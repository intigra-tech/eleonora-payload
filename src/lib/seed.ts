import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

/* Importa il contenuto iniziale (copia di eleonorarighi.com) se il database è vuoto. */
export async function seedIfEmpty() {
  const dir = process.env.SEED_DIR || path.resolve(process.cwd(), 'seed')
  const file = path.join(dir, 'content.json')
  if (!fs.existsSync(file)) return
  const payload = await getPayload({ config })
  const existing = await payload.count({ collection: 'pages' })
  if (existing.totalDocs > 0) return
  const c = JSON.parse(fs.readFileSync(file, 'utf8'))
  payload.logger.info('Seed: avvio importazione contenuti')

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const u = await payload.count({ collection: 'users' })
    if (u.totalDocs === 0)
      await payload.create({ collection: 'users', data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: 'Admin' } })
  }

  const titleOf: Record<string, string> = {}
  for (const p of c.projects) for (const g of p.gallery) titleOf[g] ??= p.title
  const media: Record<string, number | string> = {}
  for (const rel of c.media as string[]) {
    const fp = path.join(dir, 'uploads', rel)
    const alt = titleOf[rel] ? `${titleOf[rel]} — Eleonora Righi` : 'Eleonora Righi — architetto d’interni'
    const doc = await payload.create({ collection: 'media', data: { alt }, filePath: fp })
    media[rel] = doc.id
  }
  const resolve = (x: any): any => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Array.isArray(x)) return x.map(resolve)
    if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, resolve(v)]))
    if (typeof x === 'string' && x.startsWith('@')) return media[x.slice(1)]
    return x
  }

  const cats: Record<string, number | string> = {}
  for (const k of c.categories) cats[k.slug] = (await payload.create({ collection: 'project-categories', data: k })).id

  for (const p of c.projects)
    await payload.create({
      collection: 'projects',
      data: {
        title: p.title, slug: p.slug, order: p.order, body: p.body, seo: p.seo,
        categories: p.categories.map((s: string) => cats[s]).filter(Boolean),
        cover: media[p.cover], gallery: p.gallery.map((g: string) => ({ image: media[g] })),
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    })

  for (const pg of c.pages)
    await payload.create({ collection: 'pages', data: resolve(pg) as any }) // eslint-disable-line @typescript-eslint/no-explicit-any

  await payload.updateGlobal({ slug: 'site-settings', data: c.site })
  payload.logger.info('Seed: completato')
}
