# Rituale Serale — pagine nascoste

File: `rituale-serale/index.html`, `rituale-serale-grazie/index.html`.

## Da fare prima della pubblicazione (cerca `TODO` nei file)
- Indirizzo per la revoca del consenso: `info@cristianlecca.it`, nel testo di consenso e nella privacy (sezione 12). Se cambia l'indirizzo o il testo, cambia anche `CONSENT_TEXT_VERSION` (oggi `v1`, mai usata in produzione).
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
`WEBHOOK_URL` punta al webhook di produzione di n8n (`https://n8n-ki7p4haqsdhr1meg2k45zosi.92.4.222.169.sslip.io/webhook/rituale-serale`). Per le prove in locale si usa il Test URL di n8n, che ha `/webhook-test/` al posto di `/webhook/` (funziona solo mentre il workflow è in ascolto nell'editor): cambia temporaneamente la costante e non committare il valore di prova. Dopo un invio riuscito la pagina rimanda alla pagina di ringraziamento per 6 ore (cooldown): per riprovare cancella la chiave `rituale_submitted_at` da localStorage.
Nessun Google Analytics né Meta Pixel su queste due pagine, di proposito.
Il campo trappola e il tempo minimo di compilazione (8 s) bloccano invii troppo rapidi.

## Contatore visite
All'apertura di `/rituale-serale/` parte una sola richiesta POST (`keepalive`) a `…/webhook/rituale-serale-visita` con solo `{ "source": utm_source, "campaign": utm_campaign }` (stringhe dall'URL, vuote se assenti). Niente referrer, user agent o dati del form, nessun cookie o storage, errori ignorati in silenzio; non parte su `localhost` e `127.0.0.1`. Il workflow n8n deve validare i valori ricevuti e accettare il dominio del sito (CORS).

## Invio dei dati (webhook n8n)
Un solo `fetch` POST in JSON a `WEBHOOK_URL`, nessuna chiave o token nella pagina:

    {
      "survey": { "interest": 1-5, "states": ["rallentare"|"lasciare_andare"|"chiudere"|"prepararsi"],
                  "duration": "breve"|"lunga"|"dipende", "time_slot": "prima_21"|"21_22"|"dopo_22"|"varia",
                  "frequency": "ogni_sera"|"qualche_sera"|"al_bisogno",
                  "price_range": "fino_10"|"10_15"|"oltre_15"|"no_pay", "free_text": "max 1000 caratteri" },
      "waitlist": null | { "email": "...", "consent_rituale": true, "consent_text_version": "v1" },
      "source": "email"|"spotify"|"facebook"|"instagram"|"youtube"|"altro",
      "campaign": "",           // utm_campaign in minuscolo; "" se assente o non valido
      "website": "",            // campo trappola: deve restare vuoto
      "elapsed_ms": 12345       // dall'apertura della pagina all'invio
    }

- Stato 200 = salvato: la pagina va a `/rituale-serale-grazie/`. Qualsiasi altro stato, o errore di rete, mostra un messaggio d'errore e le risposte restano nel modulo. Il corpo della risposta non viene letto.
- `source` viene da `utm_source` (altrimenti `altro`). `campaign` viene da `utm_campaign`: portato in minuscolo e inviato solo se rispetta `^[a-z0-9][a-z0-9_-]{0,39}$` (massimo 40 caratteri), altrimenti stringa vuota. Non viene salvato altro e non c'è nessun tracciamento esterno. Data e ora del consenso non sono nel payload: le aggiunge il flusso n8n.
- Il webhook deve accettare richieste dal dominio del sito (CORS, header `Content-Type: application/json`).
- Risposte e email arrivano insieme nella stessa richiesta: per mantenere anonime le risposte, il flusso n8n deve salvarle in due posti separati senza campi che le colleghino.
- Il flusso n8n dovrebbe scartare le richieste con `website` non vuoto o `elapsed_ms` troppo basso: il controllo nel browser è solo una prima barriera.
