# Just Cakes

## Table of Contents
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features](#features)
- [Architecture](#architecture)
- [API Routes](#api-routes)
- [State Management](#state-management)
- [Components](#components)
- [Routing](#routing)
- [Future Enhancements](#future-enhancements)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5
- **Styling**: CSS Modules
- **State Management**: React Context API
- **Linting**: ESLint

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
just-cakes/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── products/         # Product API endpoints
│   │       ├── route.ts      # GET /api/products
│   │       └── [id]/         # GET /api/products/[id]
│   ├── cart/                 # Cart page
│   │   └── page.tsx
│   ├── store/                # Store pages
│   │   ├── page.tsx          # Store listing page
│   │   └── [id]/             # Dynamic product detail pages
│   ├── layout.tsx            # Root layout (includes Navbar & CartProvider)
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/               # Reusable React components
│   ├── Navbar.tsx            # Navigation bar
│   ├── Navbar.module.css     # Navbar styles
│   ├── Product.tsx           # Product card component
│   └── ProductDetail.tsx     # Product detail view
├── context/                  # React Context providers
│   └── CartContext.tsx       # Shopping cart state management
├── lib/                      # Utility functions and data access
│   └── products.ts           # Product data layer (mock database)
├── types/                    # TypeScript type definitions
│   ├── product.ts            # Product interface
│   └── cart.ts               # Cart & CartItem interfaces
├── public/                   # Static assets
├── package.json
├── tsconfig.json
└── next.config.js
```

## Features

### 1. Product Browsing
- View all available cakes on the store page
- Browse individual product details
- See product information (name, description, price, category, availability)

### 2. Shopping Cart
- Add products to cart
- Remove products from cart
- Update product quantities
- View cart totals (items count and total price)
- Clear entire cart
- Persistent cart state across pages

### 3. Navigation
- Global navigation bar on all pages
- Active page highlighting
- Real-time cart item counter in navbar

### 4. API Layer
- RESTful API endpoints for products
- Server-side data fetching
- Error handling for invalid requests

## Architecture

### Next.js App Router
This project uses Next.js 15's App Router (not the older Pages Router). Key concepts:

- **Server Components**: Default for all components (faster, better SEO)
- **Client Components**: Marked with `'use client'` directive (for interactivity)
- **File-based Routing**: Folders in `/app` automatically become routes

### Data Flow

```
User Action
    ↓
Client Component (Product.tsx)
    ↓
Cart Context (CartContext.tsx)
    ↓
State Update
    ↓
Re-render (Navbar shows updated count)
```

### Server vs Client Components

**Server Components** (default):
- `app/store/page.tsx` - Fetches data server-side
- `app/store/[id]/page.tsx` - Pre-rendered product pages

**Client Components** (marked with `'use client'`):
- `components/Product.tsx` - Has onClick handlers
- `components/Navbar.tsx` - Uses useCart hook
- `components/ProductDetail.tsx` - Interactive buttons
- `context/CartContext.tsx` - Uses React hooks

## API Routes

### GET /api/products
Fetches all products.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Chocolate Delight Cake",
    "description": "Rich chocolate cake with chocolate ganache",
    "price": 45.99,
    "image": "/cakes/chocolate-cake.jpg",
    "category": "chocolate",
    "available": true
  }
]
```

### GET /api/products/[id]
Fetches a single product by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Chocolate Delight Cake",
  "description": "Rich chocolate cake with chocolate ganache",
  "price": 45.99,
  "image": "/cakes/chocolate-cake.jpg",
  "category": "chocolate",
  "available": true
}
```

**Error Responses:**
- `400` - Invalid product ID
- `404` - Product not found
- `500` - Server error

## State Management

### Cart Context
Located in `context/CartContext.tsx`, this provides global shopping cart state.

**Provider:**
```tsx
<CartProvider>
  {children}
</CartProvider>
```

**Hook:**
```tsx
const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()
```

**Available Methods:**
- `addToCart(product: Product)` - Add product to cart (increases quantity if already exists)
- `removeFromCart(productId: number)` - Remove product from cart
- `updateQuantity(productId: number, quantity: number)` - Update product quantity
- `clearCart()` - Remove all items from cart

**Cart Object:**
```typescript
{
  items: CartItem[],        // Array of cart items
  totalItems: number,       // Total number of items
  totalPrice: number        // Total price of all items
}
```

## Components

### Navbar (`components/Navbar.tsx`)
Global navigation component.

**Features:**
- Links to Home, Store, Cart
- Active page highlighting
- Cart item counter
- Uses `useCart()` and `usePathname()` hooks

**Usage:**
Automatically included in `app/layout.tsx` - no need to import elsewhere.

### Product (`components/Product.tsx`)
Reusable product card component.

**Props:**
```typescript
{
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}
```

**Features:**
- Displays product information
- "Add to Cart" button
- "View Details" link to product page
- Disabled state for unavailable products

**Usage:**
```tsx
<Product {...product} />
```

### ProductDetail (`components/ProductDetail.tsx`)
Full product detail view for individual product pages.

**Props:**
```typescript
{
  product: Product
}
```

**Features:**
- Full product information
- "Add to Cart" button
- "Back to Store" navigation

## Routing

### Static Routes
- `/` - Homepage
- `/store` - Product listing page
- `/cart` - Shopping cart page

### Dynamic Routes
- `/store/[id]` - Product detail pages (e.g., `/store/1`, `/store/2`)
  - Uses `generateStaticParams()` to pre-render all product pages at build time

### API Routes
- `/api/products` - Get all products
- `/api/products/[id]` - Get single product

## Types

### Product
```typescript
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}
```

### CartItem
```typescript
interface CartItem extends Product {
  quantity: number
}
```

### Cart
```typescript
interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}
```

## Data Layer

Currently uses a mock database in `lib/products.ts`.

**Functions:**
- `getAllProducts()` - Async function returning all products
- `getProductById(id: number)` - Async function returning single product
- `getProductsByCategory(category: string)` - Async function returning filtered products

**Migration Path:**
Replace these functions with actual database queries (Prisma, MongoDB, etc.) without changing the API.

## Future Enhancements

### Backend
- [ ] Real database integration (PostgreSQL, MongoDB)
- [ ] User authentication (NextAuth.js)
- [ ] Order management system
- [ ] Payment integration (Stripe, PayPal)
- [ ] Admin dashboard for product management
- [ ] Email notifications
- [ ] Inventory tracking

### Frontend
- [ ] Product search and filtering
- [ ] Product categories page
- [ ] Customer reviews and ratings
- [ ] Image optimization with Next.js Image component
- [ ] Responsive design for mobile
- [ ] Loading states and skeletons
- [ ] Toast notifications for cart actions
- [ ] Checkout flow

### Features
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Discount codes and promotions
- [ ] Custom cake orders form
- [ ] Delivery date selection
- [ ] Order tracking
- [ ] Multiple payment options

## Development Notes

### CSS Modules
All component-specific styles use CSS Modules (`.module.css` files). Class names are automatically scoped.

**Example:**
```tsx
import styles from './Component.module.css'
<div className={styles.container}>...</div>
```

### Adding New Products
Edit `lib/products.ts` and add to the `products` array. The site will automatically generate new pages.

### Adding New Pages
Create a new folder in `/app` with a `page.tsx` file. It will automatically become a route.

### TypeScript
All components use TypeScript. Define props interfaces for type safety.

## Common Tasks

### Add a new product
Edit `lib/products.ts`:
```typescript
{
  id: 7,
  name: "New Cake",
  description: "Description here",
  price: 49.99,
  image: "/cakes/new-cake.jpg",
  category: "specialty",
  available: true
}
```

### Create a new page
Create `app/about/page.tsx`:
```tsx
export default function AboutPage() {
  return <main>About Us</main>
}
```

### Add a new API endpoint
Create `app/api/orders/route.ts`:
```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Orders' })
}
```

## Questions?

For questions about the codebase, check:
1. This README
2. Code comments in individual files
3. Next.js documentation: https://nextjs.org/docs
4. React documentation: https://react.dev
