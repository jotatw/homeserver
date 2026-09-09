/* ============================================================
 * HomeServer App — Store compartilhado de polling (Fase UX-E)
 * Uma requisição por tick, distribuída a quem precisa.
 * Pausa quando a aba está oculta (economia de CPU/rede no servidor).
 *
 * Tipos: ver app/app.d.ts (hsStore). Consumo:
 *   hsStore.subscribe("status", (st) => { ... })  — st: HsStatus
 * Chaves disponíveis: status | services | hardware.
 * PROIBIDO fetch/setInterval próprio em widget — tudo por aqui.
 * ============================================================ */

var hsStore = (function () {
  /** @type {Record<string, Function[]>} key -> [fn(data), ...] */
  var subscribers = {};
  /** @type {Record<string, any>} key -> último payload (cache) */
  var data = {};
  /** @type {Record<string, boolean>} key -> request em voo (dedupe) */
  var inflight = {};
  /** @type {number|null} */
  var timer = null;
  var INTERVAL = 10000; // 10s — suficiente para visão geral

  // Quais chaves cada consumidor usa
  var KEYS = {
    status:   "/api/v1/status",
    services: "/api/v1/services",
    hardware: "/api/v1/hardware",
  };

  /**
   * Busca uma chave e notifica assinantes. Erro mantém o último valor
   * (widgets mostram estado vazio se nunca carregou).
   * @param {string} key
   * @returns {Promise<void>}
   */
  function fetchKey(key) {
    if (inflight[key]) return Promise.resolve();
    inflight[key] = true;
    return api(KEYS[key])
      .then(function (d) { data[key] = d; notify(key); })
      .catch(function () { /* mantém último valor; widget mostra erro se nunca carregou */ })
      .finally(function () { inflight[key] = false; });
  }

  /** Notifica assinantes de uma chave; erro de um não derruba os outros. */
  function notify(key) {
    (subscribers[key] || []).forEach(function (fn) {
      try { fn(data[key]); } catch (_) {}
    });
  }

  /** Um tick: busca todas as chaves com assinantes (se a aba estiver visível). */
  function tick() {
    if (document.hidden) return; // aba em background: não gasta nada
    Object.keys(subscribers).forEach(function (key) {
      if (subscribers[key].length) fetchKey(key);
    });
  }

  return {
    /**
     * Assina uma chave; fn é chamado com o dado novo — e imediatamente com
     * o cache, se já houver. Inicia o polling no primeiro assinante.
     * @param {keyof typeof KEYS} key
     * @param {(data: any) => void} fn
     */
    subscribe: function (key, fn) {
      if (!KEYS[key]) return;
      (subscribers[key] = subscribers[key] || []).push(fn);
      if (data[key] !== undefined) { try { fn(data[key]); } catch (_) {} }
      start();
    },
    /** Remove uma assinatura (a chave para de ser buscada sem assinantes no próximo tick). */
    unsubscribe: function (key, fn) {
      if (!subscribers[key]) return;
      subscribers[key] = subscribers[key].filter(function (f) { return f !== fn; });
    },
    start: start,
    stop: function () { if (timer) { clearInterval(timer); timer = null; } },
  };

  /** Liga o intervalo (idempotente); primeira carga é imediata. */
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
