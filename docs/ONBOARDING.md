# Developer Onboarding Checklist

Welcome to the Just Cakes project! This checklist will help you get up to speed.

## Day 1: Setup & Familiarization

### Environment Setup
- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000 and see the homepage
- [ ] Verify all pages work:
  - [ ] Homepage (`/`)
  - [ ] Store (`/store`)
  - [ ] Product detail (`/store/1`)
  - [ ] Cart (`/cart`)

### Documentation Review
- [ ] Read `README.md` - Project overview
- [ ] Skim `docs/ARCHITECTURE.md` - System design
- [ ] Read `docs/DEVELOPER_GUIDE.md` - Development workflow
- [ ] Bookmark `docs/QUICK_REFERENCE.md` - Code snippets

### Test the Features
- [ ] Browse products on the store page
- [ ] Click "View Details" on a product
- [ ] Add a product to cart
- [ ] See cart counter update in navbar
- [ ] Go to cart page
- [ ] Update quantity of an item
- [ ] Remove an item from cart
- [ ] Clear the cart

## Day 2: Code Exploration

### Understand the File Structure
- [ ] Explore the `app/` directory - understand file-based routing
- [ ] Look at `components/` - see reusable components
- [ ] Check `lib/products.ts` - understand data layer
- [ ] Review `context/CartContext.tsx` - see state management
- [ ] Look at `types/` - understand TypeScript interfaces

### Follow the Data Flow
- [ ] Trace how products are fetched in `/store`
  - Start: `app/store/page.tsx`
  - Follows: `lib/products.ts` → `getAllProducts()`
  - Returns: Product array
  - Renders: `<Product>` components

- [ ] Trace the "Add to Cart" flow
  - Start: Click button in `Product.tsx`
  - Calls: `handleAddToCart()`
  - Invokes: `addToCart()` from `useCart()` hook
  - Updates: `cartItems` state in `CartContext`
  - Re-renders: Navbar shows new count

### API Exploration
- [ ] Visit `/api/products` in browser - see JSON response
- [ ] Visit `/api/products/1` - see single product
- [ ] Try `/api/products/999` - see 404 error
- [ ] Try `/api/products/abc` - see 400 error
- [ ] Look at `app/api/products/route.ts` to see implementation

## Day 3: Make Your First Change

### Simple Styling Change
- [ ] Edit `components/Navbar.tsx` or its CSS module
- [ ] Change some colors or spacing
- [ ] See hot reload update the browser
- [ ] Revert your changes

### Add a New Product
- [ ] Open `lib/products.ts`
- [ ] Add a new product object with:
  - Unique ID (7)
  - Name
  - Description
  - Price
  - Category
  - Set `available: true`
- [ ] Save and see it appear on `/store`
- [ ] Visit `/store/7` to see the detail page
- [ ] Add it to cart to test functionality

### Create a Simple Component
- [ ] Create `components/Footer.tsx`
- [ ] Add simple JSX:
  ```tsx
  export default function Footer() {
    return (
      <footer>
        <p>&copy; 2024 Just Cakes. All rights reserved.</p>
      </footer>
    )
  }
  ```
- [ ] Import it in `app/layout.tsx`
- [ ] Add it below `{children}`
- [ ] See it appear on all pages

### Build the Project
- [ ] Run `npm run build`
- [ ] Verify it builds successfully
- [ ] Note the output (which pages are static, which are dynamic)
- [ ] Run `npm start` to test production build
- [ ] Visit site at http://localhost:3000
- [ ] Stop the server (Ctrl+C)

## Day 4: Intermediate Tasks

### Create a New Page
- [ ] Create `app/about/page.tsx`
- [ ] Add some content about the business
- [ ] Add a link to it in the Navbar
- [ ] Visit `/about` and verify it works

### Try TypeScript Features
- [ ] Create a type error intentionally (e.g., pass number to string prop)
- [ ] See the TypeScript error in terminal
- [ ] Fix it and see error disappear
- [ ] Hover over variables in VS Code to see inferred types

### Understand Server vs Client
- [ ] Note which components have `'use client'`
  - `Navbar.tsx`
  - `Product.tsx`
  - `ProductDetail.tsx`
  - `CartContext.tsx`
- [ ] Understand why (they use hooks or event handlers)
- [ ] Try removing `'use client'` from `Product.tsx`
- [ ] See the error about event handlers
- [ ] Add it back

### Explore CSS Modules
- [ ] Create a new CSS module for your About page
- [ ] Add some styles
- [ ] Import and use them with `className={styles.className}`
- [ ] Inspect in browser DevTools to see scoped class names

## Day 5: Advanced Understanding

### State Management Deep Dive
- [ ] Read through `context/CartContext.tsx` line by line
- [ ] Understand how `useState` holds cart items
- [ ] See how computed values are calculated
- [ ] Understand the `addToCart` logic (increment vs add new)
- [ ] Add a `console.log` in `addToCart` to see it execute

### API Routes Deep Dive
- [ ] Read `app/api/products/[id]/route.ts`
- [ ] Understand error handling for:
  - Invalid ID format (400)
  - Product not found (404)
  - Server errors (500)
- [ ] Test these scenarios in the browser

### Dynamic Routing
- [ ] Look at `app/store/[id]/page.tsx`
- [ ] Understand `generateStaticParams()` function
- [ ] See how it pre-generates pages at build time
- [ ] Run build again and note "● /store/[id]" in output
- [ ] Understand the difference between `●` (SSG) and `○` (Static)

### Form Handling (Optional)
- [ ] Create a simple contact form as practice
- [ ] Use `useState` for form fields
- [ ] Handle `onSubmit` event
- [ ] Prevent default form submission
- [ ] Log form data to console

## Week 2: Real Contributions

### Pick a Feature to Build
Choose one from `README.md` Future Enhancements:

Easy:
- [ ] Add product search functionality
- [ ] Add loading states
- [ ] Improve styling with your design

Medium:
- [ ] Add category filtering
- [ ] Create an admin page to add products
- [ ] Add local storage persistence for cart

Advanced:
- [ ] Set up Prisma with PostgreSQL
- [ ] Add user authentication
- [ ] Implement Stripe payment

### Code Review Practice
- [ ] Review your own code
- [ ] Check for TypeScript errors
- [ ] Ensure proper error handling
- [ ] Make sure styles are in CSS modules (not global)
- [ ] Verify server vs client components are correct

### Testing Your Changes
- [ ] Test in different browsers
- [ ] Test all user flows
- [ ] Try edge cases (empty cart, out of stock items, etc.)
- [ ] Run `npm run build` before committing

## Knowledge Check

After onboarding, you should be able to answer:

### Basic
- [ ] What command starts the dev server?
- [ ] Where do you add a new page?
- [ ] How do you add a new product?
- [ ] What's the difference between `app/` and `components/`?
- [ ] Where is the mock product data stored?

### Intermediate
- [ ] What's the difference between Server and Client components?
- [ ] How does the cart state management work?
- [ ] How do you access the cart from any component?
- [ ] How do CSS Modules prevent style conflicts?
- [ ] What does `@/` mean in imports?

### Advanced
- [ ] How are dynamic routes (`/store/[id]`) generated at build time?
- [ ] How would you replace the mock data with a real database?
- [ ] What's the data flow from clicking "Add to Cart" to the navbar updating?
- [ ] How do API routes work in Next.js?
- [ ] How would you add server-side authentication?

## Common Mistakes to Avoid

- [ ] Don't use `'use client'` everywhere - only when needed
- [ ] Don't put styles in `globals.css` - use CSS Modules
- [ ] Don't forget `await params` in dynamic routes
- [ ] Don't hardcode data - use the data layer
- [ ] Don't forget `key` prop when mapping arrays
- [ ] Don't modify state directly - use setter functions

## Resources You Should Know

- [ ] Next.js Documentation: https://nextjs.org/docs
- [ ] React Documentation: https://react.dev
- [ ] TypeScript Handbook: https://www.typescriptlang.org/docs/
- [ ] MDN Web Docs: https://developer.mozilla.org/
- [ ] Project README: `README.md`
- [ ] Quick Reference: `docs/QUICK_REFERENCE.md`

## Getting Help

If you're stuck:

1. Check the error message (terminal or browser console)
2. Read the relevant documentation file
3. Search the error on Google/Stack Overflow
4. Check Next.js documentation
5. Ask the team in Slack/Discord
6. Schedule a pairing session with a senior developer

## Next Steps

Once you complete this checklist:

- [ ] Ask for a code review on your first contribution
- [ ] Start picking up tickets from the backlog
- [ ] Suggest improvements to the documentation
- [ ] Help onboard the next new developer

## Feedback

- [ ] Share what was helpful in this onboarding
- [ ] Share what was confusing or missing
- [ ] Suggest improvements to the docs

---

**Welcome to the team! You've got this! 🎂**
