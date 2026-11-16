import { marked } from 'marked'

export const paragraphs = (s?: string | null): string[] =>
  (s || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)

export const inline = (s?: string | null): string => (s ? (marked.parseInline(s, { async: false }) as string) : '')
