import type { Metadata } from 'next'
import { resolveApproval } from '@/lib/approval'
import { Blocks } from '@/components/Blocks'
import { ProjectView } from '@/components/ProjectView'
import ApproveBar from './ApproveBar'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Anteprima bozza', robots: { index: false, follow: false } }

const msg: Record<string, string> = {
  invalid: 'Questo link non è valido o è scaduto. Chiedi a Claude un nuovo link.',
  changed: 'La bozza è stata modificata dopo la creazione di questo link. Chiedi a Claude un nuovo link di approvazione.',
  done: 'Questo contenuto è già stato pubblicato.',
}

export default async function Page({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams
  const r = await resolveApproval(t)
  if (r.state !== 'ok') return <div className="c" style={{ maxWidth: 720, padding: '90px 20px 140px' }}><h2>Anteprima bozza</h2><p>{msg[r.state]}</p></div>
  return (
    <>
      <ApproveBar token={t!} title={r.doc.title} />
      {r.collection === 'projects' ? <ProjectView p={r.doc} /> : <Blocks layout={r.doc.layout} />}
    </>
  )
}
