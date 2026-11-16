import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utente', plural: 'Utenti' },
  admin: { useAsTitle: 'email' },
  auth: { useAPIKey: true },
  fields: [{ name: 'name', type: 'text', label: 'Nome' }],
}
