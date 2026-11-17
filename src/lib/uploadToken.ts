import { createHmac, timingSafeEqual } from 'crypto'

const sign = (p: string) => createHmac('sha256', process.env.PAYLOAD_SECRET || '').update(p).digest('base64url')

export function makeUploadToken(ttlMinutes = 120): string {
  const exp = String(Date.now() + ttlMinutes * 60_000)
  return `${exp}.${sign(exp)}`
}
export function checkUploadToken(t: string | null | undefined): boolean {
  if (!t) return false
  const [exp, sig] = t.split('.')
  if (!exp || !sig || !(Number(exp) > Date.now())) return false
  const a = Buffer.from(sig), b = Buffer.from(sign(exp))
  return a.length === b.length && timingSafeEqual(a, b)
}

// Token generico firmato (es. approvazione): "<dati>.<exp>.<firma>", dati senza punti.
export function signData(data: string, ttlMinutes = 1440): string {
  const body = `${data}.${Date.now() + ttlMinutes * 60_000}`
  return `${body}.${sign(body)}`
}
export function readData(t: string | null | undefined): string | null {
  if (!t) return null
  const i = t.lastIndexOf('.')
  if (i < 0) return null
  const body = t.slice(0, i), sig = t.slice(i + 1)
  const a = Buffer.from(sig), b = Buffer.from(sign(body))
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  const j = body.lastIndexOf('.')
  if (!(Number(body.slice(j + 1)) > Date.now())) return null
  return body.slice(0, j)
}
