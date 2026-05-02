# Just Cakes — SEO Documentation

## Overview

This document covers all SEO implementations across the Just Cakes site. Base URL is read from the `NEXT_PUBLIC_BASE_URL` environment variable, falling back to `https://justcakesbakery.com`.

---

## Global Metadata (`app/layout.tsx`)

Applies to every page as a baseline. Individual pages override these values with their own `metadata` or `generateMetadata` export.

```typescript
export const metadata: Metadata = {
  title: 'Just Cakes | Allergy-Free Cakes — Delivery & Pickup Available',
  description: 'Delicious allergy-free cakes available for delivery and pickup. Custom cakes for everyone, no matter your dietary needs.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: 'website',
    siteName: 'Just Cakes',
    title: 'Just Cakes | Allergy-Free Cakes — Delivery & Pickup Available',
    description: '...',
    url: baseUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Just Cakes | Allergy-Free Cakes — Delivery & Pickup Available',
    description: '...',
  },
}
```

---

## Page-Level Metadata

### Static pages

| Page | Title | Description |
|------|-------|-------------|
| `/` | *(inherits global)* | *(inherits global)* |
| `/blog` | Blog - Just Cakes | Tips, recipes, and inspiration for all things cakes |
| `/custom-orders` | Custom Orders - Just Cakes | Order a custom cake designed just for you |
| `/privacy-policy` | *(set in file)* | *(set in file)* |
| `/terms` | *(set in file)* | *(set in file)* |

### Dynamic pages — `generateMetadata()`

Each of these generates a unique title, description, canonical URL, and OpenGraph image per item:

| Route | Title pattern | Canonical |
|-------|--------------|-----------|
| `/cakes/[id]` | `{product.name} \| Just Cakes` | `/cakes/{id}` |
| `/cupcakes/[id]` | `{product.name} \| Just Cakes` | `/cupcakes/{id}` |
| `/letterbox-cakes/[id]` | `{product.name} \| Just Cakes` | `/letterbox-cakes/{id}` |
| `/digital-products/[id]` | `{product.name} \| Just Cakes` | `/digital-products/{id}` |
| `/blog/[id]` | `{post.title} - Just Cakes Blog` | `/blog/{id}` |

All dynamic pages also return `openGraph` with `title`, `description`, `url`, and `images` (product/post image where available). Blog posts additionally set `openGraph.type: 'article'`.

---

## Structured Data / JSON-LD

### Homepage — `Bakery` schema (`app/page.tsx`)

Injected into the homepage `<head>` to signal business type and fulfillment options to search engines:

```json
{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Just Cakes",
  "description": "Allergy-free custom cakes available for delivery and pickup.",
  "servesCuisine": "Bakery",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Allergy-Free Cakes"
  },
  "potentialAction": [
    {
      "@type": "OrderAction",
      "target": "https://justcakesbakery.com/cakes",
      "deliveryMethod": [
        "http://purl.org/goodrelations/v1#DeliveryModePickUp",
        "http://purl.org/goodrelations/v1#UPS"
      ]
    }
  ]
}
```

### Product pages — `Product` schema

Each product detail page (`/cakes/[id]`, `/cupcakes/[id]`, `/letterbox-cakes/[id]`, `/digital-products/[id]`) injects a `Product` schema with live price and stock status. This can unlock Google Shopping rich results.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "...",
  "description": "...",
  "image": "...",
  "offers": {
    "@type": "Offer",
    "price": 25.00,
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "url": "https://justcakesbakery.com/cakes/1"
  }
}
```

`availability` maps to `InStock` or `OutOfStock` based on `product.available`.

---

## Google Search Console (`app/layout.tsx`)

Verification is handled via a meta tag driven by an environment variable — no code changes needed when verifying.

**To verify the site:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (select "URL prefix", enter your domain)
3. Choose "HTML tag" verification method and copy the `content` value (looks like `abc123xyz`)
4. Add to your Vercel environment variables: `NEXT_PUBLIC_GSC_VERIFICATION=abc123xyz`
5. Redeploy, then click Verify in Search Console
6. Once verified, go to **Sitemaps** and submit: `https://justcakesbakery.com/sitemap.xml`

---

## Sitemap (`app/sitemap.ts`)

Auto-generated at `/sitemap.xml`. The function is `async` and fetches all dynamic content at build time via `Promise.all`.

### Static routes

| Route | Change Frequency | Priority |
|-------|-----------------|----------|
| `/` | weekly | 1.0 |
| `/cakes` | weekly | 0.9 |
| `/cupcakes` | weekly | 0.9 |
| `/letterbox-cakes` | weekly | 0.8 |
| `/custom-orders` | monthly | 0.8 |
| `/digital-products` | monthly | 0.7 |
| `/blog` | weekly | 0.7 |
| `/contact` | yearly | 0.6 |
| `/privacy-policy` | yearly | 0.3 |
| `/terms` | yearly | 0.3 |

### Dynamic routes (generated at build)

| Route pattern | Source | Priority |
|--------------|--------|----------|
| `/cakes/{id}` | `getAllCakes()` | 0.8 |
| `/cupcakes/{id}` | `getAllCupcakes()` | 0.8 |
| `/letterbox-cakes/{id}` | `getAllLetterboxCakes()` | 0.7 |
| `/digital-products/{id}` | `getAllDigitalProducts()` | 0.6 |
| `/blog/{id}` | `getAllBlogPosts()` | 0.6 |

All dynamic fetches are wrapped in `.catch(() => [])` so a database error won't break the sitemap.

---

## Robots (`app/robots.ts`)

Auto-generated at `/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /ludmilla/
Disallow: /api/
Sitemap: https://justcakesbakery.com/sitemap.xml
```

Admin routes (`/ludmilla/`) and API routes are blocked from crawlers.

---

## Checklist

- [x] Global title and meta description
- [x] Delivery & pickup signalled in title, description, and JSON-LD
- [x] OpenGraph tags (global + per dynamic page)
- [x] Twitter card tags (global)
- [x] JSON-LD `Bakery` schema on homepage
- [x] JSON-LD `Product` schema on all product detail pages (price, availability)
- [x] Canonical URLs on all dynamic pages
- [x] Sitemap includes all dynamic product and blog URLs
- [x] Robots.txt blocks admin and API routes
- [x] Google Search Console verification wired up via `NEXT_PUBLIC_GSC_VERIFICATION` env var
- [ ] Google Search Console — submit sitemap (requires manual step, see above)
