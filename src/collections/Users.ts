import type { CollectionConfig } from 'payload'
import { isAdmin, roleOf } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utente', plural: 'Utenti' },
  admin: { useAsTitle: 'email' },
  auth: { useAPIKey: true },
  access: {
    // Gli utenti non admin vedono e modificano solo se stessi.
    read: ({ req: { user } }) => (roleOf(user) === 'admin' ? true : user ? { id: { equals: user.id } } : false),
    update: ({ req: { user } }) => (roleOf(user) === 'admin' ? true : user ? { id: { equals: user.id } } : false),
    create: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nome' },
    {
      name: 'role',
      type: 'select',
      label: 'Ruolo',
      required: true,
      defaultValue: 'admin',
      saveToJWT: true,
      options: [
        { label: 'Amministratore', value: 'admin' },
        { label: 'Redattore (pubblica)', value: 'editor' },
        { label: 'Assistente AI (solo bozze)', value: 'assistant' },
      ],
      access: { create: ({ req: { user } }) => roleOf(user) === 'admin', update: ({ req: { user } }) => roleOf(user) === 'admin' },
    },
  ],
}
