'use client'
import { useState } from 'react'

export default function ApproveBar({ token, title }: { token: string; title: string }) {
  const [st, setSt] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle')
  async function publish() {
    setSt('busy')
    try {
      const r = await fetch('/approva/pubblica', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token }) })
      setSt(r.ok ? 'ok' : 'err')
    } catch { setSt('err') }
  }
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 9999, background: '#111', color: '#fff', padding: '12px 20px', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', fontSize: 15 }}>
      <span>{st === 'ok' ? '✅ Pubblicato! Il sito è aggiornato.' : st === 'err' ? '❌ Qualcosa non ha funzionato: chiedi un nuovo link a Claude.' : <>Anteprima della bozza <b>{title}</b> — non ancora online</>}</span>
      {st !== 'ok' && <button onClick={publish} disabled={st === 'busy'} style={{ background: '#fff', color: '#111', border: 0, padding: '9px 22px', fontWeight: 600, cursor: 'pointer' }}>{st === 'busy' ? 'Pubblico…' : 'Pubblica'}</button>}
    </div>
  )
}
