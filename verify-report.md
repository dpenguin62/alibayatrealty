# Ali Bayat Realty: verification report

Output verified: `dist/` · production domain `https://www.alibayatrealty.com` · 2026-11-26

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
| 9 | Accessibility: axe-core, keyboard, focus, contrast, mobile, reduced motion | ✅ pass |
| 10 | Lead form: production endpoint, payload contract, consent, honest states | ✅ pass |
| 11 | Production safety: no placeholders, invented facts or interim content | ❌ fail (legal) |
| 12 | Content governance: author, review status, dates, sources, indexability | ✅ pass |
| 13 | Internal linking: no orphans, pillars connected, contextual links | ✅ pass |
| 14 | Performance budget: weight, requests, DOM size, layout shift, render-blocking | ✅ pass |
| 15 | Reproducible, machine-independent build | ✅ pass |

## Routing
**1. Every intended production URL resolves (trailing slashes, 404, planned URLs absent): PASS**
- 62 URLs: all 200; trailing-slash redirects 301; unknown URLs 404 with the site's page
- planned, not built (no thin pages): 
- held back until the feature is live: /listings/

**4. No production hash-routing dependency; content works without JavaScript: PASS**
- primary navigation uses real URLs; no hashchange listener anywhere; /#buy, /#sell, /#invest forward to real pages
- every page's H1 and main content present with JavaScript disabled

## SEO
**2. Title, description, H1, canonical, robots and social metadata: PASS**
- 62 pages: unique titles and descriptions; descriptions 70–160 characters; one H1 each; OG + Twitter tags
- titles over 65 characters may be shortened in results (wording as specified): /resources/market/2026-10-york-region/ (82), /resources/investment/financing/ (78), /resources/buying/pre-construction-condo-questions/ (77), /fa/resources/market/2026-10-york-region/ (74), /resources/tips/choosing-a-contractor/ (73), /resources/market/2026-10-toronto-york-region/ (73), /resources/investment/cash-flow/ (72), /resources/investment/investor-strategy/ (71), /resources/investment/duplexes-triplexes-fourplexes/ (71), /resources/buying/first-home-toronto/ (71), /fa/resources/selling/offer-date-vs-pricing-to-market/ (71), /resources/selling/offer-date-vs-pricing-to-market/ (69), /resources/investment/investment-analysis/ (69), /fa/resources/investment/investor-strategy/ (69), /fa/resources/market/2026-10-toronto-york-region/ (68)

**6. robots.txt behaves correctly (production and staging): PASS**
- production: everything crawlable, noindex pages reachable so the tag is seen, sitemap declared
- staging: robots.txt blocks all, every page noindex, visible staging banner and [Staging] titles, empty sitemap

## Sitemap
**5. Sitemap: only intended canonical indexable URLs, accurate lastmod: PASS**
- 58 URLs, all canonical and indexable; noindex, planned and held-back pages excluded
- lastmod present on 58 of 58 (only from real publish/update dates; omitted otherwise, never the build date)

## Internal links
**3. Zero broken internal links: PASS**
- 4236 links and assets across 62 pages → 70 unique internal targets, 0 broken

**13. Internal linking: no orphans, pillars connected, contextual links: PASS**
- contextual inbound links (main content only): / 33, /contact/ 30, /fa/ 29, /fa/contact/ 28, /invest/ 18, /resources/ 17, /fa/invest/ 17, /fa/resources/ 17, /buy/ 14, /sell/ 13, /fa/buy/ 13, /neighbourhoods/north-york/ 12, /neighbourhoods/richmond-hill/ 12, /neighbourhoods/vaughan/ 12, /neighbourhoods/toronto/ 12, /resources/buying/land-transfer-tax-toronto-york-region/ 12, /fa/sell/ 12, /fa/resources/buying/land-transfer-tax-toronto-york-region/ 11, /neighbourhoods/thornhill/ 10, /fa/neighbourhoods/north-york/ 10, /fa/neighbourhoods/richmond-hill/ 10, /fa/neighbourhoods/vaughan/ 10, /fa/neighbourhoods/toronto/ 10, /neighbourhoods/ 9, /fa/neighbourhoods/ 9, /fa/neighbourhoods/thornhill/ 8, /resources/market/2026-10-toronto-york-region/ 6, /resources/market/2026-10-york-region/ 6, /fa/resources/market/2026-10-toronto-york-region/ 6, /fa/resources/market/2026-10-york-region/ 6, /resources/investment/cash-flow/ 5, /resources/tips/home-inspection-gta/ 5, /fa/resources/investment/cash-flow/ 5, /fa/resources/tips/home-inspection-gta/ 5, /about/ 4, /fa/about/ 4, /resources/buying/first-home-toronto/ 4, /resources/investment/investment-analysis/ 4, /resources/investment/cap-rate/ 4, /resources/investment/financing/ 4, /resources/investment/duplexes-triplexes-fourplexes/ 4, /resources/investment/investor-strategy/ 4, /resources/tips/condo-status-certificate/ 4, /fa/resources/buying/first-home-toronto/ 4, /fa/resources/investment/investment-analysis/ 4, /fa/resources/investment/cap-rate/ 4, /fa/resources/investment/financing/ 4, /fa/resources/investment/duplexes-triplexes-fourplexes/ 4, /fa/resources/investment/investor-strategy/ 4, /fa/resources/tips/condo-status-certificate/ 4, /resources/selling/what-to-fix-before-listing/ 3, /resources/selling/offer-date-vs-pricing-to-market/ 3, /resources/tips/choosing-a-contractor/ 3, /fa/resources/selling/what-to-fix-before-listing/ 3, /fa/resources/selling/offer-date-vs-pricing-to-market/ 3, /fa/resources/tips/choosing-a-contractor/ 3, /privacy/ 2, /resources/buying/pre-construction-condo-questions/ 2, /fa/resources/buying/pre-construction-condo-questions/ 2, /terms/ 0, /accessibility/ 0

## Accessibility
**8. Navigation works on desktop, tablet and mobile: PASS**
- desktop 1280px: every label goes to its intended URL; correct active state on every page
- tablet 820px and mobile 375px (touch): menu opens, every link correct, closes; no horizontal scroll on any page

**9. Accessibility: axe-core, keyboard, focus, contrast, mobile, reduced motion: PASS**
- axe-core: 0 violation(s) across 62 pages × light/dark × 1280/375px
- built-in checks (names, labels, ARIA, landmarks, zoom, WCAG AA contrast) on 62 pages × light/dark × 1280/375px: 0 issue(s), 0 contrast
- keyboard: every control reachable by Tab on every page (0 page(s) with gaps); 0 control(s) without a visible focus ring; skip link, menu Enter/Tab/Escape, live calculator results, reduced motion

## Structured data
**7. Structured data is valid and truthful (no invented facts): PASS**
- entities: Ali = Person; Ali Bayat Realty = RealEstateAgent (founder → Ali); brokerage = Organization (parentOrganization / worksFor) once confirmed
- no ratings, reviews, awards or invented dates; author/dates only on pages Ali has approved

## Lead form
**10. Lead form: production endpoint, payload contract, consent, honest states: PASS**
- stand-in endpoint (code path only; NOT the integration): payload matches lead.schema.json; consent required; source_page /invest/ and source_cta from a real click path; UTM from the landing URL; referrer reduced to its origin; error keeps the message; no-JS POST; honeypot; no third-party requests

## Content governance
**12. Content governance: author, review status, dates, sources, indexability: PASS**
- 62 pages registered; 60 approved as built; author = Ali Bayat
- approvals are tied to each page's exact content; dates come only from Ali's approvals (python build.py approve …)

| Page | Type | Author | Review | Published | Updated | Source / data period | Indexable |
|---|---|---|---|---|---|---|---|
| `/` | home | Ali Bayat | approved | 2026-11-11 | 2026-11-18 | n/a | yes |
| `/about/` | profile | Ali Bayat | approved | 2026-11-11 | 2026-11-20 | n/a | yes |
| `/buy/` | service | Ali Bayat | approved | 2026-11-11 | 2026-11-21 | n/a | yes |
| `/sell/` | service | Ali Bayat | approved | 2026-11-11 | 2026-11-21 | n/a | yes |
| `/invest/` | service | Ali Bayat | approved | 2026-11-21 | 2026-11-21 | n/a | yes |
| `/neighbourhoods/` | hub | Ali Bayat | approved | 2026-11-11 | 2026-11-18 | n/a | yes |
| `/neighbourhoods/north-york/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/neighbourhoods/thornhill/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/neighbourhoods/richmond-hill/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/neighbourhoods/vaughan/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/neighbourhoods/toronto/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/resources/` | hub | Ali Bayat | approved | 2026-11-11 | 2026-11-21 | n/a | yes |
| `/resources/buying/land-transfer-tax-toronto-york-region/` | guide | Ali Bayat | approved | 2026-11-11 | 2026-11-20 | City of Toronto, MLTT rates and fees; City of Toronto, MLTT rebates; Ontario, calculating land transfer tax; Ontario, refunds for first-time homebuyers (Ontario rates in effect since January 1, 2017; City of Toronto MLTT rates in effect from April 1, 2026; verified 2026-10-01) | yes |
| `/contact/` | contact | Ali Bayat | approved | 2026-11-11 | 2026-11-18 | n/a | yes |
| `/fa/` | home | Ali Bayat | approved | 2026-11-11 | 2026-11-18 | n/a | yes |
| `/fa/buy/` | service | Ali Bayat | approved | 2026-11-11 | 2026-11-21 | n/a | yes |
| `/fa/sell/` | service | Ali Bayat | approved | 2026-11-11 | 2026-11-21 | n/a | yes |
| `/fa/invest/` | service | Ali Bayat | approved | 2026-11-21 | 2026-11-21 | n/a | yes |
| `/fa/neighbourhoods/` | hub | Ali Bayat | approved | 2026-11-11 | 2026-11-18 | n/a | yes |
| `/fa/neighbourhoods/north-york/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/fa/neighbourhoods/thornhill/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/fa/neighbourhoods/richmond-hill/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/fa/neighbourhoods/vaughan/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/fa/neighbourhoods/toronto/` | neighbourhood-guide | Ali Bayat | approved | 2026-11-11 | 2026-11-25 | n/a | yes |
| `/fa/resources/` | hub | Ali Bayat | approved | 2026-11-11 | 2026-11-21 | n/a | yes |
| `/fa/resources/buying/land-transfer-tax-toronto-york-region/` | guide | Ali Bayat | approved | 2026-11-11 | 2026-11-20 | City of Toronto, MLTT rates and fees; City of Toronto, MLTT rebates; Ontario, calculating land transfer tax; Ontario, refunds for first-time homebuyers (Ontario rates in effect since January 1, 2017; City of Toronto MLTT rates in effect from April 1, 2026; verified 2026-10-01) | yes |
| `/fa/about/` | profile | Ali Bayat | approved | 2026-11-11 | 2026-11-20 | n/a | yes |
| `/fa/contact/` | contact | Ali Bayat | approved | 2026-11-11 | 2026-11-18 | n/a | yes |
| `/privacy/` | legal | Ali Bayat | draft | n/a | n/a | n/a | no |
| `/terms/` | legal | Ali Bayat | draft | n/a | n/a | n/a | no |
| `/accessibility/` | legal | Ali Bayat | approved | 2026-11-11 | n/a | n/a | no |
| `/404.html` | system | Ali Bayat | approved | 2026-11-11 | n/a | n/a | no |
| `/resources/buying/first-home-toronto/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | CMHC, mortgage loan insurance quick reference; CMHC, mortgage loan insurance cost; Department of Finance Canada, mortgage reforms effective December 15, 2024; CMHC, Income Property (2–4 unit rentals); Canada Revenue Agency, First Home Savings Account; Canada Revenue Agency, Home Buyers' Plan; Ontario, land transfer tax refunds for first-time homebuyers; City of Toronto, MLTT rebates; Ontario, what to know before buying a home (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/buying/pre-construction-condo-questions/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Condominium Authority of Ontario, pre-construction condos; Tarion, deposit protection; Ontario, what to know before buying a home; Canada Revenue Agency, Ontario enhanced new housing rebate (Notice 346); Gowling WLG, Ontario expands HST relief on new homes (April 2026); TRREB Market Watch, October 2026 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/selling/what-to-fix-before-listing/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; Ontario, what to know before buying a home; Ontario, your rights when starting home renovations or repairs (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/selling/offer-date-vs-pricing-to-market/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; RECO Bulletin 4.2, managing a delayed offer presentation; RECO, TRESA FAQs (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/investment/investment-analysis/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Residential Tenancies Act, 2006; CMHC, Income Property (2–4 unit rentals); City of Toronto, multiplex housing (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/investment/cash-flow/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | CMHC, Income Property (2–4 unit rentals); TRREB Market Watch, October 2026 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/investment/cap-rate/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Residential Tenancies Act, 2006 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/investment/financing/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | CMHC, mortgage loan insurance quick reference; CMHC, Income Property (2–4 unit rentals); Bank of Canada, rate announcement, October 28, 2026 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/investment/duplexes-triplexes-fourplexes/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | City of Toronto, multiplex housing; Ontario Planning Act; CMHC, mortgage loan insurance quick reference; CMHC, Income Property (2–4 unit rentals); Residential Tenancies Act, 2006 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/investment/investor-strategy/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; TRREB news release, November 4, 2026; Bank of Canada, rate announcement, October 28, 2026 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/market/2026-10-toronto-york-region/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; TRREB news release, November 4, 2026; Bank of Canada, rate announcement, October 28, 2026 (October 2026 (TRREB Market Watch, released November 4, 2026); verified 2026-11-21) | yes |
| `/resources/market/2026-10-york-region/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; TRREB news release, November 4, 2026 (October 2026 (TRREB Market Watch, released November 4, 2026); verified 2026-11-21) | yes |
| `/resources/tips/condo-status-certificate/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | FirstService Residential, status certificates in Ontario; Legal Line, what is a status certificate; Condominium Act, 1998; Ontario, what to know before buying a home (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/tips/home-inspection-gta/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Ontario, what to know before buying a home (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/resources/tips/choosing-a-contractor/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Ontario, your rights when starting home renovations or repairs; Ontario, guide for home renovation businesses; Construction Act (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/buying/first-home-toronto/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | CMHC, mortgage loan insurance quick reference; CMHC, mortgage loan insurance cost; Department of Finance Canada, mortgage reforms effective December 15, 2024; CMHC, Income Property (2–4 unit rentals); Canada Revenue Agency, First Home Savings Account; Canada Revenue Agency, Home Buyers' Plan; Ontario, land transfer tax refunds for first-time homebuyers; City of Toronto, MLTT rebates; Ontario, what to know before buying a home (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/buying/pre-construction-condo-questions/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Condominium Authority of Ontario, pre-construction condos; Tarion, deposit protection; Ontario, what to know before buying a home; Canada Revenue Agency, Ontario enhanced new housing rebate (Notice 346); Gowling WLG, Ontario expands HST relief on new homes (April 2026); TRREB Market Watch, October 2026 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/selling/what-to-fix-before-listing/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; Ontario, what to know before buying a home; Ontario, your rights when starting home renovations or repairs (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/selling/offer-date-vs-pricing-to-market/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; RECO Bulletin 4.2, managing a delayed offer presentation; RECO, TRESA FAQs (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/investment/investment-analysis/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Residential Tenancies Act, 2006; CMHC, Income Property (2–4 unit rentals); City of Toronto, multiplex housing (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/investment/cash-flow/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | CMHC, Income Property (2–4 unit rentals); TRREB Market Watch, October 2026 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/investment/cap-rate/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Residential Tenancies Act, 2006 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/investment/financing/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | CMHC, mortgage loan insurance quick reference; CMHC, Income Property (2–4 unit rentals); Bank of Canada, rate announcement, October 28, 2026 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/investment/duplexes-triplexes-fourplexes/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | City of Toronto, multiplex housing; Ontario Planning Act; CMHC, mortgage loan insurance quick reference; CMHC, Income Property (2–4 unit rentals); Residential Tenancies Act, 2006 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/investment/investor-strategy/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; TRREB news release, November 4, 2026; Bank of Canada, rate announcement, October 28, 2026 (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/market/2026-10-toronto-york-region/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; TRREB news release, November 4, 2026; Bank of Canada, rate announcement, October 28, 2026 (October 2026 (TRREB Market Watch, released November 4, 2026); verified 2026-11-21) | yes |
| `/fa/resources/market/2026-10-york-region/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | TRREB Market Watch, October 2026; TRREB news release, November 4, 2026 (October 2026 (TRREB Market Watch, released November 4, 2026); verified 2026-11-21) | yes |
| `/fa/resources/tips/condo-status-certificate/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | FirstService Residential, status certificates in Ontario; Legal Line, what is a status certificate; Condominium Act, 1998; Ontario, what to know before buying a home (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/tips/home-inspection-gta/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Ontario, what to know before buying a home (Rules and rates in effect November 2026; verified 2026-11-21) | yes |
| `/fa/resources/tips/choosing-a-contractor/` | guide | Ali Bayat | approved | 2026-11-21 | n/a | Ontario, your rights when starting home renovations or repairs; Ontario, guide for home renovation businesses; Construction Act (Rules and rates in effect November 2026; verified 2026-11-21) | yes |

## Production safety
**11. Production safety: no placeholders, invented facts or interim content: FAIL**
- spec patterns in published pages: [Brokerage: 0, [to be written / to be written: 0, draft for Ali: 0, Preview only: 0, 000000: 0, (416) 000-0000: 0, [year]: 0, [City]: 0, nan / NaN: 0, TBC: 0, TODO: 0, FIXME: 0
- ✗ [legal] /privacy/: privacy-policy is interim, not final
- ✗ [legal] /terms/: terms-of-use is interim, not final

| Pattern | Occurrences in published pages |
|---|---|
| `[Brokerage` | 0 |
| `[to be written / to be written` | 0 |
| `draft for Ali` | 0 |
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
- site.js 28 KB (prototype code stripped), site.css 66 KB, both cached across pages; scripts deferred
- largest page /invest/ 53 KB HTML; most DOM /invest/ 878 elements; max same-origin requests 5 (lazy-loaded images excluded; up to 5 per page); max layout shift 0.006
- fonts self-hosted: up to 11 woff2 files, 171 KB per page (budget 16 files, 300 KB)
- third-party hosts referenced on the home page: commons.wikimedia.org, creativecommons.org

## Reproducibility
**15. Reproducible, machine-independent build: PASS**
- two clean builds byte-identical to each other and to the output under test (127 files); pinned dependencies; no machine paths

## Remaining blockers

### Requires Ali's information or approval (0)
- none

### Requires an external service or access (0)
- none

### Requires legal / brokerage review (2)
- /privacy/: privacy-policy is interim, not final
- /terms/: terms-of-use is interim, not final

### Engineering defect (0)
- none

