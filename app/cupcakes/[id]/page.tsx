import { notFound } from 'next/navigation'
import { getProductById, getAllCupcakes } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

// Force dynamic rendering since we're using a database
export const dynamic = 'force-dynamic'

// Generate static params for all cupcakes
export async function generateStaticParams() {
  try {
    const cupcakes = await getAllCupcakes()
    return cupcakes.map((cupcake) => ({
      id: cupcake.id.toString(),
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

  if (!product || product.type !== 'cupcake') {
    return {
      title: 'Cupcake Not Found',
    }
  }

  return {
    title: `${product.name} | Just Cakes`,
    description: product.description,
  }
}

export default async function CupcakeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product || product.type !== 'cupcake') {
    notFound()
  }

  return <ProductDetail product={product} />
}
