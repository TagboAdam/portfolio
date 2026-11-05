"""Portfolio audit: structure, links, contrast, and forbidden leftovers.

Run from anywhere: `python design/check.py`
Exit code 0 = every gate passes.
"""

import html.parser
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def srgb_to_lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lum(hexcolor):
    h = hexcolor.lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    r, g, b = (int(h[i : i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * srgb_to_lin(r) + 0.7152 * srgb_to_lin(g) + 0.0722 * srgb_to_lin(b)


def contrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as fh:
        return fh.read()


class Collector(html.parser.HTMLParser):
    VOID = {
        "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.ids = []
        self.hrefs = []
        self.srcs = []
        self.imgs = []
        self.headings = []
        self.sections = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "id" in d:
            self.ids.append(d["id"])
        if tag == "a" and "href" in d:
            self.hrefs.append(d["href"])
        if "src" in d:
            self.srcs.append((tag, d["src"]))
        if tag == "img":
            self.imgs.append(d)
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.headings.append(tag)
        if tag == "section":
            self.sections.append(d)
        if tag == "script" and "src" in d:
            self.scripts.append(d["src"])
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack:
            self.errors.append("stray </%s>" % tag)
            return
        if self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            while self.stack and self.stack[-1] != tag:
                self.errors.append("unclosed <%s> before </%s>" % (self.stack.pop(), tag))
            if self.stack:
                self.stack.pop()
        else:
            self.errors.append("stray </%s>" % tag)


def main():
    failures = []
    notes = []

    page = read("index.html")
    css_files = ["css/tokens.css", "css/style.css", "css/reset.css"]

    parser = Collector()
    parser.feed(page)

    if parser.stack:
        failures.append("unclosed tags at EOF: %s" % parser.stack)
    failures.extend("html: " + e for e in parser.errors)

    dupe_ids = {i for i in parser.ids if parser.ids.count(i) > 1}
    if dupe_ids:
        failures.append("duplicate ids: %s" % ", ".join(sorted(dupe_ids)))

    for sec in parser.sections:
        if "data-od-id" not in sec:
            failures.append("section without data-od-id")
        ref = sec.get("aria-labelledby")
        if ref and ref not in parser.ids:
            failures.append("aria-labelledby=%s does not resolve" % ref)

    for href in parser.hrefs:
        if href.startswith(("http://", "https://", "mailto:", "tel:")):
            continue
        path = href.split("#")[0]
        if path and not os.path.exists(os.path.join(ROOT, path)):
            failures.append("missing link target: %s" % href)

    for tag, src in parser.srcs:
        if src.startswith(("http://", "https://")):
            if tag == "script":
                failures.append("remote script: %s" % src)
            else:
                notes.append("remote asset (fonts only): %s" % src)
            continue
        if not os.path.exists(os.path.join(ROOT, src)):
            failures.append("missing asset: %s" % src)

    for img in parser.imgs:
        if not img.get("alt"):
            failures.append("img without alt: %s" % img.get("src"))
        if "width" not in img or "height" not in img:
            failures.append("img without intrinsic size: %s" % img.get("src"))

    if parser.headings.count("h1") != 1:
        failures.append("expected exactly one h1, found %d" % parser.headings.count("h1"))
    if parser.headings and parser.headings[0] != "h1":
        failures.append("first heading is not h1")

    hex_re = re.compile(r"#[0-9a-fA-F]{3,8}\b")
    for css in css_files:
        text = read(css)
        body = re.sub(r":root\s*\{.*?\}", "", text, flags=re.S)
        body = re.sub(r"url\([^)]*\)", "", body)
        hits = hex_re.findall(body)
        if hits:
            failures.append("raw hex outside :root in %s: %s" % (css, hits))

    banned = [
        "39d353", "statusbar", "terminal", "blink", "SplitText", "hello_world",
        "typewriter", "__prompt", "ls -l", "cat ~/", ".cursor",
    ]
    for css in css_files:
        text = read(css).lower()
        for word in banned:
            if word.lower() in text:
                failures.append("leftover %r in %s" % (word, css))

    emoji_re = re.compile(
        "[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]"
    )
    for name in ["index.html", "css/style.css", "css/tokens.css", "js/main.js"]:
        found = emoji_re.findall(read(name))
        if found:
            failures.append("emoji in %s: %s" % (name, found))

    # Copy hygiene: em dashes and en dashes are banned on the page
    dash_lines = [line.strip() for line in page.splitlines() if "—" in line or "–" in line]
    if dash_lines:
        failures.append("em/en dash in page copy: %s" % dash_lines[:4])

    # Icon sprite integrity: every <use href="#id"> must resolve to a symbol
    symbol_ids = set(re.findall(r'<symbol[^>]*\sid="([^"]+)"', page))
    use_ids = set(re.findall(r'<use[^>]*href="#([^"]+)"', page))
    dangling = sorted(use_ids - symbol_ids)
    if dangling:
        failures.append("icon references without a symbol: %s" % dangling)

    tokens = read("css/tokens.css")

    def token(name):
        m = re.search(r"--%s:\s*(#[0-9a-fA-F]{3,8})" % re.escape(name), tokens)
        return m.group(1) if m else None

    bg = token("bg")
    for name, minimum in [("fg", 4.5), ("fg-2", 4.5), ("muted", 4.5), ("meta", 4.5), ("accent", 4.5)]:
        value = token(name)
        if not value:
            failures.append("token --%s missing" % name)
            continue
        ratio = contrast(value, bg)
        if ratio < minimum:
            failures.append("contrast %s on bg = %.2f (< %.1f)" % (name, ratio, minimum))
        notes.append("contrast %-7s %s on %s = %.2f  [%s]" % (name, value, bg, ratio, "ok" if ratio >= minimum else "FAIL"))

    if token("dim"):
        ratio = contrast(token("dim"), bg)
        notes.append("contrast dim %s on %s = %.2f  [decorative only]" % (token("dim"), bg, ratio))

    if "<script src=\"http" in page or "<script src='http" in page:
        failures.append("remote script tag present")

    print("\n".join(notes))
    print()
    if failures:
        print("FAILURES (%d)" % len(failures))
        for f in failures:
            print("  - " + f)
        return 1

    print("ALL CHECKS PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
