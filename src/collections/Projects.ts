import type { CollectionConfig } from 'payload'
import { canWrite, isStaff, publishedOrAuth, forceDraftForAssistant, blockPublishForAssistant } from '../lib/access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Progetto', plural: 'Progetti' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'categories', 'order', 'updatedAt'] },
  access: { read: publishedOrAuth, create: canWrite, update: canWrite, delete: isStaff },
  hooks: { beforeOperation: [forceDraftForAssistant], beforeValidate: [blockPublishForAssistant] },
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', label: 'Titolo', required: true },
    { name: 'slug', type: 'text', label: 'Slug (URL)', required: true, unique: true, index: true },
    { name: 'order', type: 'number', label: 'Ordine in elenco', defaultValue: 100, admin: { position: 'sidebar' } },
    { name: 'categories', type: 'relationship', relationTo: 'project-categories', hasMany: true, label: 'Categorie', admin: { position: 'sidebar' } },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Immagine di copertina', required: true },
    {
      name: 'body',
      type: 'textarea',
      label: 'Testo (paragrafi separati da riga vuota; **grassetto** supportato)',
      admin: { rows: 10 },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galleria',
      labels: { singular: 'Immagine', plural: 'Immagini' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Titolo SEO' },
        { name: 'description', type: 'textarea', label: 'Meta description' },
      ],
    },
  ],
}
