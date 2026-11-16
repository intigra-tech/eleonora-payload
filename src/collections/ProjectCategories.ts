import type { CollectionConfig } from 'payload'
import { isStaff } from '../lib/access'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  labels: { singular: 'Categoria progetto', plural: 'Categorie progetti' },
  admin: { useAsTitle: 'title' },
  access: { read: () => true, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'title', type: 'text', label: 'Titolo', required: true },
    { name: 'slug', type: 'text', label: 'Slug (URL)', required: true, unique: true, index: true },
  ],
}
