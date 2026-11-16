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
  const c = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (existing.totalDocs > 0) return syncPages(payload, c, dir)
  payload.logger.info('Seed: avvio importazione contenuti')

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const u = await payload.count({ collection: 'users' })
    if (u.totalDocs === 0)
      await payload.create({ collection: 'users', data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: 'Admin', role: 'admin' } })
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
        _status: 'published', cover: media[p.cover], gallery: p.gallery.map((g: string) => ({ image: media[g] })),
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    })

  for (const pg of c.pages)
    await payload.create({ collection: 'pages', data: { ...resolve(pg), _status: 'published' } as any }) // eslint-disable-line @typescript-eslint/no-explicit-any

  await payload.updateGlobal({ slug: 'site-settings', data: { ...c.site, contentVersion: c.version || 1 } })
  payload.logger.info('Seed: completato')
}

/* Aggiorna le pagine (non i progetti) quando il seed contiene una versione più nuova. Una tantum per versione. */
async function syncPages(payload: any, c: any, dir: string) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const site: any = await payload.findGlobal({ slug: 'site-settings' }) // eslint-disable-line @typescript-eslint/no-explicit-any
  const want = c.version || 1
  if ((site.contentVersion || 1) >= want) return
  payload.logger.info(`Seed: aggiornamento pagine alla versione ${want}`)
  const docs = (await payload.find({ collection: 'media', limit: 2000, sort: 'id', depth: 0, pagination: false })).docs
  const media: Record<string, number | string> = {}
  const rels: string[] = c.media
  for (const [i, rel] of rels.entries()) {
    const base = path.basename(rel).replace(/\.[^.]+$/, '')
    const d = docs[i]
    if (d && String(d.filename).startsWith(base)) { media[rel] = d.id; continue }
    const found = docs.find((x: any) => String(x.filename).startsWith(base)) // eslint-disable-line @typescript-eslint/no-explicit-any
    if (found) { media[rel] = found.id; continue }
    const doc = await payload.create({ collection: 'media', data: { alt: 'Eleonora Righi — architetto d’interni' }, filePath: path.join(dir, 'uploads', rel) })
    media[rel] = doc.id
  }
  const resolve = (x: any): any => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Array.isArray(x)) return x.map(resolve)
    if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, resolve(v)]))
    if (typeof x === 'string' && x.startsWith('@')) return media[x.slice(1)]
    return x
  }
  for (const pg of c.pages) {
    const r = await payload.find({ collection: 'pages', where: { slug: { equals: pg.slug } }, limit: 1 })
    if (r.docs[0]) await payload.update({ collection: 'pages', id: r.docs[0].id, data: { ...resolve(pg), _status: 'published' } as any })
    else await payload.create({ collection: 'pages', data: { ...resolve(pg), _status: 'published' } as any })
  }
  await payload.updateGlobal({ slug: 'site-settings', data: { contentVersion: want } })
  payload.logger.info('Seed: pagine aggiornate')
}
