import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with placeholder if env var is missing (for build)
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

interface QuoteRequestData {
  occasion: string
  servings: number
  allergies: string[]
  description: string
  contact: string
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: QuoteRequestData = await req.json()
    const { occasion, servings, allergies, description } = body

    // Validate required fields
    if (!occasion || !servings || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate servings
    if (servings < 1 || servings > 500) {
      return NextResponse.json(
        { error: 'Servings must be between 1 and 500' },
        { status: 400 }
      )
    }

    // Validate description length
    if (description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Check for required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    if (!process.env.BUSINESS_EMAIL) {
      console.error('BUSINESS_EMAIL is not set')
      return NextResponse.json(
        { error: 'Business email is not configured' },
        { status: 500 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Just Cakes <onboarding@resend.dev>',
      to: process.env.BUSINESS_EMAIL,
      subject: `New Custom Cupcake Quote Request - ${formatOccasion(occasion)}`,
      html: generateEmailHTML(body),
      text: generateEmailText(body),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: 'Quote request sent successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatOccasion(occasion: string): string {
  const map: Record<string, string> = {
    'birthday': 'Birthday',
    'wedding': 'Wedding',
    'anniversary': 'Anniversary',
    'graduation': 'Graduation',
    'baby-shower': 'Baby Shower',
    'bridal-shower': 'Bridal Shower',
    'corporate': 'Corporate Event',
    'celebration': 'Celebration',
    'other': 'Other'
  }
  return map[occasion] || occasion
}

function generateEmailHTML(data: QuoteRequestData): string {
  const { occasion, servings, allergies, description, contact } = data

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Cupcake Quote Request</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #6A00AA 0%, #8300d4 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">New Custom Cupcake Quote Request</h1>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; color: #555; margin-bottom: 24px; margin-top: 0;">
          You've received a new custom Cupcake quote request. Details below:
        </p>

        <div style="background: #f8f5fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                <strong style="color: #6A00AA;">Occasion:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">
                ${formatOccasion(occasion)}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                <strong style="color: #6A00AA;">Servings:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">
                ${servings}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0;">
                <strong style="color: #6A00AA;">Dietary Restrictions:</strong>
              </td>
              <td style="padding: 12px 0; text-align: right;">
                ${allergies.length > 0 ? allergies.join(', ') : 'None'}
              </td>
            </tr> 
            <tr>
              <td style="padding: 12px 0;">
                <strong style="color: #6A00AA;">Contact Number:</strong>
              </td>
              <td style="padding: 12px 0; text-align: right;">
                ${contact}
              </td>
           </tr>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #6A00AA; font-size: 18px; margin-bottom: 12px; margin-top: 0;">Cupcake Description:</h2>
          <div style="background: white; border: 1px solid #e5e5e5; border-left: 4px solid #6A00AA; padding: 16px; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap; color: #333;">${description}</p>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e5e5;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}
          </p>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p style="margin: 0;">Just Cakes - Custom Cupcake Orders</p>
      </div>
    </body>
    </html>
  `
}

function generateEmailText(data: QuoteRequestData): string {
  const { occasion, servings, allergies, description, contact } = data

  return `
NEW CUSTOM Cupcake QUOTE REQUEST

Occasion: ${formatOccasion(occasion)}
Servings: ${servings}
Dietary Restrictions: ${allergies.length > 0 ? allergies.join(', ') : 'None'}
Contact: ${contact}

Cupcake Description:
${description}

---
Submitted: ${new Date().toLocaleString()}
  `.trim()
}
