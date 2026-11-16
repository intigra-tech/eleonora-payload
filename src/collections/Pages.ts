import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks/config'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Pagina', plural: 'Pagine' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'] },
  access: { read: () => true },
  versions: { drafts: false, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', label: 'Titolo pagina', required: true },
    { name: 'slug', type: 'text', label: 'Slug (URL; "home" per la home page)', required: true, unique: true, index: true },
    { name: 'layout', type: 'blocks', label: 'Sezioni della pagina', blocks: allBlocks },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Titolo SEO' },
        { name: 'description', type: 'textarea', label: 'Meta description' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Immagine di condivisione' },
      ],
    },
  ],
}
