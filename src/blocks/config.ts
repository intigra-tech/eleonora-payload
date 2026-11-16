import type { Block } from 'payload'

const link = (name = 'link') => ({ name, type: 'text' as const, label: 'Link' })

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero (titolo + immagine)', plural: 'Hero' },
  fields: [
    { name: 'title', type: 'text', label: 'Titolo principale (H1)', required: true },
    { name: 'subtitle', type: 'text', label: 'Sottotitolo' },
    { name: 'text', type: 'textarea', label: 'Testo (paragrafi separati da riga vuota)' },
    { name: 'buttonLabel', type: 'text', label: 'Testo pulsante' },
    link('buttonLink'),
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Immagine' },
  ],
}

export const Steps: Block = {
  slug: 'steps',
  labels: { singular: 'Elenco di fasi', plural: 'Elenchi di fasi' },
  fields: [
    { name: 'heading', type: 'text', label: 'Titolo', required: true },
    {
      name: 'items',
      type: 'array',
      label: 'Fasi',
      fields: [
        { name: 'title', type: 'text', label: 'Titolo', required: true },
        { name: 'text', type: 'textarea', label: 'Testo' },
      ],
    },
    { name: 'imageA', type: 'upload', relationTo: 'media', label: 'Immagine' },
  ],
}

export const Features: Block = {
  slug: 'features',
  labels: { singular: 'Punti di forza', plural: 'Punti di forza' },
  fields: [
    { name: 'heading', type: 'text', label: 'Titolo', required: true },
    {
      name: 'items',
      type: 'array',
      label: 'Punti',
      fields: [
        { name: 'title', type: 'text', label: 'Titolo', required: true },
        { name: 'text', type: 'textarea', label: 'Testo' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Immagine' },
  ],
}

export const CallToAction: Block = {
  slug: 'cta',
  labels: { singular: 'Invito all’azione', plural: 'Inviti all’azione' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Sopratitolo' },
    { name: 'heading', type: 'text', label: 'Titolo', required: true },
    { name: 'text', type: 'textarea', label: 'Testo' },
    { name: 'buttonLabel', type: 'text', label: 'Testo pulsante' },
    link('buttonLink'),
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Immagine' },
  ],
}

export const ProjectsGrid: Block = {
  slug: 'projectsGrid',
  labels: { singular: 'Griglia progetti', plural: 'Griglie progetti' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Sopratitolo' },
    { name: 'heading', type: 'text', label: 'Titolo' },
    { name: 'intro', type: 'text', label: 'Testo introduttivo' },
    { name: 'limit', type: 'number', label: 'Quanti progetti mostrare (vuoto = tutti)' },
    { name: 'buttonLabel', type: 'text', label: 'Testo pulsante "tutti i progetti"' },
    link('buttonLink'),
  ],
}

export const About: Block = {
  slug: 'about',
  labels: { singular: 'Chi sono', plural: 'Chi sono' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Sopratitolo' },
    { name: 'heading', type: 'text', label: 'Titolo', required: true },
    { name: 'text', type: 'textarea', label: 'Testo (paragrafi separati da riga vuota)' },
    { name: 'badges', type: 'array', label: 'Etichette', fields: [{ name: 'label', type: 'text', required: true }] },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Immagine' },
    { name: 'buttonLabel', type: 'text', label: 'Testo pulsante' },
    link('buttonLink'),
  ],
}

export const ContactInfo: Block = {
  slug: 'contactInfo',
  labels: { singular: 'Recapiti', plural: 'Recapiti' },
  fields: [
    { name: 'heading', type: 'text', label: 'Titolo', required: true },
    { name: 'intro', type: 'textarea', label: 'Testo introduttivo (paragrafi separati da riga vuota)' },
    { name: 'note', type: 'text', label: 'Nota (es. solo su appuntamento)' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Immagine' },
  ],
}

export const allBlocks = [Hero, Steps, Features, CallToAction, ProjectsGrid, About, ContactInfo]
