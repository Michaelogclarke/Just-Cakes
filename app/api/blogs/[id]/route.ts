import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    const blog = blogs[parseInt(id) - 1]
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: parseInt(id),
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: blog.image,
      readTime: blog.readTime,
      date: blog.createdAt.toISOString().split('T')[0],
    })
  } catch (error) {
    console.error('Error fetching blog by ID:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    const blog = blogs[parseInt(id) - 1]
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    const updated = await prisma.blog.update({
      where: { id: blog.id },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author,
        category: body.category,
        image: body.image,
        readTime: body.readTime,
      },
    })

    return NextResponse.json({
      id: parseInt(id),
      title: updated.title,
      excerpt: updated.excerpt,
      content: updated.content,
      author: updated.author,
      category: updated.category,
      image: updated.image,
      readTime: updated.readTime,
      date: updated.createdAt.toISOString().split('T')[0],
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    const blog = blogs[parseInt(id) - 1]
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    await prisma.blog.delete({ where: { id: blog.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
