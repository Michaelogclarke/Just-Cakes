import { getProductById, getAllSlices } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'
import { notFound } from 'next/navigation'

interface SlicePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const slices = await getAllSlices()
  return slices.map((slice) => ({
    id: slice.id.toString(),
  }))
}

export default async function SlicePage({ params }: SlicePageProps) {
  const { id } = await params
  const slice = await getProductById(parseInt(id))

  if (!slice || slice.type !== 'slice') {
    notFound()
  }

  return <ProductDetail product={slice} />
}
