import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getP, srcOf } from '@/lib/payload'
import { Blocks } from '@/components/Blocks'

async function getPage(slug: string) {
  const payload = await getP()
  const r = await payload.find({ collection: 'pages', where: { slug: { equals: slug }, _status: { equals: 'published' } }, limit: 1, depth: 2 })
  return r.docs[0]
}

export async function generateMetadata(): Promise<Metadata> {
  const p: any = await getPage('home') // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!p) return {}
  return { title: p.meta?.title ? { absolute: p.meta.title } : undefined, description: p.meta?.description || undefined, alternates: { canonical: '/' }, openGraph: { images: srcOf(p.meta?.image, 'large') } }
}

export default async function Home() {
  const p: any = await getPage('home') // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!p) notFound()
  return <Blocks layout={p.layout} />
}
