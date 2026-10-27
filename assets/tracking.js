/* Tracciamento comune del sito (GA4 + Meta Pixel), senza librerie.
 *
 * CLTracking.track(nome, parametriGA4, meta)
 *   Invia l'evento a GA4 con gtag('event', ...), lo stesso pattern degli eventi
 *   centro_popup_*. Se `meta` e' indicato invia anche l'evento al Pixel:
 *   { event: 'ViewContent' } per un evento standard, { custom: 'QuizComplete' }
 *   per uno personalizzato, con { params, eventID } opzionali. Ogni evento Meta
 *   ha sempre un eventID (se non indicato se ne genera uno), che track restituisce:
 *   lo stesso ID va usato per l'evento lato server, cosi' Meta deduplica.
 *   Mai dati personali nei parametri.
 *
 * CLTracking.hashEmail(email) -> Promise<string>
 *   SHA-256 (hex) dell'email normalizzata: minuscolo, senza spazi. '' se non calcolabile.
 *
 * CLTracking.ricordaUtenteMeta(hash)
 *   Dopo l'invio di un form: salva solo l'hash in sessionStorage. consent.js lo passa
 *   a fbq('init') come em ed external_id solo con il consenso marketing.
 *
 * CLTracking.collegaLinkStripe()
 *   Al clic su un link buy.stripe.com aggiunge sempre client_reference_id nel formato
 *   <id>_s<0|1>m<0|1> (es. 1234567890_1234567890_s1m1 oppure nocid_s0m0). Con il
 *   consenso statistico il client_id si aspetta al massimo 300 ms, poi il link si
 *   apre comunque con "nocid". Il resto dell'URL non viene toccato.
 *
 * CLTracking.inviaContestoAcquisto()
 *   Pagina di grazie: manda a n8n solo ?session_id= e i cookie del Pixel.
 *   Il sito NON invia mai Purchase/purchase: li invia n8n dopo la conferma di Stripe.
 */
(function () {
  var GA_ID = 'G-7HN92MQPKY';
  var CONTESTO_ENDPOINT = 'https://n8n-ki7p4haqsdhr1meg2k45zosi.92.4.222.169.sslip.io/webhook/stripe-contesto-acquisto';
  var SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,240}$/;
  var CID_WAIT_MS = 300;

  function newEventId() {
    if (typeof window.clEventId === 'function') return window.clEventId();
    return 'ev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 12);
  }

  function track(name, params, meta) {
    try {
      if (typeof gtag === 'function') gtag('event', name, params || {});
    } catch (e) {}
    if (!meta) return '';
    var eventID = meta.eventID || newEventId();
    try {
      if (typeof fbq !== 'function') return eventID;
      var extra = { eventID: eventID };
      if (meta.event) fbq('track', meta.event, meta.params || {}, extra);
      else if (meta.custom) fbq('trackCustom', meta.custom, meta.params || {}, extra);
    } catch (e) {}
    return eventID;
  }

  // --- Associazione avanzata Meta (stessa chiave letta da consent.js) ---
  var META_UD_KEY = 'cl_meta_ud';
  function hashEmail(email) {
    try {
      var norm = String(email || '').replace(/\s+/g, '').toLowerCase();
      if (!norm || !(window.crypto && crypto.subtle && window.TextEncoder)) return Promise.resolve('');
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(norm)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      }, function () { return ''; });
    } catch (e) { return Promise.resolve(''); }
  }
  function ricordaUtenteMeta(hash) {
    if (!/^[a-f0-9]{64}$/.test(hash || '')) return;
    try { sessionStorage.setItem(META_UD_KEY, hash); } catch (e) {}
  }

  // Aggiunge ai payload verso n8n lo stato del consenso cookie:
  // consent_statistics, consent_marketing_cookie (booleani), consent_timestamp (ISO o null).
  function conConsenso(obj) {
    var c = window.CLConsent && CLConsent.payload ? CLConsent.payload()
      : { consent_statistics: false, consent_marketing_cookie: false, consent_timestamp: null };
    for (var k in c) obj[k] = c[k];
    return obj;
  }

  function readCookie(name) {
    try {
      var parts = ('; ' + document.cookie).split('; ' + name + '=');
      return parts.length === 2 ? decodeURIComponent(parts.pop().split(';').shift()) : '';
    } catch (e) { return ''; }
  }

  // --- client_reference_id per Stripe: <id>_s<0|1>m<0|1> ---
  // <id> = client_id GA4 con "_" al posto del punto (solo con consenso statistico),
  // altrimenti "nocid". s/m = consenso statistico/marketing (0 se non ancora scelto).
  // Esempi: 1234567890_1234567890_s1m1, nocid_s0m0. Sempre presente sui link Stripe.
  var gaCid = '';
  var waiting = [];
  function setClientId(cid) {
    if (gaCid || !/^\d+\.\d+$/.test(String(cid || ''))) return;
    gaCid = String(cid).replace('.', '_');
    waiting.splice(0).forEach(function (cb) { cb(); });
  }
  try {
    if (typeof gtag === 'function') gtag('get', GA_ID, 'client_id', setClientId);
  } catch (e) {}

  function consensi() {
    var C = window.CLConsent;
    return { s: !!(C && C.statistics()), m: !!(C && C.marketing()) };
  }

  function clientReference() {
    var c = consensi();
    var id = c.s && gaCid ? gaCid : 'nocid';
    return id + '_s' + (c.s ? 1 : 0) + 'm' + (c.m ? 1 : 0);
  }

  function conRiferimento(href) {
    try {
      var u = new URL(href, location.href);
      if (u.hostname !== 'buy.stripe.com') return href;
      var ref = clientReference();
      if (/[?&]client_reference_id=/.test(href)) return href.replace(/([?&]client_reference_id=)[^&#]*/, '$1' + ref);
      var hash = href.indexOf('#');
      var base = hash === -1 ? href : href.slice(0, hash), tail = hash === -1 ? '' : href.slice(hash);
      return base + (base.indexOf('?') === -1 ? '?' : '&') + 'client_reference_id=' + ref + tail;
    } catch (e) { return href; }
  }

  function apri(a, href) {
    if (a.target && a.target !== '_self') window.open(href, a.target, a.rel && a.rel.indexOf('noopener') !== -1 ? 'noopener' : '');
    else location.href = href;
  }

  function collegaLinkStripe() {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href*="buy.stripe.com"]') : null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      // Senza consenso statistico (o con il client_id gia' pronto) non c'e' nulla da
      // aspettare: si aggiorna il link e la navigazione resta quella normale.
      if (!consensi().s || gaCid) { a.href = conRiferimento(a.href); return; }
      e.preventDefault();
      var done = false;
      var go = function () { if (done) return; done = true; apri(a, conRiferimento(a.href)); };
      waiting.push(go);
      setTimeout(go, CID_WAIT_MS);
    });
  }

  // --- contesto per l'acquisto (pagina di grazie) ---
  // Nessun evento di acquisto dal sito: il Purchase lo inviano n8n (Meta CAPI) e GA4
  // (Measurement Protocol) dopo la conferma di Stripe. Qui si passano solo a n8n i
  // cookie del Pixel (_fbp, _fbc) collegati alla sessione Stripe, per migliorare
  // l'abbinamento della CAPI. Una sola volta per sessione; nessun dato personale.
  function inviaContestoAcquisto() {
    var sid = window.clStripeSessionId || '';
    if (!SESSION_RE.test(sid) || typeof fetch !== 'function') return;
    var key = 'cl_ctx_' + sid;
    try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch (e) {}
    try {
      fetch(CONTESTO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conConsenso({ session_id: sid, fbp: readCookie('_fbp'), fbc: readCookie('_fbc'), page: location.origin + location.pathname })),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }

  window.CLTracking = {
    track: track,
    newEventId: newEventId,
    hashEmail: hashEmail,
    ricordaUtenteMeta: ricordaUtenteMeta,
    collegaLinkStripe: collegaLinkStripe,
    clientReference: clientReference,
    conConsenso: conConsenso,
    inviaContestoAcquisto: inviaContestoAcquisto
  };
})();
