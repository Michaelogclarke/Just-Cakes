import { DigitalProduct } from './email'

export interface OrderItem {
  id: string
  name: string
  type: 'physical' | 'digital'
  digitalAssetUrl?: string
  description?: string
}

export interface Order {
  id: string
  customerName: string | null
  customerEmail: string
  orderItems: any // JSON field from Prisma
  status: string
}

/**
 * Process order fulfillment - sends digital products via email if the order contains any
 */
export async function processOrderFulfillment(order: Order): Promise<boolean> {
  try {
    // Parse orderItems JSON and filter for digital products
    const items = Array.isArray(order.orderItems) ? order.orderItems : []
    const digitalProducts = items
      .filter(item => item.type === 'digital' && item.digitalAssetUrl)
      .map(item => ({
        id: item.id,
        name: item.name,
        downloadUrl: item.digitalAssetUrl!,
        description: item.description
      }) as DigitalProduct)

    // If no digital products, return early
    if (digitalProducts.length === 0) {
      console.log(`Order ${order.id} contains no digital products`)
      return true
    }

    // Send digital products email
    const response = await fetch('/api/send-digital-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: order.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName || 'Valued Customer',
        digitalProducts
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Email API error: ${errorData.error || 'Unknown error'}`)
    }

    const result = await response.json()
    console.log(`Digital products sent for order ${order.id}:`, result)
    return true

  } catch (error) {
    console.error(`Failed to process order fulfillment for order ${order.id}:`, error)
    return false
  }
}

/**
 * Utility function to check if an order contains digital products
 */
export function orderHasDigitalProducts(order: Order): boolean {
  const items = Array.isArray(order.orderItems) ? order.orderItems : []
  return items.some(item => item.type === 'digital')
}