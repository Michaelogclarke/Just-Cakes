import { notFound } from 'next/navigation'
import { getProductById, getAllProducts } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

// Force dynamic rendering since we're using a database
export const dynamic = 'force-dynamic'

// Generate static params for all products
export async function generateStaticParams() {
  try {
    const products = await getAllProducts()
    return products.map((product) => ({
      id: product.id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Just Cakes`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
