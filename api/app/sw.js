/* HomeServer App — Service Worker mínimo (v2.0)
 *
 * Objetivo: satisfazer o critério de instalação do PWA (fetch handler) e
 * deixar base para estratégias offline na v2.1. Não há cache inteligente
 * por ora — todo request segue para a rede.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
