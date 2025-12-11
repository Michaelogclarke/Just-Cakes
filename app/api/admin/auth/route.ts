import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
)

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Check password against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || 'justcakes2024'

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    // Create response with httpOnly cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// GET /api/admin/auth - Verify authentication
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify token
    await jwtVerify(token, secret)

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}
