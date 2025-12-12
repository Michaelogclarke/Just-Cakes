# Production Deployment Guide

## Required Environment Variables

Add these to your Vercel project (Settings → Environment Variables):

### 1. Stripe Configuration (CRITICAL)
```bash
# Production Stripe Keys (replace test keys)
STRIPE_SECRET_KEY="sk_live_your_live_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_live_key_here"

# Webhook Secret (get from Stripe Dashboard → Webhooks)
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

**How to get production Stripe keys:**
1. Go to https://dashboard.stripe.com/
2. Toggle from "Test mode" to "Live mode" (top right)
3. Go to Developers → API Keys
4. Copy your **Live** keys (NOT test keys)

### 2. Database Configuration
```bash
DATABASE_URL="your_production_database_url"
```

Your current Prisma Postgres URL will work, but consider upgrading for production traffic.

### 3. Admin Security
```bash
# Change from default password!
ADMIN_PASSWORD="your_secure_password_here"

# JWT secret for admin sessions (generate a random string)
ADMIN_JWT_SECRET="your_super_secret_jwt_key_minimum_32_characters"
```

**Generate a secure JWT secret:**
```bash
# Run this in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Base URL
```bash
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

---

## Stripe Webhook Setup

### Step 1: Add Webhook Endpoint in Stripe Dashboard

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `checkout.session.completed` (REQUIRED)
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

5. Click "Add endpoint"

### Step 2: Copy Webhook Signing Secret

After creating the endpoint, Stripe will show you a webhook signing secret:
```
whsec_...
```

Add this to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 3: Test Webhook (Optional)

Test locally using Stripe CLI:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger a test event
stripe trigger checkout.session.completed
```

---

## Database Migration

After deploying, run the database migration to create the Orders table:

```bash
# Via Vercel CLI
vercel env pull .env.production
npx prisma db push

# OR let it run automatically on first deploy
```

---

## Security Checklist

### ✅ Before Going Live:

- [ ] Changed `ADMIN_PASSWORD` from default `justcakes2024`
- [ ] Generated and set `ADMIN_JWT_SECRET` (32+ characters)
- [ ] Switched to Stripe **Live mode** keys (not test keys)
- [ ] Added Stripe webhook endpoint with production URL
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Verified all product images exist in `/public` folder
- [ ] Tested checkout flow end-to-end
- [ ] Database migration completed (Orders table created)

### ⚠️ Current Security Notes:

**Admin Authentication:**
- Now uses server-side JWT with httpOnly cookies
- Password stored in environment variable (not in client code)
- Session expires after 24 hours
- Still a single password (consider adding user accounts later)

**Webhook Security:**
- Signature verification prevents fake webhooks
- Only processes events from Stripe
- Errors are logged but don't expose sensitive data

---

## Testing the Setup

### 1. Test Admin Login
1. Go to `https://your-domain.com/admin`
2. Enter your new admin password
3. Should redirect to admin dashboard
4. Try logging out and back in

### 2. Test Order Creation
1. Add items to cart
2. Go to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete payment
5. Check Admin → Orders to see the order appear

### 3. Test Webhook
1. Create a real order (or test order)
2. Check Vercel logs for webhook events
3. Verify order appears in admin panel
4. Check Stripe Dashboard → Webhooks for delivery status

---

## Admin Panel Access

After deployment, access your admin panel:

**URL:** `https://your-domain.com/admin`

**Features:**
- Dashboard: Overview of products and orders
- Products: View/manage all products
- Orders: View customer orders with details
- Blog: Manage blog posts (if enabled)

**Admin Pages:**
- `/admin` - Login page
- `/admin/dashboard` - Main dashboard
- `/admin/orders` - Orders management (NEW!)
- `/admin/products` - Product management

---

## Viewing Orders

Orders will automatically appear in the admin panel after successful Stripe payments.

**Order Information Captured:**
- Customer email and name
- Shipping address
- Order items with quantities
- Total amount paid
- Payment status
- Order status (pending, processing, shipped, etc.)
- Stripe session ID for reference

**You can:**
- View all orders sorted by date
- Filter by status (pending, processing, shipped, etc.)
- See customer shipping addresses
- Track which products were ordered
- Update order status as you fulfill them

---

## Troubleshooting

### Orders Not Appearing

**Problem:** Customer paid but order doesn't show in admin panel

**Solutions:**
1. Check Stripe Dashboard → Webhooks → Events
   - Is webhook being delivered?
   - Any errors shown?

2. Check Vercel Logs
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for webhook errors

3. Verify `STRIPE_WEBHOOK_SECRET` is set correctly

4. Make sure webhook URL matches exactly:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```

### Admin Login Not Working

**Problem:** Can't log into admin panel

**Solutions:**
1. Check environment variables are set in Vercel
2. Verify `ADMIN_PASSWORD` matches what you're typing
3. Clear browser cookies
4. Check Vercel logs for authentication errors

### Database Connection Issues

**Problem:** "Can't reach database server"

**Solutions:**
1. Verify `DATABASE_URL` is set in Vercel
2. Check database is running (Prisma Postgres dashboard)
3. Wait a few minutes after deployment for connections to establish

---

## Monitoring and Maintenance

### Regular Tasks:

**Daily:**
- Check new orders in admin panel
- Update order statuses as you fulfill them

**Weekly:**
- Review Stripe Dashboard for payment issues
- Check Vercel logs for errors
- Monitor webhook delivery success rate

**Monthly:**
- Review total revenue in Stripe
- Analyze best-selling products
- Check for failed payments or refunds

---

## Next Steps After Launch

### Immediate Improvements:
1. Add email confirmations for orders
2. Add order tracking numbers
3. Set up automated inventory management

### Future Enhancements:
1. Customer accounts/login
2. Order history for customers
3. Product reviews
4. Advanced analytics
5. Newsletter signup
6. Multi-admin user support

---

## Need Help?

**Stripe Documentation:**
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing

**Vercel Documentation:**
- Environment Variables: https://vercel.com/docs/environment-variables
- Deployment: https://vercel.com/docs/deployments

**Prisma Documentation:**
- Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate
