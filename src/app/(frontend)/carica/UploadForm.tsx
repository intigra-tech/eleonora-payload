'use client'
import { useState } from 'react'

export default function UploadForm({ token }: { token: string }) {
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ name: string; id?: number | string; error?: string }[] | null>(null)
  const [err, setErr] = useState('')

  async function send(files: FileList | null) {
    if (!files?.length) return
    setBusy(true); setErr(''); setRes(null)
    const fd = new FormData(); fd.append('t', token)
    Array.from(files).forEach((f) => fd.append('files', f))
    try {
      const r = await fetch('/carica/upload', { method: 'POST', body: fd })
      const j = await r.json()
      if (!r.ok) setErr(j.error || 'Errore'); else setRes(j.results)
    } catch { setErr('Errore di rete, riprova.') }
    setBusy(false)
  }

  return (
    <div>
      <p>Trascina qui le foto (o selezionale). Poi torna da Claude e scrivi «fatto».</p>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); send(e.dataTransfer.files) }}
        style={{ display: 'block', border: '2px dashed #999', padding: '70px 20px', textAlign: 'center', cursor: 'pointer', margin: '30px 0' }}
      >
        {busy ? 'Caricamento in corso…' : 'Trascina le foto qui oppure clicca per scegliere'}
        <input type="file" accept="image/*" multiple hidden onChange={(e) => send(e.target.files)} />
      </label>
      {err && <p style={{ color: '#b00' }}>{err}</p>}
      {res && (
        <ul>
          {res.map((x, i) => <li key={i}>{x.name}: {x.error ? `❌ ${x.error}` : '✅ caricata'}</li>)}
        </ul>
      )}
    </div>
  )
}
