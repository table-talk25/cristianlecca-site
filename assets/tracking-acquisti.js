/* Tracciamento acquisti Stripe (Reset Notturno, bonus Torna al Centro).
 *
 * 1. CLAcquisti.linkStripe(url): aggiunge al link di pagamento Stripe
 *    client_reference_id = "v1-g<client_id GA4>-s<session_id GA4>" (solo cifre, "_" e "-",
 *    come richiede Stripe). n8n lo legge dalla Checkout Session e invia il purchase
 *    a GA4 (Measurement Protocol) sulla sessione giusta. Nessun dato personale.
 *
 * 2. CLAcquisti.confermaAcquisto(): sulla pagina di grazie. Se nell'URL c'e'
 *    ?session_id=cs_... (aggiunto da Stripe), chiede a n8n di verificare la sessione
 *    su Stripe. SOLO se n8n risponde paid:true invia il Purchase del Pixel con
 *    eventID = id della sessione, lo stesso che n8n usa per la Conversions API:
 *    Meta deduplica browser + server. Una sola volta per sessione (localStorage).
 *    Il purchase GA4 parte solo da n8n, mai dal browser (niente doppioni).
 *    Senza session_id, con errore o con pagamento non confermato: nessun evento.
 */
(function () {
  var GA_ID = 'G-7HN92MQPKY';
  var CONFERMA_ENDPOINT = 'https://n8n-ki7p4haqsdhr1meg2k45zosi.92.4.222.169.sslip.io/webhook/stripe-conferma-acquisto';
  var SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,240}$/;

  function readCookie(name) {
    try {
      var parts = ('; ' + document.cookie).split('; ' + name + '=');
      return parts.length === 2 ? decodeURIComponent(parts.pop().split(';').shift()) : '';
    } catch (e) { return ''; }
  }

  // client_id e session_id GA4 dai cookie (_ga e _ga_<ID>); formati GS1 e GS2.
  function gaIds() {
    var cid = '', sid = '';
    var ga = readCookie('_ga').split('.');
    if (ga.length >= 4) cid = ga[2] + '.' + ga[3];
    var s = readCookie('_ga_' + GA_ID.replace(/^G-/, ''));
    var m = s.match(/^GS1\.\d+\.(\d+)/) || s.match(/[.$]s(\d+)/);
    if (m) sid = m[1];
    return { cid: /^\d+\.\d+$/.test(cid) ? cid : '', sid: /^\d+$/.test(sid) ? sid : '' };
  }

  function clientReference() {
    var ids = gaIds();
    if (!ids.cid) return '';
    return 'v1-g' + ids.cid.replace('.', '_') + (ids.sid ? '-s' + ids.sid : '');
  }

  function linkStripe(url) {
    try {
      var u = new URL(url, location.href);
      if (u.hostname !== 'buy.stripe.com' || u.searchParams.has('client_reference_id')) return url;
      var ref = clientReference();
      if (ref) u.searchParams.set('client_reference_id', ref);
      return u.toString();
    } catch (e) { return url; }
  }

  // Aggiorna i link Stripe al clic (i cookie GA4 a quel punto ci sono gia').
  function collegaLinkStripe(root) {
    (root || document).addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href*="buy.stripe.com"]') : null;
      if (a) a.href = linkStripe(a.href);
    }, true);
  }

  // session_id tolto dall'URL in <head>, prima di GA4 e Pixel (vedi le pagine di grazie).
  function confermaAcquisto() {
    var sid = window.clStripeSessionId || '';
    if (!SESSION_RE.test(sid) || typeof fetch !== 'function') return;
    var key = 'cl_purchase_' + sid;
    try { if (localStorage.getItem(key)) return; } catch (e) {}

    var body = {
      session_id: sid,
      fbp: readCookie('_fbp'),
      fbc: readCookie('_fbc'),
      page: location.origin + location.pathname
    };
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 10000) : null;
    fetch(CONFERMA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller ? controller.signal : undefined
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || d.paid !== true || d.event_id !== sid) return;
        var value = Number(d.value);
        if (!isFinite(value) || value <= 0 || !/^[A-Z]{3}$/.test(String(d.currency || ''))) return;
        try { localStorage.setItem(key, '1'); } catch (e) {}
        if (typeof fbq === 'function') {
          fbq('track', 'Purchase', {
            value: value,
            currency: d.currency,
            content_ids: Array.isArray(d.content_ids) ? d.content_ids : [],
            content_name: String(d.content_name || ''),
            content_type: 'product'
          }, { eventID: sid });
        }
      })
      .catch(function () {})
      .then(function () { if (timer) clearTimeout(timer); });
  }

  window.CLAcquisti = {
    linkStripe: linkStripe,
    collegaLinkStripe: collegaLinkStripe,
    confermaAcquisto: confermaAcquisto,
    clientReference: clientReference
  };
})();
