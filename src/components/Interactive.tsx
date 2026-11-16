'use client'
import { useState } from 'react'

type Item = { title: string; html: string }

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="acc">
      {items.map((it, k) => {
        const isOpen = open === k
        return (
          <div key={k} className={isOpen ? 'acc-item open' : 'acc-item'}>
            <button type="button" className="acc-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : k)}>
              <span>{it.title}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                {isOpen ? <path d="M1 7h12" /> : <path d="M4.5 1.5 10 7l-5.5 5.5" />}
              </svg>
            </button>
            {isOpen && <div className="acc-body" dangerouslySetInnerHTML={{ __html: it.html }} />}
          </div>
        )
      })}
    </div>
  )
}

export function Tabs({ items }: { items: Item[] }) {
  const [on, setOn] = useState(0)
  return (
    <div className="tabs">
      <div className="tabs-bar" role="tablist">
        {items.map((it, k) => (
          <button key={k} type="button" role="tab" aria-selected={on === k} className={on === k ? 'tab on' : 'tab'} onClick={() => setOn(k)}>
            {it.title}
          </button>
        ))}
      </div>
      <div className="tabs-body" role="tabpanel" dangerouslySetInnerHTML={{ __html: items[on]?.html }} />
    </div>
  )
}
