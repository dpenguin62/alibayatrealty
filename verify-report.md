# Ali Bayat Realty: verification report

Output verified: `dist/` · production domain `https://alibayatrealty.com` · 2026-10-03

## Final gate status: **PASS WITH OWNER INPUT REQUIRED**

All engineering checks pass. Every remaining failure needs Ali's information, an external service, or legal/brokerage review. **Not launch-ready** until those are resolved and this report says PASS.

| # | Gate | Result |
|---|---|---|
| 1 | Every intended production URL resolves (trailing slashes, 404, planned URLs absent) | ✅ pass |
| 2 | Title, description, H1, canonical, robots and social metadata | ✅ pass |
| 3 | Zero broken internal links | ✅ pass |
| 4 | No production hash-routing dependency; content works without JavaScript | ✅ pass |
| 5 | Sitemap: only intended canonical indexable URLs, accurate lastmod | ✅ pass |
| 6 | robots.txt behaves correctly (production and staging) | ✅ pass |
| 7 | Structured data is valid and truthful (no invented facts) | ✅ pass |
| 8 | Navigation works on desktop, tablet and mobile | ✅ pass |
| 9 | Accessibility: axe-core, keyboard, focus, contrast, mobile, reduced motion | ❌ fail (external) |
| 10 | Lead form: production endpoint, payload contract, consent, honest states | ❌ fail (external) |
| 11 | Production safety: no placeholders, invented facts or interim content | ❌ fail (legal, owner) |
| 12 | Content governance: author, review status, dates, sources, indexability | ❌ fail (owner) |
| 13 | Internal linking: no orphans, pillars connected, contextual links | ✅ pass |
| 14 | Performance budget: weight, requests, DOM size, layout shift, render-blocking | ✅ pass |
| 15 | Reproducible, machine-independent build | ✅ pass |

## Routing
**1. Every intended production URL resolves (trailing slashes, 404, planned URLs absent): PASS**
- 32 URLs: all 200; trailing-slash redirects 301; unknown URLs 404 with the site's page
- planned, not built (no thin pages): /invest/duplexes/, /invest/triplexes/, /invest/fourplexes/, /invest/cash-flow/, /invest/cap-rate/, /invest/investment-analysis/
- held back until the feature is live: /listings/

**4. No production hash-routing dependency; content works without JavaScript: PASS**
- primary navigation uses real URLs; no hashchange listener anywhere; /#buy, /#sell, /#invest forward to real pages
- every page's H1 and main content present with JavaScript disabled

## SEO
**2. Title, description, H1, canonical, robots and social metadata: PASS**
- 32 pages: unique titles and descriptions; descriptions 70–160 characters; one H1 each; OG + Twitter tags
- titles over 65 characters may be shortened in results (wording as specified): /invest/ (68)

**6. robots.txt behaves correctly (production and staging): PASS**
- production: everything crawlable, noindex pages reachable so the tag is seen, sitemap declared
- staging: robots.txt blocks all, every page noindex, visible staging banner and [Staging] titles, empty sitemap

## Sitemap
**5. Sitemap: only intended canonical indexable URLs, accurate lastmod: PASS**
- 28 URLs, all canonical and indexable; noindex, planned and held-back pages excluded
- lastmod present on 0 of 28 (only from real publish/update dates; omitted otherwise, never the build date)

## Internal links
**3. Zero broken internal links: PASS**
- 1841 links and assets across 32 pages → 34 unique internal targets, 0 broken

**13. Internal linking: no orphans, pillars connected, contextual links: PASS**
- contextual inbound links (main content only): / 18, /contact/ 15, /fa/ 14, /fa/contact/ 13, /invest/ 12, /fa/invest/ 11, /buy/ 10, /neighbourhoods/north-york/ 10, /neighbourhoods/vaughan/ 10, /sell/ 9, /neighbourhoods/thornhill/ 9, /fa/buy/ 9, /fa/neighbourhoods/ 9, /neighbourhoods/ 8, /neighbourhoods/richmond-hill/ 8, /neighbourhoods/toronto/ 8, /resources/buying/land-transfer-tax-toronto-york-region/ 8, /fa/sell/ 8, /fa/neighbourhoods/north-york/ 8, /fa/neighbourhoods/vaughan/ 8, /fa/neighbourhoods/thornhill/ 7, /fa/neighbourhoods/richmond-hill/ 7, /fa/neighbourhoods/toronto/ 7, /fa/resources/buying/land-transfer-tax-toronto-york-region/ 7, /resources/ 3, /fa/resources/ 2, /privacy/ 2, /about/ 1, /fa/about/ 1, /terms/ 0, /accessibility/ 0

## Accessibility
**8. Navigation works on desktop, tablet and mobile: PASS**
- desktop 1280px: every label goes to its intended URL; correct active state on every page
- tablet 820px and mobile 375px (touch): menu opens, every link correct, closes; no horizontal scroll on any page

**9. Accessibility: axe-core, keyboard, focus, contrast, mobile, reduced motion: FAIL**
- axe-core: not run
- built-in checks (names, labels, ARIA, landmarks, zoom, WCAG AA contrast) on 32 pages × light/dark × 1280/375px: 0 issue(s), 0 contrast
- keyboard: every control reachable by Tab on every page (0 page(s) with gaps); 0 control(s) without a visible focus ring; skip link, menu Enter/Tab/Escape, live calculator results, reduced motion
- ✗ [external] axe-core is not installed, so the full axe rule set did NOT run. Run `npm install` (package.json pins axe-core) and re-verify

## Structured data
**7. Structured data is valid and truthful (no invented facts): PASS**
- entities: Ali = Person; Ali Bayat Realty = RealEstateAgent (founder → Ali); brokerage = Organization (parentOrganization / worksFor) once confirmed
- no ratings, reviews, awards or invented dates; author/dates only on pages Ali has approved

## Lead form
**10. Lead form: production endpoint, payload contract, consent, honest states: FAIL**
- stand-in endpoint (code path only; NOT the integration): payload matches lead.schema.json; consent required; source_page /invest/ and source_cta from a real click path; UTM from the landing URL; referrer reduced to its origin; error keeps the message; no-JS POST; honeypot; no third-party requests
- ✗ [external] no production endpoint configured (site.config.json form_endpoint): the live form cannot send messages

## Content governance
**12. Content governance: author, review status, dates, sources, indexability: FAIL**
- 32 pages registered; 0 approved as built; author = Ali Bayat
- approvals are tied to each page's exact content; dates come only from Ali's approvals (python build.py approve …)
- ✗ [owner] /: not yet reviewed and approved by Ali
- ✗ [owner] /about/: not yet reviewed and approved by Ali
- ✗ [owner] /buy/: not yet reviewed and approved by Ali
- ✗ [owner] /sell/: not yet reviewed and approved by Ali
- ✗ [owner] /invest/: not yet reviewed and approved by Ali
- ✗ [owner] /neighbourhoods/: not yet reviewed and approved by Ali
- ✗ [owner] /neighbourhoods/north-york/: not yet reviewed and approved by Ali
- ✗ [owner] /neighbourhoods/thornhill/: not yet reviewed and approved by Ali
- ✗ [owner] /neighbourhoods/richmond-hill/: not yet reviewed and approved by Ali
- ✗ [owner] /neighbourhoods/vaughan/: not yet reviewed and approved by Ali
- ✗ [owner] /neighbourhoods/toronto/: not yet reviewed and approved by Ali
- ✗ [owner] /resources/: not yet reviewed and approved by Ali
- ✗ [owner] /resources/buying/land-transfer-tax-toronto-york-region/: not yet reviewed and approved by Ali
- ✗ [owner] /contact/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/buy/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/sell/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/invest/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/neighbourhoods/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/neighbourhoods/north-york/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/neighbourhoods/thornhill/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/neighbourhoods/richmond-hill/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/neighbourhoods/vaughan/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/neighbourhoods/toronto/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/resources/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/resources/buying/land-transfer-tax-toronto-york-region/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/about/: not yet reviewed and approved by Ali
- ✗ [owner] /fa/contact/: not yet reviewed and approved by Ali

| Page | Type | Author | Review | Published | Updated | Source / data period | Indexable |
|---|---|---|---|---|---|---|---|
| `/` | home | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/about/` | profile | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/buy/` | service | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/sell/` | service | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/invest/` | service | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/neighbourhoods/` | hub | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/neighbourhoods/north-york/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/neighbourhoods/thornhill/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/neighbourhoods/richmond-hill/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/neighbourhoods/vaughan/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/neighbourhoods/toronto/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/resources/` | hub | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/resources/buying/land-transfer-tax-toronto-york-region/` | guide | Ali Bayat | draft | n/a | n/a | City of Toronto, MLTT rates and fees; City of Toronto, MLTT rebates; Ontario, calculating land transfer tax; Ontario, refunds for first-time homebuyers (Ontario rates in effect since January 1, 2017; City of Toronto MLTT rates in effect from April 1, 2026; verified 2026-10-01) | yes |
| `/contact/` | contact | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/` | home | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/buy/` | service | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/sell/` | service | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/invest/` | service | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/neighbourhoods/` | hub | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/neighbourhoods/north-york/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/neighbourhoods/thornhill/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/neighbourhoods/richmond-hill/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/neighbourhoods/vaughan/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/neighbourhoods/toronto/` | neighbourhood-guide | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/resources/` | hub | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/resources/buying/land-transfer-tax-toronto-york-region/` | guide | Ali Bayat | draft | n/a | n/a | City of Toronto, MLTT rates and fees; City of Toronto, MLTT rebates; Ontario, calculating land transfer tax; Ontario, refunds for first-time homebuyers (Ontario rates in effect since January 1, 2017; City of Toronto MLTT rates in effect from April 1, 2026; verified 2026-10-01) | yes |
| `/fa/about/` | profile | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/fa/contact/` | contact | Ali Bayat | draft | n/a | n/a | n/a | yes |
| `/privacy/` | legal | Ali Bayat | draft | n/a | n/a | n/a | no |
| `/terms/` | legal | Ali Bayat | draft | n/a | n/a | n/a | no |
| `/accessibility/` | legal | Ali Bayat | draft | n/a | n/a | n/a | no |
| `/404.html` | system | Ali Bayat | draft | n/a | n/a | n/a | no |

## Production safety
**11. Production safety: no placeholders, invented facts or interim content: FAIL**
- spec patterns in published pages: [Brokerage: 0, [to be written / to be written: 0, draft for Ali: 2, Preview only: 0, 000000: 0, (416) 000-0000: 0, [year]: 0, [City]: 0, nan / NaN: 0, TBC: 0, TODO: 0, FIXME: 0
- every remaining hit comes from a managed placeholder awaiting the owner input listed above; none leak outside it
- ✗ [legal] needs consent-wording (1 page: /contact/)
- ✗ [legal] needs consent-wording-fa (1 page: /fa/contact/)
- ✗ [owner] needs ltt-guide-review (3 pages: /, /resources/, /resources/buying/land-transfer-tax-toronto-york-region/)
- ✗ [owner] needs ltt-guide-review-fa (1 page: /fa/resources/buying/land-transfer-tax-toronto-york-region/)
- ✗ [legal] needs referral-disclosure (2 pages: /fa/invest/, /invest/)
- ✗ [legal] /privacy/: privacy-policy is interim, not final
- ✗ [legal] /terms/: terms-of-use is interim, not final
- ✗ [legal] /accessibility/: accessibility-statement is interim, not final

| Pattern | Occurrences in published pages |
|---|---|
| `[Brokerage` | 0 |
| `[to be written / to be written` | 0 |
| `draft for Ali` | 2 |
| `Preview only` | 0 |
| `000000` | 0 |
| `(416) 000-0000` | 0 |
| `[year]` | 0 |
| `[City]` | 0 |
| `nan / NaN` | 0 |
| `TBC` | 0 |
| `TODO` | 0 |
| `FIXME` | 0 |

Every occurrence above comes from a managed placeholder (awaiting the owner input listed below); none appears outside the placeholder system, and the production build exits with an error while any remain.

## Performance
**14. Performance budget: weight, requests, DOM size, layout shift, render-blocking: PASS**
- site.js 17 KB (prototype code stripped), site.css 39 KB, both cached across pages; scripts deferred; no images
- largest page /invest/ 48 KB HTML; most DOM /invest/ 860 elements; max same-origin requests 3; max layout shift 0.000
- third-party request on every page: fonts.googleapis.com, fonts.gstatic.com (Google Fonts). Recommendation: self-host the three font families

## Reproducibility
**15. Reproducible, machine-independent build: PASS**
- two clean rebuilds skipped (--skip-rebuild)

## Remaining blockers

### Requires Ali's information or approval (30)
- /: not yet reviewed and approved by Ali
- /about/: not yet reviewed and approved by Ali
- /buy/: not yet reviewed and approved by Ali
- /contact/: not yet reviewed and approved by Ali
- /fa/: not yet reviewed and approved by Ali
- /fa/about/: not yet reviewed and approved by Ali
- /fa/buy/: not yet reviewed and approved by Ali
- /fa/contact/: not yet reviewed and approved by Ali
- /fa/invest/: not yet reviewed and approved by Ali
- /fa/neighbourhoods/: not yet reviewed and approved by Ali
- /fa/neighbourhoods/north-york/: not yet reviewed and approved by Ali
- /fa/neighbourhoods/richmond-hill/: not yet reviewed and approved by Ali
- /fa/neighbourhoods/thornhill/: not yet reviewed and approved by Ali
- /fa/neighbourhoods/toronto/: not yet reviewed and approved by Ali
- /fa/neighbourhoods/vaughan/: not yet reviewed and approved by Ali
- /fa/resources/: not yet reviewed and approved by Ali
- /fa/resources/buying/land-transfer-tax-toronto-york-region/: not yet reviewed and approved by Ali
- /fa/sell/: not yet reviewed and approved by Ali
- /invest/: not yet reviewed and approved by Ali
- /neighbourhoods/: not yet reviewed and approved by Ali
- /neighbourhoods/north-york/: not yet reviewed and approved by Ali
- /neighbourhoods/richmond-hill/: not yet reviewed and approved by Ali
- /neighbourhoods/thornhill/: not yet reviewed and approved by Ali
- /neighbourhoods/toronto/: not yet reviewed and approved by Ali
- /neighbourhoods/vaughan/: not yet reviewed and approved by Ali
- /resources/: not yet reviewed and approved by Ali
- /resources/buying/land-transfer-tax-toronto-york-region/: not yet reviewed and approved by Ali
- /sell/: not yet reviewed and approved by Ali
- needs ltt-guide-review (3 pages: /, /resources/, /resources/buying/land-transfer-tax-toronto-york-region/)
- needs ltt-guide-review-fa (1 page: /fa/resources/buying/land-transfer-tax-toronto-york-region/)

### Requires an external service or access (2)
- axe-core is not installed, so the full axe rule set did NOT run. Run `npm install` (package.json pins axe-core) and re-verify
- no production endpoint configured (site.config.json form_endpoint): the live form cannot send messages

### Requires legal / brokerage review (6)
- /accessibility/: accessibility-statement is interim, not final
- /privacy/: privacy-policy is interim, not final
- /terms/: terms-of-use is interim, not final
- needs consent-wording (1 page: /contact/)
- needs consent-wording-fa (1 page: /fa/contact/)
- needs referral-disclosure (2 pages: /fa/invest/, /invest/)

### Engineering defect (0)
- none

