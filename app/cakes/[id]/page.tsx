import { notFound } from 'next/navigation'
import { getProductById, getAllCakes } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

// Generate static params for all cakes
export async function generateStaticParams() {
  const cakes = await getAllCakes()
  return cakes.map((cake) => ({
    id: cake.id.toString(),
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(parseInt(id))

  if (!product || product.type !== 'cake') {
    return {
      title: 'Cake Not Found',
    }
  }

  return {
    title: `${product.name} | Just Cakes`,
    description: product.description,
  }
}

export default async function CakeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(parseInt(id))

  if (!product || product.type !== 'cake') {
    notFound()
  }

  return <ProductDetail product={product} />
}
