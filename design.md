# Design System — CristianLecca.it

Documento operativo da caricare nel builder o usare come riferimento fisso per mantenere coerenza tra tutte le pagine del sito.

## Obiettivo

Questo progetto **non deve essere ridisegnato da zero**. Deve mantenere un'identità unica, premium, sobria e coerente su tutte le pagine.

Il builder deve:
- uniformare il menu su tutte le pagine istituzionali;
- mantenere il logo identico ovunque;
- usare lo stesso footer su tutte le pagine istituzionali;
- applicare la palette colori approvata senza reinterpretarla;
- usare sempre gli stessi principi per CTA, card, spaziature e tipografia.

## Identità del brand

Brand name: **Cristian Lecca**  
Ruolo: **Hypno Mental Coach**  
Tone of voice: premium, autorevole, sobrio, professionale, empatico.

Il sito non deve sembrare un template AI generico.  
Niente redesign creativo.  
Niente nuove direzioni visive.  
Solo coerenza, rifinitura e standardizzazione.

## Palette colori approvata

Questa palette è già approvata e deve essere considerata vincolante.

- Primary: `#49C7A5`
- Secondary: `#3A63FF`
- Tertiary: `#C9A45C`
- Neutral light: `#F5F7FA`
- Base background: dark charcoal / near-black (`#101416` come base consigliata)

### Regole d'uso colore

- `#49C7A5` = colore principale del brand, pulsanti principali, stati attivi, highlight essenziali.
- `#3A63FF` = colore secondario di supporto, elementi secondari, dettagli UI selezionati, link o enfasi controllate.
- `#C9A45C` = accento premium, da usare poco, solo per enfasi selettive, badge o micro-highlight.
- `#F5F7FA` = testo chiaro e superfici chiare occasionali.
- `#101416` = base scura principale del sito.

### Cose da evitare

- niente viola dominante;
- niente shift verso lilla o indaco;
- niente gradienti AI-style teal+purple;
- niente glow eccessivi;
- niente palette alternative inventate dal builder.

## Tipografia

Font approvati:
- Headings / display: **Manrope**
- Body / UI text: **Inter**

### Gerarchia tipografica

- Hero title: Manrope bold / extra bold
- Section title: Manrope bold
- Body text: Inter regular
- Small UI text / nav / button text: Inter semibold

### Regole

- usare la stessa coppia di font su tutte le pagine;
- non introdurre serif o font decorativi;
- non cambiare font tra una pagina e l'altra;
- mantenere una gerarchia chiara e ripetibile.

## Header globale

Il seguente header deve essere **identico su tutte le pagine istituzionali**.

### Pagine che usano il full header

- Home
- Metodo
- Chi sono
- Contenuti
- Sessione di Svolta
- Reset Notturno

### Struttura header

Sinistra:
- logo / brand: **Cristian Lecca**

Centro o destra:
- Home
- Metodo
- Chi sono
- Contenuti
- Sessione di Svolta

Destra:
- CTA primaria: **Fai il Quiz del Coraggio**

### Regole header

- stesso layout su tutte le pagine istituzionali;
- stesso sfondo;
- stessa altezza;
- stessi spazi;
- stessa CTA;
- stessi hover states;
- stesso comportamento responsive.

### Aspetto header

- sticky / fixed top;
- dark background semi-opaque;
- bordo inferiore molto leggero;
- look premium e discreto;
- niente variazioni di colore tra pagine;
- niente header reinventati pagina per pagina.

## Header speciale Quiz del Coraggio

La pagina **Quiz del Coraggio** è l'unica eccezione.

### Struttura

Sinistra:
- logo / brand: **Cristian Lecca**

Destra:
- link semplice: **Torna al sito principale**

### Regole

- no menu completo;
- no navigazione dispersiva;
- header minimale;
- focus conversione.

## Logo

Il logo / brand text deve restare coerente ovunque.

### Regole logo

- usare sempre lo stesso logo;
- non sostituire il logo;
- non reinterpretare il logo;
- non cambiare peso, stile o tono tra pagine;
- mantenere la stessa posizione nel layout header;
- il brand deve essere sempre riconoscibile come “Cristian Lecca”.

Se il progetto usa solo wordmark testuale, allora il wordmark deve restare identico in tutte le pagine.

## Footer globale

Il footer deve essere **identico su tutte le pagine istituzionali**.

### Pagine che usano il full footer

- Home
- Metodo
- Chi sono
- Contenuti
- Sessione di Svolta
- Reset Notturno

### Struttura footer

#### Colonna 1 — Brand
- Cristian Lecca
- breve descrizione professionale

Testo suggerito:
> Hypno Mental Coach specializzato nel Metodo IpnosiApplicata per trasformazione mentale, performance e consapevolezza.

#### Colonna 2 — Navigazione
- Home
- Metodo
- Chi sono
- Contenuti
- Sessione di Svolta

#### Colonna 3 — Percorso
- Quiz del Coraggio
- Reset Notturno

#### Colonna 4 — Contatti / Legale
- Contatti
- Privacy
- Cookie
- Termini

### Riga finale footer

Nella parte più bassa del footer inserire sempre:

- copyright
- nome brand
- partita IVA

Formato richiesto:

`© 2025 Cristian Lecca — IpnosiApplicata. Tutti i diritti riservati. P.IVA IT12632010018`

### Regole footer

- stesso footer su tutte le pagine istituzionali;
- stessa griglia;
- stessa spaziatura;
- stessi colori;
- stessi link;
- stessa riga finale con P. IVA;
- niente footer diversi pagina per pagina.

## Footer speciale Quiz del Coraggio

La pagina **Quiz del Coraggio** usa un footer minimale.

### Struttura

- brand breve;
- link legali essenziali;
- link “Torna al sito principale”;
- micro-disclaimer;
- eventuale P. IVA anche qui, in forma compatta.

## CTA system

Le CTA devono essere coerenti e sempre uguali nel linguaggio.

### Gerarchia CTA

Primary CTA:
- **Fai il Quiz del Coraggio**

Secondary CTA:
- **Prenota la Sessione di Svolta**

Intermediate offer CTA:
- **Scopri Reset Notturno**
- **Inizia il Reset Notturno**

### Regole CTA

- usare sempre le stesse label;
- non inventare testi diversi per la stessa azione;
- stesso stile per la primary CTA ovunque;
- stesso stile per la secondary CTA ovunque;
- gold solo per micro-enfasi, non per tutte le CTA;
- teal dominante per la CTA primaria.

## Componenti condivisi

### Bottoni

#### Primary button
- background: `#49C7A5`
- text: scuro / molto leggibile
- uso: CTA principale

#### Secondary button
- uso del blu `#3A63FF` in modo controllato;
- non deve rubare la scena alla primary CTA.

#### Tertiary / premium accent
- usare `#C9A45C` con moderazione;
- per badge, dettagli premium, evidenze leggere.

## Card system

Le card devono sembrare parte dello stesso sito.

### Regole card

- stesso raggio angoli o famiglia di raggi;
- stesso tipo di bordo;
- stessa logica di padding;
- stessa logica di titolo + testo + CTA;
- evitare card casuali tutte diverse.

### Da evitare

- glow troppo forti;
- gradienti vistosi;
- stile SaaS generico;
- icone in cerchi colorati troppo “template AI”.

## Sezioni hero

Le hero delle pagine devono appartenere alla stessa famiglia.

### Regole hero

- stessa logica di spaziature verticali;
- stessa gerarchia titolo / sottotitolo / CTA;
- stessa qualità visiva;
- stessa famiglia tipografica;
- stessa palette.

### Consentito

- leggere variazioni di layout in base alla funzione della pagina.

### Non consentito

- reinventare ogni hero come se fosse un progetto diverso.

## Spacing system

Usare una spaziatura coerente in tutto il sito.

### Principio

- ritmo verticale uniforme;
- sezioni ariose ma non vuote;
- niente pagine densissime accanto ad altre troppo scariche.

### Regola

Le pagine devono sembrare parte di un unico sistema editoriale premium.

## Mappa del sito

### Pagine istituzionali
- Home
- Metodo
- Chi sono
- Contenuti
- Sessione di Svolta

### Pagine funnel / conversione
- Quiz del Coraggio
- Reset Notturno

### Gerarchia
- Quiz del Coraggio = ingresso principale
- Reset Notturno = offerta intermedia
- Sessione di Svolta = azione ad alta intenzione
- Home / Metodo / Chi sono / Contenuti = fiducia, autorevolezza, scoperta del brand

## Regole per pagina

### Home
Panoramica del brand e smistamento verso quiz, metodo, contenuti, reset e sessione.

### Metodo
Pagina autorevole che spiega il sistema e la logica del percorso.

### Chi sono
Pagina narrativa e di fiducia, collegata sempre ai percorsi.

### Contenuti
Hub editoriale con podcast al centro, YouTube e libro come supporto.

### Sessione di Svolta
Pagina con una CTA dominante e forte intenzione di prenotazione.

### Quiz del Coraggio
Landing standalone, focalizzata sulla conversione, con header/footer minimali.

### Reset Notturno
Sales page coerente con il brand, collegata al sito, non scollegata visivamente.

## Istruzioni forti per qualsiasi builder

Use this project as a refinement task, not a redesign task.

### Non-negotiable constraints
- do not redesign from scratch;
- do not change the approved palette;
- do not replace the logo;
- do not create different headers page by page;
- do not create different footers page by page;
- do not invent new CTA labels;
- do not shift the brand into purple / violet / generic AI style;
- do not make the site look like a template.

### What to do
- preserve the current approved direction;
- standardize header globally;
- standardize footer globally;
- keep the logo identical;
- insert the VAT number in the footer;
- apply the same design language across all pages;
- refine only;
- do not reinvent.

## Dato da completare

Sostituire questo placeholder con il dato reale preso da cristianlecca.it:

- `P. IVA IT12632010018`

## Nota finale

Se una pagina sembra “più creativa” delle altre, non va bene.  
Se un header cambia struttura, non va bene.  
Se un footer cambia struttura, non va bene.  
Se il builder prova a rifare il sito da zero, non va bene.

Questo documento deve essere trattato come **fonte di verità progettuale**.
