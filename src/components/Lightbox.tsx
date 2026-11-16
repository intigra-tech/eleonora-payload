'use client'
import { useCallback, useEffect, useState } from 'react'

export type LbItem = { thumb: string; srcSet?: string; full: string; alt: string; w?: number; h?: number }

export function Gallery({ items }: { items: LbItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length])
  useEffect(() => {
    if (open === null) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open, close, go])
  return (
    <>
      <div className="gallery">
        {items.map((it, i) => (
          <button key={i} className="gallery-item" onClick={() => setOpen(i)} aria-label={`Apri immagine ${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.thumb} srcSet={it.srcSet} sizes="(max-width: 700px) 100vw, 33vw" alt={it.alt} width={it.w} height={it.h} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="lb" role="dialog" aria-modal="true" onClick={close}>
          <button className="lb-btn lb-close" onClick={close} aria-label="Chiudi">×</button>
          <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Precedente">‹</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={items[open].full} alt={items[open].alt} onClick={(e) => e.stopPropagation()} />
          <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Successiva">›</button>
        </div>
      )}
    </>
  )
}
