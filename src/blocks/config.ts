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
    { name: 'imageWidth', type: 'number', label: 'Larghezza immagine in px (vuoto = 414)' },
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
    {
      name: 'variant',
      type: 'select',
      label: 'Stile',
      defaultValue: 'box',
      options: [
        { label: 'Riquadro grigio con immagine', value: 'box' },
        { label: 'Fascia scura centrata con sfondo', value: 'dark' },
      ],
    },
    { name: 'background', type: 'upload', relationTo: 'media', label: 'Immagine di sfondo (stile scuro)' },
  ],
}

export const PageBanner: Block = {
  slug: 'pageBanner',
  labels: { singular: 'Banner nero con titolo', plural: 'Banner neri' },
  fields: [
    { name: 'title', type: 'text', label: 'Titolo (H1)', required: true },
    { name: 'subtitle', type: 'text', label: 'Sottotitolo' },
  ],
}

export const Profile: Block = {
  slug: 'profile',
  labels: { singular: 'Presentazione (testo + ritratto)', plural: 'Presentazioni' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Sopratitolo' },
    { name: 'heading', type: 'text', label: 'Titolo', required: true },
    { name: 'text', type: 'textarea', label: 'Testo (paragrafi separati da riga vuota; **grassetto** supportato)' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Ritratto' },
    {
      name: 'columns',
      type: 'array',
      label: 'Colonne di testo sotto',
      maxRows: 2,
      fields: [{ name: 'text', type: 'textarea', label: 'Testo', required: true }],
    },
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
    {
      name: 'layout',
      type: 'select',
      label: 'Disposizione',
      defaultValue: 'squares',
      options: [
        { label: 'Griglia di quadrati (3 colonne)', value: 'squares' },
        { label: 'Immagini grandi a tutta larghezza', value: 'gallery' },
      ],
    },
    { name: 'buttonLabel', type: 'text', label: 'Testo pulsante (opzionale)' },
    link('buttonLink'),
  ],
}

export const About: Block = {
  slug: 'about',
  labels: { singular: 'Chi sono', plural: 'Chi sono' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Sopratitolo' },
    { name: 'heading', type: 'text', label: 'Titolo', required: true },
    { name: 'text', type: 'textarea', label: 'Testo (se non ci sono schede)' },
    {
      name: 'tabs',
      type: 'array',
      label: 'Schede (Esperienza / Qualità / Recensioni…)',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'text', type: 'textarea', label: 'Testo (**grassetto** supportato)', required: true },
      ],
    },
    { name: 'badges', type: 'array', label: 'Etichette (non usate)', admin: { condition: () => false }, fields: [{ name: 'label', type: 'text', required: true }] },
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

export const allBlocks = [Hero, Steps, Features, CallToAction, PageBanner, Profile, ProjectsGrid, About, ContactInfo]
