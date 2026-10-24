/* Tracciamento comune del sito (GA4 + Meta Pixel), senza librerie.
 *
 * CLTracking.track(nome, parametriGA4, meta)
 *   Invia l'evento a GA4 con gtag('event', ...), lo stesso pattern degli eventi
 *   centro_popup_*. Se `meta` e' indicato invia anche l'evento al Pixel:
 *   { event: 'ViewContent' } per un evento standard, { custom: 'QuizComplete' }
 *   per uno personalizzato, con { params, eventID } opzionali.
 *   Mai dati personali nei parametri.
 *
 * CLTracking.collegaLinkStripe()
 *   Al clic su un link buy.stripe.com aggiunge client_reference_id = client_id GA4
 *   con "_" al posto del punto (1234567890_1234567890). Il client_id viene chiesto
 *   a gtag al caricamento; se al clic non e' ancora pronto lo si aspetta al massimo
 *   300 ms, poi il link si apre comunque (senza il parametro). Il resto dell'URL
 *   non viene toccato.
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

  function track(name, params, meta) {
    try {
      if (typeof gtag === 'function') gtag('event', name, params || {});
    } catch (e) {}
    if (!meta) return;
    try {
      if (typeof fbq !== 'function') return;
      var extra = meta.eventID ? { eventID: meta.eventID } : undefined;
      if (meta.event) fbq('track', meta.event, meta.params || {}, extra);
      else if (meta.custom) fbq('trackCustom', meta.custom, meta.params || {}, extra);
    } catch (e) {}
  }

  function readCookie(name) {
    try {
      var parts = ('; ' + document.cookie).split('; ' + name + '=');
      return parts.length === 2 ? decodeURIComponent(parts.pop().split(';').shift()) : '';
    } catch (e) { return ''; }
  }

  // --- client_id GA4 per client_reference_id di Stripe ---
  var clientRef = '';
  var waiting = [];
  function setClientId(cid) {
    if (clientRef || !/^\d+\.\d+$/.test(String(cid || ''))) return;
    clientRef = String(cid).replace('.', '_');
    waiting.splice(0).forEach(function (cb) { cb(); });
  }
  try {
    if (typeof gtag === 'function') gtag('get', GA_ID, 'client_id', setClientId);
  } catch (e) {}

  function clientReference() { return clientRef; }

  function conRiferimento(href) {
    try {
      var u = new URL(href, location.href);
      if (u.hostname !== 'buy.stripe.com' || !clientRef || u.searchParams.has('client_reference_id')) return href;
      return href + (href.indexOf('?') === -1 ? '?' : '&') + 'client_reference_id=' + clientRef;
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
      if (clientRef) { a.href = conRiferimento(a.href); return; } // pronto: navigazione normale
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
        body: JSON.stringify({ session_id: sid, fbp: readCookie('_fbp'), fbc: readCookie('_fbc'), page: location.origin + location.pathname }),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }

  window.CLTracking = {
    track: track,
    collegaLinkStripe: collegaLinkStripe,
    clientReference: clientReference,
    inviaContestoAcquisto: inviaContestoAcquisto
  };
})();
