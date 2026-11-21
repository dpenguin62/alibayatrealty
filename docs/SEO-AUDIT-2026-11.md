# SEO, local SEO and conversion audit: alibayatrealty.com

**Date:** November 20, 2026 · **Scope:** this repository (`src/site.html`, `build.py`, `site.config.json`,
`content.json`, built `dist/`) plus the live response headers of www.alibayatrealty.com.
**Not covered by this audit (no access):** Google Search Console, Google Business Profile dashboard,
real-user page-speed data (CrUX), backlink data.

## Summary

The technical foundation is already stronger than most agent sites. Every page is real static HTML with
one H1, a unique title and description, a self-referencing canonical, `en-CA` / `fa` / `x-default` hreflang
pairs on all 28 indexable pages, BreadcrumbList and WebPage JSON-LD, Article schema on the guide, FAQPage on
the About pages, a clean sitemap with honest `lastmod` dates, and a production robots.txt. Content parity is
complete: every English public page has a Farsi equivalent and the language switch goes to the matching page.

The gaps that matter are:

1. **A compliance note is publicly visible on the live investment pages (P0).**
2. **Two indexable pages (`/invest/`, `/fa/invest/`) have never been approved**, so they publish with no
   author, no dates and an unresolved placeholder.
3. **No share image and no image in the business schema** (fixed in this pass).
4. **Thin search-intent coverage on the money pages.** `/buy/` and `/sell/` each have a single content H2 and
   no FAQ. There is no dedicated home-valuation page, which is the highest-intent seller query.
5. **Google Business Profile isn't linked to the site in structured data** (needs the profile's Maps URL).

## Priority findings

### P0: fix before anything else

| # | Finding | Where | Fix | Who |
|---|---|---|---|---|
| 1 | The internal note "Disclose any referral arrangements as RECO rules require" is shown to the public on the live site (English text on the Farsi page too). It reads as an unfinished compliance item. | `/invest/`, `/fa/invest/` (`src/site.html` lines with `data-note="referral-disclosure"`) | If you receive no referral fees from the professionals you introduce, add `"referral-disclosure"` to `approved` in `site.config.json` and the note disappears. If you do, put the disclosure text in `details.referral_disclosure`. | Ali + brokerage |
| 2 | `/invest/` and `/fa/invest/` are indexable but not approved, so they ship with no author, published date or `lastmod`. | `content.json` | After #1: `python build.py approve invest fa-invest --by "Ali Bayat"` | Ali |
| 3 | Privacy policy and terms are interim text (correctly `noindex`). The contact form sends personal information to HubSpot, so the privacy policy needs to say so (PIPEDA). | `/privacy/`, `/terms/` | Final text, reviewed by the brokerage or a lawyer. | Legal |

### P1: high impact

| # | Finding | Status |
|---|---|---|
| 4 | No `og:image`: shared links (WhatsApp, Telegram, Facebook, LinkedIn, iMessage) showed no preview, and `RealEstateAgent` / `Article` had no `image`. | **Fixed.** 1200×630 card with brokerage name (`src/img/og/ali-bayat-og.jpg`), plus `og:image:width/height/alt` and `twitter:card=summary_large_image`. |
| 5 | Farsi guide's `Article.inLanguage` was hard-coded to `en-CA`. | **Fixed** (`fa` on Farsi pages). |
| 6 | Business schema name "Ali Bayat" didn't match the GBP name "Ali Bayat Realtor". | **Fixed:** `alternateName: "Ali Bayat Realtor"`. |
| 7 | `areaServed` was free-text places. | **Fixed:** typed `City` / `Place` with `containedInPlace` (Toronto → Ontario; North York → Toronto; Thornhill, Richmond Hill, Vaughan → York Region). |
| 8 | No `ContactPoint` with languages, no `knowsAbout`, no person `image`. | **Fixed:** `contactPoint.availableLanguage: [English, Persian]`, `Person.knowsAbout` (only subjects the site covers), `Person.image`, `employee` link. |
| 9 | GBP not connected to the site in schema. | **Needs your input:** paste the profile's Maps share link into `gbp_url`; the build adds it to `sameAs` and `hasMap`. |
| 10 | `/invest/` title was 68 characters (truncated in results); buy/sell titles said "the GTA" rather than the places people search. | **Fixed** (see table below). |
| 11 | Weak contextual links: `/sell/` didn't link to `/buy/`, the guide or any neighbourhood; `/invest/` didn't link to the land transfer tax guide; `/about/` had 1 contextual inbound link; the guide didn't link to Thornhill, Richmond Hill or Toronto. | **Fixed** in English and Farsi. |
| 12 | `/buy/`, `/sell/`, `/invest/`, the guide and the five neighbourhood pages have no FAQ. These answer the exact questions people type ("how much is land transfer tax in Vaughan", "what is my home worth in Thornhill"). | **Open.** Content work, see "Content roadmap" below. Each FAQ is mirrored automatically into FAQPage schema by `build.py` (any `<div class="body faq" data-faq>` block). |
| 13 | No dedicated home-valuation page. Seller CTAs all go to the general contact form. | **Open.** Build `/sell/home-value/` (+ `/fa/sell/home-value/`): what a comparable-sales review includes, what you need from the owner, a short form pre-set to `interest=sell&request=valuation`. |
| 14 | Neighbourhood pages have no photo, although each area has a licensed photo already used on the hub. | **Open** (small template change in `renderArea`; images don't change the approval hash). |

### P2: worth doing

| # | Finding | Recommendation |
|---|---|---|
| 15 | Fonts load from Google Fonts (4 families on Farsi pages): a render-blocking third-party request on every page, and visitors' IPs go to Google despite the site's no-tracking stance. | Self-host the WOFF2 files with `font-display: swap` and subset Vazirmatn. |
| 16 | No measurement. The form captures UTM and source page, but there is no way to see search impressions or which pages convert. | Search Console + Bing Webmaster Tools now. If you add analytics, use a cookieless tool and update the privacy policy first. |
| 17 | `/neighbourhoods/` and `/fa/neighbourhoods/` have an H1 and cards but no H2 content. | Add a short section, e.g. "Toronto or York Region: what changes at Steeles" (tax, transit, property tax), linking the guide. |
| 18 | Response headers show the site is served through Cloudflare, but the repo has a `vercel.json`. | Confirm which host is live, then add long cache headers for `/assets/*` (CSS/JS are already versioned with `?v=`). |
| 19 | The six planned investment guides (`/invest/duplexes/` … `/invest/investment-analysis/`) are correctly unbuilt. | Write them in the order in the content roadmap; they are the strongest topical-authority play for the investor audience. |

## What changed in this pass

### Titles and descriptions

| Page | Before | After |
|---|---|---|
| `/buy/` | Buying a Home in Toronto & the GTA \| Ali Bayat | Buy a Home in Toronto, North York & York Region \| Ali Bayat (59) |
| `/sell/` | Selling a Home in Toronto & the GTA \| Ali Bayat | Sell Your Home in North York, Toronto & York Region \| Ali Bayat (63) |
| `/invest/` | Investment Properties & Real Estate Investing in the GTA \| Ali Bayat (68) | Investment Property Analysis in Toronto & York Region \| Ali Bayat (65) |
| `/contact/` | Contact Ali Bayat \| Toronto & GTA Real Estate | Contact Ali Bayat, REALTOR® \| North York & Thornhill (52) |

Descriptions for `/buy/`, `/sell/` and `/contact/` now name the areas and the comparable-sales review
(all 133–147 characters). Farsi titles were already well targeted and are unchanged.

### Images
- Home and About portraits (EN + FA): descriptive alt text naming Ali, REALTOR® and the brokerage.
- Home hero portrait: `fetchpriority="high"` (it is the largest image above the fold).
- Decorative headshots next to Ali's printed name keep `alt=""` (correct; the name is already read out).

### Internal links (English + Farsi, same targets)
- `/buy/` Related: + land transfer tax across Steeles, + selling first, + About Ali.
- `/sell/` Related: + buying your next home, + land transfer tax calculator, + About Ali.
- `/invest/` aside: new Related box with the land transfer tax guide, `/buy/`, `/neighbourhoods/`.
- Land transfer tax guide: + Thornhill, Richmond Hill and Toronto guides, + `/sell/`.

### Structured data and head tags (`build.py`)
See P1 rows 4–8 above. Also `WebSite.inLanguage: ["en-CA", "fa"]`, `Article.spatialCoverage`, and
`og:locale:alternate` on every page that has a language pair.

## Pages that now need your re-review

The approval system ties each approval to the page's exact text. The link additions changed the text of
six approved pages, so until you re-approve them they publish without author/date in their structured data:

```
python build.py
python build.py approve buy sell guide-land-transfer-tax fa-buy fa-sell fa-guide-land-transfer-tax --by "Ali Bayat"
python build.py --allow-blockers
```

Titles, descriptions, alt text and schema don't affect approvals.

## Local SEO: website ↔ Google Business Profile

| Check | Website | GBP | Action |
|---|---|---|---|
| Name | "Ali Bayat" (schema `alternateName`: "Ali Bayat Realtor") | Ali Bayat Realtor | OK. Google's guidelines discourage descriptors in the business name; if the profile is ever suspended or edited by Google, "Ali Bayat – Century 21 Heritage Group" is the safer form. |
| Phone | (647) 779-7919 / +16477797919 | (647) 779-7919 | Consistent. |
| Address | Brokerage: 7330 Yonge St, Unit 116, Thornhill, ON L4J 7Y7 | Thornhill / North York / GTA | If clients aren't received at the brokerage address during posted hours, keep the address hidden and use service areas only. |
| Service areas | North York, Thornhill, Richmond Hill, Vaughan, Toronto | verify | Set exactly these five in GBP. |
| Website link | — | verify | `https://alibayatrealty.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` so GBP leads show up in the form's UTM fields. Use `/fa/` with `utm_content=fa` for Farsi posts. |
| Categories | — | verify | Primary: Real estate agent. Secondary (only if accurate): Real estate consultant. |
| Description | — | verify | Mention numbers-first approach, the five areas, English and Farsi, Century 21 Heritage Group. No phone number or URL in the description. |
| Link from site to GBP | none | — | After `gbp_url` is set, schema links it. A visible "Reviews on Google" link on `/about/` is optional and safe (no star widgets, no review markup). |

Do not add `aggregateRating` or `Review` markup to the site: Google ignores self-serving reviews for a
business's own site, and RECO advertising rules require testimonials to be genuine and verifiable.

## Conversion pathways

| Audience | Current path | Gap | Recommendation |
|---|---|---|---|
| Sellers | `/sell/` → contact form (`interest=sell`) | No valuation-specific page or request type | `/sell/home-value/` with `request=valuation`; ask for address + timeline only; promise a comparable-sales review, not a number. |
| Buyers | `/buy/` → contact (`interest=buy`); guide → contact | Good | Add an FAQ, and a "closing-cost comparison for two areas" request (already offered in the guide's aside). |
| Investors | `/invest/` → contact (`interest=invest&request=analysis`) with a calculator | Page not approved; placeholder visible | Fix P0 #1–2, then write `/invest/cash-flow/` and `/invest/duplexes/`. |
| Farsi speakers | Full mirror with Farsi form option | None structural | Use Farsi GBP posts and WhatsApp/Telegram sharing (the new share card helps). |

Compliance checks already in place: brokerage name and "Independently owned and operated" in the footer,
RECO number on About, the "not intended to solicit buyers or sellers under contract" disclaimer, consent
wording on the form, and no guarantees in copy. Keep the brokerage name visible on any new landing page and
in every GBP post image.

## Verification (`python verify.py`, November 20, 2026)

11 of 15 gates pass, including metadata, structured data, sitemap, robots, broken links, navigation,
internal linking and the lead form. The verifier was brought up to date with the site: it now accepts the
new schema types, checks only top-level nav links (the neighbourhood dropdown is covered by the link gates),
and waits for the `/#buy` redirect itself rather than for third-party fonts. Decorative headshots next to
Ali's printed name are now `aria-hidden`. Remaining failures:

- **9 Accessibility:** built-in checks find 0 issues; the full axe-core run needs `npm install`.
- **11 Production safety:** referral disclosure, interim privacy policy and terms (P0 #1 and #3).
- **12 Content governance:** the six re-reviews above plus `/invest/` and `/fa/invest/`.
- **14 Performance budget:** `/` (9 requests) and `/neighbourhoods/` (8) exceed the 6-request budget
  because of the neighbourhood photo cards added November 13. This predates this pass; either raise the
  budget or lazy-load the cards below the fold.

## Requires manual verification

- **Search Console:** submit `/sitemap.xml`, check Pages → "Indexed" covers 28 URLs (14 EN + 14 FA), and
  watch International Targeting / hreflang errors (none expected).
- **Rich Results Test** on `/`, `/about/` and the guide after deploy.
- **PageSpeed Insights** (mobile) on `/` and `/fa/`; the build's own budget passes, but field data needs real traffic.
- **Brokerage sign-off** on the new share image (it carries the brokerage name), the referral disclosure,
  and GBP offer-post wording.
- **GBP Maps URL** for `gbp_url`.
