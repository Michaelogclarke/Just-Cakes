'use client'

import { Product } from '@/types/product'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addToCart(product)
    alert(`${product.name} added to cart!`)
  }

  const handleBackToStore = () => {
    router.push('/store')
  }

  return (
    <div>
      <button onClick={handleBackToStore}>← Back to Store</button>

      <div>
        <img src={product.image} alt={product.name} />

        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div>
            <span>Price: ${product.price.toFixed(2)}</span>
            <span>Category: {product.category}</span>
            <span>Status: {product.available ? 'Available' : 'Out of Stock'}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {product.available ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
