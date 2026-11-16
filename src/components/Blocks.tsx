import Link from 'next/link'
import { Img } from './Img'
import { paragraphs, inline } from '@/lib/md'
import { getP } from '@/lib/payload'

type B = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const P = ({ text }: { text?: string | null }) => (
  <>{paragraphs(text).map((t, i) => <p key={i} dangerouslySetInnerHTML={{ __html: inline(t) }} />)}</>
)
const Btn = ({ label, href }: { label?: string; href?: string }) =>
  label ? <Link href={href || '/contatti'} className="btn">{label}</Link> : null

export function ProjectCard({ p }: { p: B }) {
  return (
    <Link href={`/portfolio-item/${p.slug}`} className="card">
      <div className="card-img"><Img media={p.cover} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /></div>
      <h3>{p.title}</h3>
    </Link>
  )
}

export async function Blocks({ layout }: { layout?: B[] }) {
  if (!layout?.length) return null
  const out: React.ReactNode[] = []
  for (const [i, b] of layout.entries()) {
    switch (b.blockType) {
      case 'hero':
        out.push(
          <section key={i} className="hero">
            {b.image && <div className="hero-img"><Img media={b.image} size="large" sizes="(max-width: 900px) 100vw, 50vw" priority /></div>}
            <div className="hero-text">
              <h1>{b.title}</h1>
              {b.subtitle && <h2 className="sub">{b.subtitle}</h2>}
              <P text={b.text} />
              <Btn label={b.buttonLabel} href={b.buttonLink} />
            </div>
          </section>,
        ); break
      case 'steps':
        out.push(
          <section key={i} className="steps-sec">
            <div className="wrap steps">
              <div>
                <h2>{b.heading}</h2>
                <div className="steps-grid">
                  {b.items?.map((s: B, k: number) => (
                    <div key={k}><span className="num">{String(k + 1).padStart(2, '0')}</span><h3>{s.title}</h3><P text={s.text} /></div>
                  ))}
                </div>
              </div>
              {b.imageA && <div className="steps-imgs"><Img media={b.imageA} sizes="(max-width: 900px) 100vw, 35vw" /></div>}
            </div>
          </section>,
        ); break
      case 'features':
        out.push(
          <section key={i} className="wrap features">
            {b.image && <div className="features-img"><Img media={b.image} sizes="(max-width: 900px) 100vw, 40vw" /></div>}
            <div>
              <h2>{b.heading}</h2>
              <div className="acc">
                {b.items?.map((f: B, k: number) => (
                  <details key={k} open={k === 0}><summary>{f.title}</summary><div><P text={f.text} /></div></details>
                ))}
              </div>
            </div>
          </section>,
        ); break
      case 'cta':
        out.push(
          <section key={i} className="cta-sec">
            <div className="wrap cta">
              <div className="cta-card">
                {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
                <h2>{b.heading}</h2>
                <P text={b.text} />
                <Btn label={b.buttonLabel} href={b.buttonLink} />
              </div>
              {b.image && <div className="cta-img"><Img media={b.image} sizes="(max-width: 900px) 100vw, 40vw" /></div>}
            </div>
          </section>,
        ); break
      case 'projectsGrid': {
        const payload = await getP()
        const r = await payload.find({ collection: 'projects', sort: 'order', limit: b.limit || 100, depth: 1 })
        out.push(
          <section key={i} className="wrap projects">
            {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
            {b.heading && (b.limit ? <h2>{b.heading}</h2> : <h1>{b.heading}</h1>)}
            {b.intro && <p className="lead">{b.intro}</p>}
            <div className="grid">{r.docs.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
            {b.limit && b.buttonLabel ? <div className="center"><Btn label={b.buttonLabel} href={b.buttonLink || '/progetti'} /></div> : null}
          </section>,
        ); break
      }
      case 'about':
        out.push(
          <section key={i} className="band">
            <div className="wrap about">
              {b.image && <div className="about-img"><Img media={b.image} sizes="(max-width: 900px) 100vw, 45vw" /></div>}
              <div>
                {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
                <h2>{b.heading}</h2>
                {b.badges?.length ? <ul className="badges">{b.badges.map((x: B, k: number) => <li key={k}>{x.label}</li>)}</ul> : null}
                <P text={b.text} />
                <Btn label={b.buttonLabel} href={b.buttonLink} />
              </div>
            </div>
          </section>,
        ); break
      case 'contactInfo': {
        const payload = await getP()
        const s: B = await payload.findGlobal({ slug: 'site-settings' })
        const c = s.contacts || {}
        out.push(
          <section key={i} className="wrap contact">
            <div>
              <h1>{b.heading}</h1>
              <P text={b.intro} />
              {b.note && <p className="note">{b.note}</p>}
              <dl>
                {c.address && <><dt>{c.addressTitle || 'Indirizzo'}</dt><dd style={{ whiteSpace: 'pre-line' }}>{c.address}</dd></>}
                {c.email && <><dt>Email</dt><dd><a href={`mailto:${c.email}`}>{c.email}</a></dd></>}
                {c.phone && <><dt>Telefono</dt><dd><a href={`tel:${String(c.phone).replace(/\s/g, '')}`}>{c.phone}</a></dd></>}
                {c.hours && <><dt>Orari</dt><dd>{c.hours}</dd></>}
              </dl>
            </div>
            {b.image && <div className="contact-img"><Img media={b.image} size="large" sizes="(max-width: 900px) 100vw, 45vw" /></div>}
          </section>,
        ); break
      }
    }
  }
  return <>{out}</>
}
