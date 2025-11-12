# PostgreSQL Database Setup with Prisma

This document outlines the complete PostgreSQL database setup for the Just Cakes e-commerce application using Prisma ORM.

## Overview

We migrated from a mock in-memory database to PostgreSQL with Prisma ORM to enable persistent data storage and prepare for production deployment on Vercel.

## Technology Stack

- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Prisma
- **Hosting**: Neon (recommended for Vercel deployments)

## Installation Steps

### 1. Install Dependencies

```bash
npm install prisma @prisma/client --save
npm install tsx --save-dev
```

**Dependencies Added**:
- `@prisma/client@^6.19.0` - Prisma client for database queries
- `prisma@^6.19.0` - Prisma CLI and development tools
- `tsx@^4.20.6` - TypeScript execution for seed scripts

### 2. Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment variables file

## Database Schema

### Models Created

Located in: `prisma/schema.prisma`

#### Product Model
```prisma
model Product {
  id          Int         @id @default(autoincrement())
  name        String
  description String
  price       Float
  image       String
  category    String
  available   Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]

  @@map("products")
}
```

#### Customer Model
```prisma
model Customer {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]

  @@map("customers")
}
```

#### Order Model
```prisma
model Order {
  id          Int         @id @default(autoincrement())
  customerId  Int
  customer    Customer    @relation(fields: [customerId], references: [id])
  status      String      @default("pending")
  totalPrice  Float
  totalItems  Int
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]

  @@map("orders")
}
```

#### OrderItem Model
```prisma
model OrderItem {
  id        Int      @id @default(autoincrement())
  orderId   Int
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
  createdAt DateTime @default(now())

  @@map("order_items")
}
```

## File Structure

### Created Files

1. **`prisma/schema.prisma`** - Database schema
2. **`prisma/seed.ts`** - Database seeding script
3. **`lib/prisma.ts`** - Prisma client singleton
4. **`.env`** - Environment variables (DATABASE_URL)
5. **`.env.example`** - Example environment file

### Modified Files

1. **`lib/products.ts`** - Updated to use Prisma instead of mock data
2. **`package.json`** - Added database scripts

## Prisma Client Setup

**File**: `lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Why this pattern?**
- Prevents multiple Prisma Client instances in development (hot reloading)
- Optimizes connection pooling
- Recommended by Prisma for Next.js applications

## Database Seed Script

**File**: `prisma/seed.ts`

Seeds the database with 6 initial cake products:
- Chocolate Delight Cake ($45.99)
- Vanilla Dream Cake ($39.99)
- Red Velvet Supreme ($49.99)
- Lemon Bliss Cake ($42.99) - Out of stock
- Strawberry Shortcake ($44.99)
- Carrot Cake ($43.99)

## Updated Product Data Layer

**File**: `lib/products.ts`

### Before (Mock Data)
```typescript
export const products: Product[] = [...]

export async function getAllProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return products
}
```

### After (PostgreSQL)
```typescript
import { prisma } from './prisma'

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return products
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { id }
  })
  return product || undefined
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' }
  })
  return products
}
```

## NPM Scripts Added

**File**: `package.json`

```json
"scripts": {
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:seed": "tsx prisma/seed.ts",
  "db:studio": "prisma studio"
},
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

### Script Descriptions

- **`npm run db:generate`** - Generates Prisma Client from schema
- **`npm run db:migrate`** - Creates and runs database migrations
- **`npm run db:seed`** - Seeds database with initial data
- **`npm run db:studio`** - Opens Prisma Studio (visual database editor)

## Setting Up Neon Database

### Step 1: Create Neon Account

1. Visit https://neon.tech
2. Sign up for free account
3. Create new project: "just-cakes"
4. Select region closest to your users

### Step 2: Get Connection String

1. Navigate to project dashboard
2. Click "Connection String"
3. Copy the full connection string
4. Should look like:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Configure Environment

Update `.env` file:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Security Note**: Never commit `.env` to version control!

## Database Setup Commands

Run these commands in order:

```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Create database tables
npm run db:migrate
# Name the migration: "init" or "initial_schema"

# 3. Seed with initial products
npm run db:seed

# 4. View data in Prisma Studio (optional)
npm run db:studio
```

## Vercel Deployment Setup

### Environment Variables

In Vercel project settings, add:

**Key**: `DATABASE_URL`
**Value**: Your Neon connection string

### Build Settings

Vercel will automatically:
- Run `prisma generate` during build
- Use the `DATABASE_URL` environment variable
- Connect to your Neon database

### Important Notes

1. **No migrations in production**: Migrations should be run manually or via CI/CD
2. **Connection pooling**: Neon handles this automatically
3. **Serverless-friendly**: Neon is optimized for serverless deployments

## Benefits of PostgreSQL + Prisma

### PostgreSQL Benefits
- ✅ Persistent data storage
- ✅ ACID compliance
- ✅ Relational data modeling
- ✅ Scalable for production
- ✅ Rich query capabilities

### Prisma Benefits
- ✅ Type-safe database queries
- ✅ Auto-generated TypeScript types
- ✅ Database migrations
- ✅ Visual database editor (Prisma Studio)
- ✅ Excellent Next.js integration

### Neon Benefits
- ✅ Serverless PostgreSQL
- ✅ Generous free tier
- ✅ Perfect for Vercel hosting
- ✅ Auto-scaling
- ✅ Instant database branching

## Troubleshooting

### "Can't reach database server"
- Check DATABASE_URL is correct in `.env`
- Ensure Neon database is active
- Verify network connectivity

### "Prisma Client not found"
- Run `npm run db:generate`
- Restart your dev server

### Migration issues
- Check database connection
- Ensure schema.prisma is valid
- Review migration history: `npx prisma migrate status`

### Seed script errors
- Verify DATABASE_URL is set
- Check that migrations have been run
- Review seed.ts for syntax errors

## Next Steps

1. ✅ Set up Neon database account
2. ✅ Configure DATABASE_URL
3. ✅ Run migrations
4. ✅ Seed database
5. ⬜ Implement order management system
6. ⬜ Add customer authentication
7. ⬜ Build checkout flow

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Vercel + Prisma Guide](https://vercel.com/guides/prisma)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For issues or questions:
1. Check Prisma logs: `npx prisma validate`
2. Review Neon dashboard for connection issues
3. Consult Next.js + Prisma integration docs
