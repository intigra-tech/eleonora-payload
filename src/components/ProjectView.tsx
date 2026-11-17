import Link from 'next/link'
import { srcOf, srcSet, isMedia } from '@/lib/payload'
import { paragraphs, inline } from '@/lib/md'
import { Gallery } from '@/components/Lightbox'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProjectView({ p }: { p: any }) {
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
