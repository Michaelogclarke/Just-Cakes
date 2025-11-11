'use client'
import styles from "./Product.module.css"
import { Product as ProductType } from '@/types/product'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

type ProductProps = ProductType

export default function Product({
  id,
  name,
  description,
  price,
  image,
  category,
  available
}: ProductProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    const product: ProductType = {
      id,
      name,
      description,
      price,
      image,
      category,
      available
    }
    addToCart(product)
    alert(`${name} added to cart!`)
  }

  return (
    <div className={styles.card}>
      <img className={styles.image} src={image} alt={name}  />
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Price: ${price.toFixed(2)}</p>
      <p>Category: {category}</p>
      <p>Status: {available ? 'Available' : 'Out of Stock'}</p>

      <div>
        <Link href={`/store/${id}`}>
          <button>View Details</button>
        </Link>
        <button
          onClick={handleAddToCart}
          disabled={!available}
        >
          {available ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
