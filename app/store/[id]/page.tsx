import { notFound } from 'next/navigation'
import { getProductById, getAllProducts } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    id: product.id.toString(),
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(parseInt(id))

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
  const product = await getProductById(parseInt(id))

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
