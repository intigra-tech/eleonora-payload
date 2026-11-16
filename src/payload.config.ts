import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { mcpPlugin } from '@payloadcms/plugin-mcp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { ProjectCategories } from './collections/ProjectCategories'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'
import { roleOf } from './lib/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — Eleonora Righi' },
  },
  serverURL: process.env.SITE_URL || undefined,
  collections: [Pages, Projects, ProjectCategories, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    mcpPlugin({
      userCollection: 'users',
      collections: {
        pages: { enabled: { find: true, create: true, update: true }, description: 'Pagine del sito (home, chi-sono, contatti, progetti) composte da blocchi. Le modifiche restano in bozza finché il cliente non le pubblica.' },
        projects: { enabled: { find: true, create: true, update: true }, description: 'Progetti del portfolio (titolo, copertina, testo, galleria). Le modifiche restano in bozza.' },
        'project-categories': { enabled: { find: true } , description: 'Categorie dei progetti (sola lettura).' },
        media: { enabled: { find: true }, description: 'Libreria immagini (sola lettura).' },
      },
      globals: { 'site-settings': { enabled: { find: true }, description: 'Impostazioni generali del sito (sola lettura).' } },
      overrideApiKeyCollection: (collection) => {
        const adminOnly = ({ req: { user } }: { req: { user?: unknown } }) => roleOf(user) === 'admin'
        return {
          ...collection,
          access: { ...collection.access, create: adminOnly, read: adminOnly, update: adminOnly, delete: adminOnly },
          fields: collection.fields.map((f) =>
            'name' in f && f.name === 'user' ? ({ ...f, access: { create: adminOnly, update: adminOnly } } as typeof f) : f,
          ),
        } as typeof collection
      },
    }),
  ],
})
