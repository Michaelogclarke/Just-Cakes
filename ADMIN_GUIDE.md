# Admin Panel Guide

## Overview

Your Just Cakes website now has a complete admin panel for managing blog posts. This guide explains how to use it and how to connect it to your database when you're ready.

## Accessing the Admin Panel

### Login
1. Navigate to `/admin` in your browser
2. Enter the admin password: **justcakes2024**
3. Click "Login"

### Changing the Password
To change the admin password, edit the `ADMIN_PASSWORD` constant in:
```
context/AdminContext.tsx (line 15)
```

**⚠️ IMPORTANT:** This is a client-side password for demo purposes only. In production, you MUST replace this with secure backend authentication.

## Admin Features

### Dashboard (`/admin/dashboard`)
- View all blog posts in a table
- See statistics (total posts, posts this month, categories)
- Quick access to view or edit any post
- Create new blog posts

### Creating a New Post (`/admin/blog/new`)
1. Click "Create New Blog Post" from the dashboard
2. Fill in all required fields:
   - **Title**: The main heading of your blog post
   - **Excerpt**: Short summary (shown on blog listing page)
   - **Content**: Full blog post content (supports markdown-style formatting)
   - **Author**: Your name
   - **Category**: Choose from predefined categories
   - **Read Time**: Estimated reading time (e.g., "5 min read")
   - **Featured Image**: Path to image (e.g., `/carousel/cake.jpg`)
3. Click "Create Blog Post"

### Editing a Post (`/admin/blog/edit/[id]`)
1. From the dashboard, click "Edit" next to any post
2. Update any fields you want to change
3. Click "Update Blog Post"

### Content Formatting Tips

The blog posts support simple markdown-style formatting:

```
## Section Heading
Use double hash for section headings

### Subsection
Use triple hash for subsections

Regular paragraphs are separated by blank lines.

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered item 1
2. Numbered item 2
```

## Connecting to a Real Database

Currently, the admin panel uses mock data from `lib/blogs.ts`. Here's how to connect it to a real database:

### Step 1: Choose Your Database
Popular options:
- **PostgreSQL** (recommended for production)
- **MongoDB** (flexible NoSQL)
- **MySQL/MariaDB**
- **Firebase/Firestore** (easy setup)
- **Supabase** (PostgreSQL with built-in auth)

### Step 2: Set Up Your Database Schema

Example PostgreSQL schema:
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  read_time VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 3: Create API Routes

Create Next.js API routes to handle database operations:

**`app/api/blog/route.ts`** (GET all posts, POST new post):
```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/database' // your database client

export async function GET() {
  try {
    const posts = await db.query('SELECT * FROM blog_posts ORDER BY date DESC')
    return NextResponse.json(posts.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const result = await db.query(
      'INSERT INTO blog_posts (title, excerpt, content, author, date, image, category, read_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [data.title, data.excerpt, data.content, data.author, data.date, data.image, data.category, data.readTime]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
```

**`app/api/blog/[id]/route.ts`** (GET, PUT, DELETE single post):
```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await db.query('SELECT * FROM blog_posts WHERE id = $1', [params.id])
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const result = await db.query(
      'UPDATE blog_posts SET title = $1, excerpt = $2, content = $3, author = $4, image = $5, category = $6, read_time = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [data.title, data.excerpt, data.content, data.author, data.image, data.category, data.readTime, params.id]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM blog_posts WHERE id = $1', [params.id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
```

### Step 4: Update lib/blogs.ts

Replace the mock functions with API calls:

```typescript
import { BlogPost } from '@/types/blog'

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch('/api/blog', { cache: 'no-store' })
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const response = await fetch(`/api/blog/${id}`, { cache: 'no-store' })
  if (!response.ok) return undefined
  return response.json()
}

export async function createBlogPost(data: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> {
  const response = await fetch('/api/blog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to create post')
  return response.json()
}

export async function updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
  const response = await fetch(`/api/blog/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to update post')
  return response.json()
}

export async function deleteBlogPost(id: number): Promise<void> {
  const response = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete post')
}
```

### Step 5: Update Admin Forms

Replace the TODO comments in:
- `app/admin/blog/new/page.tsx` (line 65)
- `app/admin/blog/edit/[id]/page.tsx` (line 97)

With actual API calls:

```typescript
// In new post form:
const newPost = await createBlogPost(formData)

// In edit form:
await updateBlogPost(parseInt(params.id), formData)
```

### Step 6: Add Proper Authentication

Replace the client-side password with backend authentication:

1. **Use NextAuth.js**: Popular authentication for Next.js
2. **Or use a service**: Auth0, Clerk, Supabase Auth
3. **Or build custom**: JWT tokens with HTTP-only cookies

Example with NextAuth.js:
```bash
npm install next-auth
```

Create `app/api/auth/[...nextauth]/route.ts` and configure providers.

## Security Checklist

Before going to production:

- [ ] Replace client-side password with secure backend authentication
- [ ] Add server-side validation for all form inputs
- [ ] Implement CSRF protection
- [ ] Add rate limiting to prevent abuse
- [ ] Use environment variables for sensitive data
- [ ] Sanitize user input to prevent XSS attacks
- [ ] Add role-based access control if needed
- [ ] Use HTTPS in production
- [ ] Enable SQL injection protection (use parameterized queries)
- [ ] Add image upload validation and limits

## Image Management

For blog post images, you have several options:

1. **Store in /public folder**: Simple, works for small sites
2. **Use a CDN**: Better performance (Cloudinary, AWS S3, Vercel Blob)
3. **Image optimization**: Use Next.js Image component

Example with image upload API route:
```typescript
// app/api/upload/route.ts
import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const path = `/public/blog/${file.name}`
  await writeFile(path, buffer)

  return NextResponse.json({ url: `/blog/${file.name}` })
}
```

## Support

If you need help:
1. Check the console for error messages
2. Review the code comments in each file
3. Consult Next.js documentation: https://nextjs.org/docs
4. Database-specific documentation for your chosen DB

## Current Status

✅ Admin login page
✅ Admin dashboard with blog post listing
✅ Create new blog post form
✅ Edit existing blog post form
✅ Protected routes (requires login)
✅ Full UI styling matching site design
⚠️ Using mock data (ready for database integration)
⚠️ Client-side auth (replace with backend auth for production)

Everything is ready for you to connect your database!
