# eleonora — Payload CMS + Next.js (pilota eleonorarighi.com)

Sito di Eleonora Righi, architetto d'interni (Carpi). Payload 3 + Postgres.

- Contenuti: pagine a blocchi (`pages`), progetti (`projects`), categorie, immagini (`media`), impostazioni (`site-settings`).
- Al primo avvio, se il database è vuoto, importa `seed/content.json` + `seed/uploads` (copia di eleonorarighi.com) e crea l'utente admin da `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Migrazioni: `npm run payload -- migrate:create <nome>` dopo ogni modifica agli schemi; vengono applicate all'avvio.
- Deploy: `docker-compose.yml` (app + Postgres) su Coolify; `NOINDEX=1` finché il sito non è pubblico.
