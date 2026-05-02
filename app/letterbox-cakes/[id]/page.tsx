import { getProductById, getAllLetterboxCakes } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'
import { notFound } from 'next/navigation'

// Force dynamic rendering since we're using a database
export const dynamic = 'force-dynamic'

interface LetterboxCakePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const letterboxCakes = await getAllLetterboxCakes()
    return letterboxCakes.map((letterboxCake) => ({
      id: letterboxCake.id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: LetterboxCakePageProps) {
  const { id } = await params
  const product = await getProductById(id)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justcakesbakery.com'

  if (!product || product.type !== 'letterbox') {
    return { title: 'Letterbox Cake Not Found' }
  }

  return {
    title: `${product.name} | Just Cakes`,
    description: product.description,
    alternates: { canonical: `${baseUrl}/letterbox-cakes/${id}` },
    openGraph: {
      title: `${product.name} | Just Cakes`,
      description: product.description,
      url: `${baseUrl}/letterbox-cakes/${id}`,
      images: product.image ? [{ url: product.image }] : [],
    },
  }
}

export default async function LetterboxCakePage({ params }: LetterboxCakePageProps) {
  const { id } = await params
  const letterboxCake = await getProductById(id)

  if (!letterboxCake || letterboxCake.type !== 'letterbox') {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justcakesbakery.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: letterboxCake.name,
    description: letterboxCake.description,
    image: letterboxCake.image,
    offers: {
      '@type': 'Offer',
      price: letterboxCake.price,
      priceCurrency: 'GBP',
      availability: letterboxCake.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/letterbox-cakes/${id}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={letterboxCake} />
    </>
  )
}
