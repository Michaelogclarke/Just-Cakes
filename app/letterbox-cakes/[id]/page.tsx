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

export default async function LetterboxCakePage({ params }: LetterboxCakePageProps) {
  const { id } = await params
  const letterboxCake = await getProductById(id)

  if (!letterboxCake || letterboxCake.type !== 'letterbox') {
    notFound()
  }

  return <ProductDetail product={letterboxCake} />
}
