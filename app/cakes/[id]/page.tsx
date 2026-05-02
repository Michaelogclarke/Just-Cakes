import { notFound } from 'next/navigation'
import { getProductById, getAllCakes } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

// Force dynamic rendering since we're using a database
export const dynamic = 'force-dynamic'

// Generate static params for all cakes
export async function generateStaticParams() {
  try {
    const cakes = await getAllCakes()
    return cakes.map((cake) => ({
      id: cake.id.toString(),
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

  if (!product || product.type !== 'cake') {
    return {
      title: 'Cake Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justcakesbakery.com'

  return {
    title: `${product.name} | Just Cakes`,
    description: product.description,
    alternates: { canonical: `${baseUrl}/cakes/${id}` },
    openGraph: {
      title: `${product.name} | Just Cakes`,
      description: product.description,
      url: `${baseUrl}/cakes/${id}`,
      images: product.image ? [{ url: product.image }] : [],
    },
  }
}

export default async function CakeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product || product.type !== 'cake') {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justcakesbakery.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'GBP',
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/cakes/${id}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} />
    </>
  )
}
