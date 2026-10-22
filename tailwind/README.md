# CSS Tailwind compilato

Le pagine del sito non usano più il CDN di Tailwind (`cdn.tailwindcss.com`), che generava il CSS nel browser a ogni visita e rallentava molto il caricamento su smartphone. Il CSS è già compilato in `assets/css/` e collegato in fondo all'`<head>` di ogni pagina (stessa posizione in cui il CDN inseriva il suo `<style>`, così l'ordine delle regole non cambia).

Ci sono tre file perché nel sito esistono tre configurazioni Tailwind leggermente diverse (alcuni colori cambiano tra un gruppo di pagine e l'altro):

| File | Config | Pagine |
|---|---|---|
| `assets/css/tw-base.css` | `config-base.js` | home, Chi sono, Metodo, Reset Notturno, Privacy, Cookie, 4 profili del quiz |
| `assets/css/tw-funnel.css` | `config-funnel.js` | blog (anche il template), /centro/, /quiz/, Contenuti, Rituale Serale, anteprime |
| `assets/css/tw-svolta.css` | `config-svolta.js` | Sessione di Svolta |

## Quando ricompilare

Il CSS contiene solo le classi Tailwind già presenti nelle pagine. **Se aggiungi o cambi classi Tailwind in una pagina (o crei una pagina nuova), va ricompilato**, altrimenti le classi nuove non hanno stile.

```bash
cd tailwind
npm install      # solo la prima volta
npm run build    # rigenera i tre file in assets/css/
```

Poi committa anche i file in `assets/css/`. Coolify non esegue nessuna build: pubblica i file così come sono nel repo.

Una pagina nuova va aggiunta all'elenco `content` della config del suo gruppo (il blog, /centro/ e /quiz/ sono già coperti con `**`), e nell'`<head>` deve avere il `<link>` al file del gruppo, prima di `</head>`.
