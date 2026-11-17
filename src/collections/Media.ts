import type { CollectionConfig } from 'payload'
import { canWrite, isStaff, roleOf } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Immagine', plural: 'Immagini' },
  access: { read: () => true, create: canWrite, update: canWrite, delete: isStaff },
  hooks: {
    // L'assistente AI può cambiare solo il testo alternativo.
    beforeChange: [({ data, originalDoc, req, operation }) => (operation === 'update' && roleOf(req.user) === 'assistant' && originalDoc ? { ...originalDoc, alt: data.alt } : data)],
  },
  admin: { useAsTitle: 'alt', defaultColumns: ['filename', 'alt', 'createdAt'] },
  fields: [{ name: 'alt', type: 'text', label: 'Testo alternativo', required: true }],
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 640, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 1200, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'large', width: 2000, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    adminThumbnail: 'thumb',
  },
}
