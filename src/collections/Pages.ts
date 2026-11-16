import type { CollectionConfig } from 'payload'
import { canWrite, isStaff, publishedOrAuth, forceDraftForAssistant, blockPublishForAssistant } from '../lib/access'
import { allBlocks } from '../blocks/config'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Pagina', plural: 'Pagine' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'] },
  access: { read: publishedOrAuth, create: canWrite, update: canWrite, delete: isStaff },
  hooks: { beforeOperation: [forceDraftForAssistant], beforeValidate: [blockPublishForAssistant] },
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', label: 'Titolo pagina', required: true },
    { name: 'slug', type: 'text', label: 'Slug (URL; "home" per la home page)', required: true, unique: true, index: true },
    { name: 'layout', type: 'blocks', label: 'Sezioni della pagina', blocks: allBlocks },
  ],
}
