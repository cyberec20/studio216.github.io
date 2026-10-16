#!/usr/bin/env python3
"""Gate the public DentiTrace English pre-launch site against its audited v1.0 FAQ."""
from __future__ import annotations
import argparse,hashlib,html,json,re,sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote

EXPECTED={
    "faq.html":(44,7,"ff7869568a20adfd3f0e5525d308ee6fefb55e5f21b3598f9c8d48d1d30f76ba"),
    "pricing.html":(16,3,"865550ba80b721af2a6474ae650ee21cb3e92424523aba22e12b79e4acfb2ade"),
}
PAGES=("index.html","faq.html","pricing.html","terms.html","privacy.html","refund-policy.html")
LEGAL_COUNTS={"terms.html":23,"privacy.html":16,"refund-policy.html":8}
CONTACT="dentitrace@studios216.com"
def tidy(text:str)->str:
    return re.sub(r"\s+"," ",html.unescape(text)).strip()
class Questions(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.group=False
        self.h2=False
        self.current_category=""
        self.details=False
        self.current_id=None
        self.summary=False
        self.answer=False
        self.q=[]
        self.a=[]
        self.category_buffer=[]
        self.records=[]
        self.categories=[]
    def handle_starttag(self,tag,attrs):
        data=dict(attrs)
        classes=set(data.get("class","").split())
        if tag=="section" and "faq-category" in classes:
            self.group=True
            self.current_category=""
        if self.group and tag=="h2":
            self.h2=True
            self.category_buffer=[]
        if self.group and tag=="details" and "faq" in classes:
            self.details=True
            self.current_id=(data.get("id","")).removeprefix("question-")
            self.q=[]
            self.a=[]
        if self.details and tag=="summary":
            self.summary=True
        if self.details and tag=="div" and "answer" in classes:
            self.answer=True
        if self.details and tag=="br":
            self.a.append(" ")
    def handle_endtag(self,tag):
        if tag=="h2" and self.h2:
            self.current_category=tidy("".join(self.category_buffer))
            self.categories.append(self.current_category)
            self.h2=False
        if tag=="summary" and self.summary:self.summary=False
        if tag=="div" and self.answer:self.answer=False
        if tag=="details" and self.details:
            self.records.append((self.current_category,self.current_id,tidy("".join(self.q)),tidy("".join(self.a)).replace("/dentitrace/refund-policy.html","/refund-policy")))
            self.details=False
        if tag=="section" and self.group:
            self.group=False
    def handle_data(self,data):
        if self.h2:self.category_buffer.append(data)
        if self.summary:self.q.append(data)
        if self.answer:self.a.append(data)
def assert_site(root:Path):
    site=root/"dentitrace"
    errors=[]
    def check(condition,description):
        if not condition:errors.append(description)
    for file in PAGES:
        p=site/file
        check(p.is_file(),f"Missing required page: {file}")
        if not p.is_file():continue
        content=p.read_text(encoding="utf-8")
        check('name="robots" content="noindex,follow"' in content,f"{file}: prelaunch noindex/follow marker missing")
        check(CONTACT in content,f"{file}: wrong or missing contact address")
        check("contact@studios216.com" not in content,f"{file}: old generic contact email present")
        check("{{" not in content,f"{file}: unresolved interpolation")
        check("/dentitrace<a " not in content,f"{file}: malformed refund-link replacement")
        check('href="/dentitrace/faq.html"' in content or file=="faq.html",f"{file}: general FAQ link missing")
        for url in re.findall(r'\b(?:href|src)="([^"]+)"',content):
            if not url.startswith("/dentitrace/"):continue
            uri=urlsplit(url)
            dest=root/unquote(uri.path).lstrip("/")
            if dest.is_dir():dest=dest/"index.html"
            check(dest.is_file(),f"{file}: broken local link {url}")
        if file in LEGAL_COUNTS:
            check(len(re.findall(r'class="legal-section"',content))==LEGAL_COUNTS[file],f"{file}: missing legal sections")
    for filename,(expected_questions,expected_categories,digest) in EXPECTED.items():
        page=site/filename
        if not page.is_file():continue
        parser=Questions()
        parser.feed(page.read_text("utf-8"))
        data=parser.records
        check(len(data)==expected_questions,f"{filename}: FAQ entries {len(data)} != {expected_questions}")
        check(len(parser.categories)==expected_categories,f"{filename}: categories {len(parser.categories)} != {expected_categories}")
        check(len({record[1] for record in data})==len(data),f"{filename}: duplicate keys")
        checksum=hashlib.sha256(json.dumps(data,ensure_ascii=False,separators=(",",":")).encode("utf-8")).hexdigest()
        check(checksum==digest,f"{filename}: FAQ content/order deviates from audited DentalChart v1.0 ({checksum})")
    main=(site/"index.html")
    if main.is_file():
        t=main.read_text("utf-8")
        check(t.count('<details class="faq"')==4,"index.html: expected 4 general highlights")
        check('Browse all 44 product FAQs' in t,"index.html: link to full general FAQ absent")
        check("Treatment budgets" in t and "Clinical notes and diagnoses" in t,"index.html: clinical capabilities absent")
    pricing=(site/"pricing.html")
    if pricing.is_file():
        t=pricing.read_text("utf-8")
        for required in ("$37","$370","$999","Plus applicable taxes","/dentitrace/refund-policy.html"):
            check(required in t,f"pricing.html: missing required commercial detail {required}")
        check("https://studios216.com/dentitrace/pricing.html" in t,"pricing: canonical URL missing")
    manifest=Path(__file__).resolve().parents[1]/"data/public_site.json"
    if manifest.is_file():
        o=json.loads(manifest.read_text("utf-8"))
        check("dentitrace" in o.get("directories",[]),"publication whitelist missing DentiTrace")
    if errors:
        for error in errors:print("FAIL",error,file=sys.stderr)
        raise SystemExit(1)
    print(f"PASS DentiTrace canonical FAQ {EXPECTED['faq.html'][0]} general + {EXPECTED['pricing.html'][0]} pricing; legal sections, contact, links and commercial copy ({root})")
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--root",default=".",help="repository or built-site root")
    opt=parser.parse_args()
    assert_site(Path(opt.root).resolve())
if __name__=="__main__":main()
