# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Bilingual (English + Farsi) static website for Ali Bayat, a Toronto-area REALTOR®. No framework, CMS or tracking. `README.md` has the full owner-facing workflow; `LEADS.md` + `lead.schema.json` define the contact-form/HubSpot contract; `docs/` holds the SEO audit and content/GBP playbook.

## Commands

```bash
pip install -r requirements.txt && python -m playwright install chromium && npm install   # once

python build.py --staging          # preview build: banner, noindex, placeholders allowed
python build.py                    # production build; exits 1 and lists blockers by owner (owner/external/legal/engineering)
python build.py --allow-blockers   # write output, exit 0 despite blockers (verification only)
python build.py --out DIR          # build elsewhere
python build.py approve KEY [KEY..] --by "Ali Bayat"   # record page approval (or --all)

python verify.py                   # 15 gates, ~4 min; writes verify-report.md
python verify.py --skip-rebuild    # skip gate 15's two clean rebuilds (faster)
```

Use `--out DIR` (e.g. a scratch directory) for experimental builds: it leaves the committed `dist/` and `.dist-build.json` untouched. A staging build to a scratch dir was confirmed working (32 pages).

There is no per-gate flag; to iterate on one gate, edit `GATES` in `verify.py` temporarily or run the build and inspect `dist/`. `build.py` and `verify.py` both need Playwright/Chromium.

## Architecture

**Source of truth is one file: `src/site.html`** (~2700 lines). It is both the design source and a clickable single-page prototype: every page is a `<div class="page" data-page="KEY">` (Farsi ones are `fa-KEY`, `lang="fa" dir="rtl"`), with CSS, JS, the `ROUTES` array (path/title/desc/h1/index/alt per page) and an internal `site-plan` page inline. Area pages (`area`, `fa-area`) are rendered from JS data rather than static markup.

**`build.py` renders that prototype in headless Chromium (Playwright) and emits `dist/`**: one real `index.html` per route, extracted CSS/JS, images from `src/img/`, `sitemap.xml`, `robots.txt`, `404.html`, plus the head (canonical, hreflang `en-CA`/`fa`/`x-default` via each route's `alt`) and JSON-LD graph (`ld_graph`). It also writes `.dist-build.json` (route/governance metadata that `verify.py` reads). `validate()` scans output against `PROHIBITED` patterns (placeholders, TODO, example emails, etc.) and fails production builds.

**Three inputs, strict separation:**
- `site.config.json` — owner-confirmed facts (phone, RECO #, brokerage, form endpoint, `approved` wording keys, share image, GBP). Anything `null` is omitted from output and is a launch blocker in production; a visible placeholder in staging. Never invent values to fill these.
- `content.json` — editorial register. Each page's approval stores a hash of its exact built content; any content change invalidates the approval and `build.py` demands re-review. `published_at`/`updated_at` here are the only dates used for `lastmod` and schema. Only Ali (or someone he names) runs `approve`; don't edit review status by hand.
- `src/site.html` — content/layout.

**`dist/` is generated and committed** (deploys from GitHub `main` to Cloudflare Pages, project `alibayatrealty`, custom domain `www.alibayatrealty.com`, serving `dist/` with no build step; `vercel.json` is unused; DNS stays at Squarespace, where the bare domain forwards to `www`). Never hand-edit it; change source and rebuild, then commit the regenerated `dist/`, `.dist-build.json` and, if relevant, `content.json`.

**`verify.py`** serves `dist/` over real HTTP and runs 15 gates (links, SEO/hreflang/schema, a11y via axe-core + `verify_a11y.js`, form payload vs `lead.schema.json`, robots/sitemap, deterministic rebuilds, etc.). It imports `build` for the same config and prohibited patterns. Final status is PASS / PASS WITH OWNER INPUT REQUIRED / FAIL.

## Reusing this as a template for another site

Copy the repo, then replace: all facts in `site.config.json` (set unknown ones to `null`), page content and `ROUTES` in `src/site.html`, images in `src/img/`, and reset `content.json` pages to unapproved (approvals are hash-bound and won't carry over). Also update the Cloudflare Pages project/domain, `lead.schema.json`/`LEADS.md` for the new form endpoint, drop `docs/` and `verify-report.md`, regenerate `dist/`, and rewrite this file for the new site.

## Conventions that matter

- **Parity:** every public English page needs a Farsi counterpart linked through `alt` so hreflang and the language switch work. New routes go in `ROUTES` in `site.html`; planned-but-unwritten routes are marked `planned` and not built.
- **Compliance wording** (title is "Sales Representative"; REALTOR® usage, brokerage disclaimers, consent text) is gated by `approved` keys in `site.config.json`; Farsi variants have their own keys (e.g. `consent-wording-fa`). Bump `consent_version` in `site.html` when consent wording changes.
- **Contact form** posts JSON to the HubSpot Forms API; every property sent must exist as a hidden field on the HubSpot form or HubSpot returns 400 (the site then falls back to a legacy payload). See `LEADS.md`.
- Feature flags `features.idx` / `features.market-data` stay `false` until a board-approved feed exists.
- **Fonts are self-hosted** in `src/fonts/` (Fontsource 5.3.0 woff2, latin + latin-ext, plus arabic for Vazirmatn; OFL licences alongside). `fonts.css` is prepended to `site.css`; `fonts-fa.css` is linked only on Farsi pages. `FONT_PRELOAD` in `build.py` lists the above-the-fold faces per language; it keeps first-visit layout shift under budget, so update it if headings change font or weight. No Google Fonts requests remain (`src/site.html` still links them for the prototype only).
- `.gitignore` excludes `node_modules/`, `__pycache__/`, macOS `* 2.*` duplicates.
