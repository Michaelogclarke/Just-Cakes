'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Product } from '@/types/product'
import { CartItem, Cart } from '@/types/cart'
import Toast from '@/components/Toast'

interface CartContextType {
  cart: Cart
  addToCart: (product: Product | CartItem) => void
  removeFromCart: (productId: number | string, customOptions?: { flavours?: string[] }) => void
  updateQuantity: (productId: number | string, quantity: number, customOptions?: { flavours?: string[] }) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Calculate cart totals
  const cart: Cart = {
    items: cartItems,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  // Helper function to check if custom options match
  const customOptionsMatch = (options1?: { flavours?: string[] }, options2?: { flavours?: string[] }) => {
    if (!options1 && !options2) return true
    if (!options1 || !options2) return false
    if (!options1.flavours || !options2.flavours) return true
    return JSON.stringify(options1.flavours.sort()) === JSON.stringify(options2.flavours.sort())
  }

  // Add product to cart
  const addToCart = useCallback((product: Product | CartItem) => {
    setCartItems(prevItems => {
      const productAsCartItem = 'customOptions' in product ? product as CartItem : product
      const customOptions = 'customOptions' in product ? product.customOptions : undefined

      // For letterbox cakes with custom options, check if exact match exists
      const existingItem = prevItems.find(item =>
        item.id === product.id && customOptionsMatch(item.customOptions, customOptions)
      )

      if (existingItem) {
        // Increase quantity if already in cart with same options
        return prevItems.map(item =>
          item.id === product.id && customOptionsMatch(item.customOptions, customOptions)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item to cart
        return [...prevItems, { ...productAsCartItem, quantity: 1, customOptions }]
      }
    })

    // Show toast notification
    setToastMessage(`${product.name} added to cart!`)
    setToastVisible(true)
  }, [])

  // Remove product from cart
  const removeFromCart = useCallback((productId: number | string, customOptions?: { flavours?: string[] }) => {
    setCartItems(prevItems => prevItems.filter(item =>
      !(item.id === productId && customOptionsMatch(item.customOptions, customOptions))
    ))
  }, [])

  // Update quantity of product in cart
  const updateQuantity = useCallback((productId: number | string, quantity: number, customOptions?: { flavours?: string[] }) => {
    if (quantity <= 0) {
      removeFromCart(productId, customOptions)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && customOptionsMatch(item.customOptions, customOptions)
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeFromCart])

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
