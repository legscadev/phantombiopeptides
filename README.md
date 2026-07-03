# Phantom Labs — Headless Peptides Storefront

A production-ready, headless commerce storefront for a peptide research supply
brand. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**,
**Tailwind v4**, **Framer Motion**, **TanStack Query**, **React Hook Form +
Zod**, and shadcn-style Radix primitives. WooCommerce (WordPress) remains the
source of truth for products, categories, inventory, pricing, cart, coupons,
orders, customers, checkout, shipping, and taxes.

The frontend consumes WooCommerce via:

- **REST v3** (`wp-json/wc/v3`) — read-only product/category/review data on the
  server. Credentials never touch the browser.
- **Store API v1** (`wp-json/wc/store/v1`) — customer-facing cart & checkout.
  A guest `Cart-Token` is persisted in an httpOnly cookie.

## Tech stack

| Layer         | Choice                                                      |
| ------------- | ----------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Server Components)                  |
| UI            | Tailwind v4, Radix primitives, shadcn-style components      |
| Animation     | Framer Motion (subtle scroll reveals + micro-interactions)  |
| Data          | Server-fetch + `revalidate` + on-demand tags; TanStack Query on the client |
| Validation    | Zod (env, WC schemas, forms)                                |
| Forms         | React Hook Form + `@hookform/resolvers/zod`                 |
| State (cart)  | Server actions + React Context (no Redux/Zustand)           |
| Toasts        | `sonner`                                                    |
| Icons         | `lucide-react`                                              |
| SEO           | `next/metadata`, JSON-LD (Product / Breadcrumb / FAQ), sitemap, robots |

## Project structure

```
src/
├── app/                    # App Router pages, layouts, route handlers, actions
│   ├── (routes...)         # /, /shop, /product/[slug], /category/[slug], /cart,
│   │                       # /checkout, /about, /faq, /contact, /search
│   ├── actions/            # Server actions (cart mutations)
│   └── api/                # Route handlers (/api/search, /api/revalidate)
├── components/
│   ├── ui/                 # Radix + shadcn-style primitives (Button, Input,
│   │                       #  Sheet, Tabs, Accordion, ...)
│   ├── layout/             # Navbar, Footer, AnnouncementBar, SearchCommand
│   ├── product/            # ProductCard, Grid, Gallery, Tabs, Sort, Filters,
│   │                       #  Pagination, AddToCart, StickyAddToCart, RecentlyViewed
│   ├── cart/               # CartDrawer
│   ├── marketing/          # Hero, Benefits, HowItWorks, Testimonials, CTA,
│   │                       #  FAQ, Newsletter
│   └── common/             # Section, Reveal, Breadcrumb
├── services/               # WooCommerceService, ProductsService,
│                           #  CategoriesService, CartService, SearchService
├── schemas/                # Zod schemas for WC REST + Store API responses
├── hooks/                  # useCart context
├── providers/              # QueryClientProvider + CartProvider + Toaster
├── mocks/                  # Local peptide fixtures used when NEXT_PUBLIC_USE_MOCKS=true
├── lib/                    # utils, seo helpers, faqs, parse-search
├── types/                  # Public type exports
└── env.ts                  # Zod-validated env
```

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. Out of the box the storefront runs against the
local **mocks catalog** (in `src/mocks/`), so you can preview and iterate on the
full UI immediately.

### Type-check, lint, build

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Environment variables

Copy `.env.example` → `.env.local`, then set:

| Var                          | Purpose                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | Public origin — used for canonicals, OpenGraph, sitemap, JSON-LD                            |
| `NEXT_PUBLIC_SITE_NAME`      | Brand name in metadata & JSON-LD                                                            |
| `NEXT_PUBLIC_USE_MOCKS`      | `true` (default) uses `src/mocks/*`. Flip to `false` when Woo is wired up                   |
| `WC_STORE_URL`               | WooCommerce site origin (e.g. `https://cms.phantomlabs.co`)                                 |
| `WC_CONSUMER_KEY`            | REST v3 consumer key (read-only)                                                            |
| `WC_CONSUMER_SECRET`         | REST v3 consumer secret                                                                     |
| `WC_API_VERSION`             | Default `wc/v3`                                                                             |
| `WC_STORE_API_VERSION`       | Default `wc/store/v1`                                                                       |
| `REVALIDATE_SECRET`          | Long random string. Used to authorize webhooks hitting `/api/revalidate`                    |

The keys prefixed `NEXT_PUBLIC_` are exposed to the browser; **`WC_*` credentials
are server-only** and never bundled into client code (enforced by `import
"server-only"` at the top of each service file).

## Wiring WooCommerce

1. In WooCommerce → Settings → Advanced → REST API, create a **read** consumer
   key/secret and paste it into `.env.local`.
2. Ensure the **WooCommerce Blocks** plugin (which ships the Store API) is
   active. It is bundled with modern WooCommerce and is required for the
   cart/checkout flow.
3. Set `NEXT_PUBLIC_USE_MOCKS=false` and restart the dev server.

### Live cache invalidation

Add a WooCommerce webhook for `product.updated` / `product.created` /
`product.deleted`:

- Delivery URL: `https://<your-site>/api/revalidate?secret=<REVALIDATE_SECRET>`
- Payload: WooCommerce will send the product; the route revalidates the tags
  and paths corresponding to `list`, `slug:<slug>`, `/shop`, and `/`.

Custom payloads can also POST `{ tag, path, slug }` to selectively invalidate.

## Cart & checkout

- Server actions in `src/app/actions/cart.ts` wrap `CartService` — they run on
  the server, mutate the WooCommerce cart via Store API, and revalidate
  the `/cart` path.
- The cart context (`src/hooks/use-cart.tsx`) hydrates from the initial
  server-fetched cart in the root layout and owns the cart drawer state.
- Checkout is a **native headless flow**: `/checkout` is scaffolded with the
  order summary and the contact/shipping fields you extend with payment
  components. The session token that binds the customer to their cart is
  already stored in an `httpOnly` cookie, so the same session flows into the
  Store API's `/checkout` endpoint.

## Deploying to Vercel

1. Push the repo to GitHub, import in Vercel, and set the env vars from your
   `.env.local`.
2. `next.config.ts` sets `images.remotePatterns` to a wildcard for
   convenience — tighten it to your WooCommerce media origin in production.
3. Configure the WooCommerce webhook against
   `https://<your-vercel-domain>/api/revalidate?secret=…`.
4. Store API calls should stay in the Node runtime because they set cookies.

## Roadmap-ready

The architecture leaves clean seams for:

- **User accounts** — add a `/account` route + Woo customer endpoints
- **Wishlist** — a `WishlistService` mirrors `CartService`; UI slot is
  already present on the ProductCard hover state
- **Product comparison, loyalty, subscriptions** — extend `ProductsService`
  and add corresponding routes
- **Blog / CMS** — Woo REST already exposes WordPress posts under
  `/wp-json/wp/v2/posts`; wire a `PostsService` and `/journal` route
- **Multi-currency / multi-language** — the `formatPrice` util already accepts
  a currency; adopt `next-intl` for i18n
- **AI recommendations** — plug into the existing product list APIs with a
  personalisation layer

## Legal note

All content positions every SKU strictly for laboratory research and in-vitro
use. **Not for human consumption, therapeutic use, or diagnostic
applications.** Confirm compliance with your jurisdiction before shipping to
end customers.
