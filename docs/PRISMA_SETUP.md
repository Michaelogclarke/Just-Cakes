# Prisma Database Setup Guide

## Overview

This project uses Prisma as the ORM (Object-Relational Mapping) tool to interact with a PostgreSQL database. Prisma provides type-safe database queries and automatic TypeScript type generation.

## What is Prisma?

Prisma is a next-generation ORM that consists of:
- **Prisma Client**: Auto-generated and type-safe query builder
- **Prisma Migrate**: Declarative data modeling and migration system
- **Prisma Studio**: GUI to view and edit data in your database

## Database Configuration

### Environment Variables

Database connection is configured in `.env`:

```env
DATABASE_URL="postgres://[user]:[password]@db.prisma.io:5432/postgres?sslmode=require"
```

**Important**: Never commit `.env` to version control. It contains sensitive credentials.

### Prisma Schema File

Location: `prisma/schema.prisma`

This file defines:
1. **Generator**: How to generate the Prisma Client
2. **Datasource**: Database connection details
3. **Models**: Database table structures

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  imageUrl    String?
  category    String
  available   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Understanding the Product Model

### Field Types

- `String`: Text data (required by default)
- `String?`: Optional text (the `?` means nullable)
- `Float`: Decimal numbers (for prices)
- `Boolean`: True/false values
- `DateTime`: Timestamp data

### Field Attributes

- `@id`: Marks this field as the primary key
- `@default(cuid())`: Auto-generates a unique ID
- `@default(true)`: Sets default value to true
- `@default(now())`: Sets to current timestamp on creation
- `@updatedAt`: Auto-updates timestamp on record modification

### Why Custom Output Path?

```prisma
output = "../lib/generated/prisma"
```

The custom output path (`lib/generated/prisma`) keeps generated files organized and separate from `node_modules`. This makes it easier to:
- Track generated code in your project structure
- Ensure consistent imports across the codebase
- Avoid conflicts with global Prisma installations

## Prisma Client Singleton

Location: `lib/prisma.ts`

```typescript
import { PrismaClient } from '@/lib/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Why Use a Singleton?

In development, Next.js hot-reloads modules, which could create multiple Prisma Client instances and exhaust database connections. The singleton pattern:
- Reuses the same client instance across hot reloads
- Prevents connection pool exhaustion
- Only applies in development (production creates one instance anyway)

## Common Prisma Commands

### Generate Prisma Client

After changing the schema, regenerate the client:

```bash
npx prisma generate
```

This creates type-safe TypeScript types based on your models.

### Push Schema to Database

Update the database without migrations:

```bash
npx prisma db push
```

**Use for**: Development, prototyping, or rapid schema changes.

**Note**: This doesn't create migration files.

### Create a Migration

For production-ready schema changes:

```bash
npx prisma migrate dev --name description_of_change
```

**Use for**: Production deployments, version control, and rollback capabilities.

### Open Prisma Studio

Visual database editor:

```bash
npx prisma studio
```

Opens at `http://localhost:5555` to view/edit records in a GUI.

### Reset Database

**Warning**: Deletes all data!

```bash
npx prisma migrate reset
```

## Using Prisma in Your Code

### Basic Queries

```typescript
import { prisma } from '@/lib/prisma'

// Find all products
const products = await prisma.product.findMany()

// Find one product by ID
const product = await prisma.product.findUnique({
  where: { id: 'abc123' }
})

// Find with filters
const availableProducts = await prisma.product.findMany({
  where: { available: true },
  orderBy: { createdAt: 'desc' }
})

// Create a product
const newProduct = await prisma.product.create({
  data: {
    name: 'Chocolate Cake',
    description: 'Delicious chocolate cake',
    price: 25.99,
    category: 'Birthday',
    imageUrl: '/images/chocolate-cake.jpg'
  }
})

// Update a product
const updated = await prisma.product.update({
  where: { id: 'abc123' },
  data: { price: 29.99 }
})

// Delete a product
const deleted = await prisma.product.delete({
  where: { id: 'abc123' }
})
```

### Example: API Route

Location: `app/api/products/route.ts`

```typescript
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        imageUrl: body.imageUrl,
      }
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
```

## Adding New Models

1. **Edit schema** (`prisma/schema.prisma`):

```prisma
model Order {
  id         String   @id @default(cuid())
  customerEmail String
  total      Float
  status     String   @default("pending")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

2. **Generate client**:

```bash
npx prisma generate
```

3. **Push to database**:

```bash
npx prisma db push
```

4. **Use in code**:

```typescript
const order = await prisma.order.create({
  data: {
    customerEmail: 'customer@example.com',
    total: 49.99
  }
})
```

## Adding Relationships

Example: Orders with OrderItems

```prisma
model Order {
  id         String      @id @default(cuid())
  customerEmail String
  total      Float
  status     String      @default("pending")
  items      OrderItem[] // One-to-many relationship
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  quantity  Int
  price     Float
}
```

Query with relations:

```typescript
const orderWithItems = await prisma.order.findUnique({
  where: { id: 'order123' },
  include: { items: true } // Include related items
})
```

## Troubleshooting

### "Cannot find module '@prisma/client'"

**Solution**: Run `npx prisma generate`

### "Cannot find module '@/lib/generated/prisma'"

**Check**:
1. Schema has correct output path
2. You've run `npx prisma generate`
3. Import matches output location

### Type errors after schema changes

**Solution**:
1. `npx prisma generate` (regenerate types)
2. Restart TypeScript server in your editor

### Database connection errors

**Check**:
1. `.env` file exists
2. `DATABASE_URL` is set correctly
3. Database is accessible
4. Connection string includes `?sslmode=require` for Prisma Postgres

## Best Practices

1. **Always generate after schema changes**: Run `npx prisma generate` after editing `schema.prisma`

2. **Use transactions for multiple operations**:
```typescript
await prisma.$transaction([
  prisma.product.update({ where: { id: '1' }, data: { available: false } }),
  prisma.order.create({ data: { /* ... */ } })
])
```

3. **Handle errors gracefully**: Always wrap database queries in try-catch blocks

4. **Use TypeScript types**: Prisma generates types automatically - use them!

```typescript
import { Product } from '@/lib/generated/prisma'

function processProduct(product: Product) {
  // TypeScript knows all Product fields
}
```

5. **Don't commit generated files**: Add to `.gitignore`:
```
/lib/generated/
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Next.js + Prisma](https://www.prisma.io/nextjs)
