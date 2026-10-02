# Lead integration contract

**Status: pending.** No production endpoint is configured, so the live contact form shows
"Online messages aren't available yet" and can't be submitted. Nothing pretends to send.

```
Website form ─▶ validation (browser) ─▶ lead payload ─▶ HTTPS endpoint (CONFIG.form_endpoint)
                                                            │
                                                            ├─▶ owned store (sheet / database Ali controls)
                                                            ├─▶ email notification to Ali
                                                            └─▶ CRM (an adapter, replaceable)
```

The website only knows one thing: an HTTPS URL that accepts a `POST`. Everything after that is an
adapter you can swap (Formspree or Basin to start, a small serverless function later, any CRM
through its API) without touching the site. Lead data should always land in a store Ali owns
first; the CRM is a copy, not the system of record.

## Payload

Sent as `multipart/form-data` with `Accept: application/json`. Machine-readable schema: `lead.schema.json`.

| Field | Required | Notes |
|---|---|---|
| `name`, `email` | yes | Validated in the browser; validate again on the server |
| `phone`, `message` | no | |
| `interest` | yes | `buy` · `sell` · `invest` · `question` |
| `request` | no | `analysis` = Investment Property Analysis request |
| `language` | yes | `en` · `fa` (reply language) |
| `consent` | yes | `yes`; the visitor ticked the consent box |
| `consent_version` | yes | Date-stamp of the consent wording the visitor saw. Change it whenever the wording changes |
| `form_version` | yes | Form layout version |
| `source_page` | no | Same-site page the visitor came from, e.g. `/invest/` |
| `source_cta` | no | `page-key:cta-id` of the link they clicked, e.g. `invest:request-an-investment-property-a` |
| `timestamp` | no | Browser time at submit (informational). **The endpoint must record its own `received_at`.** |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` | no | From the first page of the visit, if the link had them |
| `referrer` | no | Origin only of an external referring site, e.g. `https://www.google.com` |
| `website` | no | Honeypot. If it isn't empty, discard the lead silently |

## What the endpoint must do

1. Accept `POST` over HTTPS and return **2xx** on success (the site then shows "Thanks, your message
   was sent"). Any other status shows an error and keeps the form filled in.
2. Validate against `lead.schema.json`; drop honeypot hits; rate-limit by IP.
3. Record `received_at` (server time), store the lead somewhere Ali owns, then notify and forward.
4. Allow cross-origin `POST` from the site's domain (CORS), or the browser will block it.
5. Keep leads only as long as the privacy policy says.

Without JavaScript the browser posts the same form natively (no timestamp, source or UTM fields).
The endpoint should then redirect back to a thank-you URL or show its own confirmation.

## Privacy choices

- No cookies, no third-party trackers, no fingerprinting.
- UTM values and the referring site's origin are kept in `sessionStorage` (this browser tab only,
  cleared when it closes) and sent only if the visitor submits the form.
- Referrers are reduced to their origin, never the full URL.
- The privacy policy must describe these fields before launch (legal-review item).

## Verified so far

`verify.py` gate 10 builds a throwaway copy of the site pointed at a stand-in endpoint and checks:
success and error states, required consent, field names against this contract, the source page and
CTA from a real click path, UTM capture, origin-only referrer, the honeypot, client-side
validation, no-JS `POST`, and that no other third-party request is made.

**A stand-in passing is not the integration being complete.** Gate 10 stays failed until a real
endpoint is configured.
