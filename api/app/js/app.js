/* ============================================================
 * HomeServer App — Workspace (v2.0 · Sprint 2)
 * Fonte: design/app/wireframes + design/app/flows
 *
 * Núcleo: helpers, navegação, tema/densidade, router e init.
 * As views vivem em js/views/*.js (carregados ANTES deste arquivo;
 * resolução de símbolos é em runtime — padrão globals).
 * ============================================================ */

/* ---------- Helpers ---------- */

/* ---------- Helpers ----------
 * esc() e toast() vivem em auth.js (compartilhados com login.html).
 * el(): `html` em attrs é SOMENTE para constantes internas (SVGs do ICONS)
 * — dados externos vão como filhos string (createTextNode, seguro).
 */
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (c === null || c === undefined) return;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}

/* ---------- Ícones (SVG monoline, stroke 1.8) ---------- */

const ICON_WRAP =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';

const ICONS = {
  home: '<path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  rows: '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="18" height="7" rx="1"/>',
  power: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  harddrive: '<line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  plug: '<path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0V8z"/><line x1="12" y1="18" x2="12" y2="22"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  filetext: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  square: '<rect x="5" y="5" width="14" height="14" rx="1"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  paperclip: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  chevron: '<polyline points="9 18 15 12 9 6"/>',
  pencil: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  toolbox: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  grip: '<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>',
  maximize: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
  up: '<polyline points="18 15 12 9 6 15"/>',
  down: '<polyline points="6 9 12 15 18 9"/>',
};

function icon(name, cls = "") {
  const span = el("span", { class: cls, "aria-hidden": "true", html: ICON_WRAP + (ICONS[name] || ICONS.box) + "</svg>" });
  return span;
}

function human(bytes) {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

function timeAgo(dateStr) {
  const t = new Date(dateStr.replace(" ", "T"));
  const s = Math.floor((Date.now() - t.getTime()) / 1000);
  if (s < 60) return "agora";
  if (s < 3600) return "há " + Math.floor(s / 60) + " min";
  if (s < 86400) return "há " + Math.floor(s / 3600) + " h";
  return "há " + Math.floor(s / 86400) + " d";
}

/* ---------- Navegação declarativa (flows/navigation.md §2) ---------- */

const NAV = [
  { route: "dashboard", title: "Meu espaço", icon: "home", minRole: "user", desktop: true, mobile: true },
  { route: "apps", title: "Aplicações", icon: "box", minRole: "user", desktop: true, mobile: true },
  { route: "storage", title: "Armazenamento", icon: "folder", minRole: "user", desktop: true, mobile: true },
  { route: "system", title: "Sistema", icon: "activity", minRole: "user", desktop: true, mobile: true },
  { route: "admin", title: "Administração", icon: "settings", minRole: "admin", desktop: true, mobile: true },
  { route: "print", title: "Impressão", icon: "printer", minRole: "admin", desktop: true, mobile: false },
];

const roleRank = { user: 1, admin: 2 };

function userNav() {
  const rank = roleRank[auth.user.role] || 0;
  return NAV.filter((n) => roleRank[n.minRole] <= rank);
}

/* ---------- Tema (dark/light) ---------- */

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("hs_theme", theme);
  } catch (_) {}
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(cur);
  toast(cur === "light" ? "Tema claro ativado." : "Tema escuro ativado.", "info");
}

/* ---------- Densidade (confortável / compacto) ---------- */

function applyDensity(mode) {
  document.documentElement.classList.toggle("compact", mode === "compact");
  try {
    localStorage.setItem("hs_density", mode);
  } catch (_) {}
}

function toggleDensity() {
  const compact = !document.documentElement.classList.contains("compact");
  applyDensity(compact ? "compact" : "cozy");
  toast(compact ? "Modo compacto ativado." : "Modo confortável ativado.", "info");
}

/* ---------- Build da navegação (sidebar + bottom nav) ---------- */

function buildNav() {
  const items = userNav();
  const nav = document.getElementById("sidebar-nav");
  const bottom = document.getElementById("bottom-nav");
  nav.innerHTML = "";
  bottom.innerHTML = "";

  const desktopItems = items.filter((n) => n.desktop !== false);
  const mobileItems = items.filter((n) => n.mobile !== false);

  desktopItems.forEach((n) => {
    nav.appendChild(el("a", { href: "#/" + n.route, class: "nav-item", "data-route": n.route },
      icon(n.icon), el("span", {}, n.title)));
  });

  mobileItems.forEach((n) => {
    bottom.appendChild(el("a", { href: "#/" + n.route, class: "nav-item", "data-route": n.route },
      icon(n.icon, "ic"), el("span", {}, n.title)));
  });

  // Overflow: abre o drawer com perfil, tema e sair (design navigation.md).
  const plus = el("button", { class: "nav-item", id: "bottom-plus", "aria-label": "Mais opções" },
    icon("plus", "ic"),
    el("span", {}, "Mais"));
  plus.addEventListener("click", openOverflowSheet);
  bottom.appendChild(plus);
}

function openOverflowSheet() {
  let sheet = document.getElementById("overflow-sheet");
  if (!sheet) {
    sheet = el("dialog", { id: "overflow-sheet", class: "sheet" },
      el("div", { class: "sheet-handle" }),
      el("div", { class: "sheet-item" },
        icon("user", "ic"),
        el("span", { class: "app-name", id: "sheet-user" })),
      el("button", { class: "sheet-item", id: "sheet-print" },
        icon("printer", "ic"), el("span", {}, "Impressão")),
      el("button", { class: "sheet-item", id: "sheet-theme" },
        icon("moon", "ic"), el("span", {}, "Tema")),
      el("button", { class: "sheet-item", id: "sheet-density" },
        icon("rows", "ic"), el("span", { id: "sheet-density-label" }, "Modo compacto")),
      el("button", { class: "sheet-item sheet-danger", id: "sheet-sair" },
        icon("power", "ic"), el("span", {}, "Sair")));
    document.body.appendChild(sheet);
  }

  document.getElementById("sheet-user").textContent =
    auth.user ? auth.user.username + (auth.isAdmin() ? " · Admin" : "") : "";
  sheet.showModal();
}

function highlightNav() {
  const route = currentRoute();
  document.querySelectorAll("[data-route]").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}

function setTitle() {
  const route = currentRoute();
  const item = NAV.find((n) => n.route === route);
  document.getElementById("topbar-title").textContent = item ? item.title : "";
}

function currentRoute() {
  const h = window.location.hash.replace(/^#\//, "");
  const known = NAV.find((n) => n.route === h);
  if (known) return h;
  const defaultRoute = auth.isAdmin() ? "dashboard" : "dashboard";
  return defaultRoute;
}

function renderUser() {
  const label = auth.user ? auth.user.username : "";
  const badge = auth.isAdmin() ? ' <span class="badge-admin">ADMIN</span>' : "";
  document.getElementById("sidebar-user").innerHTML = icon("user").outerHTML + " " + esc(label) + badge;
  document.getElementById("topbar-user").innerHTML = icon("user").outerHTML + " " + esc(label) + badge;
}

/* ---------- Router ---------- */

// vazio — o store centralizado (hsStore) controla o polling do dashboard

async function router() {
  const route = currentRoute();
  highlightNav();
  setTitle();

  const v = document.getElementById("view");
  v.innerHTML = "";
  v.appendChild(el("div", { class: "grid" },
    el("div", { class: "skeleton" }), el("div", { class: "skeleton" }),
    el("div", { class: "skeleton" }), el("div", { class: "skeleton" })));

  const renders = {
    dashboard: renderDashboard,
    apps: renderApps,
    storage: renderStorage,
    system: renderSystem,
    admin: renderAdmin,
    print: renderPrint,
  };

  // Guard de papel: rotas admin não renderizam nem montam skeleton para
  // não-admins (o link some da navegação; acesso direto por URL cai aqui).
  const navDef = NAV.find((n) => n.route === route);
  const rank = auth.user?.admin ? 2 : 1;
  if (navDef && roleRank[navDef.minRole] > rank) {
    v.innerHTML = "";
    v.appendChild(el("div", { class: "empty blocked-view" },
      icon("alert", "empty-icon"),
      el("h2", {}, "Acesso restrito a administradores."),
      el("p", { class: "muted" }, "Esta área requer uma conta de administrador."),
      el("a", { href: "#/dashboard", class: "btn btn-secondary" }, "Voltar ao Meu espaço")));
    return;
  }

  try {
    await renders[route]();
  } catch (err) {
    v.innerHTML = "";
    v.appendChild(el("p", { class: "empty error-msg" },
      icon("alert", "empty-icon"),
      err.message));
  }
}

/* ---------- Dashboard (Meu espaço) ----------
 * Delegado ao widget system (dashboard-widgets.js) — Fase 5
 * Mantido clearDashboardPolling como compat.
 */

/* ---------- Init ---------- */

window.addEventListener("hashchange", router);

// Delegation global: tema e sair funcionam mesmo se um render falhar no init.
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.id === "btn-theme" || btn.id === "btn-theme-mobile" || btn.id === "sheet-theme") {
    toggleTheme();
    const sheet = document.getElementById("overflow-sheet");
    if (sheet && sheet.open) sheet.close();
  } else if (btn.id === "sheet-density") {
    toggleDensity();
    const sheet = document.getElementById("overflow-sheet");
    if (sheet && sheet.open) sheet.close();
  } else if (btn.id === "btn-sair" || btn.id === "sheet-sair") {
    auth.logout().then(() => {
      window.location.href = "/app/login.html";
    });
  } else if (btn.id === "sheet-print") {
    const sheet = document.getElementById("overflow-sheet");
    if (sheet && sheet.open) sheet.close();
    window.location.hash = "#/print";
  }
});

/* ---------- Mobile Sidebar ---------- */
function setupMobileSidebar() {
  const hamburger = document.getElementById("btn-hamburger");
  const overlay = document.getElementById("sidebar-overlay");
  const sidebar = document.querySelector(".sidebar");

  if (!hamburger || !overlay || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);

  // Fechar ao clicar em link de navegação
  sidebar.querySelectorAll("a.nav-item").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  // Fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) closeSidebar();
  });
}

/* ---------- Device watcher (notificações de conexão/desconexão) ---------- */

const deviceWatchState = { devices: new Set(), enabled: false, timer: null };

function deviceWatchKey(d) {
  // Chave estável: device + mountpoint (o mountpoint muda quando monta/desmonta)
  return (d.device || "") + "|" + (d.mountpoint || "");
}

async function deviceWatchPoll() {
  if (!auth.isAdmin()) return;
  let available = [];
  try {
    available = await api("/api/v1/devices/available");
  } catch (_) {
    return; // API indisponível — tenta de novo no próximo ciclo
  }
  if (!Array.isArray(available)) return;

  const now = new Set(available.map(deviceWatchKey));
  const prev = deviceWatchState.devices;
  if (prev.size > 0) {
    // Conectados (novos): estavam fora, agora estão dentro
    const added = available.filter((d) => !prev.has(deviceWatchKey(d)));
    // Desconectados: estavam dentro, agora fora
    const removed = [...prev].filter((k) => !now.has(k));

    added.forEach((d) => {
      const label = d.label || d.device || "dispositivo";
      if (d.mounted) {
        toast("🔌 " + label + " conectado" + (d.mountpoint ? " em " + d.mountpoint : ""), "success");
      } else {
        toast("🔌 " + label + " detectado — pronto para conectar", "info");
      }
    });
    removed.forEach((k) => {
      const dev = k.split("|")[0] || "dispositivo";
      toast("⏏️ " + dev + " desconectado", "warn");
    });
  }
  deviceWatchState.devices = now;
}

function startDeviceWatch() {
  if (deviceWatchState.enabled) return;
  deviceWatchState.enabled = true;
  // Primeira passada só popula o baseline (sem notificações)
  deviceWatchPoll().then(() => {
    deviceWatchState.timer = setInterval(deviceWatchPoll, 15000);
  });
}

async function init() {
  applyTheme(localStorage.getItem("hs_theme") || "dark");
  applyDensity(localStorage.getItem("hs_density") || "cozy");

  if (!(await auth.check())) {
    window.location.href = "/app/login.html";
    return;
  }

  document.getElementById("app").hidden = false;
  buildNav();
  renderUser();
  setupMobileSidebar();
  startDeviceWatch();
  router();
}

/* Init — aguarda TODO o pipeline de scripts (views + store + widgets)
 * parsearem antes de rodar: init() é async e o await de auth.check()
 * pode resolver antes do parser terminar os <script> seguintes (corrida
 * real: renderDashboard is not defined em ~80% dos reloads). */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

