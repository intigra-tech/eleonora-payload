import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getP, srcOf } from '@/lib/payload'
import { Blocks } from '@/components/Blocks'

type Props = { params: Promise<{ slug: string }> }

async function getPage(slug: string) {
  const payload = await getP()
  const r = await payload.find({ collection: 'pages', where: { slug: { equals: slug }, _status: { equals: 'published' } }, limit: 1, depth: 2 })
  return r.docs[0] as any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getPage(slug)
  if (!p) return {}
  return {
    title: p.seo?.title ? { absolute: p.seo.title } : p.title,
    description: p.seo?.description || undefined,
    alternates: { canonical: `/${slug}` },
    openGraph: { images: srcOf(p.seo?.image, 'large') },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  if (slug === 'home') notFound()
  const p = await getPage(slug)
  if (!p) notFound()
  return <Blocks layout={p.layout} />
}
