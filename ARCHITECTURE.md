# Booking boundary

```text
Customer
  |
  v
Ghost public site
  |
  v
/book/  -- Ghost-owned service selection + starting estimate
  |
  v
GhostBookingProviders.create(config.booking)
  |
  +-- demo     (safe development fallback)
  +-- redirect (hosted provider booking page)
  +-- embed    (provider iframe when supported)
  +-- future adapter -> serverless/API integration
```

## Non-negotiable boundary

Ghost owns the domain, page content, stable service/add-on IDs, analytics events, phone number, and the `/book/` URL. Vendor SDKs, IDs, query names, and embed URLs remain inside the adapter/configuration boundary.

## Failure behavior

If the provider is unavailable or misconfigured, the site continues rendering normally and surfaces call/text fallback instead of failing the marketing site.
