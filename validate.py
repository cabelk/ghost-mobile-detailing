#!/usr/bin/env python3
"""Static integrity checks for the Ghost front end."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

class RefParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        for key in ("href", "src"):
            value = d.get(key)
            if value:
                self.refs.append((tag, key, value))

errors = []
required = [
    "index.html", "book/index.html", "privacy.html", "404.html",
    "styles.css", "data/services.js", "js/config.js", "js/booking.js",
    "js/providers/provider-registry.js", "js/providers/demo.js",
    "js/providers/redirect.js", "js/providers/embed.js"
]
for rel in required:
    if not (ROOT / rel).exists():
        errors.append(f"missing required file: {rel}")

for html in ROOT.rglob("*.html"):
    parser = RefParser()
    parser.feed(html.read_text(encoding="utf-8"))
    for _, _, ref in parser.refs:
        if ref.startswith(("http:", "https:", "tel:", "sms:", "mailto:", "#", "data:", "javascript:")):
            continue
        clean = ref.split("#", 1)[0].split("?", 1)[0]
        if not clean:
            continue
        target = ROOT / clean.lstrip("/") if clean.startswith("/") else html.parent / clean
        if clean.endswith("/") or target.is_dir():
            target = target / "index.html"
        if not target.exists():
            errors.append(f"broken ref {html.relative_to(ROOT)} -> {ref}")

catalog = (ROOT / "data/services.js").read_text(encoding="utf-8")
for needle in ['standard: { label: "Car / Crossover", price: 160 }',
               'large: { label: "Large Truck / SUV", price: 240 }',
               '{ id: "engine-bay-detail", name: "Engine Bay Detail", price: 80 }']:
    if needle not in catalog:
        errors.append(f"catalog invariant missing: {needle}")

runtime_files = [p for p in ROOT.rglob("*.js")]
provider_brands = re.compile(r"\b(orbisx|jobber|housecall|square)\b", re.I)
for path in runtime_files:
    if provider_brands.search(path.read_text(encoding="utf-8")):
        errors.append(f"provider brand leaked into runtime JS: {path.relative_to(ROOT)}")

if errors:
    print("FAIL")
    for e in errors:
        print("-", e)
    sys.exit(1)
print("PASS: static refs, pricing invariants, and provider-neutral runtime checks")
