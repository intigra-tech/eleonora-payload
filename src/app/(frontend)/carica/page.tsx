import type { Metadata } from 'next'
import { checkUploadToken } from '../../../lib/uploadToken'
import UploadForm from './UploadForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Carica foto', robots: { index: false, follow: false } }

export default async function Page({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams
  const ok = checkUploadToken(t)
  return (
    <div className="c" style={{ maxWidth: 720, padding: '80px 20px 120px' }}>
      <h2>Carica le foto</h2>
      {ok ? <UploadForm token={t!} /> : <p>Questo link è scaduto o non è valido. Chiedi un nuovo link a Claude.</p>}
    </div>
  )
}
