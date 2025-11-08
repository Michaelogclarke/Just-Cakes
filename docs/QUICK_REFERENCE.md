# Quick Reference Guide

## File Structure at a Glance

```
just-cakes/
├── app/                    # Pages and routes
│   ├── layout.tsx         # Root layout (has CartProvider & Navbar)
│   ├── page.tsx           # Homepage (/)
│   ├── store/
│   │   ├── page.tsx       # Store listing (/store)
│   │   └── [id]/page.tsx  # Product detail (/store/1)
│   ├── cart/page.tsx      # Cart page (/cart)
│   └── api/               # API endpoints
│       └── products/
│           ├── route.ts   # GET /api/products
│           └── [id]/route.ts  # GET /api/products/1
├── components/            # Reusable components
│   ├── Navbar.tsx
│   ├── Product.tsx
│   └── ProductDetail.tsx
├── context/
│   └── CartContext.tsx    # Global cart state
├── lib/
│   └── products.ts        # Data layer (mock database)
└── types/
    ├── product.ts         # Product type
    └── cart.ts            # Cart types
```

## Essential Code Snippets

### Import Aliases

```typescript
import Component from '@/components/Component'  // @ = root directory
import { Product } from '@/types/product'
import { useCart } from '@/context/CartContext'
import { getAllProducts } from '@/lib/products'
```

### Product Type

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

### Cart Context Methods

```typescript
const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()

addToCart(product)              // Add product to cart
removeFromCart(productId)       // Remove from cart
updateQuantity(productId, qty)  // Update quantity
clearCart()                     // Empty cart

cart.items         // Array of CartItem
cart.totalItems    // Total item count
cart.totalPrice    // Total price
```

### Data Layer Functions

```typescript
import { getAllProducts, getProductById, getProductsByCategory } from '@/lib/products'

const products = await getAllProducts()           // Get all products
const product = await getProductById(1)           // Get one product
const filtered = await getProductsByCategory('chocolate')  // Filter by category
```

## Component Templates

### Basic Server Component

```typescript
export default function MyPage() {
  return (
    <main>
      <h1>Page Title</h1>
      <p>Content here</p>
    </main>
  )
}
```

### Server Component with Data Fetching

```typescript
import { getAllProducts } from '@/lib/products'

export default async function MyPage() {
  const products = await getAllProducts()

  return (
    <main>
      <h1>Products: {products.length}</h1>
    </main>
  )
}
```

### Client Component with State

```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Client Component with Cart

```typescript
'use client'

import { useCart } from '@/context/CartContext'
import { Product } from '@/types/product'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  )
}
```

### Component with CSS Modules

```typescript
import styles from './MyComponent.module.css'

export default function MyComponent() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Hello</h2>
    </div>
  )
}
```

### Dynamic Route Page

```typescript
// app/products/[id]/page.tsx
export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <div>Product ID: {id}</div>
}
```

### API Route (GET)

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello' })
}
```

### API Route (POST)

```typescript
// app/api/submit/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // Process data
  console.log(body)

  return NextResponse.json({ success: true })
}
```

### API Route with Dynamic Params

```typescript
// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return NextResponse.json({ id })
}
```

## Common Patterns

### Conditional Rendering

```typescript
// If/else
{cart.items.length > 0 ? (
  <CartItems items={cart.items} />
) : (
  <p>Cart is empty</p>
)}

// && operator
{cart.totalItems > 0 && <Badge count={cart.totalItems} />}
```

### Mapping Arrays

```typescript
{products.map((product) => (
  <Product key={product.id} {...product} />
))}
```

### Event Handlers

```typescript
// Inline
<button onClick={() => console.log('clicked')}>Click</button>

// Function
const handleClick = () => {
  console.log('clicked')
}
<button onClick={handleClick}>Click</button>

// With parameters
const handleDelete = (id: number) => {
  console.log('Delete', id)
}
<button onClick={() => handleDelete(product.id)}>Delete</button>
```

### Form Handling

```typescript
'use client'

import { useState } from 'react'

export default function Form() {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Link Navigation

```typescript
import Link from 'next/link'

<Link href="/store">Go to Store</Link>
<Link href={`/store/${product.id}`}>View Product</Link>
```

### Programmatic Navigation

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function MyComponent() {
  const router = useRouter()

  const goToStore = () => {
    router.push('/store')
  }

  return <button onClick={goToStore}>Go to Store</button>
}
```

### Get Current Path

```typescript
'use client'

import { usePathname } from 'next/navigation'

export default function MyComponent() {
  const pathname = usePathname()  // e.g., "/store" or "/cart"

  return <div>Current path: {pathname}</div>
}
```

## TypeScript Patterns

### Define Component Props

```typescript
interface MyComponentProps {
  title: string
  count: number
  optional?: string
}

export default function MyComponent({ title, count, optional }: MyComponentProps) {
  return <div>{title} - {count}</div>
}
```

### Type for useState

```typescript
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<Product[]>([])
const [loading, setLoading] = useState<boolean>(false)
```

### Type for Event Handlers

```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget)
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}
```

### Extend Existing Types

```typescript
interface CartItem extends Product {
  quantity: number
}
```

### Union Types

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error'
const [status, setStatus] = useState<Status>('idle')
```

## CSS Modules Patterns

### Basic Usage

```css
/* Component.module.css */
.container {
  padding: 20px;
}

.title {
  font-size: 2rem;
  color: blue;
}
```

```typescript
import styles from './Component.module.css'

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

### Multiple Classes

```typescript
<div className={`${styles.card} ${styles.active}`}>
```

### Conditional Classes

```typescript
<div className={isActive ? styles.active : styles.inactive}>

// Or with multiple classes
<div className={`${styles.card} ${isActive ? styles.active : ''}`}>
```

## Fetching Data

### Server Component (Recommended)

```typescript
// Happens on server, no loading state needed
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()

  return <div>{json.title}</div>
}
```

### Client Component

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div>Loading...</div>

  return <div>{data.length} products</div>
}
```

## Environment Variables

### Define (.env.local)

```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Use in Server Components / API Routes

```typescript
const dbUrl = process.env.DATABASE_URL
```

### Use in Client Components (must start with NEXT_PUBLIC_)

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

rm -rf .next         # Clear cache
rm -rf node_modules  # Remove dependencies
npm install          # Reinstall dependencies
```

## File Naming Conventions

- Pages: `page.tsx`
- Layouts: `layout.tsx`
- API routes: `route.ts`
- Components: `ComponentName.tsx` (PascalCase)
- CSS Modules: `ComponentName.module.css`
- Types: `typename.ts` (lowercase)
- Utils: `utilName.ts` (camelCase)

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `useCart must be used within CartProvider` | Make sure component is inside `<CartProvider>` in layout.tsx |
| `You're importing a component that needs useState` | Add `'use client'` to top of file |
| Module not found `@/...` | Check file path exists and case matches exactly |
| Image not loading | Put images in `/public` folder |
| Changes not showing | Hard refresh browser (Cmd+Shift+R or Ctrl+F5) |
| Build failing | Run `rm -rf .next && npm run build` |

## URLs Reference

- Homepage: `/`
- Store: `/store`
- Product: `/store/1`, `/store/2`, etc.
- Cart: `/cart`
- API Products: `/api/products`
- API Single Product: `/api/products/1`

## Project-Specific Notes

### Current Product IDs
1-6 (defined in `lib/products.ts`)

### Current Categories
- `chocolate`
- `vanilla`
- `specialty`
- `fruit`

### Mock Data Location
`lib/products.ts` - Replace with database later

### Cart State
In-memory only (resets on page reload) - add localStorage later
