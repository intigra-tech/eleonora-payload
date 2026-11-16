import type { MetadataRoute } from 'next'
export const dynamic = 'force-dynamic'
export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL || 'https://eleonora.intigra.it'
  if (process.env.NOINDEX === '1') return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }, sitemap: `${base}/sitemap.xml` }
}
