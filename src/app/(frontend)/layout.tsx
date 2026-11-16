import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import '@fontsource-variable/dm-sans'
import './styles.css'
import { getP } from '@/lib/payload'
import { Consent } from '@/components/Consent'
import { NavLinks } from '@/components/NavLinks'

export const dynamic = 'force-dynamic'

const base = process.env.SITE_URL || 'https://eleonora.intigra.it'
export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: 'Eleonora Righi — Architetto d’interni a Carpi', template: '%s — Eleonora Righi' },
  description: 'Eleonora Righi, architetto d’interni a Carpi (MO): progettazione chiavi in mano di spazi unici e personalizzati.',
  icons: { icon: '/favicon.png' },
  robots: process.env.NOINDEX === '1' ? { index: false, follow: false } : undefined,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getP()
  const s: any = await payload.findGlobal({ slug: 'site-settings' }) // eslint-disable-line @typescript-eslint/no-explicit-any
  const nav: { label: string; url: string }[] = s.nav?.length ? s.nav : []
  const c = s.contacts || {}
  return (
    <html lang="it">
      <body>
        <a className="skip" href="#main">Salta al contenuto</a>
        <header className="site-header">
          <div className="hdr">
            <Link href="/" className="logo" aria-label={s.siteName}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt={s.siteName} width={757} height={140} />
            </Link>
            <nav aria-label="Menu principale">
              <NavLinks nav={nav} />
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="foot">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-footer.png" alt="" width={150} height={112} />
              <h5>{s.siteName} Architetto</h5>
              {s.footerText && <p>{s.footerText}</p>}
            </div>
            <div className="col-addr"><h5>Carpi</h5><p style={{ whiteSpace: 'pre-line' }}>{c.address}</p></div>
            <div className="col-pages"><h5>Pagine</h5><ul>{nav.filter((n) => n.url !== '/').map((n) => <li key={n.url}><Link href={n.url}>{n.url === '/progetti' ? 'Portfolio' : n.label}</Link></li>)}</ul></div>
            <div />
            {c.email && <a className="foot-mail" href={`mailto:${c.email}`}>{c.email}</a>}
          </div>
        </footer>
        <Consent gaId={s.gaId} />
      </body>
    </html>
  )
}
