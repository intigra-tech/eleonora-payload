'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks({ nav }: { nav: { label: string; url: string }[] }) {
  const path = usePathname() || '/'
  const active = (u: string) => (u === '/' ? path === '/' : path === u || path.startsWith(u + '/'))
  return (
    <ul>
      {nav.map((n) => (
        <li key={n.url}>
          <Link href={n.url} aria-current={active(n.url) ? 'page' : undefined}>{n.label}</Link>
        </li>
      ))}
    </ul>
  )
}
