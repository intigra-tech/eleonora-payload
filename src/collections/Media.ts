import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Immagine', plural: 'Immagini' },
  access: { read: () => true },
  admin: { useAsTitle: 'alt' },
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
