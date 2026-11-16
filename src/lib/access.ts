import type { Access, CollectionBeforeOperationHook, CollectionBeforeValidateHook } from 'payload'

type Role = 'admin' | 'editor' | 'assistant'
export const roleOf = (u: unknown): Role | undefined => (u as { role?: Role } | null)?.role

export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'
export const isStaff: Access = ({ req: { user } }) => ['admin', 'editor'].includes(roleOf(user) as string)
export const canWrite: Access = ({ req: { user } }) => ['admin', 'editor', 'assistant'].includes(roleOf(user) as string)

// Lettura pubblica solo dei contenuti pubblicati; gli utenti autenticati vedono anche le bozze.
export const publishedOrAuth: Access = ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } })

// L'assistente AI può solo salvare bozze: forza draft=true e impedisce di impostare "published".
export const forceDraftForAssistant: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (roleOf(req.user) === 'assistant' && (operation === 'create' || operation === 'update')) {
    // Payload salva come pubblicato se data._status === 'published', anche con draft=true: lo rimuoviamo.
    const data = { ...((args as { data?: Record<string, unknown> }).data || {}) }
    delete data._status
    return { ...args, data, draft: true }
  }
  return args
}
export const blockPublishForAssistant: CollectionBeforeValidateHook = ({ data, req }) => {
  if (roleOf(req.user) === 'assistant' && data) return { ...data, _status: 'draft' }
  return data
}
