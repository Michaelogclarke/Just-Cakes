'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()

  if (cart.items.length === 0) {
    return (
      <main>
        <h1>Shopping Cart</h1>
        <p>Your cart is empty</p>
        <Link href="/store">
          <button>Continue Shopping</button>
        </Link>
      </main>
    )
  }

  const handleCheckout = () => {
    // Checkout logic would go here
    alert('Proceeding to checkout...')
    // In a real app, this would redirect to a checkout page
  }

  return (
    <main>
      <h1>Shopping Cart</h1>

      <div>
        {cart.items.map((item) => (
          <div key={item.id}>
            <img src={item.image} alt={item.name} />

            <div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
            </div>

            <div>
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              />
            </div>

            <div>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <button onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div>
        <h2>Cart Summary</h2>
        <p>Total Items: {cart.totalItems}</p>
        <p>Total Price: ${cart.totalPrice.toFixed(2)}</p>

        <div>
          <button onClick={clearCart}>Clear Cart</button>
          <Link href="/store">
            <button>Continue Shopping</button>
          </Link>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </main>
  )
}
