# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 e-commerce application for a cake business ("Just Cakes") built with TypeScript, React 18, and the App Router architecture. It features a shopping cart system managed via React Context API.

## Essential Commands

**Development:**
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

**TypeScript:**
The project uses strict TypeScript mode. All type definitions are in `/types` directory.

## Architecture

### Next.js App Router (NOT Pages Router)

This project uses Next.js 15's **App Router**, not the legacy Pages Router. Key implications:

- **Server Components by default**: All components render server-side unless marked with `'use client'`
- **Client Components**: Require `'use client'` directive at the top of the file for interactivity (useState, useEffect, onClick handlers, etc.)
- **File-based routing**: Folders in `/app` define routes automatically
- **Layouts**: `app/layout.tsx` wraps all pages and includes the CartProvider and Navbar

### Client vs Server Components

**Client Components** (marked with `'use client'`):
- `context/CartContext.tsx` - Uses React hooks (useState, useCallback, useContext)
- `components/Navbar.tsx` - Uses useCart and usePathname hooks
- `components/Product.tsx` - Has interactive onClick handlers
- `components/ProductDetail.tsx` - Has interactive buttons

**Server Components** (default):
- `app/store/page.tsx` - Fetches products server-side
- `app/store/[id]/page.tsx` - Pre-rendered product detail pages

**Important**: When adding interactivity (event handlers, hooks), the component MUST be a Client Component with `'use client'`.

### State Management

**Cart Context** (`context/CartContext.tsx`):
- Global shopping cart state using React Context API
- Provides `useCart()` hook with methods: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- CartProvider wraps the entire app in `app/layout.tsx`
- Cart object structure: `{ items: CartItem[], totalItems: number, totalPrice: number }`

**Usage:**
```typescript
const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()
```

### Data Layer

**Product data** (`lib/products.ts`):
- Currently uses a mock in-memory database (array of products)
- Async functions simulate database delay: `getAllProducts()`, `getProductById(id)`, `getProductsByCategory(category)`
- To migrate to a real database, replace these functions without changing the API interface

### Path Aliases

TypeScript is configured with `@/*` alias mapping to the root directory:
```typescript
import { Product } from '@/types/product'
import { CartProvider } from '@/context/CartContext'
```

## Key Files

- `app/layout.tsx` - Root layout wrapping all pages with CartProvider and Navbar
- `context/CartContext.tsx` - Shopping cart state management
- `lib/products.ts` - Product data access layer (mock database)
- `types/product.ts` - Product interface definition
- `types/cart.ts` - Cart and CartItem interface definitions

## API Routes

**GET /api/products** - Returns all products
**GET /api/products/[id]** - Returns single product by ID

API routes are in `app/api/products/route.ts` and `app/api/products/[id]/route.ts`.

## Routing

**Static routes:**
- `/` - Homepage
- `/store` - Product listing
- `/cart` - Shopping cart

**Dynamic routes:**
- `/store/[id]` - Product detail pages (uses `generateStaticParams()` for SSG)

## Styling

- **Global styles**: `app/globals.css`
- **CSS Modules**: Component-specific styles use `.module.css` files with scoped class names
- Import pattern: `import styles from './Component.module.css'`

## Adding Features

**New product:**
Edit `lib/products.ts` and add to the `products` array. Pages will be auto-generated at build time.

**New page:**
Create `app/new-page/page.tsx`. Route will be auto-generated.

**New API endpoint:**
Create `app/api/endpoint/route.ts` with exported async functions: `GET()`, `POST()`, etc.

**New component:**
- Server component: Create in `/components` directory
- Client component: Add `'use client'` at the top if it uses hooks or event handlers
- Use TypeScript interfaces for props

## Development Patterns

- Use TypeScript for all files (`.ts`, `.tsx`)
- Define interfaces for all component props
- Use CSS Modules for component-specific styling
- Server components for data fetching, client components for interactivity
- CartContext is already set up globally - use `useCart()` hook in any client component

## Current Priority Tasks (Deadline: Sunday)

**REMINDER: Check TodoWrite tool for current task status. Key priorities:**

**Monday:**
1. Landing page with popular cakes carousel
2. Database setup (replace mock data)
3. Order/checkout system

**Tuesday:**
4. Custom orders page and form
5. Blog page structure
6. Digital products page
7. Vercel deployment

**Focus:** Get orders flowing first, then content pages. Client needs working e-commerce by Sunday.
