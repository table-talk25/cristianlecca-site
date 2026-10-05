# Rituale Serale — pagine nascoste

File: `rituale-serale/index.html`, `rituale-serale-grazie/index.html`.

## Da fare prima della pubblicazione (cerca `TODO` nei file)
- `WEBHOOK_URL` (costante in cima allo script del sondaggio): indirizzo del webhook n8n. Oggi è il segnaposto `https://INSERISCI-WEBHOOK`.
- Indirizzo per la revoca del consenso (segnaposto `[INDIRIZZO DA INSERIRE]`, in giallo). Se cambi il testo di consenso, cambia anche `CONSENT_TEXT_VERSION` (oggi `v1`).
- Privacy: la sezione `#rituale-serale` (n. 12) è in `/privacy/`. Va riletta quando è definito l'indirizzo di revoca e se cambiano i tempi di conservazione (oggi 24 mesi, come il quiz).
- Embed audio di prova: sostituisci il riquadro `#audioSlot`.
- Header `X-Robots-Tag: noindex` sul server (vedi sotto).

## Header X-Robots-Tag
Il repo non contiene la configurazione del server, quindi l'header va aggiunto in Coolify. Esempio nginx:

    location ~ ^/rituale-serale(-grazie)?/?$ {
        add_header X-Robots-Tag "noindex, nofollow, noarchive" always;
        try_files $uri $uri/ $uri/index.html =404;
    }

Le pagine hanno già `<meta name="robots" content="noindex, nofollow, noarchive">`.
NON aggiungerle a `robots.txt` né a `sitemap.xml`.

## Prova in locale
    python3 -m http.server 8000
    # http://localhost:8000/rituale-serale/?utm_source=spotify
Per provare l'invio senza il webhook reale, imposta `WEBHOOK_URL` su un mock locale che risponda 200. Dopo un invio riuscito la pagina rimanda alla pagina di ringraziamento per 6 ore (cooldown): per riprovare cancella la chiave `rituale_submitted_at` da localStorage.
Nessun Google Analytics né Meta Pixel su queste due pagine, di proposito.
Il campo trappola e il tempo minimo di compilazione (8 s) bloccano invii troppo rapidi.

## Invio dei dati (webhook n8n)
Un solo `fetch` POST in JSON a `WEBHOOK_URL`, nessuna chiave o token nella pagina:

    {
      "survey": { "interest": 1-5, "states": ["rallentare"|"lasciare_andare"|"chiudere"|"prepararsi"],
                  "duration": "breve"|"lunga"|"dipende", "time_slot": "prima_21"|"21_22"|"dopo_22"|"varia",
                  "frequency": "ogni_sera"|"qualche_sera"|"al_bisogno",
                  "price_range": "fino_10"|"10_15"|"oltre_15"|"no_pay", "free_text": "max 1000 caratteri" },
      "waitlist": null | { "email": "...", "consent_rituale": true, "consent_text_version": "v1" },
      "source": "email"|"spotify"|"facebook"|"instagram"|"youtube"|"altro",
      "website": "",            // campo trappola: deve restare vuoto
      "elapsed_ms": 12345       // dall'apertura della pagina all'invio
    }

- Stato 200 = salvato: la pagina va a `/rituale-serale-grazie/`. Qualsiasi altro stato, o errore di rete, mostra un messaggio d'errore e le risposte restano nel modulo. Il corpo della risposta non viene letto.
- `source` viene da `utm_source` (altrimenti `altro`). Data e ora del consenso non sono nel payload: le aggiunge il flusso n8n.
- Il webhook deve accettare richieste dal dominio del sito (CORS, header `Content-Type: application/json`).
- Risposte e email arrivano insieme nella stessa richiesta: per mantenere anonime le risposte, il flusso n8n deve salvarle in due posti separati senza campi che le colleghino.
- Il flusso n8n dovrebbe scartare le richieste con `website` non vuoto o `elapsed_ms` troppo basso: il controllo nel browser è solo una prima barriera.
