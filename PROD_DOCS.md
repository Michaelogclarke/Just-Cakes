# Just Cakes - Production Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Security](#authentication--security)
6. [Payment Processing](#payment-processing)
7. [Order Management](#order-management)
8. [Deployment Guide](#deployment-guide)
9. [Environment Variables](#environment-variables)
10. [Monitoring & Logging](#monitoring--logging)
11. [Troubleshooting](#troubleshooting)
12. [Maintenance Tasks](#maintenance-tasks)

---

## System Architecture

### Overview
Just Cakes is a Next.js 15 e-commerce application using the App Router architecture with server-side rendering, PostgreSQL database, Stripe payment processing, and JWT-based admin authentication.

### Architecture Diagram
```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│         Next.js 15 App              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Client Components          │  │
│  │  - Shopping Cart (Context)   │  │
│  │  - Product Listings          │  │
│  │  - Admin Dashboard           │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Server Components          │  │
│  │  - Homepage                  │  │
│  │  - Store Pages               │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   API Routes                 │  │
│  │  - /api/products             │  │
│  │  - /api/checkout             │  │
│  │  - /api/orders               │  │
│  │  - /api/admin/auth           │  │
│  │  - /api/webhooks/stripe      │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
       │                    ↑
       ↓                    │
┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │    Stripe    │
│   Database   │    │   Webhooks   │
└──────────────┘    └──────────────┘
```

### Key Components

**Frontend:**
- React 18 with Next.js 15 App Router
- Client-side state management via Context API
- Server-side rendering for SEO optimization
- CSS Modules for component styling

**Backend:**
- Next.js API Routes for serverless functions
- Prisma ORM for database access
- JWT authentication with jose library
- Stripe SDK for payment processing

**Database:**
- PostgreSQL (Prisma Postgres recommended)
- Two main tables: Products and Orders
- JSON fields for flexible address/item storage

---

## Technology Stack

### Core Technologies
- **Framework:** Next.js 15.0.5
- **Language:** TypeScript 5.x
- **Runtime:** Node.js (serverless on Vercel)
- **Database:** PostgreSQL with Prisma ORM
- **Payments:** Stripe Checkout & Webhooks
- **Authentication:** JWT with jose library

### Key Dependencies
```json
{
  "@prisma/client": "^6.3.0",
  "stripe": "^17.6.0",
  "jose": "^5.10.0",
  "next": "15.0.5",
  "react": "^18.3.1",
  "typescript": "^5"
}
```

### Development Tools
- ESLint for code linting
- Prisma Studio for database management
- Stripe CLI for local webhook testing

---

## Database Schema

### Products Table
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  image       String
  type        String   // 'cake', 'cupcake', 'slice', 'digital'
  category    String?
  featured    Boolean  @default(false)
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([type])
  @@index([featured])
}
```

**Product Types:**
- `cake` - Full-sized cakes
- `cupcake` - Individual cupcakes
- `slice` - Cake slices
- `digital` - Digital products (recipes, guides)

### Orders Table
```prisma
model Order {
  id                  String   @id @default(cuid())
  stripeSessionId     String   @unique
  stripePaymentIntent String?
  customerEmail       String
  customerName        String?
  customerPhone       String?
  shippingAddress     Json?
  billingAddress      Json?
  orderItems          Json
  totalAmount         Float
  currency            String   @default("gbp")
  status              String   @default("pending")
  paymentStatus       String   @default("unpaid")
  notes               String?
  trackingNumber      String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([customerEmail])
  @@index([status])
  @@index([createdAt])
}
```

**Order Status Values:**
- `pending` - Order received, awaiting processing
- `processing` - Order being prepared
- `shipped` - Order dispatched
- `delivered` - Order completed
- `cancelled` - Order cancelled/refunded

**Payment Status Values:**
- `unpaid` - Payment not completed
- `paid` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

**Address JSON Structure:**
```json
{
  "line1": "123 Main Street",
  "line2": "Apt 4B",
  "city": "London",
  "postal_code": "SW1A 1AA",
  "country": "GB"
}
```

**Order Items JSON Structure:**
```json
[
  {
    "id": "cake-1",
    "name": "Chocolate Fudge Cake",
    "price": 25.99,
    "quantity": 1,
    "image": "/images/cake1.jpg"
  }
]
```

### Database Commands

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Push Schema Changes:**
```bash
npx prisma db push
```

**Open Prisma Studio:**
```bash
npx prisma studio
```

**Seed Database:**
```bash
npx prisma db seed
```

---

## API Endpoints

### Public Endpoints

#### GET /api/products
Returns all products from the database.

**Response:**
```json
[
  {
    "id": "cake-1",
    "name": "Chocolate Fudge Cake",
    "description": "Rich chocolate cake with fudge frosting",
    "price": 25.99,
    "image": "/images/cake1.jpg",
    "type": "cake",
    "category": "chocolate",
    "featured": true,
    "inStock": true
  }
]
```

#### GET /api/products/[id]
Returns a single product by ID.

**Parameters:**
- `id` - Product ID (string)

**Response:**
```json
{
  "id": "cake-1",
  "name": "Chocolate Fudge Cake",
  "price": 25.99,
  ...
}
```

#### POST /api/checkout
Creates a Stripe Checkout session for payment.

**Request Body:**
```json
{
  "items": [
    {
      "id": "cake-1",
      "name": "Chocolate Fudge Cake",
      "price": 25.99,
      "quantity": 1,
      "image": "/images/cake1.jpg"
    }
  ]
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

**Implementation Details:**
- Creates line items for each cart item
- Stores cart data in session metadata for webhook processing
- Sets success/cancel URLs
- Uses GBP currency by default

### Protected Endpoints (Require Authentication)

#### GET /api/orders
Returns all orders (admin only).

**Headers:**
```
Cookie: admin_token=<jwt_token>
```

**Response:**
```json
[
  {
    "id": "order_123",
    "customerEmail": "customer@example.com",
    "customerName": "John Smith",
    "totalAmount": 25.99,
    "status": "pending",
    "paymentStatus": "paid",
    "createdAt": "2025-12-12T10:30:00Z",
    "orderItems": [...],
    "shippingAddress": {...}
  }
]
```

### Authentication Endpoints

#### POST /api/admin/auth
Admin login - creates JWT session.

**Request Body:**
```json
{
  "password": "your_admin_password"
}
```

**Response (Success):**
```json
{
  "success": true
}
```
Sets `admin_token` httpOnly cookie with 24-hour expiration.

**Response (Failure):**
```json
{
  "error": "Invalid password"
}
```

#### GET /api/admin/auth
Verify admin authentication status.

**Response:**
```json
{
  "authenticated": true
}
```

#### DELETE /api/admin/auth
Admin logout - removes JWT session.

**Response:**
```json
{
  "success": true
}
```

### Webhook Endpoints

#### POST /api/webhooks/stripe
Receives Stripe webhook events for order processing.

**Headers:**
```
stripe-signature: <signature>
Content-Type: application/json
```

**Security:**
- Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
- Rejects requests without valid signature
- Only processes events from Stripe

**Handled Events:**

**checkout.session.completed**
- Extracts customer and order data from session
- Creates order record in database
- Marks payment status as paid/unpaid

**payment_intent.payment_failed**
- Finds order by payment intent ID
- Updates payment status to 'failed'

**charge.refunded**
- Finds order by payment intent ID
- Updates payment status to 'refunded'
- Updates order status to 'cancelled'

---

## Authentication & Security

### Admin Authentication Flow

```
1. User visits /admin
   ↓
2. Submits password via login form
   ↓
3. POST /api/admin/auth with password
   ↓
4. Server validates password against ADMIN_PASSWORD env var
   ↓
5. If valid: Create JWT token, set httpOnly cookie
   ↓
6. Redirect to /admin/dashboard
   ↓
7. Protected pages check cookie on every request
   ↓
8. JWT verified server-side via middleware
```

### JWT Token Structure
```javascript
{
  "role": "admin",
  "iat": 1702300000,  // Issued at
  "exp": 1702386400   // Expires (24 hours later)
}
```

### Security Features

**HttpOnly Cookies:**
- Cannot be accessed by JavaScript
- Prevents XSS attacks
- Automatically sent with requests

**JWT Signing:**
- Uses HS256 algorithm
- Secret key from `ADMIN_JWT_SECRET` env var
- Token expires after 24 hours

**Password Protection:**
- Password stored in environment variable
- Never exposed to client
- Server-side validation only

**Webhook Verification:**
- Stripe signature verification
- Prevents fake webhook attacks
- Rejects unsigned requests

### Security Best Practices

**Required for Production:**
1. Change `ADMIN_PASSWORD` from default value
2. Generate strong `ADMIN_JWT_SECRET` (32+ characters)
3. Use Stripe live keys (not test keys)
4. Set `STRIPE_WEBHOOK_SECRET` from Stripe dashboard
5. Enable HTTPS in production (automatic on Vercel)

**Generate Secure JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Protected Routes
- `/admin/dashboard` - Admin homepage
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/blog` - Blog management (if enabled)

**Protection Method:**
Client-side components use `useAdmin()` hook to check authentication and redirect if not logged in.

---

## Payment Processing

### Stripe Integration

**Flow:**
```
1. User adds items to cart
   ↓
2. Clicks "Checkout" button
   ↓
3. Frontend calls POST /api/checkout with cart items
   ↓
4. Server creates Stripe Checkout session
   ↓
5. User redirected to Stripe hosted checkout page
   ↓
6. User enters payment details
   ↓
7. Stripe processes payment
   ↓
8. Stripe sends webhook to /api/webhooks/stripe
   ↓
9. Server creates order in database
   ↓
10. User redirected to /success page
```

### Checkout Session Configuration

```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: items.map(item => ({
    price_data: {
      currency: 'gbp',
      product_data: {
        name: item.name,
        images: [item.image]
      },
      unit_amount: Math.round(item.price * 100)
    },
    quantity: item.quantity
  })),
  mode: 'payment',
  success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/cart`,
  metadata: {
    cart_items: JSON.stringify(items)
  }
})
```

### Webhook Event Handling

**Event: checkout.session.completed**
```javascript
const session = event.data.object
const cartItems = JSON.parse(session.metadata.cart_items)

await prisma.order.create({
  data: {
    stripeSessionId: session.id,
    customerEmail: session.customer_details.email,
    orderItems: cartItems,
    totalAmount: session.amount_total / 100,
    paymentStatus: session.payment_status === 'paid' ? 'paid' : 'unpaid'
  }
})
```

### Testing Payments

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires 3DS: `4000 0025 0000 3155`

**Test Mode:**
Ensure you're using test keys when developing:
- `STRIPE_SECRET_KEY` starts with `sk_test_`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_`

**Local Webhook Testing:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

### Production Stripe Setup

1. **Switch to Live Mode** in Stripe Dashboard (top right toggle)

2. **Get Live API Keys:**
   - Go to Developers → API Keys
   - Copy live keys (start with `sk_live_` and `pk_live_`)

3. **Create Webhook Endpoint:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

4. **Copy Webhook Secret:**
   - After creating endpoint, reveal signing secret
   - Starts with `whsec_`
   - Add to environment variables

---

## Order Management

### Admin Orders Page

**Location:** `/admin/orders`

**Features:**
- View all orders sorted by date (newest first)
- Filter by order status
- See order statistics (total orders, revenue, pending)
- View customer details and shipping addresses
- Display order items with quantities and prices

### Order Statistics

**Calculated Metrics:**
```javascript
{
  totalOrders: orders.length,
  totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  pendingOrders: orders.filter(o => o.status === 'pending').length,
  averageOrderValue: totalRevenue / totalOrders
}
```

### Order Status Management

**Status Updates:**
Currently, order status updates must be done manually via database or Prisma Studio. Future enhancement would add UI for status changes.

**Manual Update via Prisma Studio:**
```bash
npx prisma studio
```
Navigate to Orders table and edit status field.

**Manual Update via SQL:**
```sql
UPDATE "Order"
SET status = 'processing', "updatedAt" = NOW()
WHERE id = 'order_id_here';
```

### Order Fulfillment Workflow

**Recommended Process:**
1. Order received → Status: `pending`, Payment: `paid`
2. Start preparing → Update to `processing`
3. Ready to ship → Update to `shipped`, add tracking number
4. Customer receives → Update to `delivered`

**For Cancellations:**
1. Process refund in Stripe Dashboard
2. Webhook automatically updates order to `cancelled` and payment to `refunded`

---

## Deployment Guide

### Prerequisites
- Vercel account
- PostgreSQL database (Prisma Postgres recommended)
- Stripe account with live keys
- GitHub repository (for automatic deployments)

### Step 1: Database Setup

**Option A: Prisma Postgres (Recommended)**
1. Go to https://console.prisma.io/
2. Create new project
3. Copy connection string

**Option B: Other PostgreSQL Providers**
- Supabase
- Railway
- Neon
- AWS RDS

### Step 2: Deploy to Vercel

**Via GitHub:**
1. Push code to GitHub repository
2. Go to https://vercel.com/
3. Click "New Project"
4. Import your repository
5. Configure environment variables (see below)
6. Click "Deploy"

**Via Vercel CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Step 3: Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# Stripe (LIVE KEYS)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Admin Authentication
ADMIN_PASSWORD="your_secure_password"
ADMIN_JWT_SECRET="your_32plus_character_secret"

# Application
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

### Step 4: Database Migration

After first deployment:
```bash
# Pull environment variables locally
vercel env pull .env.local

# Push database schema
npx prisma db push

# Seed database (if needed)
npx prisma db seed
```

### Step 5: Stripe Webhook Configuration

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy signing secret
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### Step 6: Verification

**Test Checklist:**
- [ ] Homepage loads correctly
- [ ] Product pages display database products
- [ ] Add to cart functionality works
- [ ] Checkout redirects to Stripe
- [ ] Complete test payment (use test card)
- [ ] Order appears in admin panel
- [ ] Admin login works
- [ ] Webhook logs show in Vercel

### Custom Domain Setup

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` to match
5. Update Stripe webhook URL to new domain

---

## Environment Variables

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` | Database provider |
| `STRIPE_SECRET_KEY` | Stripe secret API key (live) | `sk_live_abc123...` | Stripe Dashboard → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (live) | `pk_live_xyz789...` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_def456...` | Stripe Dashboard → Webhooks |
| `ADMIN_PASSWORD` | Admin panel password | `MySecurePass123!` | Create your own |
| `ADMIN_JWT_SECRET` | JWT signing secret | `64_character_hex...` | Generate with crypto |
| `NEXT_PUBLIC_BASE_URL` | Your application URL | `https://justcakes.com` | Your domain |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (local only) | `3000` |

### Environment Files

**.env.local** (Development)
```bash
DATABASE_URL="postgresql://localhost:5432/justcakes"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
ADMIN_PASSWORD="devpassword"
ADMIN_JWT_SECRET="dev_secret_key"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**.env.production** (Production - managed by Vercel)
Use Vercel Dashboard to set production variables.

### Security Notes

**Never commit:**
- `.env.local`
- `.env.production`
- `.env` files containing secrets

**Always:**
- Add `.env*` to `.gitignore`
- Use different passwords for dev/prod
- Rotate secrets if exposed
- Use Vercel's encrypted environment variables

---

## Monitoring & Logging

### Vercel Logs

**Access Logs:**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Logs" tab

**Log Types:**
- Build logs (during deployment)
- Function logs (API route execution)
- Error logs (runtime errors)

**Useful Filters:**
- Filter by status code (500 for errors)
- Filter by path (`/api/webhooks/stripe`)
- Filter by time range

### Stripe Monitoring

**Webhook Logs:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your endpoint
3. View recent deliveries
4. See response codes and retry attempts

**Payment Monitoring:**
1. Stripe Dashboard → Payments
2. View all transactions
3. Filter by status (succeeded, failed, refunded)

### Application Monitoring

**Key Metrics to Track:**
- Order creation rate
- Failed webhook deliveries
- Payment success/failure rate
- Admin login attempts
- API response times

**Recommended Tools:**
- Vercel Analytics (built-in)
- Sentry (error tracking)
- LogRocket (session replay)
- Stripe Dashboard (payment metrics)

### Error Logging

**Webhook Errors:**
```javascript
// Logged in /api/webhooks/stripe
console.error('Webhook signature verification failed:', err.message)
console.error('Error processing webhook:', error)
```

**Check Vercel Logs for:**
- Database connection errors
- Stripe API errors
- Webhook processing failures
- Authentication failures

---

## Troubleshooting

### Orders Not Appearing in Admin Panel

**Problem:** Customer completed payment but order doesn't show.

**Diagnosis:**
1. Check Stripe Dashboard → Webhooks → Your endpoint
2. Look for `checkout.session.completed` event
3. Check response code (should be 200)

**Common Causes:**
- Webhook not configured in Stripe
- Wrong webhook URL
- Incorrect `STRIPE_WEBHOOK_SECRET`
- Database connection failure

**Solution:**
```bash
# Verify webhook secret is set
vercel env ls

# Check webhook URL matches deployment
# Should be: https://your-domain.com/api/webhooks/stripe

# View logs for errors
vercel logs --follow
```

### Admin Login Not Working

**Problem:** Can't log into admin panel.

**Diagnosis:**
1. Check `ADMIN_PASSWORD` is set in Vercel
2. Verify password matches what you're typing
3. Clear browser cookies
4. Check browser console for errors

**Solution:**
```bash
# Verify environment variable
vercel env ls

# If password not set, add it
vercel env add ADMIN_PASSWORD

# Redeploy after adding env vars
vercel --prod
```

### Products Not Displaying

**Problem:** Product pages show empty or loading state.

**Diagnosis:**
1. Check `/api/products` endpoint directly
2. Verify database has products
3. Check browser console for errors

**Solution:**
```bash
# Open Prisma Studio
npx prisma studio

# Verify products exist in database
# If empty, run seed:
npx prisma db seed
```

### Checkout Redirects Failing

**Problem:** Clicking checkout button doesn't redirect to Stripe.

**Diagnosis:**
1. Check browser console for errors
2. Verify Stripe publishable key is set
3. Check `/api/checkout` endpoint in Network tab

**Solution:**
```bash
# Verify Stripe keys are set
vercel env ls

# Check keys start with correct prefix
# Test: pk_test_... / sk_test_...
# Live: pk_live_... / sk_live_...

# Ensure both keys are from same mode
```

### Database Connection Issues

**Problem:** "Can't reach database server" errors.

**Diagnosis:**
1. Check database is running
2. Verify `DATABASE_URL` is correct
3. Check database provider dashboard

**Solution:**
```bash
# Test connection locally
npx prisma db push

# If fails, verify DATABASE_URL format:
# postgresql://user:password@host:5432/database?schema=public

# Check database provider for connection issues
```

### Build Failures

**Problem:** Deployment fails during build.

**Diagnosis:**
1. Check Vercel build logs
2. Look for TypeScript errors
3. Check for missing dependencies

**Solution:**
```bash
# Test build locally first
npm run build

# If passes locally but fails on Vercel:
# - Clear build cache in Vercel
# - Redeploy
# - Check Node.js version matches (use .node-version file)
```

---

## Maintenance Tasks

### Daily Tasks

**Check New Orders:**
1. Log into `/admin/orders`
2. Review pending orders
3. Update order status as you fulfill them

**Monitor Payments:**
1. Check Stripe Dashboard for new payments
2. Review any failed payments
3. Handle customer refund requests

### Weekly Tasks

**Review Metrics:**
- Total orders and revenue
- Best-selling products
- Order completion rate
- Failed payment rate

**Check Logs:**
- Vercel function logs for errors
- Stripe webhook delivery success rate
- Any repeated error patterns

**Database Maintenance:**
- Review order backlog
- Archive old completed orders (optional)
- Check database storage usage

### Monthly Tasks

**Security Review:**
- Rotate admin password if needed
- Review access logs
- Update dependencies

**Performance Review:**
- Check API response times
- Review database query performance
- Optimize slow pages

**Content Updates:**
- Add new products
- Update product images/descriptions
- Archive discontinued products

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update Next.js
npm install next@latest

# Update all dependencies
npm update

# Update Prisma
npm install @prisma/client@latest prisma@latest
npx prisma generate

# Test after updates
npm run build
npm run dev
```

### Database Backups

**Automated Backups:**
Most database providers (Prisma Postgres, Supabase) include automatic backups.

**Manual Backup:**
```bash
# Export all data
npx prisma db pull

# Or use pg_dump for PostgreSQL
pg_dump DATABASE_URL > backup.sql
```

### Scaling Considerations

**When to Scale:**
- Order volume increases significantly
- Database queries slow down
- API response times increase
- Vercel function timeout issues

**Scaling Options:**
1. **Database:** Upgrade to higher tier with more connections
2. **Vercel:** Upgrade plan for more function executions
3. **Caching:** Add Redis for frequently accessed data
4. **CDN:** Use Vercel CDN for static assets
5. **Database Indexes:** Add indexes for slow queries

---

## Support & Resources

### Documentation Links

**Next.js:**
- Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app
- API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

**Stripe:**
- Documentation: https://stripe.com/docs
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing

**Prisma:**
- Documentation: https://www.prisma.io/docs
- Schema Reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate

**Vercel:**
- Documentation: https://vercel.com/docs
- Environment Variables: https://vercel.com/docs/environment-variables
- Deployment: https://vercel.com/docs/deployments

### Common Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx prisma studio             # Open database GUI
npx prisma db push            # Push schema changes
npx prisma db seed            # Seed database
npx prisma generate           # Generate Prisma Client

# Deployment
vercel                        # Deploy to preview
vercel --prod                 # Deploy to production
vercel logs                   # View deployment logs
vercel env ls                 # List environment variables

# Stripe CLI
stripe login                  # Authenticate
stripe listen --forward-to    # Forward webhooks locally
stripe trigger <event>        # Trigger test events
```

---

## Appendix

### File Structure Reference

```
just-cakes/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── dashboard/
│   │   ├── orders/         # Order management
│   │   └── products/       # Product management
│   ├── api/                # API routes
│   │   ├── admin/
│   │   │   └── auth/       # Admin authentication
│   │   ├── checkout/       # Stripe checkout
│   │   ├── orders/         # Orders API
│   │   ├── products/       # Products API
│   │   └── webhooks/
│   │       └── stripe/     # Stripe webhook handler
│   ├── cakes/              # Cakes product pages
│   ├── cart/               # Shopping cart
│   ├── cupcakes/           # Cupcakes product pages
│   ├── slices/             # Slices product pages
│   └── digital-products/   # Digital products pages
├── components/             # React components
│   ├── Navbar.tsx
│   ├── Product.tsx
│   └── ProductDetail.tsx
├── context/
│   ├── AdminContext.tsx    # Admin auth context
│   └── CartContext.tsx     # Shopping cart context
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── products.ts        # Product data access
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── public/                # Static assets
├── types/                 # TypeScript definitions
├── .env.local            # Local environment variables
├── package.json
└── PROD_DOCS.md          # This file
```

### Contact & Support

For technical issues with:
- **Stripe:** https://support.stripe.com/
- **Vercel:** https://vercel.com/support
- **Prisma:** https://github.com/prisma/prisma/discussions

---

**Last Updated:** December 12, 2025
**Version:** 1.0.0
**Application:** Just Cakes E-commerce Platform
