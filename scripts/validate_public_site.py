#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from pathlib import Path

parser = argparse.ArgumentParser(description="Validate the GitHub Pages publication boundary.")
parser.add_argument(
    "--root",
    default="_site",
    help="Built public-site root to inspect. Defaults to _site.",
)
args = parser.parse_args()

root = Path(args.root).resolve()

forbidden_roots = (
    ".github",
    "content",
    "data",
    "editorial",
    "scripts",
    "templates",
)

forbidden_files = (
    "README.md",
    "requirements-editorial.txt",
    "assets/articles/README.md",
)

required_files = (
    "index.html",
    "about.html",
    "about/founder/index.html",
    "articles/index.html",
    "articles/es/index.html",
    "articles/en/index.html",
    "robots.txt",
    "sitemap.xml",
    "CNAME",
)

errors: list[str] = []

if not root.exists():
    errors.append(f"{root}: built site root does not exist")
else:
    for name in forbidden_roots:
        path = root / name
        if path.exists():
            errors.append(f"{path.relative_to(root)} must not be present in the public Pages artifact")

    for name in forbidden_files:
        path = root / name
        if path.exists():
            errors.append(f"{path.relative_to(root)} must not be present in the public Pages artifact")

    for name in required_files:
        path = root / name
        if not path.exists():
            errors.append(f"{name} is required in the public Pages artifact")

    duplicate_source_patterns = (
        "content/articles/es/*.html",
        "content/articles/en/*.html",
        "editorial/**/*.html",
    )
    for pattern in duplicate_source_patterns:
        for path in root.glob(pattern):
            errors.append(
                f"{path.relative_to(root)} is an internal/generated duplicate and must not be public"
            )

if errors:
    print("Publication boundary validation failed:")
    for item in errors:
        print(f"  - {item}")
    sys.exit(1)

print("Publication boundary validation passed.")
