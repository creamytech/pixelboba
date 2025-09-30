import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/portal/',
        '/auth/',
        '/login/',
        '/signup/',
        '/reset-password/',
        '/forgot-password/',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
