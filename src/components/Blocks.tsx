import Link from 'next/link'
import { Img } from './Img'
import { Accordion, Tabs } from './Interactive'
import { paragraphs, inline } from '@/lib/md'
import { getP, isMedia, srcOf } from '@/lib/payload'

type B = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const P = ({ text }: { text?: string | null }) => (
  <>{paragraphs(text).map((t, i) => <p key={i} dangerouslySetInnerHTML={{ __html: inline(t) }} />)}</>
)
const html = (text?: string | null) => paragraphs(text).map((t) => `<p>${inline(t)}</p>`).join('')
const Btn = ({ label, href, className = 'btn' }: { label?: string; href?: string; className?: string }) =>
  label ? <Link href={href || '/contatti'} className={className}>{label}</Link> : null

export function ProjectCard({ p }: { p: B }) {
  return (
    <Link href={`/portfolio-item/${p.slug}`} className="card">
      <div className="card-img"><Img media={p.cover} sizes="(max-width: 700px) 100vw, 360px" /></div>
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
            {b.image && <div className="hero-img"><Img media={b.image} size="large" sizes="(max-width: 900px) 100vw, 720px" priority /></div>}
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
            <div className="c steps">
              <div className="steps-main">
                <h2>{b.heading}</h2>
                <div className="steps-grid">
                  {b.items?.map((s: B, k: number) => (
                    <div key={k}><span className="num">{k + 1}</span><h5>{s.title}</h5><P text={s.text} /></div>
                  ))}
                </div>
              </div>
              {b.imageA && <div className="steps-img"><Img media={b.imageA} size="large" sizes="(max-width: 900px) 100vw, 495px" /></div>}
            </div>
          </section>,
        ); break
      case 'features': {
        const w = Number(b.imageWidth) || 414
        out.push(
          <section key={i} className="feat-sec">
            <div className="c features" style={{ ['--fw' as string]: `${w}px`, ['--fg' as string]: w < 300 ? '115px' : '105px' }}>
              {b.image && <div className="features-img"><Img media={b.image} size="large" sizes="(max-width: 900px) 100vw, 414px" /></div>}
              <div>
                <h3>{b.heading}</h3>
                <Accordion items={(b.items || []).map((f: B) => ({ title: f.title, html: html(f.text) }))} />
              </div>
            </div>
          </section>,
        ); break
      }
      case 'cta':
        if (b.variant === 'dark') {
          const bg = isMedia(b.background) ? srcOf(b.background, 'large') : undefined
          out.push(
            <section key={i} className="cta-dark" style={bg ? { backgroundImage: `url(${bg})` } : undefined}>
              {b.eyebrow && <h5 className="eyebrow">{b.eyebrow}</h5>}
              <h2>{b.heading}</h2>
              {b.text && <p>{b.text}</p>}
              <Btn label={b.buttonLabel} href={b.buttonLink} />
            </section>,
          )
        } else {
          out.push(
            <section key={i} className="cta-sec">
              <div className="c cta">
                <div className="cta-card">
                  {b.eyebrow && <h5 className="eyebrow">{b.eyebrow}</h5>}
                  <h2>{b.heading}</h2>
                  <P text={b.text} />
                  <Btn label={b.buttonLabel} href={b.buttonLink} className="link" />
                </div>
                {b.image && <div className="cta-img"><Img media={b.image} size="large" sizes="(max-width: 900px) 100vw, 550px" /></div>}
              </div>
            </section>,
          )
        }
        break
      case 'pageBanner':
        out.push(
          <section key={i} className="banner">
            <h1>{b.title}</h1>
            {b.subtitle && <h4>{b.subtitle}</h4>}
          </section>,
        ); break
      case 'profile':
        out.push(
          <section key={i} className="profile">
            <div className="profile-top">
              <div className="profile-text">
                {b.eyebrow && <h5>{b.eyebrow}</h5>}
                <h2>{b.heading}</h2>
                <P text={b.text} />
              </div>
              {b.image && <div className="profile-img"><Img media={b.image} size="large" sizes="(max-width: 900px) 100vw, 360px" priority /></div>}
            </div>
            {b.columns?.length ? (
              <div className="profile-cols">{b.columns.map((c: B, k: number) => <div key={k}><P text={c.text} /></div>)}</div>
            ) : null}
          </section>,
        ); break
      case 'projectsGrid': {
        const payload = await getP()
        const r = await payload.find({ collection: 'projects', sort: 'order', limit: b.limit || 100, depth: 1 })
        if (b.layout === 'gallery') {
          out.push(
            <section key={i} className="c proj-gallery">
              {r.docs.map((p: B, k: number) => (
                <article key={p.id}>
                  <Link href={`/portfolio-item/${p.slug}`}>
                    <Img media={p.cover} size="large" sizes="(max-width: 1100px) 100vw, 1100px" priority={k === 0} />
                  </Link>
                  <h5><Link href={`/portfolio-item/${p.slug}`}>{p.title}</Link></h5>
                </article>
              ))}
            </section>,
          )
        } else {
          out.push(
            <section key={i} className="projects">
              {b.eyebrow && <h5 className="eyebrow">{b.eyebrow}</h5>}
              {b.heading && <h2>{b.heading}</h2>}
              {b.intro && <p className="lead">{b.intro}</p>}
              <div className="grid">{r.docs.map((p: B) => <ProjectCard key={p.id} p={p} />)}</div>
              {b.buttonLabel ? <div className="center"><Btn label={b.buttonLabel} href={b.buttonLink || '/progetti'} /></div> : null}
            </section>,
          )
        }
        break
      }
      case 'about':
        out.push(
          <section key={i} className="about-sec">
            {b.eyebrow && <h5 className="eyebrow">{b.eyebrow}</h5>}
            <h2>{b.heading}</h2>
            <div className="c about">
              {b.image && <div className="about-img"><Img media={b.image} sizes="(max-width: 900px) 100vw, 447px" /></div>}
              <div>
                {b.tabs?.length ? (
                  <Tabs items={b.tabs.map((t: B) => ({ title: t.label, html: html(t.text) }))} />
                ) : (
                  <div className="tabs-body"><P text={b.text} /></div>
                )}
              </div>
            </div>
          </section>,
        ); break
      case 'contactInfo': {
        const payload = await getP()
        const s: B = await payload.findGlobal({ slug: 'site-settings' })
        const c = s.contacts || {}
        const ps = paragraphs(b.intro)
        out.push(
          <section key={i} className="contact">
            <div className="c contact-top">
              <div className="contact-text">
                <h2>{b.heading}</h2>
                {ps[0] && <h4 dangerouslySetInnerHTML={{ __html: inline(ps[0]) }} />}
                {ps.slice(1).map((t, k) => <h4 key={k} dangerouslySetInnerHTML={{ __html: inline(t) }} />)}
                {b.note && <h5 className="note">{b.note}</h5>}
                {c.address && (
                  <div className="contact-addr">
                    <h5>{c.addressTitle || 'Indirizzo'}</h5>
                    <p style={{ whiteSpace: 'pre-line' }}>{c.address}</p>
                  </div>
                )}
              </div>
              {b.image && <div className="contact-img"><Img media={b.image} size="large" sizes="(max-width: 900px) 100vw, 512px" priority /></div>}
            </div>
            <div className="c contact-cols">
              {c.email && <div><h5>Email</h5><a href={`mailto:${c.email}`}>{c.email}</a></div>}
              {c.phone && <div><h5>Telefono</h5><a href={`tel:${String(c.phone).replace(/\s/g, '')}`}>{c.phone}</a></div>}
              {c.hours && <div><h5>Orari</h5><p>{c.hours}</p></div>}
            </div>
          </section>,
        ); break
      }
    }
  }
  return <>{out}</>
}
