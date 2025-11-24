import { notFound } from 'next/navigation'
import { getProductById, getAllDigitalProducts } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

// Generate static params for all digital products
export async function generateStaticParams() {
  const digitalProducts = await getAllDigitalProducts()
  return digitalProducts.map((product) => ({
    id: product.id.toString(),
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(parseInt(id))

  if (!product || product.type !== 'digital') {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Just Cakes`,
    description: product.description,
  }
}

export default async function DigitalProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(parseInt(id))

  if (!product || product.type !== 'digital') {
    notFound()
  }

  return <ProductDetail product={product} />
}
