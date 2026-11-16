import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getP } from '@/lib/payload'
import { ProjectCard } from '@/components/Blocks'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getP()
  const c = (await payload.find({ collection: 'project-categories', where: { slug: { equals: slug } }, limit: 1 })).docs[0]
  return c ? { title: c.title, alternates: { canonical: `/portfolio-category/${slug}` } } : {}
}

export default async function Category({ params }: Props) {
  const { slug } = await params
  const payload = await getP()
  const c = (await payload.find({ collection: 'project-categories', where: { slug: { equals: slug } }, limit: 1 })).docs[0]
  if (!c) notFound()
  const r = await payload.find({ collection: 'projects', where: { categories: { contains: c.id }, _status: { equals: 'published' } }, sort: 'order', limit: 100, depth: 1 })
  return (
    <section className="wrap projects">
      <p className="eyebrow">Categoria</p>
      <h1>{c.title}</h1>
      <div className="grid">{r.docs.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
    </section>
  )
}
