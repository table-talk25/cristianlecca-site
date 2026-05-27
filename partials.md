# Partials — CristianLecca.it

Blocchi HTML canonici da copiare identici in tutte le pagine.  
Questo file è la **fonte di verità del codice**. Ogni modifica va fatta qui e poi propagata su tutte le pagine.

---

## HEAD — Blocco comune (inserire in ogni pagina)

Sostituire `[TITOLO PAGINA]` con il titolo specifico della pagina.

```html
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>[TITOLO PAGINA] | Cristian Lecca</title>
<link rel="icon" type="image/png" href="/assets/favicon%201.png">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

---

## TAILWIND CONFIG — Identico su tutte le pagine

```html
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "background": "#101416",
          "on-background": "#F5F7FA",
          "surface": "#101416",
          "on-surface": "#F5F7FA",
          "primary": "#49C7A5",
          "on-primary": "#101416",
          "primary-container": "#49C7A5",
          "on-primary-container": "#101416",
          "primary-fixed-dim": "#60dbb8",
          "secondary": "#3A63FF",
          "on-secondary": "#FFFFFF",
          "on-secondary-container": "#c1cbff",
          "secondary-container": "#0543e3",
          "tertiary": "#C9A45C",
          "on-tertiary": "#101416",
          "on-tertiary-container": "#5b4100",
          "outline": "#86948e",
          "outline-variant": "#3d4944",
          "surface-container": "#1d2022",
          "surface-container-low": "#191c1e",
          "surface-container-high": "#272a2d",
          "surface-container-highest": "#323538",
          "surface-container-lowest": "#0b0f11",
          "surface-dim": "#101416",
          "surface-variant": "#323538",
          "on-surface-variant": "#bccac3"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"
        },
        "spacing": {
          "section-v-desktop": "104px", "stack-sm": "8px", "container-max": "1280px",
          "stack-lg": "32px", "stack-md": "16px", "section-v-mobile": "64px", "gutter": "24px"
        },
        "fontFamily": {
          "label-md": ["Inter"], "body-md": ["Inter"], "headline-lg": ["Manrope"],
          "headline-md": ["Manrope"], "body-lg": ["Inter"], "display-lg": ["Manrope"],
          "display-lg-mobile": ["Manrope"]
        },
        "fontSize": {
          "label-md": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600"}],
          "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
          "headline-lg": ["48px", {"lineHeight": "1.2", "fontWeight": "600"}],
          "headline-md": ["32px", {"lineHeight": "1.3", "fontWeight": "600"}],
          "body-lg": ["20px", {"lineHeight": "1.6", "fontWeight": "400"}],
          "display-lg": ["64px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
          "display-lg-mobile": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}]
        }
      }
    }
  }
</script>
```

---

## CSS BASE — Identico su tutte le pagine

```html
<style>
  body { background-color: #101416; color: #F5F7FA; overflow-x: hidden; }
  .glass-card {
    background: rgba(29,32,34,0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(245,247,250,0.1);
    transition: all 0.3s ease-in-out;
  }
  .glass-card:hover {
    border-color: rgba(73,199,165,0.3);
    background: rgba(73,199,165,0.05);
  }
  .gradient-text {
    background: linear-gradient(135deg, #49C7A5, #3A63FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
    display: inline-block;
    vertical-align: middle;
  }
  /* Menu mobile */
  #mobile-menu {
    display: none;
    flex-direction: column;
    gap: 0;
    background: #101416;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 16px 24px 24px;
  }
  #mobile-menu.open { display: flex; }
  #mobile-menu a {
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    color: #F5F7FA;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-decoration: none;
    transition: color 180ms ease;
  }
  #mobile-menu a:last-child {
    border-bottom: none;
    margin-top: 12px;
    background: #49C7A5;
    color: #101416;
    text-align: center;
    border-radius: 12px;
    padding: 14px 0;
  }
  #mobile-menu a:hover { color: #49C7A5; }
  #mobile-menu a:last-child:hover { color: #101416; }
</style>
```

---

## HEADER STANDARD — Pagine istituzionali

Usare su: Home, Metodo, Chi sono, Contenuti, Sessione di Svolta, Reset Notturno.

Sostituire la voce attiva con `text-primary border-b-2 border-primary pb-1` e le altre con `text-on-surface-variant hover:text-primary transition-colors`.

```html
<!-- HEADER GLOBALE -->
<nav class="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
  <div class="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
    <!-- Logo + Brand -->
    <a class="flex items-center gap-3 font-headline-md text-headline-md font-bold text-on-background tracking-tight" href="/">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cristian Lecca logo">
        <rect width="32" height="32" rx="8" fill="#101416"/>
        <path d="M9 23 C9 13.5 13 9 16 9 C19 9 23 13.5 23 23" stroke="#49C7A5" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="16" cy="9" r="2.5" fill="#49C7A5"/>
        <path d="M13 23 L19 23" stroke="#C9A45C" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Cristian Lecca
    </a>
    <!-- Nav desktop -->
    <div class="hidden md:flex gap-8 items-center">
      <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="/">Home</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="/metodo/">Metodo</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="/contenuti/">Contenuti</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="/chi-sono/">Chi sono</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="/sessione-di-svolta/">Sessione di Svolta</a>
      <a class="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md transition-all active:scale-95 duration-300" href="/quiz/">
        Fai il Quiz del Coraggio
      </a>
    </div>
    <!-- Hamburger mobile -->
    <button id="hamburger-btn" class="md:hidden text-on-background p-2" aria-label="Apri menu" aria-expanded="false" aria-controls="mobile-menu">
      <span class="material-symbols-outlined" id="hamburger-icon">menu</span>
    </button>
  </div>
  <!-- Menu mobile -->
  <div id="mobile-menu" role="navigation" aria-label="Menu mobile">
    <a href="/">Home</a>
    <a href="/metodo/">Metodo</a>
    <a href="/contenuti/">Contenuti</a>
    <a href="/chi-sono/">Chi sono</a>
    <a href="/sessione-di-svolta/">Sessione di Svolta</a>
    <a href="/quiz/">Fai il Quiz del Coraggio</a>
  </div>
</nav>
```

---

## HEADER MINIMALE — Solo Quiz del Coraggio

```html
<!-- HEADER MINIMALE QUIZ -->
<nav class="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
  <div class="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
    <a class="flex items-center gap-3 font-headline-md text-headline-md font-bold text-on-background tracking-tight" href="/">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cristian Lecca logo">
        <rect width="32" height="32" rx="8" fill="#101416"/>
        <path d="M9 23 C9 13.5 13 9 16 9 C19 9 23 13.5 23 23" stroke="#49C7A5" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="16" cy="9" r="2.5" fill="#49C7A5"/>
        <path d="M13 23 L19 23" stroke="#C9A45C" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Cristian Lecca
    </a>
    <a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md flex items-center gap-2" href="/">
      <span class="material-symbols-outlined text-sm">arrow_back</span>
      Torna al sito
    </a>
  </div>
</nav>
```

---

## FOOTER STANDARD — Pagine istituzionali

Usare su: Home, Metodo, Chi sono, Contenuti, Sessione di Svolta, Reset Notturno.

```html
<!-- FOOTER GLOBALE -->
<footer class="bg-surface-container-lowest w-full py-section-v-desktop px-gutter border-t border-outline-variant/30">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-stack-lg max-w-container-max mx-auto">
    <!-- Colonna 1: Brand -->
    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="#1d2022"/>
          <path d="M9 23 C9 13.5 13 9 16 9 C19 9 23 13.5 23 23" stroke="#49C7A5" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="16" cy="9" r="2.5" fill="#49C7A5"/>
          <path d="M13 23 L19 23" stroke="#C9A45C" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <h3 class="font-headline-md text-headline-md text-on-surface">Cristian Lecca</h3>
      </div>
      <p class="font-body-md text-body-md text-on-surface-variant">
        Hypno Mental Coach specializzato nel Metodo IpnosiApplicata per trasformazione mentale, performance e consapevolezza.
      </p>
    </div>
    <!-- Colonna 2: Navigazione -->
    <div>
      <h4 class="font-label-md text-label-md text-on-surface mb-6 uppercase tracking-wider">Navigazione</h4>
      <ul class="space-y-3 font-body-md text-body-md">
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/">Home</a></li>
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/metodo/">Metodo</a></li>
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/chi-sono/">Chi sono</a></li>
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/contenuti/">Contenuti</a></li>
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/sessione-di-svolta/">Sessione di Svolta</a></li>
      </ul>
    </div>
    <!-- Colonna 3: Percorso -->
    <div>
      <h4 class="font-label-md text-label-md text-on-surface mb-6 uppercase tracking-wider">Percorso</h4>
      <ul class="space-y-3 font-body-md text-body-md">
        <li><a class="text-primary font-semibold hover:text-primary/80 transition-colors" href="/quiz/">Quiz del Coraggio</a></li>
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/reset-notturno/">Reset Notturno</a></li>
      </ul>
    </div>
    <!-- Colonna 4: Legale -->
    <div>
      <h4 class="font-label-md text-label-md text-on-surface mb-6 uppercase tracking-wider">Legale</h4>
      <ul class="space-y-3 font-body-md text-body-md">
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a></li>
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="#">Cookie</a></li>
        <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="#">Termini</a></li>
      </ul>
    </div>
  </div>
  <!-- Riga finale -->
  <div class="max-w-container-max mx-auto mt-16 pt-8 border-t border-outline-variant/30 text-center text-on-surface-variant font-label-md text-label-md">
    © 2026 Cristian Lecca — IpnosiApplicata. Tutti i diritti riservati. P.IVA IT12632010018
  </div>
</footer>
```

---

## FOOTER MINIMALE — Solo Quiz del Coraggio

```html
<!-- FOOTER MINIMALE QUIZ -->
<footer class="bg-surface-container-lowest w-full py-12 px-gutter border-t border-outline-variant/30">
  <div class="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    <span class="font-label-md text-label-md text-on-surface-variant">
      © 2026 Cristian Lecca — P.IVA IT12632010018
    </span>
    <div class="flex gap-6 font-label-md text-label-md">
      <a class="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors" href="#">Cookie</a>
      <a class="text-on-surface-variant hover:text-primary transition-colors" href="/">Torna al sito</a>
    </div>
  </div>
</footer>
```

---

## SCRIPT JS — Menu mobile (inserire prima di </body>)

```html
<script>
  // Menu mobile toggle
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('hamburger-icon');
  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    icon.textContent = isOpen ? 'close' : 'menu';
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      icon.textContent = 'menu';
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('section > div').forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
    observer.observe(el);
  });
</script>
```

---

## Voce attiva nel nav — Come segnalare la pagina corrente

Per ogni pagina, il link corrispondente nel nav desktop riceve queste classi al posto di `text-on-surface-variant hover:text-primary transition-colors`:

```
text-primary border-b-2 border-primary pb-1
```

Esempio per la pagina **Chi sono**:
```html
<a class="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md" href="/chi-sono/">Chi sono</a>
```

---

## Note operative

- Non modificare questi blocchi senza aggiornare **tutte** le pagine che li usano.
- Il file `design.md` definisce le regole di design. Questo file `partials.md` definisce il codice HTML che le implementa.
- Qualsiasi modifica all'header o al footer va fatta qui prima, poi propagata pagina per pagina.
