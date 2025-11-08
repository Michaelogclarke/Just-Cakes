# Architecture Documentation

## System Overview

Just Cakes is built using Next.js 15's App Router with a focus on server-side rendering for performance and SEO, while using client-side interactivity where needed.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Navbar     │  │   Product    │  │ ProductDetail│      │
│  │ (Client)     │  │  (Client)    │  │  (Client)    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │ CartContext │                          │
│                    │  (Client)   │                          │
│                    └─────────────┘                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                      Next.js Server                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Store Page   │  │ Product Page │  │  API Routes  │      │
│  │  (Server)    │  │  (Server)    │  │  (Server)    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │ lib/products│                          │
│                    │ (Data Layer)│                          │
│                    └─────────────┘                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
RootLayout (app/layout.tsx)
└── CartProvider (context/CartContext.tsx)
    ├── Navbar (components/Navbar.tsx) [Client]
    └── Page Content
        ├── HomePage (app/page.tsx) [Server]
        ├── StorePage (app/store/page.tsx) [Server]
        │   └── Product Components [Client]
        ├── ProductDetailPage (app/store/[id]/page.tsx) [Server]
        │   └── ProductDetail Component [Client]
        └── CartPage (app/cart/page.tsx) [Client]
```

## Data Flow Patterns

### 1. Server-Side Data Fetching (Store Page)

```
User navigates to /store
    ↓
Next.js renders StorePage (Server Component)
    ↓
Calls getAllProducts() from lib/products.ts
    ↓
Fetches data (currently from mock, future: database)
    ↓
Renders HTML with product data
    ↓
Sends complete HTML to browser
    ↓
Hydrates client components (Product cards)
```

### 2. Client-Side Cart Management

```
User clicks "Add to Cart"
    ↓
Product component calls handleAddToCart()
    ↓
Calls addToCart() from useCart() hook
    ↓
CartContext updates state
    ↓
All components using useCart() re-render
    ↓
Navbar shows updated cart count
```

### 3. API Route Pattern

```
Client requests /api/products/1
    ↓
Next.js API Route Handler (app/api/products/[id]/route.ts)
    ↓
Extracts ID from params
    ↓
Calls getProductById(1) from lib/products.ts
    ↓
Returns JSON response
```

## Key Design Decisions

### 1. Server Components by Default
**Why**: Better performance, smaller bundle size, automatic SEO optimization

**Where used**:
- Store page (product listing)
- Product detail pages
- Homepage

### 2. Client Components for Interactivity
**Why**: React hooks and event handlers only work in client components

**Where used**:
- Product cards (onClick handlers)
- Navbar (useCart hook)
- Cart page (interactive updates)
- ProductDetail (navigation)

### 3. Context API for Cart State
**Why**: Simple global state without external dependencies

**Alternatives considered**:
- Redux (too complex for this use case)
- Zustand (added dependency)
- Server-side cart (requires authentication)

**Trade-offs**:
- ✅ Simple implementation
- ✅ No external dependencies
- ❌ State resets on page reload (future: localStorage)
- ❌ Not suitable for multi-tab sync

### 4. CSS Modules
**Why**: Scoped styles, no naming conflicts, co-located with components

**Alternatives considered**:
- Tailwind (user specifically requested CSS modules)
- Styled Components (adds bundle size)
- Global CSS (naming conflicts)

### 5. Mock Data Layer
**Why**: Easy to replace with real database later

**Migration path**:
```typescript
// Current (mock)
export async function getAllProducts(): Promise<Product[]> {
  return products
}

// Future (with Prisma)
export async function getAllProducts(): Promise<Product[]> {
  return await prisma.product.findMany()
}
```

## Rendering Strategies

### Static Generation (SSG)
Used for product detail pages (`/store/[id]`)

```typescript
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    id: product.id.toString(),
  }))
}
```

**Result**: All 6 product pages pre-rendered at build time

### Server-Side Rendering (SSR)
Used for store page (`/store`)

**Result**: HTML generated on each request (can be cached)

### Client-Side Rendering (CSR)
Used for cart interactions

**Result**: Updates happen in browser without server roundtrip

## State Management

### Cart State Structure

```typescript
// Internal state (in CartContext)
const [cartItems, setCartItems] = useState<CartItem[]>([])

// Computed values (derived from state)
const cart: Cart = {
  items: cartItems,
  totalItems: cartItems.reduce(...),
  totalPrice: cartItems.reduce(...)
}
```

### State Update Patterns

**Adding to cart:**
```typescript
setCartItems(prevItems => {
  const existingItem = prevItems.find(item => item.id === product.id)
  if (existingItem) {
    // Increment quantity
    return prevItems.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  } else {
    // Add new item
    return [...prevItems, { ...product, quantity: 1 }]
  }
})
```

## Type System

### Type Hierarchy

```
Product (base type)
  └── CartItem extends Product
       └── adds quantity: number

Cart (container type)
  └── contains CartItem[]
  └── computed: totalItems, totalPrice
```

### Type Safety Benefits

1. **Compile-time errors** for missing properties
2. **IDE autocomplete** for all properties
3. **Refactoring safety** when changing types
4. **Documentation** through type definitions

## Performance Considerations

### Current Optimizations
- ✅ Server components for faster initial load
- ✅ Static generation for product pages
- ✅ Minimal JavaScript bundle (only client components)

### Future Optimizations
- [ ] Image optimization with next/image
- [ ] Route prefetching for product links
- [ ] Lazy loading for product images
- [ ] Memoization for expensive calculations
- [ ] Code splitting for cart page

## Security Considerations

### Current State
- ✅ TypeScript prevents many runtime errors
- ✅ API routes validate input (invalid IDs)
- ⚠️ No authentication yet
- ⚠️ No rate limiting
- ⚠️ No CSRF protection

### Future Requirements
- [ ] User authentication (NextAuth.js)
- [ ] Server-side session management
- [ ] Input validation and sanitization
- [ ] Rate limiting on API routes
- [ ] HTTPS enforcement in production

## Scalability Path

### Phase 1: Current (MVP)
- Mock data layer
- In-memory cart state
- Static product catalog

### Phase 2: Database Integration
- Replace `lib/products.ts` with Prisma
- Add PostgreSQL or MongoDB
- Server-side cart persistence

### Phase 3: User Accounts
- NextAuth.js integration
- User profiles
- Order history
- Saved carts

### Phase 4: Admin Panel
- Product management UI
- Order management
- Analytics dashboard

### Phase 5: Advanced Features
- Real-time inventory
- Multiple payment gateways
- Email notifications
- Push notifications

## Error Handling

### API Routes
```typescript
try {
  // Operation
} catch (error) {
  return NextResponse.json(
    { error: 'Descriptive message' },
    { status: 500 }
  )
}
```

### Client Components
Currently using `alert()` - should be replaced with toast notifications

### Server Components
Next.js automatically shows error UI, can be customized with `error.tsx`

## Testing Strategy (Future)

### Unit Tests
- Cart context functions
- Utility functions in lib/products.ts

### Integration Tests
- API routes
- Component interactions

### E2E Tests
- Complete user flows (browse → add to cart → checkout)
- Use Playwright or Cypress

## Deployment Considerations

### Environment Variables
Future needs:
- Database connection strings
- API keys (payment, email)
- Authentication secrets

### Build Output
- Static pages: `/`, `/store/[1-6]`
- Server routes: `/api/products/*`
- Client bundles: Navbar, Product, Cart components

### Hosting Options
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Self-hosted with Node.js

## Maintenance Guidelines

### Adding Features
1. Update types first (`types/`)
2. Implement data layer (`lib/`)
3. Create API routes if needed (`app/api/`)
4. Build UI components (`components/`)
5. Add pages (`app/`)

### Code Review Checklist
- [ ] TypeScript types defined
- [ ] Server vs Client components correct
- [ ] Error handling implemented
- [ ] CSS modules used (no global styles)
- [ ] Props interfaces documented

### Breaking Changes to Avoid
- Changing Product interface (will break existing code)
- Renaming lib/products.ts functions (used in multiple places)
- Modifying CartContext API (used by all components)
