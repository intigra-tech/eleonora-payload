import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { checkUploadToken } from '../../../../lib/uploadToken'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const form = await req.formData()
  if (!checkUploadToken(String(form.get('t') || ''))) return NextResponse.json({ error: 'Link scaduto o non valido' }, { status: 403 })
  const files = form.getAll('files').filter((f): f is File => f instanceof File).slice(0, 30)
  const payload = await getPayload({ config })
  const out: { name: string; id?: number | string; error?: string }[] = []
  for (const f of files) {
    if (!f.type.startsWith('image/')) { out.push({ name: f.name, error: 'non è un\'immagine' }); continue }
    if (f.size > 25 * 1024 * 1024) { out.push({ name: f.name, error: 'oltre 25 MB' }); continue }
    try {
      // Anti-doppioni: stesso nome e peso caricati nelle ultime 15 minuti -> riuso quello esistente.
      const stem = f.name.replace(/[^\w.\-]+/g, '_').replace(/\.[^.]+$/, '')
      const dup = await payload.find({ collection: 'media', where: { and: [{ filesize: { equals: f.size } }, { filename: { like: stem } }, { createdAt: { greater_than: new Date(Date.now() - 15 * 60_000).toISOString() } }] }, limit: 1, depth: 0, overrideAccess: true })
      if (dup.docs[0]) { out.push({ name: f.name, id: dup.docs[0].id }); continue }
      const alt = f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Immagine'
      const doc = await payload.create({ collection: 'media', data: { alt }, file: { data: Buffer.from(await f.arrayBuffer()), mimetype: f.type, name: f.name.replace(/[^\w.\-]+/g, '_'), size: f.size } })
      out.push({ name: f.name, id: doc.id })
    } catch (e) {
      out.push({ name: f.name, error: 'caricamento non riuscito' })
    }
  }
  return NextResponse.json({ results: out })
}
