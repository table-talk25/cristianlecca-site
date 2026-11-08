# Blog: `posts.json`

`blog/posts.json` e' l'elenco degli articoli (piu' recente per primo). Lo legge la pagina `blog/index.html`
e anche gli "Altri articoli" in fondo a ogni articolo. Lo scrive il workflow n8n alla pubblicazione.

## Cosa va aggiornato a ogni nuovo articolo

`posts.json` e `blog/sitemap-blog.xml` li scrive il workflow. Questi altri punti, per ora, si aggiornano a mano
(o con il workflow, se lo si estende), perche' devono essere leggibili anche senza JavaScript:
- la card statica in testa all'elenco di `blog/index.html` (stesso markup delle altre);
- la voce in `llms.txt`, sezione «Articoli del blog»;
- la `lastmod` di `/blog/` in `sitemap.xml`;
- l'elenco nei dati strutturati di `blog/index.html` (`#blog-jsonld`): con JavaScript si riallinea da solo a `posts.json`.

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

## Ricerca nell'elenco (`/blog/`)

C'e' una lente in alto a destra dell'elenco: al tocco si apre un campo che filtra le card mentre si scrive,
cercando nel titolo e nell'estratto (senza distinguere maiuscole e accenti). Funziona solo con JavaScript; senza,
la lente non compare e l'elenco resta com'e'. Il testo cercato non viene inviato a nessuno (nessun evento, nessuna richiesta).
Le card restano nel codice della pagina, quindi i motori di ricerca le leggono normalmente.

## Idee per quando gli articoli saranno piu' di 10 (da riprendere verso meta' dicembre 2026)

Decise insieme a Ele il 7 novembre 2026: con 4 articoli la ricerca basta; il resto ha senso dopo una decina di articoli.

1. **Filtro per argomento.** Una riga di etichette sopra le card («Stanchezza», «Decisioni», «Alimentazione»...)
   che filtra l'elenco. Serve un campo opzionale `tags` in `posts.json` (lista di stringhe), che il workflow n8n
   dovra' compilare. Senza `tags` la voce compare solo in «Tutti».
2. **Indice laterale per mese o anno** (archivio). Non servono campi nuovi, la `date` c'e' gia'.
   Su desktop in una colonna stretta a lato dell'elenco, su telefono come menu a tendina sopra le card.
   Da valutare insieme alla griglia a due colonne, che oggi occupa tutta la larghezza.
3. **«Carica altri articoli»** (o paginazione) quando l'elenco diventa lungo, mostrando per esempio i primi 8-10.
4. **Pagine per argomento** (`/blog/argomento/<tag>/`), solo se gli argomenti diventano abbastanza grandi: sono utili
   per la SEO, ma richiedono pagine statiche generate dal workflow.

Attenzione quando si aggiungono filtri: l'elenco completo deve restare nel codice statico della pagina (o in
`blog/sitemap-blog.xml` e `llms.txt`), perche' i motori di ricerca e gli assistenti AI non usano i filtri.
