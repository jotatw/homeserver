/* Registro do Service Worker — arquivo externo (CSP: script-src 'self'
 * bloqueia <script> inline; sem isso o PWA nunca fica offline-capable). */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/app/sw.js");
  });
}
