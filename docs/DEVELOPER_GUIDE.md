# Developer Guide

## Quick Start

### First Time Setup

1. **Clone and install**
```bash
cd just-cakes
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Open browser**
Navigate to http://localhost:3000

4. **Test the site**
- Browse products at `/store`
- Add items to cart
- View cart at `/cart`
- Test API at `/api/products`

## Development Workflow

### Day-to-Day Development

1. **Start dev server** (with hot reload)
```bash
npm run dev
```

2. **Make changes** to files - browser auto-refreshes

3. **Check for errors**
- Terminal shows build errors
- Browser console shows runtime errors

4. **Test changes** manually in browser

5. **Build to verify**
```bash
npm run build
```

### File Change Detection

Next.js watches these folders:
- `app/` - Auto-refreshes routes
- `components/` - Auto-refreshes components
- `lib/` - Auto-refreshes data layer
- `*.css` - Auto-refreshes styles

## Understanding the Codebase

### Where to Find Things

**Need to...** | **Look in...**
---|---
Add a new page | `app/[page-name]/page.tsx`
Create a component | `components/[ComponentName].tsx`
Add API endpoint | `app/api/[endpoint]/route.ts`
Define types | `types/[type-name].ts`
Access data | `lib/products.ts`
Manage cart state | `context/CartContext.tsx`
Add global styles | `app/globals.css`

### Code Patterns

#### Creating a New Page

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We make amazing cakes!</p>
    </main>
  )
}
```

Access at: `http://localhost:3000/about`

#### Creating a Client Component

```typescript
// components/MyComponent.tsx
'use client'  // This line makes it a client component

import { useState } from 'react'

export default function MyComponent() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

#### Creating a Server Component (default)

```typescript
// components/ServerComponent.tsx
// No 'use client' directive = server component

import { getAllProducts } from '@/lib/products'

export default async function ServerComponent() {
  const products = await getAllProducts()  // Can fetch data directly

  return (
    <div>
      <h2>We have {products.length} products</h2>
    </div>
  )
}
```

#### Using CSS Modules

```typescript
// components/Card.tsx
import styles from './Card.module.css'

export default function Card({ title }: { title: string }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
    </div>
  )
}
```

```css
/* components/Card.module.css */
.card {
  padding: 20px;
  border: 1px solid #ccc;
}

.title {
  font-size: 1.5rem;
  color: #333;
}
```

#### Using the Cart Context

```typescript
'use client'

import { useCart } from '@/context/CartContext'

export default function MyComponent() {
  const { cart, addToCart, removeFromCart } = useCart()

  return (
    <div>
      <p>Cart has {cart.totalItems} items</p>
      <p>Total: ${cart.totalPrice.toFixed(2)}</p>
    </div>
  )
}
```

## Common Tasks

### 1. Add a New Product

Edit `lib/products.ts`:

```typescript
export const products: Product[] = [
  // ... existing products
  {
    id: 7,  // Make sure ID is unique
    name: 'Carrot Cake',
    description: 'Moist carrot cake with cream cheese frosting',
    price: 43.99,
    image: '/cakes/carrot-cake.jpg',
    category: 'specialty',
    available: true
  }
]
```

**Result**:
- Automatically shows on `/store`
- Creates `/store/7` page
- Available via `/api/products` and `/api/products/7`

### 2. Add a New Category Filter

1. Create the API route:
```typescript
// app/api/products/category/[category]/route.ts
import { NextResponse } from 'next/server'
import { getProductsByCategory } from '@/lib/products'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params
  const products = await getProductsByCategory(category)
  return NextResponse.json(products)
}
```

2. Create the page:
```typescript
// app/store/category/[category]/page.tsx
import { getProductsByCategory } from '@/lib/products'
import Product from '@/components/Product'

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const products = await getProductsByCategory(category)

  return (
    <main>
      <h1>{category} Cakes</h1>
      <div>
        {products.map(product => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </main>
  )
}
```

### 3. Add a Custom Hook

```typescript
// hooks/useLocalStorage.ts
'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored) {
      setValue(JSON.parse(stored))
    }
  }, [key])

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue] as const
}
```

### 4. Add Form Handling

```typescript
'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      alert('Message sent!')
      setFormData({ name: '', email: '', message: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Name"
      />
      <button type="submit">Send</button>
    </form>
  )
}
```

## Debugging

### Common Issues

#### 1. "use client" Errors

**Error**: `You're importing a component that needs useState/useEffect...`

**Fix**: Add `'use client'` to the top of the file

```typescript
'use client'  // Add this line

import { useState } from 'react'
```

#### 2. Module Not Found

**Error**: `Module not found: Can't resolve '@/components/...'`

**Fix**: Check the file path and make sure it exists
- `@/` maps to the root directory
- Use exact case (file names are case-sensitive)

#### 3. Image Not Loading

**Error**: Images show broken link icon

**Fix**: Put images in `/public` folder
```
public/
  cakes/
    chocolate-cake.jpg
```

Then reference as: `/cakes/chocolate-cake.jpg`

#### 4. Cart Not Working

**Error**: `useCart must be used within a CartProvider`

**Fix**: Make sure component is inside CartProvider (should already be in layout.tsx)

### Debugging Tools

**React DevTools**
- Install browser extension
- Inspect component tree
- View props and state

**Console Logging**
```typescript
// Server component (shows in terminal)
console.log('Server:', data)

// Client component (shows in browser console)
console.log('Client:', data)
```

**Network Tab**
- View API requests
- Check response status codes
- Inspect request/response bodies

## TypeScript Tips

### Type Inference

TypeScript can often infer types:
```typescript
// Don't need to specify type here
const products = await getAllProducts()  // Type is Product[]
```

### Defining Props

```typescript
// Option 1: Interface
interface ButtonProps {
  text: string
  onClick: () => void
}

// Option 2: Type
type ButtonProps = {
  text: string
  onClick: () => void
}

// Option 3: Inline
export default function Button({ text, onClick }: { text: string, onClick: () => void }) {
  return <button onClick={onClick}>{text}</button>
}
```

### Optional Props

```typescript
interface ProductProps {
  name: string
  price: number
  description?: string  // Optional (can be undefined)
}
```

### Union Types

```typescript
type Status = 'available' | 'out-of-stock' | 'discontinued'

interface Product {
  status: Status  // Can only be one of these three values
}
```

## Best Practices

### 1. Component Organization

```typescript
// Good: Clear structure
export default function Product({ id, name, price }: ProductProps) {
  // 1. Hooks at the top
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)

  // 2. Event handlers
  const handleAddToCart = () => {
    addToCart({ id, name, price })
  }

  // 3. Render logic
  return (
    <div>
      <h3>{name}</h3>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  )
}
```

### 2. File Naming

- **Components**: PascalCase - `ProductCard.tsx`
- **Pages**: lowercase - `page.tsx`
- **Utilities**: camelCase - `formatPrice.ts`
- **CSS Modules**: Match component - `ProductCard.module.css`
- **Types**: camelCase - `product.ts`

### 3. Import Organization

```typescript
// 1. External packages
import { useState } from 'react'
import Link from 'next/link'

// 2. Internal imports (with @/ alias)
import { useCart } from '@/context/CartContext'
import { Product } from '@/types/product'

// 3. Relative imports
import styles from './Component.module.css'
```

### 4. Avoid Prop Drilling

**Bad:**
```typescript
<GrandParent cart={cart}>
  <Parent cart={cart}>
    <Child cart={cart} />
  </Parent>
</GrandParent>
```

**Good:**
```typescript
// Use Context instead
function Child() {
  const { cart } = useCart()  // Access directly
}
```

## Performance Tips

### 1. Use Server Components When Possible

```typescript
// Good: Server component (faster)
export default async function ProductList() {
  const products = await getAllProducts()
  return <div>{products.map(...)}</div>
}

// Only use client when you need interactivity
'use client'
export default function InteractiveButton() {
  const [clicked, setClicked] = useState(false)
  return <button onClick={() => setClicked(true)}>...</button>
}
```

### 2. Minimize Client Component Size

```typescript
// Bad: Everything is client-side
'use client'
export default function Page() {
  return (
    <div>
      <Header />  {/* Doesn't need to be client */}
      <ProductList />  {/* Doesn't need to be client */}
      <AddToCartButton />  {/* Only this needs client */}
    </div>
  )
}

// Good: Split into server + client
export default function Page() {  // Server component
  return (
    <div>
      <Header />
      <ProductList />
      <AddToCartButton />  {/* Only this is 'use client' */}
    </div>
  )
}
```

## Git Workflow

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/add-wishlist

# Make changes and commit
git add .
git commit -m "Add wishlist functionality"

# Push to remote
git push origin feature/add-wishlist
```

### Commit Message Format

```
type: brief description

- Detailed change 1
- Detailed change 2
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
- `feat: add product search functionality`
- `fix: resolve cart quantity update bug`
- `docs: update API documentation`
- `style: format product card component`

## Getting Help

### Resources

1. **Next.js Docs**: https://nextjs.org/docs
2. **React Docs**: https://react.dev
3. **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
4. **MDN Web Docs**: https://developer.mozilla.org/

### When Stuck

1. Check error message in terminal/console
2. Read the documentation for the feature you're using
3. Search for the error on Google/Stack Overflow
4. Check this project's docs (README.md, ARCHITECTURE.md)
5. Ask the team

### Useful Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Format code (if prettier is installed)
npx prettier --write .

# Clear Next.js cache (if things are broken)
rm -rf .next

# Reinstall dependencies (if things are really broken)
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After getting familiar with the codebase:

1. **Add your first feature** - Pick something from Future Enhancements in README
2. **Write tests** - Set up Jest and write unit tests
3. **Improve styling** - Replace placeholder styles with real design
4. **Add database** - Replace mock data with Prisma + PostgreSQL
5. **Deploy** - Get the site live on Vercel

Welcome to the team! 🎂
