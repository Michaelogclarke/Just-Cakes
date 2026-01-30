import { Product } from './product'

export interface CartItem extends Product {
  quantity: number
  customOptions?: {
    flavours?: string[]
  }
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}
