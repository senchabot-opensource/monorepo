import { type MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/terms-of-service',
        '/privacy-policy',
        '/cookie-policy',
        '/eula',
      ],
    },
  }
}
