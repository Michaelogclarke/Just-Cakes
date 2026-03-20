import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    console.log(' Fetching session details for:', sessionId)

    // Get session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details']
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    console.log(' Session retrieved successfully')

    // Extract order details
    const customerEmail = session.customer_details?.email
    const customerName = session.customer_details?.name || 'Valued Customer'
    const totalAmount = (session.amount_total || 0) / 100
    const deliveryDate = session.metadata?.delivery_date || null
    const shippingDetails = (session as any).shipping_details

    // Parse cart items from metadata
    const cartItems = session.metadata?.cart_items
      ? JSON.parse(session.metadata.cart_items)
      : []

    // Fetch digitalAssetUrl from DB for any digital items
    const digitalItemIds = cartItems
      .filter((item: any) => item.type === 'digital')
      .map((item: any) => String(item.id))

    const digitalProducts: { name: string; downloadUrl: string }[] = []
    if (digitalItemIds.length > 0) {
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: digitalItemIds } },
        select: { id: true, name: true, digitalAssetUrl: true }
      })
      dbProducts.forEach(p => {
        if (p.digitalAssetUrl) {
          digitalProducts.push({ name: p.name, downloadUrl: p.digitalAssetUrl })
        }
      })
    }

    console.log(' Order details:', {
      customerEmail,
      customerName,
      totalAmount,
      itemCount: cartItems.length,
      digitalProducts
    })

    // Save order to DB (upsert to avoid duplicates if success page loads twice)
    try {
      await prisma.order.upsert({
        where: { stripeSessionId: sessionId },
        update: {},
        create: {
          stripeSessionId: sessionId,
          stripePaymentIntent: (session.payment_intent as string) || null,
          customerEmail: customerEmail || '',
          customerName: customerName,
          customerPhone: session.customer_details?.phone || null,
          shippingAddress: (session as any).shipping_details || null,
          billingAddress: session.customer_details?.address ? JSON.parse(JSON.stringify(session.customer_details.address)) : null,
          orderItems: cartItems,
          totalAmount,
          currency: session.currency || 'gbp',
          paymentStatus: session.payment_status === 'paid' ? 'paid' : 'unpaid',
          status: 'pending',
          deliveryDate: deliveryDate,
        }
      })
      console.log('Order saved to DB for session:', sessionId)
    } catch (dbError) {
      console.error('Failed to save order to DB:', dbError)
      // Don't fail the request if DB save fails — emails still go out
    }

    const emailResults = []

    // Send customer confirmation email
    if (customerEmail) {
      console.log(` Sending confirmation email to: ${customerEmail}`)
      try {
        const customerEmailResult = await resend.emails.send({
          from: 'Just Cakes <orders@justcakesbakery.com>',
          to: customerEmail,
          subject: 'Order Confirmation - Just Cakes',
          html: generateOrderConfirmationHTML(
            customerName,
            cartItems,
            totalAmount,
            deliveryDate,
            shippingDetails,
            digitalProducts
          )
        })

        console.log('Customer email sent:', customerEmailResult.data?.id)
        emailResults.push({ type: 'customer', success: true, id: customerEmailResult.data?.id })
      } catch (error) {
        console.error(' Failed to send customer email:', error)
        emailResults.push({ type: 'customer', success: false, error: error })
      }
    }

    // Send business notification email
    if (process.env.BUSINESS_EMAIL) {
      console.log(` Sending business notification to: ${process.env.BUSINESS_EMAIL}`)
      try {
        const businessEmailResult = await resend.emails.send({
          from: 'Just Cakes Orders <justcakesbakery.com@justcakesbakery.com>',
          to: process.env.BUSINESS_EMAIL,
          subject: ` New Order - ${deliveryDate ? 'Delivery: ' + new Date(deliveryDate).toLocaleDateString('en-GB') : 'Action Required'}`,
          html: generateBusinessNotificationHTML(
            customerName,
            customerEmail || 'Not provided',
            session.customer_details?.phone || null,
            cartItems,
            totalAmount,
            deliveryDate,
            shippingDetails,
            sessionId
          )
        })

        console.log('✅ Business email sent:', businessEmailResult.data?.id)
        emailResults.push({ type: 'business', success: true, id: businessEmailResult.data?.id })
      } catch (error) {
        console.error('❌ Failed to send business email:', error)
        emailResults.push({ type: 'business', success: false, error: error })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Emails processed',
      results: emailResults
    })

  } catch (error) {
    console.error('❌ Error in send-order-emails:', error)
    return NextResponse.json(
      { error: 'Failed to send emails', details: error },
      { status: 500 }
    )
  }
}

// Email template functions (same as webhook)
function generateOrderConfirmationHTML(
  customerName: string,
  orderItems: any[],
  totalAmount: number,
  deliveryDate: string | null,
  shippingAddress: any,
  digitalProducts: { name: string; downloadUrl: string }[] = []
): string {
  const formatAddress = (address: any) => {
    if (!address) return 'N/A'
    const addr = address.address || address
    return `${addr.line1 || ''}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city || ''}, ${addr.postal_code || ''}, ${addr.country || ''}`
  }

  const itemsHTML = orderItems.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">£${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">£${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Just Cakes</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #6A00AA 0%, #8300d4 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Order Confirmation</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Thank you for your order!</p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; color: #555; margin-bottom: 24px; margin-top: 0;">
          Hi ${customerName},<br><br>
          We've received your order and we're excited to create your delicious cakes!
        </p>

        ${deliveryDate ? `
        <div style="background: #fff5f5; border-left: 4px solid #6A00AA; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="margin: 0; color: #333;">
            <strong style="color: #6A00AA;">Requested Delivery Date:</strong> ${new Date(deliveryDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        ` : ''}

        <div style="margin-bottom: 24px;">
          <h2 style="color: #6A00AA; font-size: 18px; margin-bottom: 16px;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #6A00AA; color: white;">
                <th style="padding: 12px; text-align: left;">Item</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr style="font-weight: bold;">
                <td colspan="3" style="padding: 16px; text-align: right;">Order Total:</td>
                <td style="padding: 16px; text-align: right; color: #6A00AA;">£${totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${digitalProducts.length > 0 ? `
        <div style="background: #f0f7ff; border-left: 4px solid #6A00AA; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
          <h3 style="color: #6A00AA; font-size: 16px; margin-top: 0; margin-bottom: 12px;">Your Digital Downloads</h3>
          ${digitalProducts.map(p => `
            <div style="margin-bottom: 12px;">
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #333;">${p.name}</p>
              <p style="margin: 0; color: #555;">Download link: <a href="${p.downloadUrl}" style="color: #6A00AA;">${p.downloadUrl}</a></p>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div style="background: #f8f5fc; padding: 20px; border-radius: 8px;">
          <p style="margin: 0; text-align: center; color: #6A00AA; font-weight: bold;">
            Thank you for choosing Just Cakes!
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateBusinessNotificationHTML(
  customerName: string,
  customerEmail: string,
  customerPhone: string | null,
  orderItems: any[],
  totalAmount: number,
  deliveryDate: string | null,
  shippingAddress: any,
  orderNumber: string
): string {
  const formatAddress = (address: any) => {
    if (!address) return 'N/A'
    const addr = address.address || address
    return `${addr.line1 || ''}${addr.line2 ? '<br>' + addr.line2 : ''}<br>${addr.city || ''}, ${addr.postal_code || ''}<br>${addr.country || ''}`
  }

  const itemsHTML = orderItems.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;"><strong>${item.name}</strong></td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">£${item.price.toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title> New Order Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #d32f2f; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0;"> NEW ORDER RECEIVED</h1>
      </div>

      <div style="background: white; padding: 20px; border: 1px solid #ddd;">
        ${deliveryDate ? `
        <div style="background: #ffebee; border: 2px solid #d32f2f; padding: 15px; margin-bottom: 20px; text-align: center;">
          <h2 style="color: #d32f2f; margin: 0;"> DELIVERY DATE: ${new Date(deliveryDate).toLocaleDateString('en-GB')}</h2>
        </div>
        ` : ''}

        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>

        <h3>Items to Prepare:</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Product</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
            <tr style="font-weight: bold; background: #f9f9f9;">
              <td colspan="2" style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total:</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">£${totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <h3>Delivery Address:</h3>
        <p>${formatAddress(shippingAddress)}</p>

        <div style="background: #e3f2fd; padding: 15px; margin-top: 20px;">
          <p style="margin: 0;"><strong>Order ID:</strong> ${orderNumber.slice(-10)}</p>
          <p style="margin: 5px 0 0 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `
}
