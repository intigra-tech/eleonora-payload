import type { CollectionConfig } from 'payload'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  labels: { singular: 'Categoria progetto', plural: 'Categorie progetti' },
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', label: 'Titolo', required: true },
    { name: 'slug', type: 'text', label: 'Slug (URL)', required: true, unique: true, index: true },
  ],
}
