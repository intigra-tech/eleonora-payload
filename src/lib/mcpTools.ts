import { z } from 'zod3'
import dns from 'dns/promises'
import net from 'net'
import type { PayloadRequest } from 'payload'
import type { MCPPluginConfig } from '@payloadcms/plugin-mcp'
import { makeUploadToken, signData } from './uploadToken'
import { approvalPayload } from './approval'

const SITE = () => (process.env.SITE_URL || 'https://eleonora.intigra.it').replace(/\/$/, '')
const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] })

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number)
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224
  }
  const l = ip.toLowerCase()
  return l === '::1' || l === '::' || l.startsWith('fc') || l.startsWith('fd') || l.startsWith('fe80') || l.startsWith('::ffff:')
}

export const mcpInstructions = `Sei l'assistente che aiuta il cliente a gestire il sito di Eleonora Righi (architetto, Carpi).
REGOLE DI LAVORO
- Ogni modifica a pagine e progetti viene salvata SEMPRE come bozza: tu non puoi pubblicare, e non è un errore. Non riprovare a pubblicare.
- Dopo ogni modifica di pagine/progetti dici cosa hai cambiato e chiami createApprovalLink (collection + id) per dare al cliente il link di approvazione: lo apre senza login, vede l'anteprima e preme "Pubblica". NON dare link all'area /admin e non chiedere login. Se modifichi ancora la bozza, crea un nuovo link. Finché il cliente non pubblica, il sito online resta invariato.
- Per creare/modificare usa i campi esistenti; le immagini si collegano con l'ID del media. Per vedere le immagini già presenti usa findMedia.
FOTO NUOVE
- Non puoi ricevere file dalla chat. Per caricarle: (1) se il cliente ha un link pubblico https alla foto usa importImageFromUrl; (2) altrimenti usa createUploadLink e dai al cliente il link: apre la pagina, trascina le foto e torna da te a dire "fatto". Poi cerca le immagini nuove con findMedia (le più recenti) e collegale alla bozza.
- Il link di caricamento va usato UNA volta: dopo "fatto" cerca le foto con findMedia, non creare altri link e non chiedere di ricaricare. Non dire che ci sono doppioni se non li vedi.
- TESTI ALTERNATIVI (alt): le foto nuove hanno come alt il nome del file. Guarda le foto che il cliente ti ha mostrato in chat, PROPONI un alt breve e descrittivo per ognuna (es. "Cucina in rovere con striscia LED a soffitto"), CHIEDI conferma o correzioni, e solo dopo salvali con updateMedia (puoi cambiare solo il campo alt).
NON puoi cancellare contenuti, né cambiare impostazioni, struttura o grafica del sito.`

export const customTools: NonNullable<NonNullable<MCPPluginConfig['mcp']>['tools']> = [
  {
    name: 'createApprovalLink',
    description: 'Crea il link di approvazione per una bozza (pagina o progetto): il cliente lo apre SENZA login, vede l\'anteprima di come apparirà e preme "Pubblica". Valido 24 ore e solo per la bozza attuale: se la modifichi di nuovo, crea un nuovo link.',
    parameters: {
      collection: z.enum(['pages', 'projects']).describe('pages = pagina, projects = progetto'),
      id: z.string().describe('ID del documento'),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
      const collection = args.collection as 'pages' | 'projects'
      const doc = (await req.payload.findByID({ collection, id: String(args.id), draft: true, depth: 0, overrideAccess: true }).catch(() => null)) as unknown as { _status?: string; updatedAt: string; title?: string } | null
      if (!doc) return text('Errore: documento non trovato.')
      if (doc._status === 'published') return text('Questo contenuto è già pubblicato e non ha modifiche in bozza.')
      return text(`Link di approvazione per "${doc.title}" (24 ore): ${SITE()}/approva?t=${signData(approvalPayload(collection, String(args.id), doc.updatedAt))}\nDallo al cliente: vede l\'anteprima e preme "Pubblica", senza login.`)
    },
  },
  {
    name: 'createUploadLink',
    description: 'Crea un link temporaneo (2 ore) con cui il cliente può caricare foto nella libreria del sito trascinandole in una pagina, senza fare login. Da usare quando servono foto nuove.',
    parameters: {},
    handler: async () => text(`Link di caricamento (valido 2 ore): ${SITE()}/carica?t=${makeUploadToken(120)}\nDai questo link al cliente: apre la pagina, trascina le foto e conferma. Poi usa findMedia per trovare le immagini appena caricate.`),
  },
  {
    name: 'importImageFromUrl',
    description: 'Scarica un\'immagine da un URL pubblico https (max 15 MB) e la aggiunge alla libreria immagini. Restituisce l\'ID del media da collegare a pagine o progetti.',
    parameters: {
      url: z.string().url().describe('URL https pubblico dell\'immagine'),
      alt: z.string().min(3).describe('Testo alternativo descrittivo dell\'immagine'),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
      const url = new URL(String(args.url))
      if (url.protocol !== 'https:') return text('Errore: serve un URL https.')
      const addrs = await dns.lookup(url.hostname, { all: true }).catch(() => [])
      if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) return text('Errore: indirizzo non consentito o non raggiungibile.')
      const res = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20_000) }).catch(() => null)
      if (!res || !res.ok) return text(`Errore: download non riuscito (${res?.status ?? 'rete'}).`)
      const mime = (res.headers.get('content-type') || '').split(';')[0].trim()
      if (!mime.startsWith('image/')) return text(`Errore: il file non è un'immagine (${mime || 'tipo sconosciuto'}).`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length > 15 * 1024 * 1024) return text('Errore: immagine oltre 15 MB.')
      const name = decodeURIComponent(url.pathname.split('/').pop() || 'immagine').replace(/[^\w.\-]+/g, '_') || 'immagine.jpg'
      const doc = await req.payload.create({ collection: 'media', data: { alt: String(args.alt) }, file: { data: buf, mimetype: mime, name, size: buf.length } })
      return text(`Immagine caricata. ID media: ${doc.id} (${doc.filename}).`)
    },
  },
]
