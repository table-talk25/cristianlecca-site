# Blog: `posts.json`

`blog/posts.json` e' l'elenco degli articoli (piu' recente per primo). Lo legge la pagina `blog/index.html`
e anche gli "Altri articoli" in fondo a ogni articolo. Lo scrive il workflow n8n alla pubblicazione.

## Campi

Obbligatori (quelli che scrive n8n oggi):

| Campo     | Esempio                                   |
|-----------|-------------------------------------------|
| `slug`    | `rimandare-una-decisione`                 |
| `title`   | titolo mostrato nell'elenco               |
| `excerpt` | estratto (di solito la meta description)  |
| `date`    | `2026-09-25` (AAAA-MM-GG)                 |
| `url`     | `/blog/rimandare-una-decisione/`          |

Opzionali, per la miniatura nell'elenco `/blog/`:

| Campo      | Esempio                                                | Note |
|------------|--------------------------------------------------------|------|
| `image`    | `/assets/blog/articolo-<slug>-2.jpg`                   | percorso assoluto sul sito (inizia con `/`, non con `//`) |
| `imageAlt` | `Una persona davanti al frigorifero aperto...`         | testo alternativo; se manca l'alt resta vuoto |

- Senza `image` la card e' solo testo, identica a prima: nessuno spazio vuoto e nessuna immagine di riserva.
- Se il file non si carica, la miniatura sparisce e la card resta solo testo.
- Per gli articoli nuovi la miniatura e' la prima immagine interna (`articolo-<slug>-2.jpg`), **mai la hero**:
  la hero e' sempre la stessa foto di Cristian in studio.
- Il template `blog/_template/articolo.html` non cambia: i due campi riguardano solo l'elenco.
