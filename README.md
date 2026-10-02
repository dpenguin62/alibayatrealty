# Ali Bayat Realty website

A static website: real HTML pages at real URLs, no framework, no CMS, no tracking. You own all of it.

```
src/site.html       Design source + clickable prototype. Page content and layout live here.
site.config.json    Owner-confirmed facts: phone, email, brokerage, RECO, form endpoint, approvals.
content.json        Editorial register: who approved each page, when, against which exact content.
build.py            Builds dist/ from the three files above. Exits with an error while launch blockers remain.
verify.py           15 launch gates (needs requirements.txt + `npm install` for axe-core).
verify_a11y.js      Built-in accessibility checks used by verify.py.
LEADS.md            Contact-form integration contract (+ lead.schema.json).
dist/               The website to upload. Generated; never edit by hand.
verify-report.md    The latest verification report.
```

## Setup (once)

```
pip install -r requirements.txt
python -m playwright install chromium
npm install                          # axe-core, for the full accessibility audit
```

## Everyday use

```
python build.py --staging            # preview build: banner, noindex, crawling blocked; placeholders allowed
python build.py                      # production build; lists every blocker by who must resolve it
python verify.py                     # all 15 gates (about 4 minutes); --skip-rebuild for a quicker pass
```

`verify.py` ends with one of:
- **PASS**: launch-ready.
- **PASS WITH OWNER INPUT REQUIRED**: engineering is done; the remaining items need you, a service, or legal review.
- **FAIL**: a defect to fix in the code or content.

## Getting to PASS

1. **Facts.** Fill `site.config.json` (`details`, `site_url_confirmed`, `form_endpoint`). Anything left
   `null` stays out of the site and out of the structured data, and blocks launch.
2. **Wording approvals.** Add a key to `approved` in `site.config.json` once you've confirmed the text
   is true and final:

   | Key | What you're approving |
   |---|---|
   | `reply-time` | "usually within one business day" (contact page) |
   | `contact-channels` | call, text, email or WhatsApp (About page) |
   | `experience-claim` | "about ten years" (About page). Approve only if literally true; otherwise set `details.experience_phrase` |
   | `ltt-guide-review` | You've reviewed the land transfer tax guide |
   | `footer-disclaimer` *(brokerage)* | "Not intended to solicit buyers or sellers currently under contract…" |
   | `referral-disclosure` *(brokerage)* | You receive no referral fees, or set `details.referral_disclosure` to the disclosure text |
   | `consent-wording` *(legal)* | The contact form's consent sentence. Bump `consent_version` in `src/site.html` whenever it changes |
   | `mls-notice` *(only with IDX)* | MLS® / REALTOR® trademark notice |

3. **Legal pages.** Replace the interim text in `src/site.html` (the `data-pending` boxes for privacy,
   terms and accessibility) with final, reviewed text.
4. **Page reviews.** Build, read each page, then record your approval:
   ```
   python build.py
   python build.py approve invest buy sell --by "Ali Bayat"      # or: approve --all --by "Ali Bayat"
   python build.py
   ```
   An approval is tied to the page's exact content. If the page changes later, the build asks for a new
   review. Pages that still contain placeholders can't be approved. The approval date becomes the page's
   published date (later re-approvals set the updated date). These are the only dates used for `lastmod`
   and structured data.
5. **Neighbourhood perspectives (optional).** Draft "takes" exist only in the prototype. To publish your
   own, set `perspective:"…"` for that area in `src/site.html`.
6. Run `python build.py && python verify.py` until it says **PASS**.

## Deploy

Upload `dist/` to any static host (Netlify, Cloudflare Pages, GitHub Pages, or shared hosting).
- Set the host's "not found" page to `/404.html`.
- Folders contain `index.html`, so `/invest/` works without server rules.

After launch:
- Add the site to Google Search Console and Bing Webmaster Tools, and submit `/sitemap.xml`.
- Keep the domain, hosting, analytics, Search Console, lead storage and CRM in accounts you own.
  Integrations are adapters, never the system of record.

## Extension points (not built yet, on purpose)

- **Investment guides:** `/invest/duplexes/`, `/triplexes/`, `/fourplexes/`, `/cash-flow/`, `/cap-rate/`
  and `/investment-analysis/` are planned routes in `ROUTES`. They're built only when written. Use the land
  transfer tax guide as the template (page head, byline, article body, sources, aside).
- **Listings:** set `features.idx` to `true` once a board-approved IDX/VOW feed exists. This publishes
  `/listings/` and the listing sections.
- **Market data:** set `features.market-data` once a board-approved, dated, sourced feed exists.
- **Farsi pages:** add routes per language, then add hreflang to `head()` in `build.py`.
- **CRM, email automation, lead scoring:** behind the form endpoint (see `LEADS.md`). No site changes needed.
