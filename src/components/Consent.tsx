'use client'
import { useEffect, useState } from 'react'

export function Consent({ gaId }: { gaId?: string | null }) {
  const [state, setState] = useState<'unknown' | 'yes' | 'no'>('no')
  useEffect(() => {
    try { const v = localStorage.getItem('consent-analytics'); setState(v === 'yes' ? 'yes' : v === 'no' ? 'no' : 'unknown') } catch { setState('unknown') }
  }, [])
  useEffect(() => {
    if (state !== 'yes' || !gaId || document.getElementById('ga-js')) return
    const s = document.createElement('script')
    s.id = 'ga-js'; s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(s)
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void }
    w.dataLayer = w.dataLayer || []
    w.gtag = function () { w.dataLayer.push(arguments) }
    w.gtag('js', new Date()); w.gtag('config', gaId, { anonymize_ip: true })
  }, [state, gaId])
  if (!gaId || state !== 'unknown') return null
  const set = (v: 'yes' | 'no') => { try { localStorage.setItem('consent-analytics', v) } catch {} setState(v) }
  return (
    <div className="consent" role="dialog" aria-label="Cookie">
      <p>Questo sito usa cookie di analisi statistica solo con il tuo consenso.</p>
      <div>
        <button onClick={() => set('no')}>Rifiuta</button>
        <button className="primary" onClick={() => set('yes')}>Accetta</button>
      </div>
    </div>
  )
}
