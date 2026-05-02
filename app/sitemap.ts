import { MetadataRoute } from 'next'
import { getAllCakes, getAllCupcakes, getAllLetterboxCakes, getAllDigitalProducts } from '@/lib/products'
import { getAllBlogPosts } from '@/lib/blogs'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justcakesbakery.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/cakes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cupcakes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/letterbox-cakes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/digital-products`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/custom-orders`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const [cakes, cupcakes, letterboxCakes, digitalProducts, blogPosts] = await Promise.all([
    getAllCakes().catch(() => []),
    getAllCupcakes().catch(() => []),
    getAllLetterboxCakes().catch(() => []),
    getAllDigitalProducts().catch(() => []),
    getAllBlogPosts().catch(() => []),
  ])

  const cakeRoutes: MetadataRoute.Sitemap = cakes.map((cake) => ({
    url: `${baseUrl}/cakes/${cake.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const cupcakeRoutes: MetadataRoute.Sitemap = cupcakes.map((cupcake) => ({
    url: `${baseUrl}/cupcakes/${cupcake.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const letterboxRoutes: MetadataRoute.Sitemap = letterboxCakes.map((cake) => ({
    url: `${baseUrl}/letterbox-cakes/${cake.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const digitalRoutes: MetadataRoute.Sitemap = digitalProducts.map((product) => ({
    url: `${baseUrl}/digital-products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...cakeRoutes,
    ...cupcakeRoutes,
    ...letterboxRoutes,
    ...digitalRoutes,
    ...blogRoutes,
  ]
}
