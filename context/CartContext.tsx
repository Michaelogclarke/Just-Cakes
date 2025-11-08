'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Product } from '@/types/product'
import { CartItem, Cart } from '@/types/cart'

interface CartContextType {
  cart: Cart
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Calculate cart totals
  const cart: Cart = {
    items: cartItems,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  // Add product to cart
  const addToCart = useCallback((product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)

      if (existingItem) {
        // Increase quantity if already in cart
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }, [])

  // Remove product from cart
  const removeFromCart = useCallback((productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }, [])

  // Update quantity of product in cart
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
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
