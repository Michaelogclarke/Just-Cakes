import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match BlogPost interface (with numeric id and date string)
    const transformedBlogs = blogs.map((blog, index) => ({
      id: blog.id.length > 10 ? index + 1 : parseInt(blog.id), // Use index for cuid, parse for numeric strings
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: blog.image,
      readTime: blog.readTime,
      date: blog.createdAt.toISOString().split('T')[0]
    }))

    return NextResponse.json(transformedBlogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'author', 'category', 'image', 'readTime']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new blog post in database
    const newBlog = await prisma.blog.create({
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author,
        category: body.category,
        image: body.image,
        readTime: body.readTime,
        published: true
      }
    })

    // Transform to match BlogPost interface
    const transformedBlog = {
      id: newBlog.id.length > 10 ? Date.now() : parseInt(newBlog.id), // Use timestamp for cuid, parse for numeric strings
      title: newBlog.title,
      excerpt: newBlog.excerpt,
      content: newBlog.content,
      author: newBlog.author,
      category: newBlog.category,
      image: newBlog.image,
      readTime: newBlog.readTime,
      date: newBlog.createdAt.toISOString().split('T')[0]
    }

    return NextResponse.json(transformedBlog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}