import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Parse cart items from metadata
        const cartItems = session.metadata?.cart_items
          ? JSON.parse(session.metadata.cart_items)
          : []

        // Get delivery date from metadata
        const deliveryDate = session.metadata?.delivery_date || null

        // Create order in database
        const order = await prisma.order.create({
          data: {
            stripeSessionId: session.id,
            stripePaymentIntent: (session.payment_intent as string) || null,
            customerEmail: session.customer_details?.email || '',
            customerName: session.customer_details?.name || null,
            customerPhone: session.customer_details?.phone || null,
            shippingAddress: (session as any).shipping_details || null,
            billingAddress: session.customer_details?.address ? JSON.parse(JSON.stringify(session.customer_details.address)) : null,
            orderItems: cartItems,
            totalAmount: (session.amount_total || 0) / 100, // Convert from cents
            currency: session.currency || 'gbp',
            paymentStatus: session.payment_status === 'paid' ? 'paid' : 'unpaid',
            status: 'pending',
            deliveryDate: deliveryDate,
          },
        })

        console.log(`Order created for session ${session.id}`)

        // Send emails if Resend is configured
        if (process.env.RESEND_API_KEY) {
          const customerEmail = session.customer_details?.email
          const customerName = session.customer_details?.name || 'Valued Customer'
          const totalAmount = (session.amount_total || 0) / 100
          const shippingDetails = (session as any).shipping_details

          // Send order confirmation email to customer
          if (customerEmail) {
            try {
              await resend.emails.send({
                from: 'Just Cakes <onboarding@resend.dev>',
                to: customerEmail,
                subject: 'Order Confirmation - Just Cakes',
                html: generateOrderConfirmationHTML(
                  customerName,
                  cartItems,
                  totalAmount,
                  deliveryDate,
                  shippingDetails
                ),
                text: generateOrderConfirmationText(
                  customerName,
                  cartItems,
                  totalAmount,
                  deliveryDate,
                  shippingDetails
                ),
              })
              console.log(`Order confirmation email sent to ${customerEmail}`)
            } catch (emailError) {
              console.error('Failed to send order confirmation email:', emailError)
              // Don't fail the webhook if email fails
            }
          }

          // Send order notification email to business owner
          if (process.env.BUSINESS_EMAIL) {
            try {
              await resend.emails.send({
                from: 'Just Cakes Orders <onboarding@resend.dev>',
                to: process.env.BUSINESS_EMAIL,
                subject: `🔔 New Order - ${deliveryDate ? 'Delivery: ' + new Date(deliveryDate).toLocaleDateString('en-GB') : 'Action Required'}`,
                html: generateBusinessNotificationHTML(
                  customerName,
                  customerEmail || 'Not provided',
                  session.customer_details?.phone || null,
                  cartItems,
                  totalAmount,
                  deliveryDate,
                  shippingDetails,
                  order.id
                ),
                text: generateBusinessNotificationText(
                  customerName,
                  customerEmail || 'Not provided',
                  session.customer_details?.phone || null,
                  cartItems,
                  totalAmount,
                  deliveryDate,
                  shippingDetails,
                  order.id
                ),
              })
              console.log(`Business notification email sent to ${process.env.BUSINESS_EMAIL}`)
            } catch (emailError) {
              console.error('Failed to send business notification email:', emailError)
              // Don't fail the webhook if email fails
            }
          }
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`Payment failed: ${paymentIntent.id}`)

        // Update order if it exists
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntent: paymentIntent.id }
        })

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: 'failed' }
          })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log(`Charge refunded: ${charge.id}`)

        // Find and update order
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntent: charge.payment_intent as string }
        })

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'refunded',
              status: 'cancelled'
            }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    )
  }
}

// Email template functions
function generateOrderConfirmationHTML(
  customerName: string,
  orderItems: any[],
  totalAmount: number,
  deliveryDate: string | null,
  shippingAddress: any
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
          We've received your order and we're excited to create your delicious cakes! Here are your order details:
        </p>

        ${deliveryDate ? `
        <div style="background: #fff5f5; border-left: 4px solid #6A00AA; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="margin: 0; color: #333;">
            <strong style="color: #6A00AA;">Requested Delivery Date:</strong> ${new Date(deliveryDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        ` : ''}

        <div style="margin-bottom: 24px;">
          <h2 style="color: #6A00AA; font-size: 18px; margin-bottom: 16px; margin-top: 0;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse; background: #f8f5fc; border-radius: 8px; overflow: hidden;">
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
              <tr style="background: #f8f5fc; font-weight: bold;">
                <td colspan="3" style="padding: 16px; text-align: right; border-top: 2px solid #6A00AA;">Order Total:</td>
                <td style="padding: 16px; text-align: right; color: #6A00AA; font-size: 18px; border-top: 2px solid #6A00AA;">£${totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 24px;">
          <h2 style="color: #6A00AA; font-size: 18px; margin-bottom: 12px; margin-top: 0;">Delivery Address</h2>
          <div style="background: #f8f5fc; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; color: #333;">${formatAddress(shippingAddress)}</p>
          </div>
        </div>

        <div style="background: #f8f5fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #6A00AA; font-size: 16px; margin-top: 0; margin-bottom: 12px;">What Happens Next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555;">
            <li style="margin-bottom: 8px;">We'll start preparing your order</li>
            <li style="margin-bottom: 8px;">You'll receive updates via email</li>
            <li style="margin-bottom: 8px;">Your cakes will be delivered fresh on your requested date</li>
          </ul>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e5e5; text-align: center;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            If you have any questions, please don't hesitate to contact us.
          </p>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p style="margin: 0;">Just Cakes - Made with love, delivered with care</p>
      </div>
    </body>
    </html>
  `
}

function generateOrderConfirmationText(
  customerName: string,
  orderItems: any[],
  totalAmount: number,
  deliveryDate: string | null,
  shippingAddress: any
): string {
  const formatAddress = (address: any) => {
    if (!address) return 'N/A'
    const addr = address.address || address
    return `${addr.line1 || ''}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city || ''}, ${addr.postal_code || ''}, ${addr.country || ''}`
  }

  const itemsList = orderItems.map(item =>
    `${item.name} x${item.quantity} - £${item.price.toFixed(2)} each = £${(item.price * item.quantity).toFixed(2)}`
  ).join('\n')

  return `
ORDER CONFIRMATION - JUST CAKES

Hi ${customerName},

Thank you for your order! We're excited to create your delicious cakes.

${deliveryDate ? `REQUESTED DELIVERY DATE: ${new Date(deliveryDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` : ''}

ORDER ITEMS:
${itemsList}

ORDER TOTAL: £${totalAmount.toFixed(2)}

DELIVERY ADDRESS:
${formatAddress(shippingAddress)}

WHAT HAPPENS NEXT?
- We'll start preparing your order
- You'll receive updates via email
- Your cakes will be delivered fresh on your requested date

If you have any questions, please don't hesitate to contact us.

---
Just Cakes - Made with love, delivered with care
  `.trim()
}

// Business notification email templates
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order - Action Required</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🔔 NEW ORDER RECEIVED</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Action Required - Start Production</p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
        <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="margin: 0; color: #e65100; font-weight: bold; font-size: 16px;">
            Order #${orderNumber.slice(-8).toUpperCase()}
          </p>
        </div>

        ${deliveryDate ? `
        <div style="background: #ffebee; border: 2px solid #d32f2f; padding: 20px; margin-bottom: 24px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #d32f2f; font-weight: bold; font-size: 18px;">
            📅 DELIVERY DATE
          </p>
          <p style="margin: 8px 0 0 0; color: #b71c1c; font-size: 20px; font-weight: bold;">
            ${new Date(deliveryDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        ` : ''}

        <div style="margin-bottom: 24px;">
          <h2 style="color: #d32f2f; font-size: 18px; margin-bottom: 12px; margin-top: 0;">Customer Information</h2>
          <div style="background: #f8f5fc; padding: 16px; border-radius: 8px;">
            <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${customerName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #6A00AA;">${customerEmail}</a></p>
            <p style="margin: 0;"><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h2 style="color: #d32f2f; font-size: 18px; margin-bottom: 16px; margin-top: 0;">Items to Prepare</h2>
          <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #d32f2f;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #d32f2f;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #d32f2f;">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr style="background: #f5f5f5; font-weight: bold;">
                <td colspan="2" style="padding: 16px; text-align: right; border-top: 2px solid #d32f2f;">Order Total:</td>
                <td style="padding: 16px; text-align: right; color: #d32f2f; font-size: 18px; border-top: 2px solid #d32f2f;">£${totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 24px;">
          <h2 style="color: #d32f2f; font-size: 18px; margin-bottom: 12px; margin-top: 0;">Delivery Address</h2>
          <div style="background: #f8f5fc; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; line-height: 1.8;">${formatAddress(shippingAddress)}</p>
          </div>
        </div>

        <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
          <h3 style="color: #1565c0; font-size: 16px; margin-top: 0; margin-bottom: 8px;">Next Steps:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555;">
            <li style="margin-bottom: 8px;">Review the order details</li>
            <li style="margin-bottom: 8px;">Begin cake preparation according to delivery date</li>
            <li style="margin-bottom: 8px;">Contact customer if there are any questions</li>
            <li>Update order status in admin dashboard when complete</li>
          </ul>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e5e5;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            <strong>Order received:</strong> ${new Date().toLocaleString('en-GB', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}
          </p>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p style="margin: 0;">Just Cakes - Order Management System</p>
      </div>
    </body>
    </html>
  `
}

function generateBusinessNotificationText(
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
    return `${addr.line1 || ''}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city || ''}, ${addr.postal_code || ''}, ${addr.country || ''}`
  }

  const itemsList = orderItems.map(item =>
    `${item.name} x${item.quantity} - £${item.price.toFixed(2)} each`
  ).join('\n')

  return `
🔔 NEW ORDER RECEIVED - ACTION REQUIRED

Order #${orderNumber.slice(-8).toUpperCase()}

${deliveryDate ? `📅 DELIVERY DATE: ${new Date(deliveryDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` : ''}

CUSTOMER INFORMATION:
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone || 'Not provided'}

ITEMS TO PREPARE:
${itemsList}

ORDER TOTAL: £${totalAmount.toFixed(2)}

DELIVERY ADDRESS:
${formatAddress(shippingAddress)}

NEXT STEPS:
- Review the order details
- Begin cake preparation according to delivery date
- Contact customer if there are any questions
- Update order status in admin dashboard when complete

---
Order received: ${new Date().toLocaleString('en-GB')}
Just Cakes - Order Management System
  `.trim()
}
