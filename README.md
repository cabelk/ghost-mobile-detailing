# Ghost Mobile Detailing — provider-agnostic front end

A zero-build, static front end for Ghost Mobile Detailing. The marketing site and pre-booking selector are owned by Ghost. Booking-provider details are isolated behind one configuration seam.

## Run locally

From this directory:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

## Connect or switch a booking provider

Edit `js/config.js` only.

### Generic hosted redirect

Set:

```js
booking: {
  mode: "redirect",
  bookingUrl: "https://YOUR-PROVIDER-BOOKING-URL",
  ...
}
```

The redirect adapter can append Ghost's neutral service, vehicle, add-on, ZIP, and estimate fields as query parameters. Use `serviceMap`, `vehicleMap`, and `addonMap` to translate stable Ghost IDs into provider-specific IDs.

### Generic embed

Set:

```js
booking: {
  mode: "embed",
  embedUrl: "https://YOUR-PROVIDER-EMBED-URL"
}
```

Use only with vendors that allow iframe embedding. If they require a vendor SDK, create a new adapter in `js/providers/`, register it with `GhostBookingProviders.register()`, and change the `mode` in `config.js`.

### API integration later

Do **not** put API secrets in this front end. If a provider requires private API credentials, keep this front end unchanged and place the credentialed integration behind a small serverless/backend endpoint. Add an adapter that calls that endpoint.

## Stable Ghost domain model

- Service: `ghost-premium-detail`
- Vehicle classes: `standard`, `large`
- Add-ons live in `data/services.js`

The public site should not contain OrbisX, Jobber, Housecall Pro, Square, or other vendor IDs.

## Deployment

This package is ordinary static HTML/CSS/JS. It can be hosted on Netlify, Vercel, Cloudflare Pages, GitHub Pages (with path adjustments), S3/CloudFront, or a traditional web server. No npm build step is required.

## Production checklist

1. Replace demo booking configuration with the selected provider.
2. Confirm provider mapping IDs and service-area behavior.
3. Replace the placeholder privacy notice with the actual deployed vendor/privacy terms.
4. Confirm business email and domain.
5. Add real customer reviews/photos when available.
6. Test call/text links and booking on iPhone, Android, desktop Chrome/Safari/Edge.
7. Add analytics only after choosing a privacy approach; the hook already exists in `config.js`.
8. Run Lighthouse/accessibility checks after the final provider embed/redirect is enabled.

## Why this is portable

The marketing pages know only Ghost's own service vocabulary. Every `Book Now` button points to `/book/`. The provider-specific handoff exists only in `js/config.js` plus a small adapter. Switching vendors should therefore be configuration/mapping work rather than a redesign.
