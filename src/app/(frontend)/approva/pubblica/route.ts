import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { resolveApproval } from '@/lib/approval'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { t } = await req.json().catch(() => ({ t: '' }))
  const r = await resolveApproval(t)
  if (r.state !== 'ok') return NextResponse.json({ error: r.state }, { status: 403 })
  const payload = await getPayload({ config })
  // Pubblica ESATTAMENTE la bozza controllata: copio i dati dell'ultima versione e imposto "published".
  const draft = (await payload.findByID({ collection: r.collection, id: r.id, draft: true, depth: 0, overrideAccess: true })) as unknown as Record<string, unknown>
  const data = { ...draft }
  for (const k of ['id', 'createdAt', 'updatedAt', '_status']) delete data[k]
  await payload.update({ collection: r.collection, id: r.id, data: { ...data, _status: 'published' } as never, draft: false, overrideAccess: true })
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true })
}
