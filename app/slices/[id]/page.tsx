import { getProductById, getAllSlices } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'
import { notFound } from 'next/navigation'

// Force dynamic rendering since we're using a database
export const dynamic = 'force-dynamic'

interface SlicePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const slices = await getAllSlices()
    return slices.map((slice) => ({
      id: slice.id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function SlicePage({ params }: SlicePageProps) {
  const { id } = await params
  const slice = await getProductById(id)

  if (!slice || slice.type !== 'slice') {
    notFound()
  }

  return <ProductDetail product={slice} />
}
