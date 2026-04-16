import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justcakesbakery.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ludmilla/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
