/* ============================================================
 * HomeServer App — Biblioteca de Componentes (Sprint UX-02)
 * Fonte da verdade: design/app/components/*.md
 *
 * Fábricas de UI compartilhadas por todas as telas.
 * Depende apenas de el() (app.js) e dos tokens de theme.css.
 * Carregado ANTES de app.js — funções resolvem el() em runtime.
 * ============================================================ */

/* ---------- Botão ---------- */
/**
 * Botão padrão do design system.
 * @param {{label?: string, variant?: "primary"|"secondary"|"danger",
 *          icon?: string, onClick?: EventListener, title?: string,
 *          type?: "button"|"submit"}} opts
 * @returns {HTMLButtonElement}
 */
function button(opts = {}) {
  const b = el("button", {
    class: "btn btn-" + (opts.variant || "primary"),
    type: opts.type || "button",
  });
  if (opts.title) b.setAttribute("title", opts.title);
  if (opts.icon) b.appendChild(icon(opts.icon, "ic"));
  if (opts.label) b.appendChild(document.createTextNode(opts.icon ? " " + opts.label : opts.label));
  if (opts.onClick) b.addEventListener("click", opts.onClick);
  return b;
}

/* ---------- Estados de serviço (semântica consistente) ----------
 * Não depender só da cor (acessibilidade): glifo + rótulo + cor. */
const SERVICE_STATES = {
  running:    { label: "Online",       kind: "ok",     glyph: "✓" },
  stopped:    { label: "Parado",       kind: "danger", glyph: "×" },
  exited:     { label: "Parado",       kind: "danger", glyph: "×" },
  updating:   { label: "Atualizando",  kind: "info",   glyph: "↻" },
  warning:    { label: "Atenção",      kind: "warn",   glyph: "!" },
  unknown:    { label: "Desconhecido", kind: "warn",   glyph: "?" },
};

/** Estado canônico a partir do status bruto vindo da API. */
function serviceState(status) {
  return SERVICE_STATES[status] || SERVICE_STATES.unknown;
}

/** Dot colorido (usar junto de stateBadge ou isolado em listas densas). */
function statusDot(state, cls = "") {
  return el("span", { class: "status-dot " + state.kind + " " + cls, "aria-hidden": "true" });
}

/** Selo completo de estado: "✓ Online" — glifo + texto + cor. */
function stateBadge(status) {
  const st = serviceState(status);
  return el("span", { class: "badge " + st.kind },
    el("span", { class: "badge-glyph", "aria-hidden": "true" }, st.glyph),
    " " + st.label);
}

/* ---------- Badge genérico ---------- */
/** badge("texto", "ok|warn|danger|info") */
function badge(text, kind = "info") {
  return el("span", { class: "badge " + kind }, text);
}

/* ---------- Card de métrica (stat) ---------- */
/** statCard("CPU", "41%", 41) — barra opcional quando pct > 0. */
/**
 * Card de métrica com barra opcional. Limiares de cor da barra:
 * >85 danger, >60 warn, senão ok — o pill de saúde do dashboard usa
 * OS MESMOS limiares (dashboard-widgets.js).
 * @param {string} label
 * @param {string} value
 * @param {number} [pct] 0..100; 0 = sem barra (ex.: uptime)
 * @returns {HTMLDivElement}
 */
function statCard(label, value, pct = 0) {
  const bar = pct > 0
    ? el("div", { class: "stat-bar", role: "img", "aria-label": label + ": " + Math.round(pct) + "%" },
        el("div", { style: `width:${Math.min(100, pct)}%;background:${pct > 85 ? "var(--hs-color-danger)" : pct > 60 ? "var(--hs-color-warn)" : "var(--hs-color-ok)"}` }))
    : null;
  return el("div", { class: "stat-card" },
    el("div", { class: "stat-label" }, label),
    el("div", { class: "stat-value" }, value),
    bar);
}

/* ---------- Linha de lista/feed ---------- */
/** feedRow("clock", "Desliga às", "23:00") */
/** Linha de feed "ícone + rótulo + valor". @returns {HTMLDivElement} */
function feedRow(iconName, label, value) {
  return el("div", { class: "feed-item" },
    icon(iconName),
    el("span", { class: "app-name" }, label),
    el("span", { class: "feed-time" }, value));
}

/* ---------- Card de atalho ---------- */
/** actionCard("folder", "Arquivos", "/files/") — href # rotas internas. */
/** Card de atalho; href "#" abre na SPA, externo abre em nova aba. @returns {HTMLAnchorElement} */
function actionCard(iconName, title, href) {
  const isHash = href.startsWith("#");
  return el("a", { href, class: "app-card", target: isHash ? "_self" : "_blank" },
    icon(iconName, "ic"),
    el("span", { class: "app-name" }, title),
    el("span", {}, "→"));
}

/* ---------- Estruturas de página ---------- */
/** Título de seção padrão. */
function sectionTitle(text) {
  return el("h3", { class: "section" }, text);
}

/** Estado vazio com mensagem (e ação opcional). */
/** Estado vazio com mensagem (e ação opcional). @returns {HTMLParagraphElement} */
function emptyState(message, actionEl) {
  return el("p", { class: "empty" }, message, actionEl || null);
}
