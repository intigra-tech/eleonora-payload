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
