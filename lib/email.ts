import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface DigitalProduct {
  id: string
  name: string
  downloadUrl: string
  description?: string
}

export interface EmailOptions {
  to: string
  customerName: string
  orderId: string
  digitalProducts: DigitalProduct[]
}

export async function sendDigitalProductEmail({ to, customerName, orderId, digitalProducts }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Just Cakes <orders@justcakes.com>', // Replace with your verified domain
      to: [to],
      subject: `Your Digital Products from Just Cakes - Order #${orderId}`,
      html: generateDigitalProductEmailHTML({ customerName, orderId, digitalProducts }),
    })

    if (error) {
      console.error('Error sending digital product email:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('Digital product email sent successfully:', data)
    return data
  } catch (error) {
    console.error('Failed to send digital product email:', error)
    throw error
  }
}

function generateDigitalProductEmailHTML({ customerName, orderId, digitalProducts }: Omit<EmailOptions, 'to'>) {
  const productListHTML = digitalProducts
    .map(
      product => `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${product.name}</h3>
          ${product.description ? `<p style="margin: 0 0 10px 0; color: #666;">${product.description}</p>` : ''}
          <a href="${product.downloadUrl}"
             style="display: inline-block; background-color: #ff6b9d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Download ${product.name}
          </a>
        </div>
      `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Digital Products - Just Cakes</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff6b9d; margin: 0;">Just Cakes</h1>
          <p style="color: #666; margin: 5px 0;">Your Digital Products are Ready!</p>
        </div>

        <h2 style="color: #333;">Hello ${customerName}!</h2>

        <p>Thank you for your purchase! Your digital products from order <strong>#${orderId}</strong> are ready for download.</p>

        <div style="margin: 30px 0;">
          <h3 style="color: #333; margin-bottom: 20px;">Your Digital Products:</h3>
          ${productListHTML}
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h4 style="margin: 0 0 10px 0; color: #333;">Important Information:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Download links are valid for 30 days from the date of purchase</li>
            <li>You can download each product up to 3 times</li>
            <li>If you have any issues downloading, please contact us</li>
          </ul>
        </div>

        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>

        <p>Happy baking!<br>
        <strong>The Just Cakes Team</strong></p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <div style="text-align: center; color: #888; font-size: 12px;">
          <p>Just Cakes | Visit us at <a href="https://justcakes.com" style="color: #ff6b9d;">justcakes.com</a></p>
        </div>
      </body>
    </html>
  `
}