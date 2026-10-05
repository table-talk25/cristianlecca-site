# Rituale Serale — pagine nascoste

File: `rituale-serale/index.html`, `rituale-serale-grazie/index.html`.

## Da fare prima della pubblicazione (cerca `TODO` nei file)
- `PB_URL` (costante in cima allo script del sondaggio): indirizzo di PocketBase.
- Indirizzo per la revoca del consenso (segnaposto `[INDIRIZZO DA INSERIRE]`, in giallo). Se cambi il testo di consenso, cambia anche `CONSENT_TEXT_VERSION`.
- Sezione `#rituale-serale` in `/privacy/`: non esiste ancora, il link `/privacy/#rituale-serale` oggi porta alla pagina senza ancora.
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
Per provare l'invio senza PocketBase reale, imposta `PB_URL` su un mock. Dopo un invio riuscito la pagina rimanda alla pagina di ringraziamento per 6 ore (cooldown): per riprovare cancella la chiave `rituale_submitted_at` da localStorage.
Nessun Google Analytics né Meta Pixel su queste due pagine, di proposito.
Il campo trappola e il tempo minimo di compilazione (8 s) bloccano invii troppo rapidi.

## Lato PocketBase (non incluso)
Domanda 6 (disponibilità a investire): campo `price_range` in `rituale_survey_responses` (ex `price_reaction`), valori `fino_10`, `10_15`, `oltre_15`, `no_pay`.
Le regole di creazione pubbliche e il rate limit del server vanno configurati da te; il limite nel browser è solo una prima barriera.
