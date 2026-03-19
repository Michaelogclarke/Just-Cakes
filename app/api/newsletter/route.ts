import { NextRequest, NextResponse } from 'next/server'
import { BrevoClient } from '@getbrevo/brevo'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    if (!process.env.BREVO_API_KEY) {
      return NextResponse.json(
        { error: 'Brevo API key not configured' },
        { status: 500 }
      )
    }

    const client = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY,
    })

    await client.contacts.createContact({
      email: email,
      listIds: [3], // Newsletter list ID
      updateEnabled: true // Update if contact already exists
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Newsletter signup error:', error)

    // Handle duplicate contact (already subscribed)
    if (error.response?.status === 400) {
      return NextResponse.json({ success: true }) // Don't reveal if already subscribed
    }

    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
