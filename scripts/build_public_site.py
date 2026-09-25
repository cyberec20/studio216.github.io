#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG = REPO_ROOT / "data" / "public_site.json"

class BuildError(RuntimeError):
    pass

def load_config(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    for key in ("root_files", "directories", "excluded_names", "excluded_suffixes", "generated_files"):
        if key not in data or not isinstance(data[key], list):
            raise BuildError(f"{path}: {key} must be a list")
    return data

def validate_relpath(value: str) -> Path:
    path = Path(value)
    if path.is_absolute() or ".." in path.parts:
        raise BuildError(f"unsafe public-site path: {value}")
    return path

def should_exclude(path: Path, config: dict) -> bool:
    if path.name in set(config["excluded_names"]):
        return True
    return any(path.name.endswith(suffix) for suffix in config["excluded_suffixes"])

def copy_file(source: Path, destination: Path) -> None:
    if source.is_symlink():
        raise BuildError(f"symlinks are not allowed in the public artifact: {source}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)

def build_public_site(source_root: Path, destination: Path, config: dict) -> int:
    source_root = source_root.resolve()
    destination = destination.resolve()

    if destination == source_root:
        raise BuildError("destination must not be the repository root")

    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True, exist_ok=True)

    copied = 0

    for item in config["root_files"]:
        rel = validate_relpath(str(item))
        source = source_root / rel
        if not source.is_file():
            raise BuildError(f"required public root file is missing: {rel.as_posix()}")
        copy_file(source, destination / rel)
        copied += 1

    for item in config["directories"]:
        rel_dir = validate_relpath(str(item))
        source_dir = source_root / rel_dir
        if not source_dir.is_dir():
            raise BuildError(f"required public directory is missing: {rel_dir.as_posix()}")

        for source in sorted(p for p in source_dir.rglob("*") if p.is_file()):
            rel = source.relative_to(source_root)
            if should_exclude(rel, config):
                continue
            copy_file(source, destination / rel)
            copied += 1

    for item in config["generated_files"]:
        rel = validate_relpath(str(item))
        target = destination / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("", encoding="utf-8")
        copied += 1

    return copied

def main() -> int:
    parser = argparse.ArgumentParser(description="Build the explicit public GitHub Pages artifact.")
    parser.add_argument("--source", default=str(REPO_ROOT), help="Repository/source root.")
    parser.add_argument("--destination", default=str(REPO_ROOT / "_site"), help="Output directory.")
    parser.add_argument("--config", default=str(DEFAULT_CONFIG), help="Public-site whitelist JSON.")
    args = parser.parse_args()

    source_root = Path(args.source)
    destination = Path(args.destination)
    config_path = Path(args.config)

    if not config_path.exists():
        raise BuildError(f"public-site config not found: {config_path}")

    config = load_config(config_path)
    copied = build_public_site(source_root, destination, config)
    print(f"Built explicit public site with {copied} files at {destination.resolve()}.")
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (BuildError, json.JSONDecodeError) as exc:
        print(f"Public-site build failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
