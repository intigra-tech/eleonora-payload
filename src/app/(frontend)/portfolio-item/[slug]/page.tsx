import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getP, srcOf, srcSet, isMedia } from '@/lib/payload'
import { paragraphs, inline } from '@/lib/md'
import { Gallery } from '@/components/Lightbox'

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
  const desc = p.seo?.description || paragraphs(p.body)[0]?.replace(/\*+/g, '').slice(0, 160)
  return {
    title: p.seo?.title ? { absolute: p.seo.title } : p.title,
    description: desc,
    alternates: { canonical: `/portfolio-item/${slug}` },
    openGraph: { images: srcOf(p.cover, 'large') },
  }
}

export default async function Project({ params }: Props) {
  const { slug } = await params
  const p = await getProject(slug)
  if (!p) notFound()
  const items = (p.gallery || [])
    .map((g: any) => g.image) // eslint-disable-line @typescript-eslint/no-explicit-any
    .filter(isMedia)
    .map((m: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      thumb: srcOf(m, 'card')!, srcSet: srcSet(m), full: srcOf(m, 'large')!, alt: m.alt || p.title, w: m.width, h: m.height,
    }))
  return (
    <article>
      <section className="banner"><h1>{p.title}</h1></section>
      <Gallery items={items} />
      <div className="proj-body">
        {paragraphs(p.body).map((t, i) => <p key={i} dangerouslySetInnerHTML={{ __html: inline(t) }} />)}
      </div>
      <section className="ctabox">
        <div>
          <h5>Ti piace questo stile?</h5>
          <p>Se vuoi arredare i tuoi spazi e vuoi progettarli insieme a me, contattami ora.</p>
        </div>
        <Link href="/contatti" className="btn">Contatti</Link>
      </section>
    </article>
  )
}
