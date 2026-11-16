import type { MetadataRoute } from 'next'
import { getP } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || 'https://eleonora.intigra.it'
  const payload = await getP()
  const [pages, projects, cats] = await Promise.all([
    payload.find({ collection: 'pages', limit: 100, depth: 0 }),
    payload.find({ collection: 'projects', limit: 200, depth: 0 }),
    payload.find({ collection: 'project-categories', limit: 50, depth: 0 }),
  ])
  return [
    ...pages.docs.map((p) => ({ url: p.slug === 'home' ? `${base}/` : `${base}/${p.slug}`, lastModified: p.updatedAt })),
    ...projects.docs.map((p) => ({ url: `${base}/portfolio-item/${p.slug}`, lastModified: p.updatedAt })),
    ...cats.docs.map((c) => ({ url: `${base}/portfolio-category/${c.slug}`, lastModified: c.updatedAt })),
  ]
}
