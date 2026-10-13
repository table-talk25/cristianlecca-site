/* Pop-up "Torna al Centro": compare dopo 2 secondi, una sola volta per sessione.
   Il pulsante porta al form di /centro/ (#accedi). Incluso in home e /quiz/. */
(function () {
  var KEY = 'centro_popup_visto';
  var DELAY = 2000;

  function seen() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function track(name) {
    try { if (typeof gtag === 'function') gtag('event', name); } catch (e) {}
  }

  var css = '' +
    '.cp-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(8,10,11,.72);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;transition:opacity .3s ease}' +
    '.cp-overlay.cp-open{opacity:1}' +
    '.cp-dialog{position:relative;width:100%;max-width:640px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;border-radius:24px;border:1px solid #3d4944;background:#101416;box-shadow:0 25px 60px -12px rgba(0,0,0,.6);transform:translateY(16px) scale(.98);transition:transform .3s ease;font-family:Inter,sans-serif;color:#F5F7FA}' +
    '.cp-open .cp-dialog{transform:none}.cp-dialog:focus{outline:none}' +
    '.cp-hero{padding:48px 32px 32px;text-align:center;background:radial-gradient(circle at 50% 20%,rgba(73,199,165,.08) 0%,rgba(16,20,22,1) 70%)}' +
    '.cp-badge{display:inline-block;padding:4px 12px;border-radius:9999px;border:1px solid rgba(73,199,165,.2);background:rgba(73,199,165,.1);color:#49C7A5;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}' +
    '.cp-title{margin:20px 0 0;font-family:Manrope,sans-serif;font-weight:800;font-size:44px;line-height:1.1;letter-spacing:-.02em;color:#F5F7FA}' +
    '.cp-title span{background:linear-gradient(135deg,#49C7A5,#3A63FF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}' +
    '.cp-text{margin:16px auto 0;max-width:500px;font-size:17px;line-height:1.6;color:#bccac3}' +
    '.cp-btn{display:inline-block;margin-top:28px;padding:16px 32px;border-radius:12px;background:#49C7A5;color:#101416;font-size:15px;font-weight:600;text-decoration:none;transition:filter .2s ease,transform .1s ease}' +
    '.cp-btn:hover{filter:brightness(1.1)}.cp-btn:active{transform:scale(.97)}' +
    '.cp-meta{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;margin:16px 0 0;font-size:12px;font-weight:600;color:#bccac3}' +
    '.cp-dot{width:4px;height:4px;border-radius:50%;background:#3d4944}' +
    '.cp-features{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:32px;background:#191c1e;text-align:center}' +
    '.cp-feat h3{margin:12px 0 0;font-family:Manrope,sans-serif;font-size:15px;font-weight:700;color:#F5F7FA}' +
    '.cp-feat p{margin:6px 0 0;font-size:13px;line-height:1.5;color:#bccac3}' +
    '.cp-icon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%}' +
    '.cp-icon .material-symbols-outlined{font-size:22px}' +
    '.cp-close{position:absolute;top:12px;right:12px;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:0;border-radius:50%;background:rgba(245,247,250,.06);color:#bccac3;font-size:24px;line-height:1;cursor:pointer}' +
    '.cp-close:hover{background:rgba(245,247,250,.12);color:#F5F7FA}' +
    '@media (max-width:560px){.cp-hero{padding:44px 20px 24px}.cp-title{font-size:34px}.cp-text{font-size:15px}' +
    '.cp-features{grid-template-columns:1fr;gap:14px;padding:20px;text-align:left}' +
    '.cp-feat{display:grid;grid-template-columns:40px 1fr;column-gap:12px;align-items:start}.cp-icon{width:40px;height:40px;grid-row:span 2}' +
    '.cp-feat h3{margin:0}.cp-feat p{margin:2px 0 0}}' +
    '@media (prefers-reduced-motion:reduce){.cp-overlay,.cp-dialog{transition:none}}';

  var html = '' +
    '<div class="cp-dialog" role="dialog" aria-modal="true" aria-labelledby="cp-title" tabindex="-1">' +
      '<button type="button" class="cp-close" aria-label="Chiudi">&times;</button>' +
      '<div class="cp-hero">' +
        '<span class="cp-badge">Audio gratuito · 17 minuti</span>' +
        '<h2 class="cp-title" id="cp-title">Torna al <span>Centro.</span></h2>' +
        '<p class="cp-text">Un\'induzione ipnotica guidata di 17 minuti, pensata per i momenti in cui ti senti sopraffatto, disperso o fuori fuoco — per ritrovare in poco tempo stabilità e lucidità.</p>' +
        '<a class="cp-btn" href="/centro/#accedi">Ricevi l\'audio gratis</a>' +
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
    var lastFocus = document.activeElement;
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function close() {
      document.removeEventListener('keydown', onKey);
      overlay.classList.remove('cp-open');
      document.body.style.overflow = prevOverflow;
      setTimeout(function () { overlay.remove(); }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = dialog.querySelectorAll('a[href], button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('.cp-close').addEventListener('click', close);
    overlay.querySelector('.cp-btn').addEventListener('click', function () {
      track('centro_popup_click');
      document.body.style.overflow = prevOverflow;
    });
    document.addEventListener('keydown', onKey);

    requestAnimationFrame(function () { overlay.classList.add('cp-open'); });
    dialog.focus();
    track('centro_popup_view');
  }

  if (seen()) return;
  setTimeout(open, DELAY);
})();
