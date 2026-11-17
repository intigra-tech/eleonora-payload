import { getPayload } from 'payload'
import config from '@payload-config'
import { readData } from './uploadToken'

export type DraftInfo = { collection: 'pages' | 'projects'; id: string; stamp: number }

export const approvalPayload = (collection: string, id: string | number, updatedAt: string) =>
  `${collection}~${id}~${new Date(updatedAt).getTime()}`

// Verifica il token e che la bozza non sia cambiata da quando è stato creato il link.
export async function resolveApproval(token: string | null | undefined) {
  const d = readData(token)
  if (!d) return { state: 'invalid' as const }
  const [collection, id, stamp] = d.split('~')
  if (collection !== 'pages' && collection !== 'projects') return { state: 'invalid' as const }
  const payload = await getPayload({ config })
  const doc = await payload.findByID({ collection, id, draft: true, depth: 2, overrideAccess: true }).catch(() => null)
  if (!doc) return { state: 'invalid' as const }
  const d2 = doc as unknown as { _status?: string; updatedAt: string }
  if (new Date(d2.updatedAt).getTime() !== Number(stamp)) return { state: 'changed' as const }
  if (d2._status === 'published') return { state: 'done' as const }
  return { state: 'ok' as const, collection: collection as 'pages' | 'projects', id, doc: doc as any } // eslint-disable-line @typescript-eslint/no-explicit-any
}
