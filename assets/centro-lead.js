/* Invio del lead "Torna al Centro": stessa logica per la pagina /centro/ e per il pop-up
 * (assets/centro-popup.js). Webhook n8n centro-lead.
 *
 * CLCentroLead.invia(payload) -> Promise che si risolve sempre (mai rifiutata) con:
 *   { esito: 'ok' }                    n8n ha risposto success: true
 *   { esito: 'timeout' }               nessuna risposta entro 8 secondi: la richiesta NON
 *                                      viene annullata (keepalive) e arriva comunque a n8n
 *   { esito: 'rifiutato', messaggio }  n8n ha risposto, ma senza success
 *   { esito: 'errore' }                errore di rete prima degli 8 secondi
 * La destinazione (/centro/ascolta/) non dipende dalla risposta: con 'ok' e 'timeout'
 * si prosegue, con 'rifiutato' ed 'errore' si resta sul form.
 */
(function () {
  var ENDPOINT = 'https://n8n-ki7p4haqsdhr1meg2k45zosi.92.4.222.169.sslip.io/webhook/centro-lead';
  var TIMEOUT_MS = 8000;

  function invia(payload) {
    return new Promise(function (resolve) {
      var finito = false;
      var timer = setTimeout(function () { fine({ esito: 'timeout' }); }, TIMEOUT_MS);
      function fine(r) {
        if (finito) return;
        finito = true;
        clearTimeout(timer);
        resolve(r);
      }
      var richiesta;
      try {
        // keepalive: la richiesta prosegue anche se nel frattempo si cambia pagina.
        // Nessun nuovo tentativo automatico: se n8n avesse gia' ricevuto i dati,
        // un secondo invio creerebbe un lead doppio.
        richiesta = fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        });
      } catch (e) {
        richiesta = Promise.reject(e);
      }
      richiesta
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) fine({ esito: 'ok' });
          else fine({ esito: 'rifiutato', messaggio: data && data.message });
        })
        .catch(function () { fine({ esito: 'errore' }); });
    });
  }

  window.CLCentroLead = { invia: invia, TIMEOUT_MS: TIMEOUT_MS };
})();
