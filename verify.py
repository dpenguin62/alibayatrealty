#!/usr/bin/env python3
"""
Ali Bayat Realty: launch verification.

    python build.py; python verify.py        verify dist/ (the production build)
    python verify.py --skip-rebuild           skip gate 15's two clean rebuilds (faster)
    python verify.py --dist DIR --config F --content F   verify another build (e.g. a rehearsal)

Serves the build over real HTTP the way a static host does, runs 15 gates, writes
verify-report.md, and ends with one of:
    PASS                           every production requirement met: launch-ready
    PASS WITH OWNER INPUT REQUIRED engineering is complete; remaining items need Ali, a service, or legal review
    FAIL                           an engineering defect exists
A gate is never passed because a stand-in or mock passed.
"""
import html as htmlmod, http.server, json, os, pathlib, re, shutil, subprocess, sys, tempfile, threading, urllib.parse, urllib.request
import datetime
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).parent
DIST = pathlib.Path(sys.argv[sys.argv.index("--dist") + 1]).resolve() if "--dist" in sys.argv else ROOT / "dist"
PASS_ARGS = []
for flag in ("--config", "--content"):
    if flag in sys.argv:
        PASS_ARGS += [flag, sys.argv[sys.argv.index(flag) + 1]]
INFO = json.loads((DIST.parent / f".{DIST.name}-build.json").read_text())
sys.path.insert(0, str(ROOT))
import build as B  # same CONFIG / content register / prohibited patterns the build used

OWNER, EXTERNAL, LEGAL, ENG = B.OWNER, B.EXTERNAL, B.LEGAL, B.ENGINEERING
BASE = INFO["base"]
PORT = 8780
HOST = f"http://127.0.0.1:{PORT}"
NAV_PARENT = {"area": "neighbourhoods", "guide-land-transfer-tax": "resources", "listings": "buy"}
SCHEMA = json.loads((ROOT / "lead.schema.json").read_text())
STATUS = {g["path"]: g for g in INFO["governance"]}

ALL_ROUTES = [r for r in INFO["routes"] if r["path"] and not r.get("internal") and not r.get("planned")
              and (not r.get("requires") or INFO["features"].get(r["requires"]))]
PLANNED = [r for r in INFO["routes"] if r.get("planned")]
by_key = {r["key"]: r for r in INFO["routes"]}
pages = list(ALL_ROUTES)                 # narrowed after gate 1 to URLs that resolve
content_pages = [r for r in pages if r["key"] != "not-found"]
indexable = [r for r in content_pages if r["index"]]


# ---------------------------------------------------------------- static host emulation
def make_handler(root):
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=str(root), **k)

        def log_message(self, *a):
            pass

        def list_directory(self, path):          # static hosts don't list folders
            self.send_error(404)
            return None

        def send_error(self, code, message=None, explain=None):
            nf = pathlib.Path(root) / "404.html"  # like Netlify / Cloudflare Pages: /404.html with status 404
            if code == 404 and nf.exists():
                body = nf.read_bytes()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(body)
            else:
                super().send_error(code, message, explain)

        def handle(self):
            try:
                super().handle()
            except (BrokenPipeError, ConnectionResetError):
                pass
    return H


def serve(root, port):
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), make_handler(root))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


opener = urllib.request.build_opener(NoRedirect)


def fetch(path, host=HOST):
    try:
        r = opener.open(host + path)
        return r.status, r.read().decode("utf8", "replace"), {k.lower(): v for k, v in r.headers.items()}
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf8", "replace"), {k.lower(): v for k, v in e.headers.items()}


class Doc(HTMLParser):
    """What a crawler sees, without JavaScript."""
    def __init__(self, text):
        super().__init__()
        self.a, self.res, self.ids, self.h1s, self.meta, self.ld = [], [], [], [], {}, []
        self.main_links = []
        self.canon, self.title, self.lang = None, "", None
        self._t = self._ld = False
        self._h1 = self._main = 0
        self.crumbs, self._crumb, self._cur = [], 0, None
        self.feed(text)

    def handle_starttag(self, t, attrs):
        a = dict(attrs)
        if t == "html":
            self.lang = a.get("lang")
        if t == "main":
            self._main += 1
        if a.get("id"):
            self.ids.append(a["id"])
        if t == "a" and "href" in a:
            self.a.append(a["href"])
            if self._main:
                self.main_links.append(a["href"])
        if t in ("link", "script") and (a.get("href") or a.get("src")) and a.get("rel") != "preconnect":
            self.res.append(a.get("href") or a.get("src"))
        if t == "meta" and (a.get("name") or a.get("property")):
            self.meta[a.get("name") or a.get("property")] = a.get("content")
        if t == "link" and a.get("rel") == "canonical":
            self.canon = a.get("href")
        if t == "title" and not self.title:
            self._t = True
        if t == "script" and a.get("type") == "application/ld+json":
            self._ld = True
            self.ld.append("")
        if t == "h1":
            self._h1 += 1
            self.h1s.append("")
        if t == "nav" and a.get("aria-label") == "Breadcrumb":
            self._crumb = 1
        elif self._crumb and t in ("a", "span") and a.get("aria-hidden") != "true":
            self._cur = {"href": a.get("href"), "name": ""}

    def handle_endtag(self, t):
        if t == "title":
            self._t = False
        if t == "script":
            self._ld = False
        if t == "h1":
            self._h1 -= 1
        if t == "main":
            self._main -= 1
        if self._crumb and t in ("a", "span") and self._cur is not None:
            self.crumbs.append(self._cur)
            self._cur = None
        elif self._crumb and t == "nav":
            self._crumb = 0

    def handle_data(self, d):
        if self._t:
            self.title += d
        if self._ld:
            self.ld[-1] += d
        if self._h1 > 0:
            self.h1s[-1] += d
        if self._cur is not None:
            self._cur["name"] += d


def norm(s):
    return re.sub(r"\s+", " ", htmlmod.unescape(s or "")).strip()


def internal_path(href, page):
    u = urllib.parse.urlsplit(urllib.parse.urljoin(BASE + page, href))
    if u.netloc != urllib.parse.urlsplit(BASE).netloc or u.scheme not in ("http", "https"):
        return None
    return u.path


# ---------------------------------------------------------------- gate runner
RESULTS = []


def gate(n, title, section):
    def deco(fn):
        def run(ctx):
            problems, notes = [], []
            try:
                fn(ctx, problems, notes)
            except Exception as e:
                problems.append((ENG, f"check crashed: {type(e).__name__}: {e}"))
            items = [(p if isinstance(p, tuple) else (ENG, p)) for p in problems]
            items = list(dict.fromkeys(items))
            RESULTS.append({"n": n, "title": title, "section": section, "ok": not items, "problems": items, "notes": notes})
            print(f"\n[{'PASS' if not items else 'FAIL'}] {n:>2}. {title}")
            for c, p in items[:30]:
                print(f"       ✗ [{c}] {p}")
            if len(items) > 30:
                print(f"       … and {len(items) - 30} more (see report)")
            for t in notes:
                print("       ·", t)
        return run
    return deco


def js_errors(ctx, P):
    new = ctx["errors"][ctx["seen_err"]:]
    ctx["seen_err"] = len(ctx["errors"])
    P.extend(f"JavaScript error: {e}" for e in dict.fromkeys(new))


# ================================================================ ROUTING
@gate(1, "Every intended production URL resolves (trailing slashes, 404, planned URLs absent)", "Routing")
def g1(ctx, P, N):
    ok = []
    for r in ALL_ROUTES:
        st, body, _ = fetch(r["path"])
        if st != 200:
            P.append(f"{r['path']} → {st}")
            continue
        ctx["html"][r["path"]] = body
        ok.append(r)
    pages[:] = ok
    content_pages[:] = [r for r in ok if r["key"] != "not-found"]
    for r in content_pages:
        if r["path"] != "/" and r["path"].endswith("/"):
            st, _, h = fetch(r["path"].rstrip("/"))
            if st not in (301, 308) or not h.get("location", "").endswith(r["path"]):
                P.append(f"{r['path'].rstrip('/')} should redirect to {r['path']} (got {st})")
    st, body, _ = fetch("/definitely-not-a-page/")
    if st != 404 or "This page" not in body:
        P.append(f"unknown URL should return the site's 404 page with status 404 (got {st})")
    for r in PLANNED:
        if fetch(r["path"])[0] != 404:
            P.append(f"planned URL {r['path']} is published before it has content")
    html_files = {("/" + str(p.relative_to(DIST))).replace("index.html", "") for p in DIST.rglob("*.html")}
    for o in sorted(html_files - {r["path"] for r in ALL_ROUTES}):
        P.append(f"unintended HTML file: {o}")
    held = [r["path"] for r in INFO["routes"] if r.get("requires") and not INFO["features"].get(r["requires"])]
    N.append(f"{len(ALL_ROUTES)} URLs: all 200; trailing-slash redirects 301; unknown URLs 404 with the site's page")
    N.append(f"planned, not built (no thin pages): {', '.join(r['path'] for r in PLANNED)}")
    if held:
        N.append(f"held back until the feature is live: {', '.join(held)}")


@gate(2, "Title, description, H1, canonical, robots and social metadata", "SEO")
def g2(ctx, P, N):
    longest = []
    for r in pages:
        d = Doc(ctx["html"][r["path"]])
        ctx["doc"][r["path"]] = d
        want_robots = "index, follow" if (r["index"] and not INFO["staging"]) else "noindex, follow"
        if norm(d.title) != r["title"]:
            P.append(f"{r['path']}: title {norm(d.title)!r} ≠ {r['title']!r}")
        if norm(d.meta.get("description")) != r["desc"]:
            P.append(f"{r['path']}: meta description differs from ROUTES")
        if r["index"] and len(r["desc"]) > 160:
            P.append(f"{r['path']}: description is {len(r['desc'])} characters (keep ≤ 160)")
        if r["index"] and len(r["desc"]) < 70:
            P.append(f"{r['path']}: description is only {len(r['desc'])} characters")
        if d.meta.get("robots") != want_robots:
            P.append(f"{r['path']}: robots {d.meta.get('robots')!r} ≠ {want_robots!r}")
        if len(d.h1s) != 1:
            P.append(f"{r['path']}: {len(d.h1s)} H1 elements")
        elif norm(d.h1s[0]) != r["h1"]:
            P.append(f"{r['path']}: H1 {norm(d.h1s[0])!r} ≠ {r['h1']!r}")
        want_lang = "fa" if r.get("lang") == "fa" else "en-CA"
        if d.lang != want_lang:
            P.append(f"{r['path']}: <html lang> is {d.lang!r}, expected {want_lang!r}")
        if r.get("alt") and r["key"] != "not-found":  # hreflang pairs must point at each other
            alt = by_key[r["alt"]]
            en, fa = (alt, r) if r.get("lang") == "fa" else (r, alt)
            body = ctx["html"][r["path"]]
            for hl, target in (("en-CA", en), ("fa", fa), ("x-default", en)):
                if f'<link rel="alternate" hreflang="{hl}" href="{BASE + target["path"]}">' not in body:
                    P.append(f"{r['path']}: missing hreflang {hl} → {target['path']}")
        dupes = {i for i in d.ids if d.ids.count(i) > 1}
        if dupes:
            P.append(f"{r['path']}: duplicate ids {sorted(dupes)}")
        if r["key"] == "not-found":
            if d.canon:
                P.append("404 page must not declare a canonical")
            continue
        if d.canon != BASE + r["path"]:
            P.append(f"{r['path']}: canonical {d.canon!r}")
        for k, v in (("og:url", BASE + r["path"]), ("og:title", r["title"]), ("og:description", r["desc"]),
                     ("twitter:title", r["title"]), ("twitter:description", r["desc"])):
            if d.meta.get(k) != v:
                P.append(f"{r['path']}: {k} doesn't match")
        for k in ("og:type", "og:site_name", "og:locale", "twitter:card"):
            if not d.meta.get(k):
                P.append(f"{r['path']}: missing {k}")
        longest.append((len(r["title"]), r["path"]))
    if not B.CONFIG.get("site_url_confirmed"):
        P.append((EXTERNAL, f"canonical domain {BASE} not confirmed as registered to Ali with hosting chosen; canonicals and sitemap depend on it"))
    titles = [r["title"] for r in content_pages]
    if len(titles) != len(set(titles)):
        P.append("duplicate titles across pages")
    descs = [r["desc"] for r in content_pages]
    if len(descs) != len(set(descs)):
        P.append("duplicate meta descriptions across pages")
    long_t = [f"{p} ({n})" for n, p in sorted(longest, reverse=True) if n > 65]
    N.append(f"{len(pages)} pages: unique titles and descriptions; descriptions 70–160 characters; one H1 each; OG + Twitter tags")
    if long_t:
        N.append("titles over 65 characters may be shortened in results (wording as specified): " + ", ".join(long_t))


@gate(3, "Zero broken internal links", "Internal links")
def g3(ctx, P, N):
    targets = {}
    for path, d in ctx["doc"].items():
        for href in d.a + d.res:
            if href.startswith("#"):
                if href[1:] not in d.ids:
                    P.append(f"{path}: in-page link {href} has no target")
                continue
            ip = internal_path(href, path)
            if ip is None:
                continue
            targets.setdefault(ip, set()).add(path)
    for t, srcs in sorted(targets.items()):
        if fetch(t)[0] != 200:
            P.append(f"{t} → broken (linked from {', '.join(sorted(srcs)[:3])})")
    ctx["link_count"] = sum(len(d.a) + len(d.res) for d in ctx["doc"].values())
    N.append(f"{ctx['link_count']} links and assets across {len(ctx['doc'])} pages → {len(targets)} unique internal targets, 0 broken")


@gate(4, "No production hash-routing dependency; content works without JavaScript", "Routing")
def g4(ctx, P, N):
    for path, d in ctx["doc"].items():
        bad = [h for h in d.a if h.startswith("#") and h[1:] not in d.ids]
        if bad:
            P.append(f"{path}: hash links that rely on the prototype router: {bad[:5]}")
        body = ctx["html"][path]
        if len(re.findall(r'data-page="', body)) != 1:
            P.append(f"{path}: should contain exactly one pre-rendered page section")
        if re.search(r'<div class="page"[^>]*\bhidden\b', body):
            P.append(f"{path}: its page section is hidden in the HTML")
    nav = [h.split("?")[0] for h in ctx["doc"]["/"].a if h.split("?")[0] in ("/buy/", "/sell/", "/invest/", "/about/", "/contact/", "/neighbourhoods/", "/resources/")]
    if len(set(nav)) != 7:
        P.append(f"primary navigation doesn't use real URLs for all sections: {sorted(set(nav))}")
    js = (DIST / "assets" / "site.js").read_text()
    if "hashchange" in js:
        P.append("production JavaScript still contains the hash router")
    br = ctx["browser"]
    nojs = br.new_context(java_script_enabled=False).new_page()
    for r in pages:
        nojs.goto(HOST + r["path"])
        h1 = nojs.locator("h1")
        if h1.count() != 1 or not h1.first.is_visible() or norm(h1.first.inner_text()) != r["h1"]:
            P.append(f"{r['path']}: H1 not visible without JavaScript")
        if len(nojs.locator("main").inner_text()) < (60 if r["key"] == "not-found" else 200):
            P.append(f"{r['path']}: main content nearly empty without JavaScript")
    nojs.context.close()
    c = br.new_context()
    c.add_init_script("""(() => { window.__hc = 0; const o = window.addEventListener;
      window.addEventListener = function(t, ...a){ if (t === 'hashchange') window.__hc++; return o.call(this, t, ...a); }; })()""")
    pg = c.new_page()
    for r in pages:
        pg.goto(HOST + r["path"])
        if pg.evaluate("window.__hc"):
            P.append(f"{r['path']}: registers a hashchange router")
    pg.goto(HOST + "/invest/")
    pg.evaluate("location.hash = 'buy'")
    pg.wait_for_timeout(150)
    if norm(pg.locator("h1").inner_text()) != by_key["invest"]["h1"]:
        P.append("changing the URL hash swaps page content")
    for legacy, real in (("buy", "/buy/"), ("sell", "/sell/"), ("invest", "/invest/")):
        pg.goto(HOST + "/#" + legacy)
        pg.wait_for_url("**" + real, timeout=3000)
    c.close()
    js_errors(ctx, P)
    N.append("primary navigation uses real URLs; no hashchange listener anywhere; /#buy, /#sell, /#invest forward to real pages")
    N.append("every page's H1 and main content present with JavaScript disabled")


@gate(5, "Sitemap: only intended canonical indexable URLs, accurate lastmod", "Sitemap")
def g5(ctx, P, N):
    st, body, _ = fetch("/sitemap.xml")
    if st != 200:
        P.append(f"/sitemap.xml → {st}")
        return
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    root = ET.fromstring(body)
    urls = [(u.find("s:loc", ns).text, getattr(u.find("s:lastmod", ns), "text", None)) for u in root.findall("s:url", ns)]
    locs = [u for u, _ in urls]
    want = {BASE + r["path"] for r in ALL_ROUTES if r["index"] and r["key"] != "not-found"}
    if len(locs) != len(set(locs)):
        P.append("duplicate URLs in sitemap")
    for extra in sorted(set(locs) - want):
        P.append(f"not an intended indexable URL: {extra}")
    for miss in sorted(want - set(locs)):
        P.append(f"missing: {miss}")
    today = datetime.date.today().isoformat()
    for loc, mod in urls:
        path = loc[len(BASE):] if loc.startswith(BASE) else None
        if "#" in loc or "?" in loc:
            P.append(f"{loc}: fragment or query in sitemap URL")
        d = ctx["doc"].get(path)
        if d and d.canon != loc:
            P.append(f"{loc}: page canonical is {d.canon}")
        if d and d.meta.get("robots") != "index, follow":
            P.append(f"{loc}: listed but page says {d.meta.get('robots')}")
        g = STATUS.get(path, {})
        real = g.get("updated_at") or g.get("published_at")
        if mod != real:
            P.append(f"{loc}: lastmod {mod!r} but the editorial record says {real!r}")
        if mod and mod > today:
            P.append(f"{loc}: lastmod in the future")
    dated = sum(1 for _, m in urls if m)
    N.append(f"{len(locs)} URLs, all canonical and indexable; noindex, planned and held-back pages excluded")
    N.append(f"lastmod present on {dated} of {len(locs)} (only from real publish/update dates; omitted otherwise, never the build date)")


@gate(6, "robots.txt behaves correctly (production and staging)", "SEO")
def g6(ctx, P, N):
    st, txt, h = fetch("/robots.txt")
    if st != 200:
        P.append(f"/robots.txt → {st}")
        return
    if "text/plain" not in h.get("content-type", ""):
        P.append(f"robots.txt served as {h.get('content-type')}")
    rules = robots_rules(txt)
    if not INFO["staging"]:
        for r in pages:
            if blocked(rules, r["path"]):
                P.append(f"{r['path']} is blocked; {'it should be crawlable' if r['index'] else 'crawlers then cannot see its noindex tag'}")
        if f"Sitemap: {BASE}/sitemap.xml" not in txt:
            P.append("robots.txt doesn't point to the sitemap on the production domain")
    tmp = pathlib.Path(tempfile.mkdtemp()) / "staging"
    subprocess.run([sys.executable, str(ROOT / "build.py"), "--staging", "--out", str(tmp), *PASS_ARGS], check=True, capture_output=True)
    if not blocked(robots_rules((tmp / "robots.txt").read_text()), "/"):
        P.append("staging build does not block crawling")
    for p in tmp.rglob("*.html"):
        t = p.read_text()
        if 'content="noindex, follow"' not in t:
            P.append(f"staging page without noindex: {p.relative_to(tmp)}")
        if "Staging preview, not the live site" not in t or "<title>[Staging]" not in t:
            P.append(f"staging page not clearly marked: {p.relative_to(tmp)}")
    if "<url>" in (tmp / "sitemap.xml").read_text():
        P.append("staging sitemap lists URLs")
    shutil.rmtree(tmp.parent, ignore_errors=True)
    N.append("production: everything crawlable, noindex pages reachable so the tag is seen, sitemap declared")
    N.append("staging: robots.txt blocks all, every page noindex, visible staging banner and [Staging] titles, empty sitemap")


def robots_rules(txt):
    rules, applies = [], False
    for line in txt.splitlines():
        line = line.split("#")[0].strip()
        if ":" not in line:
            continue
        k, v = [x.strip() for x in line.split(":", 1)]
        if k.lower() == "user-agent":
            applies = v == "*"
        elif applies and k.lower() in ("allow", "disallow"):
            rules.append((k.lower(), v))
    return rules


def blocked(rules, path):
    best = ("allow", "")
    for k, v in rules:
        if v and path.startswith(v) and len(v) >= len(best[1]):
            best = (k, v)
    return best[0] == "disallow"


# ================================================================ STRUCTURED DATA
ALLOWED = {"WebSite", "RealEstateAgent", "Person", "Organization", "Place", "WebPage", "BreadcrumbList", "ListItem", "Article", "PostalAddress", "PropertyValue", "FAQPage", "Question", "Answer"}
REQUIRED = {"WebSite": ["@id", "url", "name"], "RealEstateAgent": ["@id", "name", "url"], "Person": ["@id", "name"],
            "Organization": ["@id", "name"], "WebPage": ["@id", "url", "name", "description", "isPartOf"],
            "BreadcrumbList": ["@id", "itemListElement"], "Article": ["@id", "headline", "publisher", "mainEntityOfPage"]}
SUSPECT = re.compile(r"\[|\]|000-0000|000000|TBD|TBC|confirm|example\.com|lorem|placeholder", re.I)


def walk(o, fn):
    if isinstance(o, dict):
        fn(o)
        for v in o.values():
            walk(v, fn)
    elif isinstance(o, list):
        for v in o:
            walk(v, fn)


@gate(7, "Structured data is valid and truthful (no invented facts)", "Structured data")
def g7(ctx, P, N):
    D = B.DETAILS
    for r in content_pages:
        path, d = r["path"], ctx["doc"][r["path"]]
        g = STATUS.get(path, {})
        live = g.get("review_status") == "approved" and g.get("approved_matches")
        if len(d.ld) != 1:
            P.append(f"{path}: {len(d.ld)} JSON-LD blocks")
            continue
        try:
            data = json.loads(d.ld[0])
        except Exception as e:
            P.append(f"{path}: JSON-LD doesn't parse ({e})")
            continue
        if data.get("@context") != "https://schema.org":
            P.append(f"{path}: wrong @context")
        graph = data.get("@graph", [])
        top = {n.get("@id"): n for n in graph}
        issues, refs = [], []

        def check(node):
            t = node.get("@type")
            if t and t not in ALLOWED:
                issues.append(f"type {t} not allowed")
            if set(node) == {"@id"}:
                refs.append(node["@id"])
            if node in graph and t in REQUIRED:
                issues.extend(f"{t} missing {k}" for k in REQUIRED[t] if k not in node)
            for k in ("aggregateRating", "review", "award", "numberOfEmployees", "foundingDate"):
                if k in node:
                    issues.append(f"{t}.{k} is not a confirmed fact")
            backed = {"telephone": D.get("phone_e164"), "email": D.get("email"), "jobTitle": D.get("job_title")}
            for k, v in backed.items():
                if k in node and node[k] != v:
                    issues.append(f"{t}.{k}={node[k]!r} not backed by site.config.json")
            if "address" in node and not D.get("brokerage_address"):
                issues.append(f"{t}.address not backed by site.config.json")
            for k in ("datePublished", "dateModified", "author"):
                if k in node and not live:
                    issues.append(f"{t}.{k} claimed but page isn't approved by Ali")
            if node.get("datePublished") and node["datePublished"] != g.get("published_at"):
                issues.append(f"{t}.datePublished doesn't match the editorial record")
            if node.get("dateModified") and node["dateModified"] != g.get("updated_at"):
                issues.append(f"{t}.dateModified doesn't match the editorial record")
            for k, v in node.items():
                if isinstance(v, str) and SUSPECT.search(v) and k not in ("@id", "url", "item"):
                    issues.append(f"{t}.{k} looks like a placeholder: {v!r}")
        walk(graph, check)
        issues.extend(f"dangling reference {x}" for x in refs if x not in top)
        types = {n.get("@type"): n for n in graph}
        if "RealEstateAgent" in types and types.get("Organization") is None and "parentOrganization" in types["RealEstateAgent"]:
            issues.append("parentOrganization without a confirmed brokerage")
        brok = types.get("Organization")
        if brok and brok.get("name") != D.get("brokerage_name"):
            issues.append("brokerage name not backed by site.config.json")
        if any(n.get("@type") == "RealEstateAgent" and n.get("@id") != BASE + "/#business" for n in graph):
            issues.append("the brokerage must not be modelled as a second RealEstateAgent")
        person = types.get("Person", {})
        if person.get("name") != B.CONFIG["agent_name"]:
            issues.append("Person name doesn't match CONFIG")
        wp = types.get("WebPage", {})
        if wp.get("url") != d.canon or wp.get("name") != norm(d.title) or wp.get("description") != norm(d.meta.get("description")):
            issues.append("WebPage url/name/description don't match the page")
        if r.get("type") == "article":
            art = types.get("Article", {})
            if art.get("headline") != norm(d.h1s[0]):
                issues.append("Article headline doesn't match the H1")
            if not art.get("citation"):
                issues.append("Article has no sources (citation)")
        bl = types.get("BreadcrumbList")
        vis = [c for c in d.crumbs if norm(c["name"])]
        if bl:
            items = bl["itemListElement"]
            for c, it in zip([c for c in vis if c["href"]], items):
                if urllib.parse.urljoin(BASE + path, c["href"]) != it["item"] or norm(c["name"]) != it["name"]:
                    issues.append(f"breadcrumb {norm(c['name'])!r} doesn't match {it['name']!r}")
            if items[-1]["item"] != BASE + path:
                issues.append("last breadcrumb isn't the page itself")
        elif vis and path != "/":
            issues.append("visible breadcrumb but no BreadcrumbList")
        P.extend(f"{path}: {i}" for i in dict.fromkeys(issues))
    missing = [k for k in ("phone_e164", "email", "job_title", "brokerage_name", "brokerage_address") if k not in D]
    N.append("entities: Ali = Person; Ali Bayat Realty = RealEstateAgent (founder → Ali); brokerage = Organization (parentOrganization / worksFor) once confirmed")
    N.append("no ratings, reviews, awards or invented dates; author/dates only on pages Ali has approved")
    if missing:
        N.append("omitted until confirmed: " + ", ".join(missing))


# ================================================================ NAVIGATION
@gate(8, "Navigation works on desktop, tablet and mobile", "Accessibility")
def g8(ctx, P, N):
    br = ctx["browser"]
    want = ["Home", "Buy", "Sell", "Invest", "Neighbourhoods", "Resources", "About", "Talk to Ali"]
    dest = {by_key[k]["name"]: by_key[k]["path"] for k in ("home", "buy", "sell", "invest", "neighbourhoods", "resources", "about", "contact")}
    dest.update({"About Ali": by_key["about"]["path"], "Talk to Ali": by_key["contact"]["path"]})
    pg = br.new_page(viewport={"width": 1280, "height": 900})
    pg.goto(HOST + "/")
    labels = [norm(t) for t in pg.locator(".nav a:not([data-lang-switch])").all_inner_texts()]
    if labels != want:
        P.append(f"desktop nav is {labels}")
    for i in range(len(labels)):
        pg.goto(HOST + "/")
        with pg.expect_navigation():
            pg.locator(".nav a:not([data-lang-switch])").nth(i).click()
        if urllib.parse.urlsplit(pg.url).path != dest.get(labels[i]):
            P.append(f"desktop: {labels[i]} went to {urllib.parse.urlsplit(pg.url).path}, expected {dest.get(labels[i])}")
    for r in content_pages:
        pg.goto(HOST + r["path"])
        # language switch: goes to this page's other-language version, else that language's home page
        sw = pg.get_attribute(".nav a[data-lang-switch]", "href")
        want_sw = by_key[r["alt"]]["path"] if r.get("alt") else ("/" if r.get("lang") == "fa" else "/fa/")
        if sw != want_sw:
            P.append(f"{r['path']}: language switch goes to {sw}, expected {want_sw}")
        if r.get("lang") == "fa":
            cur = pg.eval_on_selector_all(".nav a[aria-current='page']", "e=>e.map(a=>a.getAttribute('href'))")
            nk = {"fa-area": "fa-neighbourhoods", "fa-guide-land-transfer-tax": "fa-resources"}.get(r.get("page") or r["key"], r["key"])
            if cur != [by_key[nk]["path"]] and not (r["key"] == "fa-contact" and cur == []):
                P.append(f"{r['path']}: Farsi menu marks {cur} as current")
            continue
        key = NAV_PARENT.get(r.get("page") or r["key"], r["key"])
        expect = by_key[key]["name"] if key in ("home", "buy", "sell", "invest", "neighbourhoods", "resources", "about") else None
        cur = [norm(t) for t in pg.locator(".nav a[aria-current='page']").all_inner_texts()]
        if (cur[0] if cur else None) != expect or len(cur) > 1:
            P.append(f"{r['path']}: active nav is {cur}, expected {expect}")
    pg.close()
    for w in (375, 820):
        m = br.new_page(viewport={"width": w, "height": 800}, has_touch=True)
        m.goto(HOST + "/")
        if m.locator(".nav").is_visible() or not m.locator("#menu-btn").is_visible():
            P.append(f"{w}px: menu button / desktop nav visibility wrong")
        dl = [norm(t) for t in m.locator(".drawer a:not([data-lang-switch])").all_inner_texts()]
        for lab in want[:-1]:
            if not any(x.startswith(lab) for x in dl):
                P.append(f"{w}px: drawer missing {lab}")
        for i in range(len(dl)):
            m.goto(HOST + "/")
            m.locator("#menu-btn").tap()
            if m.get_attribute("#menu-btn", "aria-expanded") != "true" or not m.locator("#drawer").is_visible():
                P.append(f"{w}px: menu didn't open")
                break
            with m.expect_navigation():
                m.locator(".drawer a:not([data-lang-switch])").nth(i).tap()
            if urllib.parse.urlsplit(m.url).path != dest.get(dl[i]):
                P.append(f"{w}px: drawer link {dl[i]} went to {urllib.parse.urlsplit(m.url).path}, expected {dest.get(dl[i])}")
        m.goto(HOST + "/")
        m.locator("#menu-btn").tap()
        m.locator("#menu-btn").tap()
        if m.locator("#drawer").is_visible():
            P.append(f"{w}px: menu doesn't close")
        for r in content_pages:
            m.goto(HOST + r["path"])
            if m.evaluate("document.documentElement.scrollWidth > innerWidth + 1"):
                P.append(f"{w}px: horizontal scroll on {r['path']}")
        m.close()
    js_errors(ctx, P)
    N.append("desktop 1280px: every label goes to its intended URL; correct active state on every page")
    N.append("tablet 820px and mobile 375px (touch): menu opens, every link correct, closes; no horizontal scroll on any page")


# ================================================================ ACCESSIBILITY
A11Y_JS = (ROOT / "verify_a11y.js").read_text() if (ROOT / "verify_a11y.js").exists() else None


def axe_source():
    for p in (ROOT / "node_modules/axe-core/axe.min.js", ROOT / "tools/axe.min.js"):
        if p.exists():
            return p.read_text()
    return None


@gate(9, "Accessibility: axe-core, keyboard, focus, contrast, mobile, reduced motion", "Accessibility")
def g9(ctx, P, N):
    br = ctx["browser"]
    axe = axe_source()
    stats = ctx["a11y"] = {"axe": "not run", "builtin": 0, "contrast": 0, "keyboard": 0, "focus": 0}
    if not axe:
        P.append((EXTERNAL, "axe-core is not installed, so the full axe rule set did NOT run. Run `npm install` (package.json pins axe-core) and re-verify"))
    axe_v = 0
    for scheme in ("light", "dark"):
        for w in (1280, 375):
            c = br.new_context(viewport={"width": w, "height": 900}, color_scheme=scheme, reduced_motion="reduce")
            pg = c.new_page()
            for r in pages:
                pg.goto(HOST + r["path"])
                for issue in pg.evaluate(A11Y_JS):
                    if issue.startswith("contrast"):
                        stats["contrast"] += 1
                    stats["builtin"] += 1
                    P.append(f"{r['path']} [{scheme} {w}px]: {issue}")
                if axe:
                    pg.add_script_tag(content=axe)
                    res = pg.evaluate("axe.run(document,{resultTypes:['violations']}).then(r=>r.violations.map(v=>v.impact+' '+v.id+' ×'+v.nodes.length))")
                    axe_v += len(res)
                    P.extend(f"{r['path']} [axe {scheme} {w}px]: {v}" for v in res)
            c.close()
    if axe:
        stats["axe"] = f"{axe_v} violation(s) across {len(pages)} pages × light/dark × 1280/375px"
    pg = br.new_page(viewport={"width": 1280, "height": 900})
    for r in pages:
        pg.goto(HOST + r["path"])
        expected = pg.evaluate("""(()=>{const groups=new Set();let i=0;
            [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])')]
            .forEach(e=>{const s=getComputedStyle(e),b=e.getBoundingClientRect(),radio=e.type==='radio';
              if(e.tabIndex<0||e.disabled||s.visibility==='hidden'||e.closest('[hidden],[aria-hidden="true"]'))return;
              if(!radio&&(b.width===0||b.height===0))return;
              if(radio){if(groups.has(e.name))return;groups.add(e.name)}
              e.dataset.kbi=radio?'radio-'+e.name:String(i++)});
            return document.querySelectorAll('[data-kbi]').length})()""")
        reached, invisible = set(), []
        pg.keyboard.press("Tab")
        if pg.evaluate("document.activeElement.className") != "skip":
            P.append(f"{r['path']}: first Tab doesn't land on 'Skip to content'")
        for _ in range(expected + 5):
            info = pg.evaluate("""(()=>{const e=document.activeElement;if(!e||e===document.body)return null;
              const s=getComputedStyle(e);const ring=(s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0)||s.boxShadow!=='none';
              return {k:e.type==='radio'?'radio-'+e.name:e.dataset.kbi,id:e.outerHTML.slice(0,70),ring,radio:e.type==='radio'}})()""")
            if info is None:
                break
            if info["k"] is not None:
                reached.add(info["k"])
            if not info["ring"] and not info["radio"]:
                invisible.append(info["id"])
            pg.keyboard.press("Tab")
        if len(reached) < expected:
            stats["keyboard"] += 1
            missed = pg.evaluate("r=>[...document.querySelectorAll('[data-kbi]')].filter(e=>!r.includes(e.dataset.kbi)).map(e=>e.outerHTML.slice(0,70))", sorted(reached))
            P.append(f"{r['path']}: Tab reached {len(reached)} of {expected} controls; missed {missed[:3]}")
        stats["focus"] += len(invisible)
        for i in invisible[:3]:
            P.append(f"{r['path']}: no visible focus indicator on {i}")
    pg.goto(HOST + "/invest/")
    pg.keyboard.press("Tab")
    pg.keyboard.press("Enter")
    if not pg.evaluate("location.hash === '#main' && document.querySelector('main').getBoundingClientRect().top < 120"):
        P.append("skip link doesn't move to the main content")
    m = br.new_page(viewport={"width": 375, "height": 800})
    m.goto(HOST + "/")
    m.focus("#menu-btn")
    m.keyboard.press("Enter")
    if m.get_attribute("#menu-btn", "aria-expanded") != "true":
        P.append("menu doesn't open with Enter")
    m.keyboard.press("Tab")
    if not m.evaluate("document.activeElement.closest('#drawer') !== null"):
        P.append("Tab after opening the menu doesn't move into it")
    m.keyboard.press("Escape")
    if m.locator("#drawer").is_visible() or m.evaluate("document.activeElement.id") != "menu-btn":
        P.append("Escape doesn't close the menu and return focus to the Menu button")
    for path, sel in (("/invest/", "#iv-o-cf"), ("/resources/buying/land-transfer-tax-toronto-york-region/", "#o-total")):
        m.goto(HOST + path)
        if not m.evaluate(f"!!document.querySelector('{sel}').closest('[aria-live]')"):
            P.append(f"{path}: calculator results aren't in a live region")
    # Form errors are announced and tied to their fields
    m.goto(HOST + "/contact/")
    err = m.evaluate("""[...document.querySelectorAll('#contact-form .err')].map(e=>({id:e.id,role:e.getAttribute('role'),
        described:!!document.querySelector('[aria-describedby~="'+e.id+'"]')}))""")
    for e in err:
        if e["id"] == "send-error":
            if e["role"] != "alert":
                P.append("send error isn't announced (role=alert)")
        elif not e["described"]:
            P.append(f"contact form error {e['id']} isn't linked to its field (aria-describedby)")
    rm = br.new_context(reduced_motion="reduce").new_page()
    rm.goto(HOST + "/")
    if rm.evaluate("getComputedStyle(document.querySelector('.btn')).transitionDuration") not in ("0s", "1e-05s"):
        P.append("animations aren't disabled for prefers-reduced-motion")
    rm.context.close()
    pg.close()
    m.close()
    js_errors(ctx, P)
    N.append(f"axe-core: {stats['axe']}")
    N.append(f"built-in checks (names, labels, ARIA, landmarks, zoom, WCAG AA contrast) on {len(pages)} pages × light/dark × 1280/375px: "
             f"{stats['builtin']} issue(s), {stats['contrast']} contrast")
    N.append(f"keyboard: every control reachable by Tab on every page ({stats['keyboard']} page(s) with gaps); "
             f"{stats['focus']} control(s) without a visible focus ring; skip link, menu Enter/Tab/Escape, live calculator results, reduced motion")


# ================================================================ LEAD FORM
def parse_multipart(body):
    return {m.group(1): m.group(2) for m in re.finditer(r'name="([^"]+)"\r\n\r\n(.*?)\r\n--', body or "", re.S)}


def schema_errors(payload):
    errs = []
    props = SCHEMA["properties"]
    for k in SCHEMA["required"]:
        if not payload.get(k):
            errs.append(f"missing required {k}")
    for k, v in payload.items():
        if k not in props:
            errs.append(f"field not in contract: {k}")
            continue
        s = props[k]
        if "enum" in s and v not in s["enum"]:
            errs.append(f"{k}={v!r} not in {s['enum']}")
        if "const" in s and v != s["const"]:
            errs.append(f"{k}={v!r} must be {s['const']!r}")
        if "pattern" in s and v and not re.match(s["pattern"], v):
            errs.append(f"{k}={v!r} doesn't match pattern")
        if "maxLength" in s and len(v) > s["maxLength"]:
            errs.append(f"{k} too long")
    return errs


@gate(10, "Lead form: production endpoint, payload contract, consent, honest states", "Lead form")
def g10(ctx, P, N):
    br = ctx["browser"]
    # Real build: no endpoint means an honest pending state, never a fake success.
    body = ctx["html"].get("/contact/", "")
    if not INFO["endpoint"]:
        P.append((EXTERNAL, "no production endpoint configured (site.config.json form_endpoint): the live form cannot send messages"))
        pg = br.new_page()
        reqs = []
        pg.on("request", lambda q: reqs.append(q.url) if q.method == "POST" else None)
        pg.goto(HOST + "/contact/")
        if 'data-pending="form-endpoint"' not in body or not pg.locator("[data-pending='form-endpoint']").is_visible():
            P.append("contact page doesn't say the form isn't connected yet")
        if not pg.locator("#c-send").is_disabled():
            P.append("submit button is enabled although there's no endpoint")
        if "data-preview-only" in body or "Preview only" in body:
            P.append("a preview/fake confirmation is present in production")
        if reqs:
            P.append(f"something was POSTed without an endpoint: {reqs}")
        pg.close()
    elif not re.match(r"^https://[^/]+\.[^/]+/", INFO["endpoint"]):
        P.append(f"endpoint must be an absolute https URL: {INFO['endpoint']}")
    elif f'action="{INFO["endpoint"]}"' not in body or 'method="post"' not in body:
        P.append("built form isn't wired to the configured endpoint")
    # Exercise the submit path against a stand-in endpoint (proves the code, not the integration).
    test_ep = "https://forms.verify.invalid/submit/"
    tmp = pathlib.Path(tempfile.mkdtemp()) / "formtest"
    env = dict(os.environ, ABR_TEST_FORM_ENDPOINT=test_ep)
    subprocess.run([sys.executable, str(ROOT / "build.py"), "--out", str(tmp), "--allow-blockers", *PASS_ARGS], check=True, capture_output=True, env=env)
    srv = serve(tmp, PORT + 1)
    H2 = f"http://127.0.0.1:{PORT + 1}"
    try:
        c = br.new_context()
        third = []
        c.on("request", lambda q: third.append(q.url) if not q.url.startswith((H2, "https://fonts.", test_ep)) else None)
        got = []
        c.route(test_ep + "**", lambda route, request: (got.append(request.post_data or ""), route.fulfill(status=200, body='{"ok":true}', content_type="application/json")))
        pg = c.new_page()
        pg.goto(H2 + "/?utm_source=newsletter&utm_medium=email&utm_campaign=fall-2026&utm_content=hero", referer="https://www.google.com/search?q=gta+fourplex")
        with pg.expect_navigation():
            pg.locator(".nav a[href='/invest/']").click()
        with pg.expect_navigation():
            pg.locator(".page-head a.btn").click()
        if not pg.is_checked("#i-invest") or not pg.locator("#req-note").is_visible():
            P.append("Investment Property Analysis CTA doesn't preselect Investing and show the request note")
        pg.fill("#c-name", "Verify Bot")
        pg.fill("#c-email", "verify@verify.invalid")
        pg.click("#c-send")
        if got or pg.locator("#e-consent").is_hidden():
            P.append("submission without consent isn't blocked with a visible message")
        pg.check("#c-consent")
        pg.click("#c-send")
        pg.wait_for_selector("#sent-live:not([hidden])", timeout=4000)
        payload = parse_multipart(got[-1] if got else "")
        ctx["payload"] = payload
        for e in schema_errors(payload):
            P.append(f"payload: {e}")
        expect = {"interest": "invest", "request": "analysis", "language": "en", "consent": "yes", "source_page": "/invest/",
                  "utm_source": "newsletter", "utm_medium": "email", "utm_campaign": "fall-2026", "utm_content": "hero",
                  "referrer": "https://www.google.com", "website": ""}
        for k, v in expect.items():
            if payload.get(k) != v:
                P.append(f"payload {k}={payload.get(k)!r}, expected {v!r}")
        if not payload.get("source_cta", "").startswith("invest:"):
            P.append(f"payload source_cta={payload.get('source_cta')!r} should identify the /invest/ CTA")
        try:
            datetime.datetime.fromisoformat(payload.get("timestamp", "").replace("Z", "+00:00"))
        except ValueError:
            P.append(f"payload timestamp isn't ISO-8601: {payload.get('timestamp')!r}")
        if third:
            P.append(f"third-party requests during the lead flow: {sorted(set(third))[:4]}")
        c.close()
        # Error path keeps the visitor's message
        c = br.new_context()
        c.route(test_ep + "**", lambda route, request: route.fulfill(status=500, body="{}"))
        pg = c.new_page()
        pg.goto(H2 + "/contact/")
        pg.fill("#c-name", "Verify Bot")
        pg.fill("#c-email", "verify@verify.invalid")
        pg.fill("#c-msg", "keep me")
        pg.check("#c-consent")
        pg.click("#c-send")
        pg.wait_for_selector("#send-error:not([hidden])", timeout=4000)
        if not pg.locator("#contact-form").is_visible() or pg.input_value("#c-msg") != "keep me":
            P.append("on a failed send the form should stay visible with the message intact")
        c.close()
        fb = (tmp / "contact" / "index.html").read_text()
        tag = re.search(r'<form[^>]*id="contact-form"[^>]*>', fb).group(0)
        if "novalidate" in tag or f'action="{test_ep}"' not in tag or 'method="post"' not in tag:
            P.append("without JavaScript the form wouldn't POST to the endpoint with browser validation")
        for fid in ("c-name", "c-email", "c-consent"):
            if not re.search(rf'id="{fid}"[^>]*required', fb):
                P.append(f"#{fid} lacks the required attribute for no-JS validation")
        if not re.search(r'class="hp" aria-hidden="true"', fb) or not re.search(r'name="website"[^>]*tabindex="-1"', fb):
            P.append("honeypot isn't hidden from people and assistive technology")
    finally:
        srv.shutdown()
        shutil.rmtree(tmp.parent, ignore_errors=True)
    js_errors(ctx, P)
    N.append("stand-in endpoint (code path only; NOT the integration): payload matches lead.schema.json; consent required; "
             "source_page /invest/ and source_cta from a real click path; UTM from the landing URL; referrer reduced to its origin; "
             "error keeps the message; no-JS POST; honeypot; no third-party requests")


# ================================================================ PRODUCTION SAFETY
SPEC_PATTERNS = [("[Brokerage", r"\[Brokerage"), ("[to be written / to be written", r"to be written"), ("draft for Ali", r"draft for Ali"),
                 ("Preview only", r"Preview only"), ("000000", r"0{6}"), ("(416) 000-0000", r"\(416\) 000-0000"), ("[year]", r"\[year\]"),
                 ("[City]", r"\[City\]"), ("nan / NaN", r"\b(?:nan|NaN)\b"), ("TBC", r"\bTBC\b"), ("TODO", r"\bTODO\b"), ("FIXME", r"\bFIXME\b")]


@gate(11, "Production safety: no placeholders, invented facts or interim content", "Production safety")
def g11(ctx, P, N):
    counts = {label: 0 for label, _ in SPEC_PATTERNS}
    other = {}
    for path, body in ctx["html"].items():
        txt = B.visible_text(body)
        for label, pat in SPEC_PATTERNS:
            counts[label] += len(re.findall(pat, txt))
        for pat, label in B.PROHIBITED:
            n = len(re.findall(pat, txt))
            if n:
                other[label] = other.get(label, 0) + n
        clean = B.visible_text(body, drop_unresolved=True)
        hits = sorted({label for pat, label in B.PROHIBITED if re.search(pat, clean)})
        if hits:
            P.append(f"{path}: placeholder text outside the managed placeholder system: {hits}")
    for f in ("assets/site.js", "assets/site.css", "robots.txt", "sitemap.xml"):
        t = (DIST / f).read_text()
        for label, pat in SPEC_PATTERNS:
            if label in ("TODO", "FIXME", "TBC", "draft for Ali", "Preview only", "[to be written / to be written", "(416) 000-0000") and re.search(pat, t):
                P.append(f"{f}: contains {label}")
    for b in INFO["blockers"]:
        if b["category"] != ENG and not b["message"].startswith(("page review", "form endpoint", "domain not confirmed")):
            P.append((b["category"], b["message"]))
    ctx["safety"] = {"spec": counts, "all": other}
    N.append("spec patterns in published pages: " + ", ".join(f"{k}: {v}" for k, v in counts.items()))
    if any(other.values()):
        N.append("every remaining hit comes from a managed placeholder awaiting the owner input listed above; none leak outside it")


# ================================================================ CONTENT GOVERNANCE
@gate(12, "Content governance: author, review status, dates, sources, indexability", "Content governance")
def g12(ctx, P, N):
    for g in INFO["governance"]:
        if g["key"] == "not-found":
            continue
        if g["indexable"]:
            if g["review_status"] != "approved":
                P.append((OWNER, f"{g['path']}: not yet reviewed and approved by Ali"))
            elif not g["approved_matches"]:
                P.append((OWNER, f"{g['path']}: changed after approval; needs review again"))
            elif not g["published_at"]:
                P.append((OWNER, f"{g['path']}: no publication date"))
            if not g["author"]:
                P.append(f"{g['path']}: no author in the content register")
        if g["time_sensitive"] and g["indexable"]:
            for k in ("sources", "data_period", "verified_at"):
                if not g.get(k):
                    P.append(f"{g['path']}: time-sensitive page missing {k}")
            if g.get("verified_at") and (datetime.date.today() - datetime.date.fromisoformat(g["verified_at"])).days > 180:
                P.append((OWNER, f"{g['path']}: facts last verified {g['verified_at']}; re-verify"))
        for s in g.get("sources") or []:
            if not s[1].startswith("https://"):
                P.append(f"{g['path']}: source {s[0]!r} has no https URL")
    approved = sum(1 for g in INFO["governance"] if g["review_status"] == "approved" and g["approved_matches"])
    N.append(f"{len(INFO['governance'])} pages registered; {approved} approved as built; author = {INFO['governance'][0]['author']}")
    N.append("approvals are tied to each page's exact content; dates come only from Ali's approvals (python build.py approve …)")


# ================================================================ INTERNAL LINKING
PILLARS = ["/buy/", "/sell/", "/invest/", "/neighbourhoods/", "/resources/"]


@gate(13, "Internal linking: no orphans, pillars connected, contextual links", "Internal links")
def g13(ctx, P, N):
    inbound = {r["path"]: set() for r in content_pages}
    out = {}
    for path, d in ctx["doc"].items():
        targets = {internal_path(h, path) for h in d.main_links if not h.startswith("#")} - {None, path}
        out[path] = targets
        if len(d.main_links) > 120:
            P.append(f"{path}: {len(d.main_links)} links in the main content (link-farm guard)")
        for t in targets:
            if t in inbound:
                inbound[t].add(path)
    for r in content_pages:
        if r["index"] and r["path"] != "/" and not inbound[r["path"]]:
            P.append(f"{r['path']}: orphan (no contextual link from another page's main content)")
    for p in PILLARS:
        if p not in out:
            continue
        if "/contact/" not in out[p]:
            P.append(f"{p}: main content doesn't link to the contact page")
        if not (out[p] & (set(PILLARS) - {p})):
            P.append(f"{p}: main content doesn't link to another pillar page")
    for r in content_pages:
        if r.get("page") == "area":
            o = out.get(r["path"], set())
            for need in ("/invest/", "/buy/", by_key["guide-land-transfer-tax"]["path"]):
                if need not in o:
                    P.append(f"{r['path']}: should link contextually to {need}")
    g = by_key["guide-land-transfer-tax"]["path"]
    if g in out and "/buy/" not in out[g]:
        P.append(f"{g}: buying guide should link to the buyer service page")
    ctx["inbound"] = {k: len(v) for k, v in inbound.items()}
    N.append("contextual inbound links (main content only): " + ", ".join(f"{k} {v}" for k, v in sorted(ctx["inbound"].items(), key=lambda x: -x[1])))


# ================================================================ PERFORMANCE
BUDGET = {"html_kb": 120, "js_kb": 30, "css_kb": 60, "dom": 1500, "same_origin_requests": 6, "cls": 0.05}


@gate(14, "Performance budget: weight, requests, DOM size, layout shift, render-blocking", "Performance")
def g14(ctx, P, N):
    br = ctx["browser"]
    rows = []
    js_kb = (DIST / "assets/site.js").stat().st_size / 1024
    css_kb = (DIST / "assets/site.css").stat().st_size / 1024
    if js_kb > BUDGET["js_kb"]:
        P.append(f"site.js is {js_kb:.0f} KB (budget {BUDGET['js_kb']})")
    if css_kb > BUDGET["css_kb"]:
        P.append(f"site.css is {css_kb:.0f} KB (budget {BUDGET['css_kb']})")
    if re.search(r"<!--|/\*<prototype>", (DIST / "assets/site.js").read_text()):
        P.append("prototype code shipped in site.js")
    c = br.new_context()
    c.add_init_script("""window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});""")
    for r in pages:
        pg = c.new_page()
        reqs = []
        pg.on("request", lambda q: reqs.append(q.url))
        pg.goto(HOST + r["path"], wait_until="load")
        pg.wait_for_timeout(250)
        html_kb = len(ctx["html"][r["path"]].encode()) / 1024
        dom = pg.evaluate("document.getElementsByTagName('*').length")
        cls = pg.evaluate("window.__cls")
        same = [u for u in reqs if u.startswith(HOST)]
        blocking = pg.evaluate("[...document.querySelectorAll('script[src]')].filter(s=>!s.defer&&!s.async&&s.type!=='module').length")
        imgs = pg.evaluate("[...document.images].filter(i=>!i.getAttribute('width')||!i.getAttribute('height')).length")
        rows.append((r["path"], html_kb, dom, len(same), cls))
        if html_kb > BUDGET["html_kb"]:
            P.append(f"{r['path']}: HTML {html_kb:.0f} KB (budget {BUDGET['html_kb']})")
        if dom > BUDGET["dom"]:
            P.append(f"{r['path']}: {dom} DOM elements (budget {BUDGET['dom']})")
        if len(same) > BUDGET["same_origin_requests"]:
            P.append(f"{r['path']}: {len(same)} requests (budget {BUDGET['same_origin_requests']})")
        if cls > BUDGET["cls"]:
            P.append(f"{r['path']}: layout shift {cls:.3f} (budget {BUDGET['cls']})")
        if blocking:
            P.append(f"{r['path']}: {blocking} render-blocking script(s)")
        if imgs:
            P.append(f"{r['path']}: {imgs} image(s) without width/height")
        pg.close()
    c.close()
    third = sorted({urllib.parse.urlsplit(u).netloc for u in re.findall(r'(?:href|src)="(https://[^"]+)"', ctx["html"]["/"]) if not u.startswith(BASE)} - {"www.reco.on.ca"})
    worst = max(rows, key=lambda x: x[2])
    N.append(f"site.js {js_kb:.0f} KB (prototype code stripped), site.css {css_kb:.0f} KB, both cached across pages; scripts deferred; no images")
    N.append(f"largest page {max(rows, key=lambda x: x[1])[0]} {max(x[1] for x in rows):.0f} KB HTML; most DOM {worst[0]} {worst[2]} elements; "
             f"max same-origin requests {max(x[3] for x in rows)}; max layout shift {max(x[4] for x in rows):.3f}")
    if third:
        N.append(f"third-party request on every page: {', '.join(third)} (Google Fonts). Recommendation: self-host the three font families")


# ================================================================ REPRODUCIBILITY
def tree(d):
    return {str(p.relative_to(d)): p.read_bytes() for p in sorted(d.rglob("*")) if p.is_file()}


@gate(15, "Reproducible, machine-independent build", "Reproducibility")
def g15(ctx, P, N):
    req = (ROOT / "requirements.txt").read_text().split()
    if not req or any("==" not in x for x in req):
        P.append("requirements.txt must pin exact versions")
    pkg = json.loads((ROOT / "package.json").read_text())
    if not all(re.fullmatch(r"\d+\.\d+\.\d+", v) for v in pkg.get("devDependencies", {}).values()):
        P.append("package.json must pin exact versions")
    leaks = [str(p.relative_to(DIST)) for p in DIST.rglob("*") if p.is_file() and re.search(rb"/home/|/root/|/tmp/|file://|\\Users\\", p.read_bytes())]
    if leaks:
        P.append(f"machine-specific paths in output: {leaks[:4]}")
    if "--skip-rebuild" in sys.argv:
        N.append("two clean rebuilds skipped (--skip-rebuild)")
        return
    base = pathlib.Path(tempfile.mkdtemp())
    outs = []
    for i in (1, 2):
        out = base / f"b{i}"
        res = subprocess.run([sys.executable, str(ROOT / "build.py"), "--out", str(out), "--allow-blockers", *PASS_ARGS], capture_output=True, text=True)
        if res.returncode != 0:
            P.append(f"build {i} failed: {res.stderr.strip()[-300:]}")
            return
        outs.append(tree(out))
    a, b, d = outs[0], outs[1], tree(DIST)
    if a != b:
        P.append(f"two clean builds differ: {sorted(k for k in set(a) | set(b) if a.get(k) != b.get(k))[:6]}")
    if a != d:
        P.append(f"output under test is stale or edited by hand: {sorted(k for k in set(a) | set(d) if a.get(k) != d.get(k))[:6]}")
    shutil.rmtree(base, ignore_errors=True)
    N.append(f"two clean builds byte-identical to each other and to the output under test ({len(a)} files); pinned dependencies; no machine paths")


GATES = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15]


def final_status():
    cats = {c for r in RESULTS for c, _ in r["problems"]}
    if ENG in cats:
        return "FAIL"
    if cats:
        return "PASS WITH OWNER INPUT REQUIRED"
    return "PASS"


def write_report(status):
    L = ["# Ali Bayat Realty: verification report", "",
         f"Output verified: `{DIST.name}/` · production domain `{BASE}` · {datetime.date.today().isoformat()}", "",
         f"## Final gate status: **{status}**", ""]
    if status == "PASS WITH OWNER INPUT REQUIRED":
        L += ["All engineering checks pass. Every remaining failure needs Ali's information, an external service, or legal/brokerage review. "
              "**Not launch-ready** until those are resolved and this report says PASS.", ""]
    L += ["| # | Gate | Result |", "|---|---|---|"]
    for r in RESULTS:
        kinds = sorted({c for c, _ in r["problems"]})
        L.append(f"| {r['n']} | {r['title']} | {'✅ pass' if r['ok'] else '❌ fail (' + ', '.join(kinds) + ')'} |")
    L.append("")
    sections = ["Routing", "SEO", "Sitemap", "Internal links", "Accessibility", "Structured data", "Lead form",
                "Content governance", "Production safety", "Performance", "Reproducibility"]
    for s in sections:
        L.append(f"## {s}")
        for r in [x for x in RESULTS if x["section"] == s]:
            L.append(f"**{r['n']}. {r['title']}: {'PASS' if r['ok'] else 'FAIL'}**")
            L += [f"- {n}" for n in r["notes"]]
            L += [f"- ✗ [{c}] {p}" for c, p in r["problems"]]
            L.append("")
        if s == "Content governance":
            L += ["| Page | Type | Author | Review | Published | Updated | Source / data period | Indexable |", "|---|---|---|---|---|---|---|---|"]
            for g in INFO["governance"]:
                src = "; ".join(s_[0] for s_ in g["sources"]) + (f" ({g['data_period']}; verified {g['verified_at']})" if g.get("data_period") else "") if g["sources"] else "n/a"
                rv = g["review_status"] + ("" if g["review_status"] != "approved" or g["approved_matches"] else " (changed since)")
                L.append(f"| `{g['path']}` | {g['content_type']} | {g['author']} | {rv} | {g['published_at'] or 'n/a'} | {g['updated_at'] or 'n/a'} | {src} | {'yes' if g['indexable'] else 'no'} |")
            L.append("")
        if s == "Production safety" and ctx_ref.get("safety"):
            L += ["| Pattern | Occurrences in published pages |", "|---|---|"]
            L += [f"| `{k}` | {v} |" for k, v in ctx_ref["safety"]["spec"].items()]
            L += ["", "Every occurrence above comes from a managed placeholder (awaiting the owner input listed below); "
                      "none appears outside the placeholder system, and the production build exits with an error while any remain.", ""]
    L += ["## Remaining blockers", ""]
    for cat in (OWNER, EXTERNAL, LEGAL, ENG):
        items = sorted({p for r in RESULTS for c, p in r["problems"] if c == cat})
        build_items = sorted({b["message"] for b in INFO["blockers"] if b["category"] == cat
                              and not b["message"].startswith(("page review", "form endpoint", "domain not confirmed"))})
        allitems = list(dict.fromkeys(items + [b for b in build_items if b not in items]))
        L.append(f"### {B.CATEGORY_LABEL[cat]} ({len(allitems)})")
        L += [f"- {x}" for x in allitems] or ["- none"]
        L.append("")
    out = DIST.parent / ("verify-report.md" if DIST == ROOT / "dist" else f"verify-report-{DIST.name}.md")
    out.write_text("\n".join(L) + "\n")
    return out


ctx_ref = {}


def main():
    global ctx_ref
    srv = serve(DIST, PORT)
    ctx = ctx_ref = {"html": {}, "doc": {}, "errors": [], "seen_err": 0}
    print(f"Verifying {DIST} at {HOST} (production domain {BASE}){'  [STAGING BUILD]' if INFO['staging'] else ''}")
    with sync_playwright() as p:
        br = p.chromium.launch()
        orig_page, orig_ctx = br.new_page, br.new_context

        def hook(pg):
            pg.route(re.compile(r"^https://fonts\."), lambda r: r.abort())   # results must not depend on the network
            pg.on("pageerror", lambda e, pg=pg: ctx["errors"].append(f"{pg.url}: {e}"))
            return pg

        def new_page(*a, **k):
            return hook(orig_page(*a, **k))

        def new_context(*a, **k):
            c = orig_ctx(*a, **k)
            c.on("page", hook)
            return c
        br.new_page, br.new_context = new_page, new_context
        ctx["browser"] = br
        for g in GATES:
            g(ctx)
        br.close()
    srv.shutdown()
    status = final_status()
    report = write_report(status)
    print(f"\n{'=' * 70}\n{sum(r['ok'] for r in RESULTS)}/{len(RESULTS)} gates passed · FINAL GATE STATUS: {status}\nReport: {report}")
    sys.exit(0 if status == "PASS" else 1)


if __name__ == "__main__":
    main()
