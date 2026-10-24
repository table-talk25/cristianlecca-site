/* Consenso cookie (Google Consent Mode v2 + Meta Pixel), senza librerie.
 *
 * Va caricato come PRIMO script dell'<head>, prima del blocco gtag e del Pixel.
 *  - Consent Mode v2: default tutto "denied"; se c'e' una scelta salvata (cookie
 *    tecnico `cookie_consent`, 6 mesi) viene applicata subito con 'update'.
 *  - GA4: lo script gtag.js viene caricato SOLO con il consenso "statistici".
 *    Prima della scelta gli eventi restano in coda nel dataLayer e non escono.
 *  - Meta Pixel: fbq('consent','revoke') prima di fbq('init'). Lo script
 *    fbevents.js viene caricato SOLO con il consenso "marketing": prima nessuna
 *    richiesta a connect.facebook.net. Le chiamate fbq restano in coda.
 *  - Contenuti esterni (YouTube, Spotify, SoundCloud, calendario Cal.eu): categoria a
 *    parte. Finche' non e' accettata, al posto di ogni contenuto [data-cl-embed] c'e' un
 *    riquadro con "Mostra contenuto" (solo quello) e "Accetta sempre i contenuti esterni".
 *  - Banner: "Accetta tutto", "Rifiuta tutto", "Personalizza" con lo stesso peso;
 *    nessun consenso implicito; si riapre dai link [data-cl-consent-open].
 *
 *  Cookie tecnico `cookie_consent`: v2|a<0|1|x>|m<0|1|x>|e<0|1>|<timestamp>
 *  (x = non ancora scelto: succede solo se si accettano i contenuti esterni da un
 *  riquadro prima di rispondere al banner, che quindi resta visibile).
 */
(function () {
  var COOKIE = 'cookie_consent';
  var MAX_AGE = 60 * 60 * 24 * 182; // circa 6 mesi
  // Proprieta' GA4 configurate nella pagina (la prima da' l'URL di gtag.js).
  var GA_IDS = ['G-7HN92MQPKY'];
  var GA_SRC = 'https://www.googletagmanager.com/gtag/js?id=' + GA_IDS[0];
  var FB_SRC = 'https://connect.facebook.net/en_US/fbevents.js';
  var POLICY_URL = '/cookie/';

  // --- Consent Mode v2: default negato, prima di qualsiasi altro tag ---
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  // --- Meta Pixel: coda senza script finche' non c'e' il consenso marketing ---
  // Stessa struttura del codice base di Meta: lo snippet della pagina trova fbq gia'
  // definito e non scarica fbevents.js; le chiamate (init, PageView, ...) restano in coda.
  if (!window.fbq) {
    var n = window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
  }
  window.fbq('consent', 'revoke');

  var gaLoaded = false, fbLoaded = false;
  var pendingUpdate = null; // update del consenso inserito in coda prima che gtag.js sia caricato
  var state = null; // { analytics, marketing: true|false|null(non scelto), esterni: bool, ts: secondi }

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    var first = document.getElementsByTagName('script')[0];
    if (first && first.parentNode) first.parentNode.insertBefore(s, first);
    else (document.head || document.documentElement).appendChild(s);
  }

  function args() { return arguments; }

  function deleteCookies(test) {
    var host = location.hostname;
    var domains = ['', host, '.' + host];
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function apply(c) {
    var a = !!c.analytics, m = !!c.marketing;
    var update = {
      analytics_storage: a ? 'granted' : 'denied',
      ad_storage: m ? 'granted' : 'denied',
      ad_user_data: m ? 'granted' : 'denied',
      ad_personalization: m ? 'granted' : 'denied'
    };
    if (!gaLoaded) {
      // gtag.js non e' ancora caricato: nessun dato e' uscito. L'update va messo in coda
      // subito dopo il default, prima di config ed eventi gia' in attesa, cosi' quando
      // gtag.js li elabora il consenso e' gia' quello scelto (non si affida al timer).
      // Una scelta precedente ancora in coda (es. "Rifiuta" e poi "Accetta" dallo
      // stesso banner) viene sostituita, non lasciata dopo la nuova.
      var dl = window.dataLayer, at = -1;
      if (pendingUpdate) {
        var old = dl.indexOf(pendingUpdate);
        if (old !== -1) dl.splice(old, 1);
      }
      for (var i = 0; i < dl.length; i++) {
        if (dl[i] && dl[i][0] === 'consent' && dl[i][1] === 'default') { at = i; break; }
      }
      pendingUpdate = args('consent', 'update', update);
      if (at === -1) dl.push(pendingUpdate);
      else dl.splice(at + 1, 0, pendingUpdate);
    } else {
      gtag('consent', 'update', update);
    }

    // GA4
    GA_IDS.forEach(function (id) { window['ga-disable-' + id] = !a; });
    if (a && !gaLoaded) { gaLoaded = true; loadScript(GA_SRC); }
    if (!a) deleteCookies(function (name) { return name === '_ga' || name.indexOf('_ga_') === 0; });

    // Meta Pixel
    var q = window.fbq;
    if (m) {
      if (!fbLoaded) {
        // Lo script non e' mai stato caricato: nessun evento e' uscito. Si toglie la
        // revoca iniziale dalla coda e si mette il consenso in testa, cosi' anche gli
        // eventi di questa pagina (PageView, ...) partono una sola volta.
        if (q && q.queue) {
          q.queue = Array.prototype.filter.call(q.queue, function (x) {
            return !(x && x[0] === 'consent' && x[1] === 'revoke');
          });
          q.queue.unshift(args('consent', 'grant'));
        }
        fbLoaded = true;
        loadScript(FB_SRC);
      } else {
        q('consent', 'grant');
      }
    } else {
      if (fbLoaded) q('consent', 'revoke');
      deleteCookies(function (name) { return name === '_fbp' || name === '_fbc'; });
    }

    if (c.esterni) attivaTuttiEsterni(); else bloccaEsterniAttivi();

    try { document.dispatchEvent(new CustomEvent('cl:consent', { detail: { analytics: a, marketing: m, esterni: !!c.esterni } })); } catch (e) {}
  }

  function read() {
    try {
      var parts = ('; ' + document.cookie).split('; ' + COOKIE + '=');
      if (parts.length !== 2) return null;
      var v = decodeURIComponent(parts.pop().split(';').shift()).split('|');
      if (v.length !== 5 || v[0] !== 'v2' || !/^a[01x]$/.test(v[1]) || !/^m[01x]$/.test(v[2]) ||
          !/^e[01]$/.test(v[3]) || !/^\d+$/.test(v[4])) return null;
      var ts = Number(v[4]);
      if (Date.now() / 1000 - ts > MAX_AGE) return null; // scaduta: si richiede
      var tri = function (x) { return x === '1' ? true : x === '0' ? false : null; };
      return { analytics: tri(v[1].charAt(1)), marketing: tri(v[2].charAt(1)), esterni: v[3] === 'e1', ts: ts };
    } catch (e) { return null; }
  }

  function decided(c) { return !!c && c.analytics !== null && c.marketing !== null; }

  function save(c) {
    var ts = Math.floor(Date.now() / 1000);
    var f = function (x) { return x === true ? '1' : x === false ? '0' : 'x'; };
    var value = ['v2', 'a' + f(c.analytics), 'm' + f(c.marketing), 'e' + (c.esterni ? 1 : 0), ts].join('|');
    document.cookie = COOKIE + '=' + encodeURIComponent(value) + '; Max-Age=' + MAX_AGE +
      '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    state = { analytics: c.analytics, marketing: c.marketing, esterni: !!c.esterni, ts: ts };
  }

  function choose(c) {
    save(c);
    apply(c);
    if (decided(state)) hideBanner();
  }

  // --- Contenuti esterni: riquadro al posto di [data-cl-embed] ---
  // <iframe data-cl-embed="YouTube" data-cl-src="..."> oppure, per contenuti caricati
  // da uno script (Cal.eu), <div data-cl-embed="Cal.eu" data-cl-load="nomeFunzione"
  // data-cl-label="Carica il calendario">. Senza consenso nessuna richiesta parte.
  var EMBED_CSS = '' +
    '.clc-embed{display:flex;flex-direction:column;justify-content:center;gap:12px;padding:20px;border-radius:14px;' +
    'border:1px dashed #3d4944;background:rgba(29,32,34,.6);color:#bccac3;font-family:Inter,sans-serif;font-size:14px;line-height:1.6;text-align:center}' +
    '.clc-embed p{margin:0}.clc-embed a{color:#49C7A5;text-decoration:underline}' +
    '.clc-embed-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}' +
    '.clc-embed button{padding:10px 16px;border-radius:9999px;border:1px solid #49C7A5;background:transparent;color:#F5F7FA;' +
    'font-family:Inter,sans-serif;font-size:13px;font-weight:600;cursor:pointer}' +
    '.clc-embed button:hover{background:rgba(73,199,165,.12)}' +
    '.clc-embed button:focus-visible{outline:2px solid #49C7A5;outline-offset:2px}';
  var embedCssAdded = false;
  var embedCallbacks = [];

  function addEmbedCss() {
    if (embedCssAdded) return;
    embedCssAdded = true;
    var st = document.createElement('style');
    st.textContent = EMBED_CSS;
    document.head.appendChild(st);
  }

  function esterniConsentiti() { return !!(state && state.esterni); }

  function attivaEsterno(el) {
    if (!el || el.getAttribute('data-cl-attivo') === '1') return;
    el.setAttribute('data-cl-attivo', '1');
    var ph = el._clPlaceholder;
    if (ph && ph.parentNode) ph.parentNode.removeChild(ph);
    el._clPlaceholder = null;
    el.style.display = el._clDisplay || '';
    if (el.tagName === 'IFRAME') {
      var src = el.getAttribute('data-cl-src');
      if (src) el.src = src;
    }
    var fn = el.getAttribute('data-cl-load');
    if (fn && typeof window[fn] === 'function') { try { window[fn](); } catch (e) {} }
    embedCallbacks.forEach(function (cb) { if (cb.el === el) { try { cb.fn(); } catch (e) {} } });
  }

  function bloccaEsterno(el) {
    if (!el || el.getAttribute('data-cl-attivo') === '1' && el.tagName !== 'IFRAME') return; // Cal: resta fino al ricaricamento
    if (el.getAttribute('data-cl-attivo') === '1') {
      el.removeAttribute('src');
      el.setAttribute('data-cl-attivo', '0');
    }
    if (el._clPlaceholder) return;
    addEmbedCss();
    var nome = el.getAttribute('data-cl-embed') || 'un servizio esterno';
    var label = el.getAttribute('data-cl-label') || 'Mostra contenuto';
    var ph = document.createElement('div');
    ph.className = 'clc-embed';
    // Stessa altezza del contenuto (fino a 360px), cosi' la pagina non salta al caricamento.
    var h = parseInt(el.getAttribute('height') || el.style.minHeight || '', 10);
    if (h > 0) ph.style.minHeight = Math.min(h, 360) + 'px';
    ph.innerHTML = '<p>Questo contenuto è fornito da <strong></strong>, che può impostare cookie di terze parti. ' +
      'Si carica solo se lo chiedi. <a href="' + POLICY_URL + '">Cookie Policy</a></p>' +
      '<div class="clc-embed-actions"><button type="button" data-clc-embed="uno"></button>' +
      '<button type="button" data-clc-embed="sempre">Accetta sempre i contenuti esterni</button></div>';
    ph.querySelector('strong').textContent = nome;
    ph.querySelector('[data-clc-embed="uno"]').textContent = label;
    ph.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-clc-embed]') : null;
      if (!b) return;
      if (b.getAttribute('data-clc-embed') === 'uno') attivaEsterno(el);
      else {
        var c = state || { analytics: null, marketing: null };
        choose({ analytics: c.analytics, marketing: c.marketing, esterni: true });
      }
    });
    if (el._clDisplay === undefined) el._clDisplay = el.style.display;
    el.style.display = 'none';
    el._clPlaceholder = ph;
    el.parentNode.insertBefore(ph, el);
  }

  function preparaEsterno(el) {
    if (esterniConsentiti()) attivaEsterno(el); else bloccaEsterno(el);
  }

  function tuttiEsterni() { return Array.prototype.slice.call(document.querySelectorAll('[data-cl-embed]')); }
  function attivaTuttiEsterni() { if (document.body) tuttiEsterni().forEach(attivaEsterno); }
  function bloccaEsterniAttivi() { if (document.body) tuttiEsterni().forEach(bloccaEsterno); }

  // --- Banner ---
  var CSS = '' +
    '.clc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:10001;max-width:760px;margin:0 auto;padding:24px;border-radius:20px;' +
    'background:rgba(16,20,22,.97);border:1px solid #3d4944;box-shadow:0 25px 50px -12px rgba(0,0,0,.6);color:#F5F7FA;font-family:Inter,sans-serif;' +
    'max-height:calc(100vh - 32px);overflow-y:auto}' +
    '.clc-banner[hidden]{display:none}' +
    '.clc-title{margin:0 0 8px;font-family:Manrope,sans-serif;font-size:18px;font-weight:700;color:#F5F7FA}' +
    '.clc-text{margin:0;font-size:14px;line-height:1.6;color:#bccac3}' +
    '.clc-text a{color:#49C7A5;text-decoration:underline;text-underline-offset:2px}' +
    '.clc-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}' +
    '.clc-btn{padding:12px 14px;border-radius:12px;border:1px solid #49C7A5;background:transparent;color:#F5F7FA;' +
    'font-family:Inter,sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s ease}' +
    '.clc-btn:hover{background:rgba(73,199,165,.12)}' +
    '.clc-btn:focus-visible,.clc-check input:focus-visible{outline:2px solid #49C7A5;outline-offset:2px}' +
    '.clc-panel{margin-top:16px;padding-top:16px;border-top:1px solid rgba(61,73,68,.6)}' +
    '.clc-panel[hidden]{display:none}' +
    '.clc-check{display:flex;gap:12px;align-items:flex-start;padding:10px 0;font-size:14px;line-height:1.5;color:#bccac3;cursor:pointer}' +
    '.clc-check input{width:18px;height:18px;margin-top:2px;flex-shrink:0;accent-color:#49C7A5;cursor:pointer}' +
    '.clc-check strong{display:block;color:#F5F7FA;font-weight:600}' +
    '.clc-check input:disabled{cursor:not-allowed}' +
    '.clc-save{margin-top:8px;width:100%}' +
    '@media (max-width:560px){.clc-banner{left:8px;right:8px;bottom:8px;padding:20px}.clc-actions{grid-template-columns:1fr}}';

  var HTML = '' +
    '<h2 class="clc-title" id="clc-title">Cookie e privacy</h2>' +
    '<p class="clc-text" id="clc-desc">Usiamo cookie tecnici necessari al funzionamento del sito. Solo con il tuo consenso ' +
    'usiamo anche cookie statistici (Google Analytics) e di marketing (Meta Pixel), per capire come viene usato il sito e ' +
    'misurare le campagne, e mostriamo contenuti esterni (video, podcast, calendario). Puoi cambiare scelta quando vuoi ' +
    'da “Gestisci le preferenze cookie” in fondo alla pagina. ' +
    '<a href="' + POLICY_URL + '">Cookie Policy</a></p>' +
    '<div class="clc-actions">' +
      '<button type="button" class="clc-btn" data-clc="accept">Accetta tutto</button>' +
      '<button type="button" class="clc-btn" data-clc="reject">Rifiuta tutto</button>' +
      '<button type="button" class="clc-btn" data-clc="custom" aria-expanded="false" aria-controls="clc-panel">Personalizza</button>' +
    '</div>' +
    '<div class="clc-panel" id="clc-panel" hidden>' +
      '<label class="clc-check"><input type="checkbox" checked disabled>' +
        '<span><strong>Tecnici (sempre attivi)</strong>Necessari al funzionamento del sito e a ricordare questa scelta.</span></label>' +
      '<label class="clc-check"><input type="checkbox" data-clc-cat="analytics">' +
        '<span><strong>Statistici</strong>Google Analytics 4: statistiche sull’uso del sito.</span></label>' +
      '<label class="clc-check"><input type="checkbox" data-clc-cat="marketing">' +
        '<span><strong>Marketing (terze parti)</strong>Meta Pixel: misurazione delle campagne pubblicitarie.</span></label>' +
      '<label class="clc-check"><input type="checkbox" data-clc-cat="esterni">' +
        '<span><strong>Contenuti esterni</strong>Video YouTube, podcast Spotify, audio SoundCloud e calendario di prenotazione Cal.eu, che possono impostare cookie di terze parti.</span></label>' +
      '<button type="button" class="clc-btn clc-save" data-clc="save">Salva le mie scelte</button>' +
    '</div>';

  var banner = null;

  function build() {
    if (banner) return banner;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    banner = document.createElement('div');
    banner.className = 'clc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'clc-title');
    banner.setAttribute('aria-describedby', 'clc-desc');
    banner.hidden = true;
    banner.innerHTML = HTML;
    document.body.appendChild(banner);
    banner.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-clc]') : null;
      if (!b) return;
      var action = b.getAttribute('data-clc');
      if (action === 'accept') choose({ analytics: true, marketing: true, esterni: true });
      else if (action === 'reject') choose({ analytics: false, marketing: false, esterni: false });
      else if (action === 'custom') togglePanel();
      else if (action === 'save') {
        choose({
          analytics: banner.querySelector('[data-clc-cat="analytics"]').checked,
          marketing: banner.querySelector('[data-clc-cat="marketing"]').checked,
          esterni: banner.querySelector('[data-clc-cat="esterni"]').checked
        });
      }
    });
    return banner;
  }

  function togglePanel(forceOpen) {
    var panel = banner.querySelector('#clc-panel');
    var open = forceOpen === true ? true : panel.hidden;
    panel.hidden = !open;
    banner.querySelector('[data-clc="custom"]').setAttribute('aria-expanded', String(open));
    if (!banner.hidden) reserveSpace();
  }

  function showBanner(withPanel) {
    build();
    var c = state || { analytics: false, marketing: false, esterni: false };
    banner.querySelector('[data-clc-cat="analytics"]').checked = !!c.analytics;
    banner.querySelector('[data-clc-cat="marketing"]').checked = !!c.marketing;
    banner.querySelector('[data-clc-cat="esterni"]').checked = !!c.esterni;
    banner.querySelector('#clc-panel').hidden = true;
    if (withPanel) togglePanel(true);
    banner.hidden = false;
    reserveSpace();
  }

  // Il banner non blocca il sito: si aggiunge spazio in fondo alla pagina, cosi'
  // anche l'ultimo contenuto (footer compreso) resta raggiungibile scorrendo.
  var savedPadding = null;
  function reserveSpace() {
    if (savedPadding === null) savedPadding = document.body.style.paddingBottom;
    document.body.style.paddingBottom = (banner.offsetHeight + 32) + 'px';
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    if (savedPadding !== null) { document.body.style.paddingBottom = savedPadding; savedPadding = null; }
  }

  // Link "Gestisci le preferenze cookie" nel footer (e ovunque ci sia l'attributo).
  document.addEventListener('click', function (e) {
    var l = e.target && e.target.closest ? e.target.closest('[data-cl-consent-open]') : null;
    if (!l) return;
    e.preventDefault();
    showBanner(true);
    var first = banner.querySelector('.clc-btn');
    if (first) first.focus();
  });

  window.CLConsent = {
    analytics: function () { return !!(state && state.analytics === true); },
    statistics: function () { return !!(state && state.analytics === true); },
    marketing: function () { return !!(state && state.marketing === true); },
    esterni: esterniConsentiti,
    // Momento della scelta (ISO 8601) o null se l'utente non ha ancora scelto.
    timestamp: function () { return state ? new Date(state.ts * 1000).toISOString() : null; },
    // Campi per i payload verso n8n. consent_marketing_cookie (e non consent_marketing)
    // perche' consent_marketing nei payload esistenti indica il consenso alle email.
    payload: function () {
      return {
        consent_statistics: !!(state && state.analytics === true),
        consent_marketing_cookie: !!(state && state.marketing === true),
        consent_timestamp: state ? new Date(state.ts * 1000).toISOString() : null
      };
    },
    open: function () { showBanner(true); },
    // Contenuti esterni aggiunti da script (es. player SoundCloud): da chiamare dopo l'inserimento.
    esterno: function (el) { if (el) preparaEsterno(el); },
    // Esegue fn quando quel contenuto viene davvero caricato (subito se lo e' gia').
    quandoAttivo: function (el, fn) {
      if (!el) return;
      if (el.getAttribute('data-cl-attivo') === '1') { try { fn(); } catch (e) {} return; }
      embedCallbacks.push({ el: el, fn: fn });
    }
  };

  state = read();
  if (state) apply(state);
  var start = function () {
    tuttiEsterni().forEach(preparaEsterno);
    if (!decided(state)) showBanner(false);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
