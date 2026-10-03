#!/usr/bin/env python3
"""
Ali Bayat Realty: static site build.

Turns the design source (src/site.html, the clickable prototype) into real, crawlable pages,
using only owner-confirmed facts (site.config.json) and editorial status (content.json).

    python build.py                     production build -> dist/   (exits 1 while launch blockers remain)
    python build.py --staging           staging build: visible banner, noindex everywhere, robots blocks all
    python build.py --out DIR           build somewhere else
    python build.py --allow-blockers    write output and exit 0 even with blockers (verification only)
    python build.py approve KEY [KEY..] --by "Ali Bayat" [--date YYYY-MM-DD]
                                        record that you reviewed a page exactly as built (see README)
    python build.py approve --all --by "Ali Bayat"

Nothing is ever invented: a fact or approval that hasn't been supplied stays a visible placeholder
in staging and is a reported blocker in production.
"""
import datetime, hashlib, html, json, os, pathlib, re, shutil, sys
from playwright.sync_api import sync_playwright

# --------------------------------------------------------------------------------------
# Defaults. Owner facts go in site.config.json (same keys), never here.
# --------------------------------------------------------------------------------------
CONFIG = {
    "site_url": "https://alibayatrealty.com",
    "site_url_confirmed": False,      # true once the domain is registered to Ali and hosting is chosen
    "site_name": "Ali Bayat",
    "agent_name": "Ali Bayat",
    "languages": ["en", "fa"],
    "areas_served": ["Toronto, ON", "North York, Toronto, ON", "Thornhill, ON", "Richmond Hill, ON", "Vaughan, ON"],
    "form_endpoint": None,            # HTTPS URL that accepts the lead payload (LEADS.md)
    "features": {"idx": False, "market-data": False},
    "details": {k: None for k in (
        "phone_display", "phone_e164", "email", "job_title", "reco_number", "start_year", "experience_phrase",
        "brokerage_name", "brokerage_address_line", "brokerage_franchise_note", "brokerage_address",
        "brokerage_url", "designations", "referral_disclosure")},
    # Wording already on the site that becomes final once approved (see README for each key).
    "approved": [],
    "same_as": [],
    "og_image": None,
}

# Who has to resolve each kind of blocker.
OWNER, EXTERNAL, LEGAL, ENGINEERING = "owner", "external", "legal", "engineering"
KEY_CATEGORY = {
    "footer-disclaimer": LEGAL, "referral-disclosure": LEGAL, "consent-wording": LEGAL, "consent-wording-fa": LEGAL, "mls-notice": LEGAL,
    "privacy-policy": LEGAL, "terms-of-use": LEGAL, "accessibility-statement": LEGAL,
    "form-endpoint": EXTERNAL,
}
CATEGORY_LABEL = {OWNER: "Requires Ali's information or approval", EXTERNAL: "Requires an external service or access",
                  LEGAL: "Requires legal / brokerage review", ENGINEERING: "Engineering defect"}

# Production safety scan: patterns that must never appear in published output.
PROHIBITED = [
    (r"\[Brokerage", "brokerage placeholder"), (r"\[year\]", "year placeholder"), (r"\[City\]", "city placeholder"),
    (r"\[Street address\]", "address placeholder"), (r"\[[A-Z][^\]\n]{1,40}\]", "bracketed placeholder"),
    (r"to be written", "unfinished content"), (r"draft for Ali", "review note"), (r"Preview only", "preview text"),
    (r"\b0{6}\b", "dummy number"), (r"000-0000", "dummy phone"), (r"\bNaN\b|\bnan\b", "NaN"),
    (r"\bundefined\b", "undefined value"), (r"\bTBC\b", "TBC"), (r"\bTBD\b", "TBD"), (r"\bTODO\b", "TODO"),
    (r"\bFIXME\b", "FIXME"), (r"(?i)lorem ipsum", "lorem ipsum"), (r"Photo to come|Portrait to come", "photo note"),
    (r"Layout example|design review|Highlight items|Site plan", "prototype text"), (r"\bAli:", "note to Ali"),
    (r"@example\.(com|org|net)", "example email"), (r"\\[nt]", "escape sequence"), (r"\{[a-z_]+\}", "unfilled template"),
]

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src" / "site.html"
ARGS = sys.argv[1:]


def _arg(name):
    return ARGS[ARGS.index(name) + 1] if name in ARGS else None


def _merge(base, extra):
    for k, v in extra.items():
        if isinstance(v, dict) and isinstance(base.get(k), dict):
            _merge(base[k], v)
        else:
            base[k] = v


CONTENT_FILE = pathlib.Path(_arg("--content")) if _arg("--content") else ROOT / "content.json"
CONFIG_FILE = pathlib.Path(_arg("--config")) if _arg("--config") else ROOT / "site.config.json"
if CONFIG_FILE.exists():
    _merge(CONFIG, {k: v for k, v in json.loads(CONFIG_FILE.read_text()).items() if not k.startswith("_")})
if os.environ.get("ABR_TEST_FORM_ENDPOINT"):          # verify.py only: exercises the submit path in a throwaway build
    CONFIG["form_endpoint"] = os.environ["ABR_TEST_FORM_ENDPOINT"]
STAGING = "--staging" in ARGS
OUT = pathlib.Path(_arg("--out")) if _arg("--out") else ROOT / "dist"
BASE = CONFIG["site_url"].rstrip("/")
DETAILS = {k: v for k, v in CONFIG["details"].items() if v is not None}
for k in CONFIG["details"]:
    KEY_CATEGORY.setdefault(k, OWNER)


def load_content():
    return json.loads(CONTENT_FILE.read_text()) if CONTENT_FILE.exists() else {"pages": {}}


CONTENT = load_content()


def page_status(key):
    return CONTENT.get("pages", {}).get(key, {})


# Runs inside the rendered prototype: clones the visible page plus shared chrome, removes
# unreleased features and internal notes, fills confirmed facts, rewrites #links to real URLs.
TRANSFORM_JS = r"""
(cfg) => {
  const R = window.__routes, map = {};
  R.forEach(r => { if (r.path && !r.internal && !r.planned && (!r.requires || cfg.features[r.requires])) map[r.key] = r.path; });
  const page = [...document.querySelectorAll('main [data-page]')].find(p => !p.hidden);
  // Farsi pages use the Farsi header/footer/mobile bar from <template id="fa-chrome">.
  const fa = cfg.lang === 'fa', chrome = fa ? document.getElementById('fa-chrome').content : document;
  const parts = { header: chrome.querySelector('.site-head'), page,
                  footer: chrome.querySelector('footer'), mbar: chrome.querySelector('#mbar') };
  const out = {}, warn = [], unresolved = [];
  const fill = tpl => tpl.replace(/\{(\w+)\}/g, (_, k) => cfg.values[k]);
  const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  for (const [k, el] of Object.entries(parts)) {
    const c = el.cloneNode(true);
    if (k === 'footer' && fa) {  // legal notices stay in their approved English wording
      const slot = c.querySelector('[data-legal-from-en]');
      const legal = document.querySelector('footer .legal').cloneNode(true);
      legal.setAttribute('lang', 'en'); legal.setAttribute('dir', 'ltr');
      if (slot) slot.replaceWith(legal);
    }
    if (k === 'header' && fa) c.querySelectorAll('.nav a, .drawer a').forEach(a => {
      if (a.getAttribute('href') === '#' + (cfg.navKey || cfg.route) && !a.classList.contains('btn')) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    c.querySelectorAll('[data-lang-switch]').forEach(a => a.setAttribute('href', '#' + (cfg.altKey || (fa ? 'home' : 'fa-home'))));
    c.querySelectorAll('[data-internal], .tbc-note, .photo-tag, [data-preview-only]').forEach(x => x.remove());
    c.querySelectorAll('[data-requires]').forEach(x => { if (!cfg.features[x.dataset.requires]) x.remove(); else x.removeAttribute('data-requires'); });
    if (k === 'page') c.removeAttribute('hidden');

    // Placeholders: fill confirmed values, unwrap approved wording, drop resolved notes. Anything else stays.
    c.querySelectorAll('mark.tbc').forEach(m => {
      const d = m.dataset, keys = d.tpl ? [...d.tpl.matchAll(/\{(\w+)\}/g)].map(x => x[1]) : [];
      if (d.tpl && keys.every(x => x in cfg.values)) {
        const text = fill(d.tpl);
        if (!text.trim()) { (d.removeEmpty ? m.closest(d.removeEmpty) : m).remove(); return; }
        const frag = document.createDocumentFragment();
        text.split(/\n|\\n/).forEach((line, i) => { if (i) frag.appendChild(document.createElement('br')); frag.appendChild(document.createTextNode(line)); });
        m.replaceWith(frag); return;
      }
      if (d.approve && cfg.approved.includes(d.approve)) { m.replaceWith(...m.childNodes); return; }
      if (d.note && cfg.approved.includes(d.note)) { m.remove(); return; }
      const key = d.approve || d.note || keys.filter(x => !(x in cfg.values)).join('+');
      m.setAttribute('data-unresolved', key);
      unresolved.push(key);
    });

    // Editorial dates, shown only when real.
    c.querySelectorAll('[data-meta="dates"]').forEach(x => {
      const t = [cfg.dates.published && (fa ? 'تاریخ انتشار: ' : 'Published ') + cfg.dates.published, cfg.dates.updated && (fa ? 'به‌روزرسانی: ' : 'Updated ') + cfg.dates.updated].filter(Boolean).join(' · ');
      if (t) { x.textContent = t; x.removeAttribute('data-meta'); x.setAttribute('data-editorial', ''); } else { const br = x.previousElementSibling; if (br && br.tagName === 'BR') br.remove(); x.remove(); }
    });

    c.querySelectorAll('.portrait .dir').forEach(x => x.remove());
    c.querySelectorAll('.portrait[role="img"]').forEach(x => x.setAttribute('aria-label', 'Ali Bayat monogram'));
    c.querySelectorAll('.dwg[aria-label^="Drawing placeholder"]').forEach(x => x.setAttribute('aria-label', 'Architectural drawing'));

    const form = c.querySelector('#contact-form');
    if (form) {
      if (cfg.endpoint) {
        form.setAttribute('action', cfg.endpoint); form.setAttribute('method', 'post');
        form.setAttribute('data-endpoint', cfg.endpoint); form.removeAttribute('novalidate');
      } else {
        // Honest pending state: the form can't send, so it says so and can't be submitted.
        const n = document.createElement('div');
        n.className = 'banner'; n.setAttribute('role', 'note'); n.setAttribute('data-pending', 'form-endpoint');
        n.innerHTML = fa ? '<p><b>ارسال پیام آنلاین هنوز فعال نیست.</b> این فرم به‌زودی به صندوق ایمیل علی متصل می‌شود. تا آن زمان لطفاً تماس بگیرید یا پیامک بفرستید.</p>'
                         : '<p><b>Online messages aren’t available yet.</b> This form will start working once it’s connected to Ali’s inbox.</p>';
        form.before(n);
        const b = form.querySelector('#c-send'); b.disabled = true; b.setAttribute('aria-disabled', 'true');
      }
    }

    c.querySelectorAll('a[href^="#"]').forEach(a => {
      const key = a.getAttribute('href').slice(1);
      if (key === 'main') return;
      if (a.dataset.cat) {
        a.setAttribute('href', '/resources/?category=' + encodeURIComponent(a.dataset.cat));
        a.removeAttribute('data-cat'); return;
      }
      const p = map[key];
      if (!p) { warn.push(key); return; }
      let href = p;
      if ((key === 'contact' || key === 'fa-contact') && !a.hasAttribute('data-lang-switch')) {
        const q = [];
        if (a.dataset.interest) q.push('interest=' + a.dataset.interest);
        if (a.dataset.request) q.push('request=' + a.dataset.request);
        if (k === 'page' || a.dataset.cta) q.push('cta=' + (cfg.route + ':' + (a.dataset.cta || slug(a.textContent) || 'link')));
        if (q.length) href += '?' + q.join('&');
      }
      ['interest', 'request', 'cta'].forEach(x => a.removeAttribute('data-' + x));
      a.setAttribute('href', href);
    });
    out[k] = c.outerHTML;
  }
  return { out, warn, unresolved };
}
"""

FAVICON = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#F3F4F0"/><rect x="7" y="7" width="50" height="50" fill="none" stroke="#14222A" stroke-width="3"/><text x="32" y="41" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="24" fill="#14222A">AB</text></svg>
"""
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">')
STAGING_BAR = ('<div class="preview" role="note" aria-label="Staging notice"><div class="wrap"><span><span class="dot" aria-hidden="true"></span>'
               'Staging preview, not the live site. Unconfirmed details are shown as placeholders.</span></div></div>')


def esc(s):
    return html.escape(s or "", quote=True)


def url(path):
    return BASE + path


def fmt_date(d):
    if not d:
        return None
    dt = datetime.date.fromisoformat(d)
    return f"{dt.strftime('%B')} {dt.day}, {dt.year}"


def main_text(doc):
    """Normalized visible text of <main>: what a reviewer actually approved."""
    m = re.search(r"<main[^>]*>(.*)</main>", doc, re.S)
    # Editorial dates are excluded: recording an approval must not invalidate it.
    t = re.sub(r"<span[^>]*data-editorial[^>]*>.*?</span>", " ", m.group(1), flags=re.S)
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", t, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t))).strip()


def approved_live(r, content_hash):
    st = page_status(r["key"])
    return st.get("review_status") == "approved" and st.get("approved_hash") == content_hash


FAQS = {}  # path -> [(question, answer)], read from the built page's data-faq block


def extract_faq(doc):
    m = re.search(r'<div class="body faq" data-faq[^>]*>(.*?)</div></div>', doc, re.S)
    if not m:
        return []
    pairs = re.findall(r"<h3>(.*?)</h3>\s*<p>(.*?)</p>", m.group(1), re.S)
    clean = lambda x: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", x))).strip()
    return [(clean(q), clean(a)) for q, a in pairs]


def ld_graph(r, routes_by_key, content_hash):
    """JSON-LD from confirmed facts only. Ali is a Person; his practice is a RealEstateAgent;
    the brokerage is an Organization, and appears only once its details are confirmed."""
    person = {"@type": "Person", "@id": BASE + "/#ali", "name": CONFIG["agent_name"],
              "url": BASE + "/about/", "knowsLanguage": CONFIG["languages"]}
    if "job_title" in DETAILS:
        person["jobTitle"] = DETAILS["job_title"]
    if DETAILS.get("reco_number"):
        person["identifier"] = {"@type": "PropertyValue", "propertyID": "RECO registration number", "value": DETAILS["reco_number"]}
    if DETAILS.get("designations") and "TRREB" in DETAILS["designations"]:
        person["memberOf"] = {"@type": "Organization", "name": "Toronto Regional Real Estate Board", "alternateName": "TRREB", "url": "https://trreb.ca"}
    if CONFIG["same_as"]:
        person["sameAs"] = CONFIG["same_as"]
    business = {"@type": "RealEstateAgent", "@id": BASE + "/#business", "name": CONFIG["site_name"], "url": BASE + "/",
                "areaServed": [{"@type": "Place", "name": a} for a in CONFIG["areas_served"]],
                "knowsLanguage": CONFIG["languages"], "founder": {"@id": BASE + "/#ali"}}
    if "phone_e164" in DETAILS:
        business["telephone"] = DETAILS["phone_e164"]
    if "email" in DETAILS:
        business["email"] = DETAILS["email"]
    if CONFIG["same_as"]:
        business["sameAs"] = CONFIG["same_as"]
    if CONFIG["og_image"]:
        business["image"] = CONFIG["og_image"]
    graph = [{"@type": "WebSite", "@id": BASE + "/#website", "url": BASE + "/", "name": CONFIG["site_name"],
              "inLanguage": "en-CA", "publisher": {"@id": BASE + "/#business"}}, business, person]
    if "brokerage_name" in DETAILS:
        brokerage = {"@type": "Organization", "@id": BASE + "/#brokerage", "name": DETAILS["brokerage_name"],
                     "legalName": DETAILS["brokerage_name"]}
        if DETAILS.get("brokerage_url"):
            brokerage["url"] = DETAILS["brokerage_url"]
        if DETAILS.get("brokerage_address"):
            brokerage["address"] = {"@type": "PostalAddress", **DETAILS["brokerage_address"]}
            business["address"] = brokerage["address"]
        graph.append(brokerage)
        business["parentOrganization"] = {"@id": BASE + "/#brokerage"}
        person["worksFor"] = {"@id": BASE + "/#brokerage"}

    page_url = url(r["path"])
    st, live = page_status(r["key"]), approved_live(r, content_hash)
    webpage = {"@type": "WebPage", "@id": page_url + "#webpage", "url": page_url, "name": r["title"],
               "description": r["desc"], "inLanguage": "fa" if r.get("lang") == "fa" else "en-CA", "isPartOf": {"@id": BASE + "/#website"}}
    if r.get("place"):
        webpage["about"] = {"@type": "Place", "name": next(a for a in CONFIG["areas_served"] if a.startswith(r["place"]))}
    if live:  # authorship and dates are claimed only for pages Ali has actually approved
        webpage["author"] = {"@id": BASE + "/#ali"}
        if st.get("published_at"):
            webpage["datePublished"] = st["published_at"]
        if st.get("updated_at"):
            webpage["dateModified"] = st["updated_at"]

    chain, cur = [], r
    while cur:
        chain.append(cur)
        cur = routes_by_key.get(cur.get("parent"))
    chain.reverse()
    if len(chain) > 1:
        webpage["breadcrumb"] = {"@id": page_url + "#breadcrumb"}
        graph.append({"@type": "BreadcrumbList", "@id": page_url + "#breadcrumb",
                      "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": c["name"], "item": url(c["path"])}
                                          for i, c in enumerate(chain)]})
    graph.append(webpage)
    faq = FAQS.get(r["path"])
    if faq:  # visible Q&A on the page, mirrored exactly (answer engines read this)
        graph.append({"@type": "FAQPage", "@id": page_url + "#faq", "isPartOf": {"@id": page_url + "#webpage"},
                      "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]})
    if r.get("type") == "article":
        art = {"@type": "Article", "@id": page_url + "#article", "headline": r["h1"], "description": r["desc"],
               "mainEntityOfPage": {"@id": page_url + "#webpage"}, "inLanguage": "en-CA",
               "publisher": {"@id": BASE + "/#business"}}
        if r.get("sources"):
            art["citation"] = [s[1] for s in r["sources"]]
        if live:
            art["author"] = {"@id": BASE + "/#ali"}
            for k, prop in (("published_at", "datePublished"), ("updated_at", "dateModified")):
                if st.get(k):
                    art[prop] = st[k]
        if CONFIG["og_image"]:
            art["image"] = CONFIG["og_image"]
        graph.append(art)
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=1).replace("</", "<\\/")


def head(r, routes_by_key, css_href, content_hash):
    indexable = r["index"] and not STAGING
    is_404 = r["key"] == "not-found"
    title = ("[Staging] " if STAGING else "") + r["title"]
    tags = ['<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
            f'<title>{esc(title)}</title>',
            f'<meta name="description" content="{esc(r["desc"])}">',
            f'<meta name="robots" content="{"index, follow" if indexable else "noindex, follow"}">']
    if not is_404:
        tags += [f'<link rel="canonical" href="{esc(url(r["path"]))}">',
                 f'<meta property="og:type" content="{"article" if r.get("type") == "article" else "website"}">',
                 f'<meta property="og:site_name" content="{esc(CONFIG["site_name"])}">',
                 f'<meta property="og:locale" content="{"fa_IR" if r.get("lang") == "fa" else "en_CA"}">',
                 f'<meta property="og:title" content="{esc(r["title"])}">',
                 f'<meta property="og:description" content="{esc(r["desc"])}">',
                 f'<meta property="og:url" content="{esc(url(r["path"]))}">']
        if CONFIG["og_image"]:
            tags += [f'<meta property="og:image" content="{esc(CONFIG["og_image"])}">', '<meta name="twitter:card" content="summary_large_image">']
        else:
            tags.append('<meta name="twitter:card" content="summary">')
        tags += [f'<meta name="twitter:title" content="{esc(r["title"])}">', f'<meta name="twitter:description" content="{esc(r["desc"])}">']
    tags += ['<link rel="icon" href="/favicon.svg" type="image/svg+xml">', '<meta name="theme-color" content="#F3F4F0">',
             FONTS, f'<link rel="stylesheet" href="{css_href}">']
    if r.get("lang") == "fa":
        tags.insert(-1, '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700&display=swap">')
    alt = routes_by_key.get(r.get("alt"))
    if alt and not is_404:  # hreflang pairs: English <-> Farsi versions of the same page
        en, fa_ = (alt, r) if r.get("lang") == "fa" else (r, alt)
        tags += [f'<link rel="alternate" hreflang="en-CA" href="{esc(url(en["path"]))}">',
                 f'<link rel="alternate" hreflang="fa" href="{esc(url(fa_["path"]))}">',
                 f'<link rel="alternate" hreflang="x-default" href="{esc(url(en["path"]))}">']
    if not is_404:
        tags.append(f'<script type="application/ld+json">\n{ld_graph(r, routes_by_key, content_hash)}\n</script>')
    return "\n".join(tags)


def production_js(src_js, legacy):
    js = re.sub(r"/\*<prototype>\*/.*?/\*</prototype>\*/", "", src_js, flags=re.S)
    assert "/*@legacy*/{}" in js
    js = js.replace("/*@legacy*/{}", json.dumps(legacy, separators=(",", ":")))
    js = re.sub(r"\n\s*\n+", "\n", js)
    return "/* Ali Bayat Realty: generated from src/site.html by build.py */\n" + js.strip() + "\n"


# ------------------------------------------------------------------------- validation
def visible_text(doc, drop_unresolved=False):
    if drop_unresolved:  # unresolved placeholders are reported by key, not as anonymous leaks
        doc = re.sub(r'<mark class="tbc"[^>]*data-unresolved[^>]*>.*?</mark>', " ", doc, flags=re.S)
        doc = re.sub(r'<div class="banner" role="note" data-pending="form-endpoint">.*?</div>', " ", doc, flags=re.S)
    doc = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", doc, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", doc)))


def validate(out, built, routes, pages_html, unresolved, hashes):
    """Production rules. Returns blockers as (category, message)."""
    B = []
    # 1. Placeholders and prohibited text
    for key, where in sorted(unresolved.items()):
        cat = KEY_CATEGORY.get(key.split("+")[0], OWNER)
        B.append((cat, f"needs {key} ({len(where)} page{'s' if len(where) > 1 else ''}: {', '.join(sorted(where)[:3])}{'…' if len(where) > 3 else ''})"))
    for path, doc in pages_html.items():
        for m in sorted(set(re.findall(r'data-pending="([^"]+)"', doc)) - {"form-endpoint"}):  # endpoint reported once below
            B.append((KEY_CATEGORY.get(m, LEGAL), f"{path}: {m} is interim, not final"))
        txt = visible_text(doc, drop_unresolved=True)
        hits = sorted({label for pat, label in PROHIBITED if re.search(pat, txt)})
        if hits:
            B.append((ENGINEERING, f"{path}: prohibited text in output: {', '.join(hits)}"))
        for marker in ("data-internal", "tbc-note", "photo-tag"):
            if marker in doc:
                B.append((ENGINEERING, f"{path}: internal element '{marker}' shipped"))
    for asset in ("assets/site.js", "assets/site.css", "robots.txt", "sitemap.xml"):
        t = (out / asset).read_text()
        hits = sorted({label for pat, label in PROHIBITED if label in ("TODO", "FIXME", "TBC", "TBD", "unfinished content",
                       "review note", "preview text", "dummy phone", "dummy number", "prototype text", "note to Ali") and re.search(pat, t)})
        if hits:
            B.append((ENGINEERING, f"{asset}: {', '.join(hits)}"))
    # 2. Internal links resolve to built files; in-page anchors have targets
    files = {"/" + str(p.relative_to(out)).replace("\\", "/") for p in out.rglob("*") if p.is_file()}
    def exists(path):
        return path in files or (path.endswith("/") and path + "index.html" in files)
    for path, doc in pages_html.items():
        ids = set(re.findall(r'\sid="([^"]+)"', doc))
        for href in re.findall(r'(?:href|src)="([^"]+)"', doc):
            if href.startswith(("http://", "https://", "mailto:", "tel:")):
                if href.startswith(BASE + "/"):
                    href = href[len(BASE):]
                else:
                    continue
            if href.startswith("#"):
                if href[1:] not in ids:
                    B.append((ENGINEERING, f"{path}: anchor {href} has no target"))
                continue
            target = href.split("#")[0].split("?")[0]
            if target and not exists(target):
                B.append((ENGINEERING, f"{path}: broken internal link {href}"))
    # 3. Routes: every intended page built, nothing extra, nothing planned
    intended = {r["path"] for r in routes if r["path"] and not r.get("internal") and not r.get("planned")
                and (not r.get("requires") or CONFIG["features"].get(r["requires"]))}
    built_paths = {r["path"] for r, _ in built}
    for p in sorted(intended - built_paths):
        B.append((ENGINEERING, f"intended route not built: {p}"))
    html_files = {("/" + str(p.relative_to(out))).replace("index.html", "") for p in out.rglob("*.html")}
    for p in sorted(html_files - intended):
        B.append((ENGINEERING, f"unintended page in output: {p}"))
    # 4. Governance: indexable pages must be approved exactly as built
    for r, _ in built:
        if not r["index"] or r["key"] == "not-found":
            continue
        st = page_status(r["key"])
        if st.get("review_status") != "approved":
            B.append((OWNER, f"page review: {r['path']} not yet approved by Ali"))
        elif st.get("approved_hash") != hashes[r["path"]]:
            B.append((OWNER, f"page review: {r['path']} changed since it was approved; review again"))
        elif not st.get("published_at"):
            B.append((OWNER, f"page review: {r['path']} has no publication date"))
        if r.get("ts") and r.get("verifiedAt"):
            age = (datetime.date.today() - datetime.date.fromisoformat(r["verifiedAt"])).days
            if age > 180:
                B.append((OWNER, f"{r['path']}: time-sensitive facts last verified {r['verifiedAt']} ({age} days ago); re-verify"))
    # 5. Integrations and domain
    if not CONFIG["form_endpoint"]:
        B.append((EXTERNAL, "form endpoint not configured: the contact form cannot send messages"))
    if not CONFIG["site_url_confirmed"]:
        B.append((EXTERNAL, f"domain not confirmed: {BASE} (registered to Ali? hosting chosen?)"))
    return list(dict.fromkeys(B))


# ------------------------------------------------------------------------- build
def build():
    src = SRC.read_text(encoding="utf8")
    styles = re.findall(r"<style>(.*?)</style>", src, re.S)
    scripts = re.findall(r"<script>(.*?)</script>", src, re.S)
    assert len(styles) == 2 and len(scripts) == 1, "unexpected source structure"
    css = "/* Ali Bayat Realty: generated from src/site.html by build.py */\n" + styles[0] + "\n" + styles[1]

    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "assets").mkdir(parents=True)
    (OUT / "favicon.svg").write_text(FAVICON, encoding="utf8")

    built, warnings, unresolved, pages_html, hashes = [], [], {}, {}, {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        pg = browser.new_page(viewport={"width": 1280, "height": 900})
        errors = []
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.route(re.compile(r"^https?://"), lambda route: route.abort())  # offline and deterministic
        pg.goto(SRC.resolve().as_uri() + "#home")
        pg.wait_for_function("window.__routes && document.body.dataset.route")
        routes = pg.evaluate("window.__routes.map(r=>({...r}))")
        by_key = {r["key"]: r for r in routes}
        public = [r for r in routes if r["path"] and not r.get("internal") and not r.get("planned")
                  and (not r.get("requires") or CONFIG["features"].get(r["requires"]))]
        legacy = {r["key"]: r["path"] for r in public if r["key"] != "not-found"}
        js = production_js(scripts[0], legacy)
        v_css, v_js = hashlib.sha1(css.encode()).hexdigest()[:10], hashlib.sha1(js.encode()).hexdigest()[:10]
        (OUT / "assets" / "site.css").write_text(css, encoding="utf8")
        (OUT / "assets" / "site.js").write_text(js, encoding="utf8")

        for r in public:
            expect = r.get("page", r["key"])
            pg.evaluate("k => { location.hash = k }", r["key"])
            pg.wait_for_function("e => document.body.dataset.route === e", arg=expect)
            st = page_status(r["key"])
            cfg = {"values": DETAILS, "approved": CONFIG["approved"], "features": CONFIG["features"],
                   "endpoint": CONFIG["form_endpoint"], "route": r["key"], "lang": r.get("lang", "en"), "altKey": r.get("alt"), "navKey": {"fa-area": "fa-neighbourhoods", "fa-guide-land-transfer-tax": "fa-resources"}.get(r.get("page", r["key"]), r["key"]),
                   "dates": {"published": fmt_date(st.get("published_at")), "updated": fmt_date(st.get("updated_at"))}}
            res = pg.evaluate(TRANSFORM_JS, cfg)
            warnings += [f'{r["path"]}: unmapped link #{w}' for w in res["warn"]]
            for u in res["unresolved"]:
                unresolved.setdefault(u, set()).add(r["path"])
            o = res["out"]
            body = f'{o["header"]}\n<main id="main">\n{o["page"]}\n</main>\n{o["footer"]}\n{o["mbar"]}\n'
            content_hash = hashlib.sha1(main_text(body).encode()).hexdigest()[:16]
            FAQS[r["path"]] = extract_faq(body)
            hashes[r["path"]] = content_hash
            doc = ('<!doctype html>\n'
                   f'<html lang="{"fa" if r.get("lang") == "fa" else "en-CA"}"{" dir=\"rtl\"" if r.get("lang") == "fa" else ""} data-static>\n<head>\n{head(r, by_key, f"/assets/site.css?v={v_css}", content_hash)}\n</head>\n'
                   f'<body data-route="{esc(expect)}">\n<a class="skip" href="#main">Skip to content</a>\n'
                   + (STAGING_BAR + "\n" if STAGING else "") + body +
                   f'<script src="/assets/site.js?v={v_js}" defer></script>\n</body>\n</html>\n')
            out = OUT / (r["path"].lstrip("/") if r["path"].endswith(".html") else r["path"].lstrip("/") + "index.html")
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(doc, encoding="utf8")
            pages_html[r["path"]] = doc
            built.append((r, content_hash))
        browser.close()
    if errors:
        raise SystemExit("JavaScript errors while rendering:\n" + "\n".join(errors))

    # Sitemap: indexable canonical URLs; lastmod only from a real publication/update date.
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    if not STAGING:
        for r, _ in built:
            if r["index"] and r["key"] != "not-found":
                st = page_status(r["key"])
                mod = st.get("updated_at") or st.get("published_at")
                sm.append(f"  <url><loc>{esc(url(r['path']))}</loc>" + (f"<lastmod>{mod}</lastmod>" if mod else "") + "</url>")
    sm.append("</urlset>")
    (OUT / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf8")
    robots = ("# Staging build: keep out of search engines\nUser-agent: *\nDisallow: /\n" if STAGING
              else f"# {CONFIG['site_name']}\nUser-agent: *\nAllow: /\n\nSitemap: {BASE}/sitemap.xml\n")
    (OUT / "robots.txt").write_text(robots, encoding="utf8")

    blockers = validate(OUT, built, routes, pages_html, {k: v for k, v in unresolved.items()}, hashes)
    gov = []
    for r, h in built:
        st = page_status(r["key"])
        gov.append({"path": r["path"], "key": r["key"], "content_type": r.get("ct"), "category": r.get("cat"),
                    "geography": r.get("geo"), "evergreen": bool(r.get("evergreen")), "time_sensitive": bool(r.get("ts")),
                    "author": CONTENT.get("defaults", {}).get("author"), "review_status": st.get("review_status", "draft"),
                    "approved_matches": st.get("approved_hash") == h, "reviewed_by": st.get("reviewed_by"),
                    "published_at": st.get("published_at"), "updated_at": st.get("updated_at"),
                    "data_period": r.get("dataPeriod"), "verified_at": r.get("verifiedAt"),
                    "sources": r.get("sources") or [], "indexable": bool(r["index"]) and not STAGING,
                    "canonical": None if r["key"] == "not-found" else url(r["path"]), "content_hash": h,
                    "open_items": sorted({k for k, v in unresolved.items() if r["path"] in v}
                                         | set(re.findall(r'data-pending="([^"]+)"', pages_html[r["path"]])))})
    info = {"base": BASE, "staging": STAGING, "endpoint": CONFIG["form_endpoint"], "features": CONFIG["features"],
            "routes": [{k: r.get(k) for k in ("key", "path", "title", "desc", "h1", "index", "parent", "name", "type",
                                               "requires", "internal", "page", "planned", "lang", "alt")} for r in routes],
            "built": [r["path"] for r, _ in built], "hashes": hashes,
            "unresolved": {k: sorted(v) for k, v in sorted(unresolved.items())},
            "blockers": [{"category": c, "message": m} for c, m in blockers], "governance": gov,
            "details": sorted(DETAILS), "approved": CONFIG["approved"],
            "assets": {"site.js": len(js.encode()), "site.css": len(css.encode())}}
    (OUT.parent / f".{OUT.name}-build.json").write_text(json.dumps(info, indent=1))

    print(f"Built {len(built)} pages{' [STAGING]' if STAGING else ''} -> {OUT}  (JS {len(js.encode()) // 1024} KB, CSS {len(css.encode()) // 1024} KB)")
    for w in warnings:
        print("WARNING", w)
    if STAGING:
        print("Staging build: placeholders allowed; noindex everywhere; robots.txt blocks all.")
        return 0
    if blockers:
        print(f"\nPRODUCTION BLOCKED: {len(blockers)} item(s) must be resolved before launch.")
        for cat in (ENGINEERING, OWNER, LEGAL, EXTERNAL):
            items = [m for c, m in blockers if c == cat]
            if items:
                print(f"\n  {CATEGORY_LABEL[cat]} ({len(items)})")
                for m in items:
                    print("   -", m)
        return 0 if "--allow-blockers" in ARGS else 1
    print("Production build passed all build-time checks.")
    return 0


# ------------------------------------------------------------------------- approvals
def approve():
    """Record Ali's review of pages exactly as they are in the last production build."""
    info_file = OUT.parent / f".{OUT.name}-build.json"
    if not info_file.exists():
        raise SystemExit("Run `python build.py` first so the current page content can be recorded.")
    info = json.loads(info_file.read_text())
    by = _arg("--by")
    if not by:
        raise SystemExit('Say who reviewed it: --by "Ali Bayat"')
    when = _arg("--date") or datetime.date.today().isoformat()
    datetime.date.fromisoformat(when)
    keys = [g["key"] for g in info["governance"]] if "--all" in ARGS else \
        [a for i, a in enumerate(ARGS[1:], 1) if not a.startswith("--") and not ARGS[i - 1].startswith("--")]
    known = {g["key"]: g for g in info["governance"]}
    content = load_content()
    for k in keys:
        if k not in known:
            raise SystemExit(f"Unknown page key: {k}. Known: {', '.join(known)}")
        g = known[k]
        if g.get("open_items"):  # a page can't be approved while it still has placeholders or interim content
            print(f"NOT approved {k} ({g['path']}): still has open items: {', '.join(g['open_items'])}")
            continue
        st = content.setdefault("pages", {}).setdefault(k, {})
        changed = st.get("approved_hash") not in (None, g["content_hash"])
        st.update({"review_status": "approved", "approved_hash": g["content_hash"], "reviewed_by": by, "reviewed_at": when})
        if not st.get("published_at"):
            st["published_at"] = when
        elif changed:
            st["updated_at"] = when
        print(f"approved {k} ({g['path']}) as of {when}")
    CONTENT_FILE.write_text(json.dumps(content, indent=1, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    sys.exit(approve() if ARGS[:1] == ["approve"] else build())
