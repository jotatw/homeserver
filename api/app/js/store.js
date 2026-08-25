/* ============================================================
 * HomeServer App — Store compartilhado de polling (Fase UX-E)
 * Uma requisição por tick, distribuída a quem precisa.
 * Pausa quando a aba está oculta (economia de CPU/rede no servidor).
 * ============================================================ */

var hsStore = (function () {
  var subscribers = {};   // key -> [fn(data), ...]
  var data = {};          // key -> último payload
  var inflight = {};      // key -> true enquanto request em voo
  var timer = null;
  var INTERVAL = 10000;   // 10s — suficiente para visão geral

  // Quais chaves cada consumidor usa
  var KEYS = {
    status:   "/api/v1/status",
    services: "/api/v1/services",
    hardware: "/api/v1/hardware",
  };

  function fetchKey(key) {
    if (inflight[key]) return Promise.resolve();
    inflight[key] = true;
    return api(KEYS[key])
      .then(function (d) { data[key] = d; notify(key); })
      .catch(function () { /* mantém último valor; widget mostra erro se nunca carregou */ })
      .finally(function () { inflight[key] = false; });
  }

  function notify(key) {
    (subscribers[key] || []).forEach(function (fn) {
      try { fn(data[key]); } catch (_) {}
    });
  }

  function tick() {
    if (document.hidden) return; // aba em background: não gasta nada
    Object.keys(subscribers).forEach(function (key) {
      if (subscribers[key].length) fetchKey(key);
    });
  }

  return {
    /** Assina uma chave; fn é chamado com o dado novo (ou o cache imediatamente). */
    subscribe: function (key, fn) {
      if (!KEYS[key]) return;
      (subscribers[key] = subscribers[key] || []).push(fn);
      if (data[key] !== undefined) { try { fn(data[key]); } catch (_) {} }
      start();
    },
    unsubscribe: function (key, fn) {
      if (!subscribers[key]) return;
      subscribers[key] = subscribers[key].filter(function (f) { return f !== fn; });
    },
    start: start,
    stop: function () { if (timer) { clearInterval(timer); timer = null; } },
  };

  function start() {
    if (timer) return;
    tick(); // primeira carga imediata
    timer = setInterval(tick, INTERVAL);
  }
})();

// Pausa/retoma conforme a visibilidade da aba
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) hsStore.start();
});
