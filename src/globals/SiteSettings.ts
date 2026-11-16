import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Impostazioni del sito',
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text', label: 'Nome del sito', required: true, defaultValue: 'Eleonora Righi' },
    { name: 'tagline', type: 'text', label: 'Descrizione breve', defaultValue: 'Architetto d’interni' },
    {
      name: 'nav',
      type: 'array',
      label: 'Menu',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'contacts',
      type: 'group',
      label: 'Recapiti',
      fields: [
        { name: 'addressTitle', type: 'text', label: 'Etichetta indirizzo' },
        { name: 'address', type: 'textarea', label: 'Indirizzo' },
        { name: 'email', type: 'text', label: 'Email' },
        { name: 'phone', type: 'text', label: 'Telefono' },
        { name: 'hours', type: 'text', label: 'Orari' },
      ],
    },
    { name: 'footerText', type: 'text', label: 'Testo del piè di pagina' },
    { name: 'gaId', type: 'text', label: 'ID Google Analytics (G-XXXX; caricato solo dopo il consenso)' },
  ],
}
