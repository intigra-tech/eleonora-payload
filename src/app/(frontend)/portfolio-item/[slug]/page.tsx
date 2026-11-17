import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getP, srcOf } from '@/lib/payload'
import { paragraphs } from '@/lib/md'
import { ProjectView } from '@/components/ProjectView'

type Props = { params: Promise<{ slug: string }> }

async function getProject(slug: string) {
  const payload = await getP()
  const r = await payload.find({ collection: 'projects', where: { slug: { equals: slug }, _status: { equals: 'published' } }, limit: 1, depth: 2 })
  return r.docs[0] as any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) return {}
  const desc = p.meta?.description || paragraphs(p.body)[0]?.replace(/\*+/g, '').slice(0, 160)
  return {
    title: p.meta?.title ? { absolute: p.meta.title } : p.title,
    description: desc,
    alternates: { canonical: `/portfolio-item/${slug}` },
    openGraph: { images: srcOf(p.cover, 'large') },
  }
}

export default async function Project({ params }: Props) {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) notFound()
  return <ProjectView p={p} />
}
