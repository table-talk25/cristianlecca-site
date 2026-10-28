/* Pop-up "Torna al Centro": compare dopo 2 secondi, una sola volta per sessione.
   Il pulsante apre il form dentro il pop-up; l'invio usa lo stesso codice di /centro/
   (assets/centro-lead.js: webhook centro-lead, timeout di 8 secondi), poi Lead su Pixel,
   email in sessionStorage e /centro/ascolta/. Incluso in home e /quiz/. */
(function () {
  var KEY = 'centro_popup_visto';
  var DELAY = 2000;
  var CTA_LABEL = "Ricevi l'audio gratis";

  function seen() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }
  // Stessa funzione comune di /assets/tracking.js quando la pagina la carica.
  function track(name, params) {
    if (window.CLTracking) return window.CLTracking.track(name, params);
    try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch (e) {}
  }
  function readCookie(name) {
    try {
      var parts = ('; ' + document.cookie).split('; ' + name + '=');
      return parts.length === 2 ? parts.pop().split(';').shift() : '';
    } catch (e) { return ''; }
  }
  function getFbc() {
    var fromCookie = readCookie('_fbc');
    if (fromCookie) return fromCookie;
    try {
      var fbclid = new URLSearchParams(window.location.search).get('fbclid');
      if (fbclid) return 'fb.1.' + Date.now() + '.' + fbclid;
    } catch (e) {}
    return '';
  }
  function newEventId() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    } catch (e) {}
    return 'ev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 12);
  }

  var css = '' +
    '.cp-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(8,10,11,.72);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;transition:opacity .3s ease}' +
    '.cp-overlay.cp-open{opacity:1}' +
    '.cp-dialog{position:relative;width:100%;max-width:640px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;overscroll-behavior:contain;border-radius:24px;border:1px solid #3d4944;background:#101416;box-shadow:0 25px 60px -12px rgba(0,0,0,.6);transform:translateY(16px) scale(.98);transition:transform .3s ease;font-family:Inter,sans-serif;color:#F5F7FA}' +
    '.cp-open .cp-dialog{transform:none}.cp-dialog:focus{outline:none}' +
    '.cp-dialog[hidden],.cp-step[hidden]{display:none}' +
    '.cp-hero{padding:48px 32px 32px;text-align:center;background:radial-gradient(circle at 50% 20%,rgba(73,199,165,.08) 0%,rgba(16,20,22,1) 70%)}' +
    '.cp-badge{display:inline-block;padding:4px 12px;border-radius:9999px;border:1px solid rgba(73,199,165,.2);background:rgba(73,199,165,.1);color:#49C7A5;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}' +
    '.cp-title{margin:20px 0 0;font-family:Manrope,sans-serif;font-weight:800;font-size:44px;line-height:1.1;letter-spacing:-.02em;color:#F5F7FA}' +
    '.cp-title span{background:linear-gradient(135deg,#49C7A5,#3A63FF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}' +
    '.cp-text{margin:16px auto 0;max-width:500px;font-size:17px;line-height:1.6;color:#bccac3}' +
    '.cp-btn{display:inline-block;margin-top:28px;padding:16px 32px;border:0;border-radius:12px;background:#49C7A5;color:#101416;font-family:Inter,sans-serif;font-size:15px;font-weight:600;text-decoration:none;cursor:pointer;transition:filter .2s ease,transform .1s ease,opacity .2s ease}' +
    '.cp-btn:hover{filter:brightness(1.1)}.cp-btn:active{transform:scale(.97)}' +
    '.cp-btn:disabled{opacity:.6;cursor:not-allowed;filter:none;transform:none}' +
    '.cp-meta{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;margin:16px 0 0;font-size:12px;font-weight:600;color:#bccac3}' +
    '.cp-dot{width:4px;height:4px;border-radius:50%;background:#3d4944}' +
    '.cp-features{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:32px;background:#191c1e;text-align:center}' +
    '.cp-feat h3{margin:12px 0 0;font-family:Manrope,sans-serif;font-size:15px;font-weight:700;color:#F5F7FA}' +
    '.cp-feat p{margin:6px 0 0;font-size:13px;line-height:1.5;color:#bccac3}' +
    '.cp-icon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%}' +
    '.cp-icon .material-symbols-outlined{font-size:22px}' +
    '.cp-close{position:absolute;top:12px;right:12px;z-index:1;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:0;border-radius:50%;background:rgba(245,247,250,.06);color:#bccac3;font-size:24px;line-height:1;cursor:pointer}' +
    '.cp-close:hover{background:rgba(245,247,250,.12);color:#F5F7FA}' +
    /* Passo 2: form */
    '.cp-form-wrap{max-width:440px;margin:0 auto;padding:48px 32px 32px}' +
    '.cp-back{display:inline-flex;align-items:center;gap:4px;margin:0 0 16px;padding:0;border:0;background:none;color:#bccac3;font-family:Inter,sans-serif;font-size:13px;font-weight:600;cursor:pointer}' +
    '.cp-back:hover{color:#F5F7FA}' +
    '.cp-form-head{text-align:center;margin-bottom:24px}' +
    '.cp-form-head h2{margin:0;font-family:Manrope,sans-serif;font-size:24px;font-weight:700;line-height:1.25;color:#F5F7FA}' +
    '.cp-form-head p{margin:8px 0 0;font-size:15px;line-height:1.6;color:#bccac3}' +
    '.cp-form{display:flex;flex-direction:column;gap:14px}' +
    '.cp-input{display:block;width:100%;box-sizing:border-box;padding:14px 18px;background:rgba(255,255,255,.04)!important;border:1px solid rgba(245,247,250,.12)!important;border-radius:12px!important;color:#F5F7FA!important;-webkit-text-fill-color:#F5F7FA!important;font-family:Inter,sans-serif;font-size:16px;line-height:1.4;outline:none;box-shadow:none!important;transition:border-color .2s}' +
    '.cp-input:focus{border-color:#49C7A5!important}' +
    '.cp-input::placeholder{color:#86948e;-webkit-text-fill-color:#86948e;opacity:1}' +
    '.cp-input:-webkit-autofill{-webkit-text-fill-color:#F5F7FA!important;-webkit-box-shadow:0 0 0 1000px #1d2022 inset!important;caret-color:#F5F7FA}' +
    '.cp-input.cp-invalid{border-color:#ffb4ab!important}' +
    '.cp-hint{margin:6px 0 0;font-size:11px;color:#bccac3}' +
    '.cp-check{display:flex;align-items:flex-start;gap:10px;font-size:13px;line-height:1.5;color:#bccac3;cursor:pointer}' +
    '.cp-check input{width:18px;height:18px;margin:1px 0 0;flex-shrink:0;accent-color:#49C7A5;border-radius:4px;cursor:pointer}' +
    '.cp-check a{color:#49C7A5;text-decoration:underline}' +
    '.cp-form .cp-btn{width:100%;margin-top:4px;border-radius:9999px}' +
    '.cp-msg{display:none;padding:12px 16px;border-radius:12px;font-size:14px;line-height:1.5;text-align:center;color:#ffb4ab;background:rgba(255,180,171,.08);border:1px solid rgba(255,180,171,.25)}' +
    '.cp-msg.cp-show{display:block}' +
    '.cp-privacy{display:flex;align-items:center;justify-content:center;gap:6px;margin:16px 0 0;font-size:12px;color:rgba(188,202,195,.6)}' +
    '.cp-privacy .material-symbols-outlined{font-size:14px}' +
    '.cp-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}' +
    '@media (max-width:560px){.cp-hero{padding:44px 20px 24px}.cp-title{font-size:34px}.cp-text{font-size:15px}' +
    '.cp-features{grid-template-columns:1fr;gap:14px;padding:20px;text-align:left}' +
    '.cp-feat{display:grid;grid-template-columns:40px 1fr;column-gap:12px;align-items:start}.cp-icon{width:40px;height:40px;grid-row:span 2}' +
    '.cp-feat h3{margin:0}.cp-feat p{margin:2px 0 0}' +
    '.cp-form-wrap{padding:40px 20px 24px}.cp-form-head h2{font-size:22px}}' +
    '@media (prefers-reduced-motion:reduce){.cp-overlay,.cp-dialog{transition:none}}';

  var html = '' +
    '<div class="cp-dialog" role="dialog" aria-modal="true" aria-labelledby="cp-title" tabindex="-1">' +
      '<button type="button" class="cp-close" aria-label="Chiudi">&times;</button>' +

      '<div class="cp-step cp-step-intro">' +
        '<div class="cp-hero">' +
          '<span class="cp-badge">Audio gratuito · 17 minuti</span>' +
          '<h2 class="cp-title" id="cp-title">Torna al <span>Centro.</span></h2>' +
          '<p class="cp-text">Un\'induzione ipnotica guidata di 17 minuti, pensata per i momenti in cui ti senti sopraffatto, disperso o fuori fuoco — per ritrovare in poco tempo stabilità e lucidità.</p>' +
          '<button type="button" class="cp-btn cp-open-form">' + CTA_LABEL + '</button>' +
          '<p class="cp-meta"><span>Gratuito</span><span class="cp-dot"></span><span>17 minuti</span><span class="cp-dot"></span><span>Ascolti subito, qui</span></p>' +
        '</div>' +
        '<div class="cp-features">' +
          '<div class="cp-feat"><span class="cp-icon" style="background:rgba(73,199,165,.15);color:#49C7A5"><span class="material-symbols-outlined" aria-hidden="true">self_improvement</span></span>' +
            '<h3>Radicamento immediato</h3><p>Riporta l\'attenzione nel corpo, fuori dal loop mentale.</p></div>' +
          '<div class="cp-feat"><span class="cp-icon" style="background:rgba(58,99,255,.15);color:#3A63FF"><span class="material-symbols-outlined" aria-hidden="true">schedule</span></span>' +
            '<h3>17 minuti</h3><p>Puoi ascoltarlo ovunque, anche tra un impegno e l\'altro.</p></div>' +
          '<div class="cp-feat"><span class="cp-icon" style="background:rgba(201,164,92,.15);color:#C9A45C"><span class="material-symbols-outlined" aria-hidden="true">replay</span></span>' +
            '<h3>Riascoltabile quando serve</h3><p>Non è legato a un momento: torna al Centro ogni volta che ti serve.</p></div>' +
        '</div>' +
      '</div>' +

      '<div class="cp-step cp-step-form" hidden>' +
        '<div class="cp-form-wrap">' +
          '<button type="button" class="cp-back"><span aria-hidden="true">&larr;</span> Indietro</button>' +
          '<div class="cp-form-head">' +
            '<h2 id="cp-form-title">Ricevi subito il tuo audio</h2>' +
            '<p>Inserisci i tuoi dati: ti portiamo subito all\'audio, non arriva per email.</p>' +
          '</div>' +
          '<form class="cp-form" novalidate>' +
            '<input class="cp-input" type="text" name="first_name" placeholder="Il tuo nome" autocomplete="given-name" required>' +
            '<input class="cp-input" type="email" name="email" placeholder="La tua email" autocomplete="email" inputmode="email" required>' +
            '<div><input class="cp-input" type="tel" name="whatsapp" placeholder="Il tuo WhatsApp (facoltativo)" autocomplete="tel">' +
              '<p class="cp-hint">Solo per inviti a eventi live, mai spam.</p></div>' +
            '<input class="cp-hp" type="text" name="website" value="" tabindex="-1" autocomplete="off" aria-hidden="true">' +
            '<label class="cp-check"><input type="checkbox" name="consent_privacy" required>' +
              '<span>Accetto la <a href="/privacy/" target="_blank" rel="noopener">privacy policy</a></span></label>' +
            '<button type="submit" class="cp-btn cp-submit" disabled>' + CTA_LABEL + '</button>' +
            '<div class="cp-msg" role="alert"></div>' +
          '</form>' +
          '<p class="cp-privacy"><span class="material-symbols-outlined" aria-hidden="true">lock</span>100% Privacy. Nessuno spam.</p>' +
        '</div>' +
      '</div>' +
    '</div>';

  function open() {
    if (seen() || document.querySelector('.cp-overlay')) return;
    markSeen();

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'cp-overlay';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    var dialog = overlay.querySelector('.cp-dialog');
    var stepIntro = overlay.querySelector('.cp-step-intro');
    var stepForm = overlay.querySelector('.cp-step-form');
    var form = overlay.querySelector('.cp-form');
    var nameInput = form.elements.first_name;
    var emailInput = form.elements.email;
    var waInput = form.elements.whatsapp;
    var consent = form.elements.consent_privacy;
    var submitBtn = overlay.querySelector('.cp-submit');
    var msg = overlay.querySelector('.cp-msg');
    var sending = false;

    var lastFocus = document.activeElement;
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function close() {
      if (sending) return;
      document.removeEventListener('keydown', onKey);
      overlay.classList.remove('cp-open');
      document.body.style.overflow = prevOverflow;
      setTimeout(function () { overlay.remove(); }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(
          dialog.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"])'),
          function (el) { return el.offsetParent !== null; }
        );
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    function showStep(toForm) {
      stepIntro.hidden = toForm;
      stepForm.hidden = !toForm;
      dialog.setAttribute('aria-labelledby', toForm ? 'cp-form-title' : 'cp-title');
      dialog.scrollTop = 0;
      if (toForm) nameInput.focus();
      else overlay.querySelector('.cp-open-form').focus();
    }
    function showError(text) {
      msg.textContent = text;
      msg.classList.add('cp-show');
    }
    function resetSubmit() {
      sending = false;
      submitBtn.textContent = CTA_LABEL;
      submitBtn.disabled = !consent.checked;
    }

    // Su un pop-up col form aperto, un tocco fuori per sbaglio non deve far perdere i dati.
    overlay.addEventListener('click', function (e) { if (e.target === overlay && stepForm.hidden) close(); });
    overlay.querySelector('.cp-close').addEventListener('click', close);
    overlay.querySelector('.cp-open-form').addEventListener('click', function () {
      track('centro_popup_click');
      showStep(true);
    });
    overlay.querySelector('.cp-back').addEventListener('click', function () { showStep(false); });
    consent.addEventListener('change', function () { if (!sending) submitBtn.disabled = !consent.checked; });
    [nameInput, emailInput].forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('cp-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending || !consent.checked) return;
      msg.classList.remove('cp-show');

      var name = nameInput.value.trim();
      var email = emailInput.value.trim().toLowerCase();
      if (!name) { nameInput.classList.add('cp-invalid'); nameInput.focus(); showError('Scrivi il tuo nome.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailInput.classList.add('cp-invalid'); emailInput.focus(); showError('Controlla la tua email.'); return; }

      sending = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Invio in corso…';

      var eventId = newEventId();
      var payload = {
        first_name: name,
        email: email,
        whatsapp: waInput.value.trim(),
        source: 'centro_torna_al_centro',
        website: form.elements.website.value,
        consent_privacy: consent.checked,
        consent_marketing: false,
        submitted_at: new Date().toISOString(),
        // _fbp/_fbc (identificativi Meta) solo con il consenso marketing.
        fbp: window.CLConsent && CLConsent.marketing() ? readCookie('_fbp') : '',
        fbc: window.CLConsent && CLConsent.marketing() ? getFbc() : '',
        event_id: eventId,
        // SHA-256 dell'email normalizzata (per la CAPI in n8n): aggiunti qui sotto.
        em_sha256: '',
        external_id: '',
        // Stato del consenso cookie (consent_marketing qui sopra resta il consenso alle email).
        consent_statistics: !!(window.CLConsent && CLConsent.statistics()),
        consent_marketing_cookie: !!(window.CLConsent && CLConsent.marketing()),
        consent_timestamp: window.CLConsent ? CLConsent.timestamp() : null
      };
      // Come nel quiz: event_source_url solo con il consenso marketing e senza query string.
      if (window.CLConsent && CLConsent.marketing()) payload.event_source_url = location.origin + location.pathname;

      var T = window.CLTracking;
      (T && T.hashEmail ? T.hashEmail(email) : Promise.resolve(''))
        .then(function (h) {
          payload.em_sha256 = h;
          payload.external_id = h;
          // Lead del Pixel subito, senza aspettare n8n: stesso eventID del payload,
          // cosi' Meta deduplica con la Conversions API. Non blocca la navigazione.
          if (T && T.ricordaUtenteMeta) T.ricordaUtenteMeta(h);
          if (typeof fbq === 'function') {
            try { fbq('track', 'Lead', { content_name: 'Torna al Centro' }, { eventID: eventId }); } catch (err) {}
          }
          return window.CLCentroLead ? CLCentroLead.invia(payload) : { esito: 'errore' };
        })
        .then(function (r) {
          if (r.esito === 'ok' || r.esito === 'timeout') {
            // 'timeout': dopo 8 secondi si prosegue; la richiesta (keepalive) arriva comunque.
            track('centro_popup_lead');
            track('generate_lead', { method: 'centro_popup' });
            try { sessionStorage.setItem('centro_lead_email', payload.email); } catch (err) {}
            window.location.href = '/centro/ascolta/';
          } else if (r.esito === 'rifiutato') {
            resetSubmit();
            showError(r.messaggio || 'Qualcosa non ha funzionato. Riprova.');
          } else {
            // Errore di rete: i dati inseriti restano nel form, si puo' riprovare.
            resetSubmit();
            showError('Non siamo riusciti a inviare i dati: controlla la connessione e riprova.');
          }
        });
    });

    document.addEventListener('keydown', onKey);
    requestAnimationFrame(function () { overlay.classList.add('cp-open'); });
    dialog.focus();
    track('centro_popup_view');
  }

  if (seen()) return;
  setTimeout(open, DELAY);
})();
