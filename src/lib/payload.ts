import { getPayload } from 'payload'
import config from '@payload-config'

export const getP = () => getPayload({ config })

export type Media = {
  id: number | string
  alt?: string
  url?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null }>
}

export const isMedia = (m: unknown): m is Media => !!m && typeof m === 'object' && 'url' in (m as object)

export function srcOf(m: unknown, size: 'thumb' | 'card' | 'large' | 'full' = 'card'): string | undefined {
  if (!isMedia(m)) return undefined
  if (size === 'full') return m.url || undefined
  return m.sizes?.[size]?.url || m.url || undefined
}

export function srcSet(m: unknown): string | undefined {
  if (!isMedia(m) || !m.sizes) return undefined
  const parts = (['thumb', 'card', 'large'] as const)
    .map((k) => (m.sizes?.[k]?.url && m.sizes?.[k]?.width ? `${m.sizes[k]!.url} ${m.sizes[k]!.width}w` : null))
    .filter(Boolean)
  return parts.length ? parts.join(', ') : undefined
}
