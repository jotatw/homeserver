/* ============================================================
 * HomeServer App — Workspace (v2.0 · Sprint 2)
 * Fonte: design/app/wireframes + design/app/flows
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

function statCard(label, value, pct) {
  const bar = pct > 0
    ? el("div", { class: "stat-bar" },
        el("div", { style: `width:${Math.min(100, pct)}%`, background: pct > 85 ? "var(--hs-color-danger)" : pct > 60 ? "var(--hs-color-warn)" : "var(--hs-color-ok)" }))
    : null;
  return el("div", { class: "stat-card" },
    el("div", { class: "stat-label" }, label),
    el("div", { class: "stat-value" }, value),
    bar);
}

function actionCard(iconName, title, href) {
  const isHash = href.startsWith("#");
  const a = el("a", { href, class: "app-card", target: isHash ? "_self" : "_blank" },
    icon(iconName, "ic"),
    el("span", { class: "app-name" }, title),
    el("span", {}, "→"));
  return a;
}

/* ---------- Aplicações ---------- */

const APP_MAP = {
  homepage: { title: "Homepage", host: "/", icon: "home" },
  api: { title: "HomeServer App", host: "/app", icon: "monitor" },
  files: { title: "Arquivos (FileBrowser)", host: "/files/", icon: "folder" },
  gitea: { title: "Gitea", host: "/git/", icon: "code" },
  caddy: { title: "Proxy (Caddy)", host: "", icon: "shield" },
  portainer: { title: "Portainer", host: "", icon: "layers" },
};

/** Retorna os metadados amigáveis de um serviço, derivando do APP_MAP estático
 *  ou gerando dinamicamente para novos serviços/módulos não mapeados. */
function getAppMeta(s) {
  if (!s) return { title: "Aplicação", host: "", icon: "box" };
  const known = APP_MAP[s.name];
  if (known) return known;

  // Fallback dinâmico gracioso
  const title = s.title || s.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let icon = "box";
  const n = s.name.toLowerCase();
  if (n.includes("media") || n.includes("jelly") || n.includes("plex")) icon = "monitor";
  else if (n.includes("net") || n.includes("dns") || n.includes("pihole")) icon = "shield";
  else if (n.includes("store") || n.includes("drive") || n.includes("cloud")) icon = "folder";
  else if (n.includes("db") || n.includes("sql") || n.includes("postgres")) icon = "database";

  const host = s.url || s.host || (s.port ? "http://" + window.location.hostname + ":" + s.port : "");
  return { title, host, icon };
}

async function renderApps() {
  const services = await api("/api/v1/services");
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Aplicações"));

  const state = { query: "", filter: "all" };

  // Toolbar: busca + filtros
  const toolbar = el("div", { class: "apps-toolbar" });
  const search = el("input", {
    class: "search-field",
    type: "search",
    placeholder: "Buscar aplicação…",
    "aria-label": "Buscar aplicação",
  });
  toolbar.appendChild(search);

  const chips = el("div", { class: "chips" });
  [["all", "Todos"], ["running", "Ativos", "ok"], ["down", "Offline", "danger"]].forEach(([key, label, cls]) => {
    const chip = el("button", { class: "chip" + (key === "all" ? " active" : ""), "data-filter": key },
      cls ? el("span", { class: "chip-dot " + cls }, "") : null,
      el("span", {}, label));
    chip.addEventListener("click", () => {
      state.filter = key;
      chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === key));
      renderGrid();
    });
    chips.appendChild(chip);
  });
  toolbar.appendChild(chips);
  v.appendChild(toolbar);

  const grid = el("div", { class: "grid", id: "apps-grid" });
  v.appendChild(grid);

  function matches(s, meta) {
    const q = state.query.toLowerCase();
    if (state.filter === "running" && s.status !== "running") return false;
    if (state.filter === "down" && s.status === "running") return false;
    if (!q) return true;
    return (meta.title + " " + s.name).toLowerCase().includes(q);
  }

  function renderGrid() {
    grid.innerHTML = "";
    const list = services
      .filter((s) => matches(s, getAppMeta(s)))
      .sort((a, b) => (a.status === "running" ? -1 : 1) - (b.status === "running" ? -1 : 1));

    if (!list.length) {
      grid.appendChild(el("p", { class: "empty" },
        "Nenhuma aplicação encontrada para \"" + state.query + "\"",
        el("br", {}),
        el("button", { class: "btn btn-secondary", style: "margin-top:var(--hs-space-2)" }, "Limpar busca")));
      return;
    }

    list.forEach((s) => {
      const meta = getAppMeta(s);
      const up = s.status === "running";
      const card = el("div", { class: "app-card" },
        icon(meta.icon, "ic"),
        el("span", { class: "status-dot " + (up ? "ok" : "danger") }),
        el("span", { class: "app-name" }, meta.title),
        el("span", { class: "app-host" }, up ? "Ativo" : "Offline"));

      if (meta.host && up) {
        card.addEventListener("click", () => window.open(meta.host, "_blank"));
        card.style.cursor = "pointer";
      }

      // Controle de serviços (admin) — casa canônica: Aplicações
      if (auth.isAdmin()) {
        const ops = el("div", { class: "app-card-ops" });
        if (up) {
          const stopBtn = el("button", {
            class: "btn btn-secondary", style: "height:var(--hs-touch-compact)",
            title: "Parar " + (meta.title || s.name),
          }, "Parar");
          stopBtn.addEventListener("click", (e) => { e.stopPropagation(); runServiceOp(s.name, "stop", stopBtn); });
          ops.appendChild(stopBtn);
        } else {
          const startBtn = el("button", {
            class: "btn btn-primary", style: "height:var(--hs-touch-compact)",
            title: "Iniciar " + (meta.title || s.name),
          }, "Iniciar");
          startBtn.addEventListener("click", (e) => { e.stopPropagation(); runServiceOp(s.name, "start", startBtn); });
          ops.appendChild(startBtn);
        }
        card.appendChild(ops);
      }

      grid.appendChild(card);
    });
  }

  search.addEventListener("input", () => {
    state.query = search.value.trim();
    renderGrid();
  });

  renderGrid();
}

/* ---------- Armazenamento (Fase 1: painel de uso) ---------- */

async function renderStorage() {
  const [st, status, devices] = await Promise.all([
    api("/api/v1/storage"),
    api("/api/v1/status"),
    api("/api/v1/devices"),
  ]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  // 1. Disco principal
  const disk = status.disk || {};
  v.appendChild(el("h3", { class: "section" }, "Disco principal"));
  const grid = el("div", { class: "grid" });
  grid.appendChild(statCard("Disco", (disk.percent ?? 0) + "%", disk.percent ?? 0));
  grid.appendChild(statCard("Usado", human(disk.used || 0), 0));
  grid.appendChild(statCard("Disponível", human(disk.available || 0), 0));
  grid.appendChild(statCard("Total", human(disk.total || 0), 0));
  v.appendChild(grid);

  // 2. Raiz de dados
  v.appendChild(el("h3", { class: "section" }, "Dados"));
  const dados = el("div", { class: "feed" });
  dados.appendChild(feedRow("folder", "Raiz de dados", st.root || "—"));
  dados.appendChild(feedRow("harddrive", "Total armazenado", st.total_size_human || "—"));
  dados.appendChild(feedRow("check", "Pronto", st.ready ? "Sim" : "Não"));
  v.appendChild(dados);

  // 3. Pastas por usuário
  v.appendChild(el("h3", { class: "section" }, "Pastas"));
  const folders = [
    ["user", "Usuários", st.users ?? 0],
    ["users", "Compartilhado", st.shared ?? 0],
    ["film", "Mídia", st.media ?? 0],
    ["filetext", "Documentos", st.documents ?? 0],
    ["plug", "Dispositivos", st.devices ?? 0],
  ];
  const fgrid = el("div", { class: "grid" });
  folders.forEach(([iconName, label, value]) =>
    fgrid.appendChild(el("div", { class: "app-card" },
      icon(iconName, "ic"),
      el("span", { class: "app-name" }, label),
      el("span", { class: "app-host" }, String(value)))));
  v.appendChild(fgrid);

  // 4. Dispositivos conectados — descoberta automática (montados ou não)
  v.appendChild(el("h3", { class: "section" }, "Dispositivos"));
  await renderDevicesSection(devices);

  // 5. Navegação de arquivos (FileBrowser)
  v.appendChild(el("div", { class: "empty", style: "padding-top: var(--hs-space-8)" },
    icon("folder", "empty-icon"),
    "Os arquivos são gerenciados pelo FileBrowser.",
    el("br", {}),
    el("a", { href: "/files/", target: "_blank" }, "Abrir Arquivos →")));
}

/* ---------- Dispositivos (descoberta + 1 clique) ---------- */

async function renderDevicesSection(mountedDevices) {
  const wrap = el("div");
  const v = document.getElementById("view");
  v.appendChild(wrap);

  const feed = el("div", { class: "feed", id: "devices-feed" });
  wrap.appendChild(feed);

  let available = [];
  if (auth.isAdmin()) {
    try {
      available = await api("/api/v1/devices/available");
    } catch (_) { /* segue com montados apenas */ }
  }

  // Índice de removíveis por mountpoint para cruzar com montados
  const availByMp = {};
  available.forEach((d) => {
    if (d.mountpoint) availByMp[d.mountpoint] = d;
  });

  // --- Removíveis NÃO montados: Conectar com 1 clique ---
  const unmounted = available.filter((d) => !d.mounted);
  if (unmounted.length) {
    feed.appendChild(el("div", { class: "feed-item", style: "background:var(--hs-color-info-soft);font-size:.85rem" },
      icon("zap"), el("span", {}, "Prontos para conectar")));
    unmounted.forEach((d) => {
      const row = el("div", { class: "feed-item module-row" },
        icon("plug"),
        el("div", { class: "module-meta" },
          el("div", { class: "app-name" }, d.label),
          el("div", { class: "app-host" },
            `${d.size} · ${d.fstype || "fs?"} · ${d.model || d.transport}`)));
      if (auth.isAdmin()) {
        const act = el("span", { class: "device-actions" });
        const btn = el("button", { class: "btn btn-primary", style: "height:var(--hs-touch-compact)" }, "Conectar");
        btn.addEventListener("click", async () => {
          btn.disabled = true;
          btn.textContent = "Conectando…";
          try {
            await apiOrFail("/api/v1/devices/mount", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: d.type, label: d.label, device: d.device }),
            });
            toast(`${d.label} conectado.`, "success");
            renderStorage();
          } catch (err) {
            toast(err.message || "Falha ao conectar.", "error");
            btn.disabled = false;
            btn.textContent = "Conectar";
          }
        });
        act.appendChild(btn);
        row.appendChild(act);
      }
      feed.appendChild(row);
    });
  }

  // --- Montados ---
  if (mountedDevices && mountedDevices.length) {
    mountedDevices.forEach((d) => {
      const extra = availByMp[d.mountpoint] || {};
      const sizeUsed = human(Number(d.size || 0));
      const modelInfo = extra.model ? ` · ${extra.model}` : "";

      const row = el("div", { class: "feed-item module-row" },
        el("span", { class: "status-dot ok" }),
        el("div", { class: "module-meta" },
          el("div", { class: "app-name" }, d.label),
          el("div", { class: "app-host" },
            `${(d.type || "").toUpperCase()}${sizeUsed !== "0 B" ? " · " + sizeUsed : ""}${modelInfo} · ${d.mountpoint}`)));

      if (auth.isAdmin()) {
        const act = el("span", { class: "device-actions" });

        // Abrir arquivos (rota /files/ via Caddy — HTTPS)
        const openLink = el("a", {
          href: "/files/",
          target: "_blank",
          class: "btn btn-secondary", style: "height:var(--hs-touch-compact);text-decoration:none",
        }, "Abrir");
        act.appendChild(openLink);

        // Ejetar (seguro p/ pendrive/SD): desmonta + ejeta em um clique
        if (extra.device) {
          const ejBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Ejetar");
          ejBtn.addEventListener("click", async () => {
            if (!confirm(`Ejetar ${d.label}? Aguarde o LED apagar antes de remover.`)) return;
            ejBtn.disabled = true;
            ejBtn.textContent = "…";
            try {
              await apiOrFail("/api/v1/devices/unmount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: d.type, label: d.label }),
              });
              await apiOrFail("/api/v1/devices/eject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ device: extra.device }),
              }).catch(() => { }); // eject é best-effort (HD externo sem suporte)
              toast(`${d.label} pode ser removido com segurança.`, "success");
              renderStorage();
            } catch (err) {
              toast(err.message || "Falha ao ejetar.", "error");
              ejBtn.disabled = false;
              ejBtn.textContent = "Ejetar";
            }
          });
          act.appendChild(ejBtn);
        }

        // Desmontar (sem eject — HD externo que fica conectado)
        const umBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Desmontar");
        umBtn.addEventListener("click", async () => {
          if (!confirm(`Desmontar ${d.label}?`)) return;
          umBtn.disabled = true;
          umBtn.textContent = "…";
          try {
            await apiOrFail("/api/v1/devices/unmount", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: d.type, label: d.label }),
            });
            toast(`${d.label} desmontado.`, "success");
            renderStorage();
          } catch (err) {
            toast(err.message || "Falha ao desmontar.", "error");
            umBtn.disabled = false;
            umBtn.textContent = "Desmontar";
          }
        });
        act.appendChild(umBtn);

        row.appendChild(act);
      }
      feed.appendChild(row);
    });
  } else if (!unmounted.length) {
    feed.appendChild(el("div", { class: "feed-item" }, "Nenhum dispositivo conectado."));
  }

  // Dialog manual continua disponível como fallback avançado
  if (auth.isAdmin()) {
    const adv = el("details", { class: "ops-menu", style: "margin-top:var(--hs-space-2)" },
      el("summary", { class: "btn btn-secondary", style: "width:auto;height:var(--hs-touch-compact)" },
        icon("toolbox", "ic"), " Montagem manual (avançado)"));
    adv.addEventListener("toggle", () => { if (adv.open && !adv.dataset.ready) { adv.dataset.ready = "1"; openMountDialog(); adv.open = false; } });
    wrap.appendChild(adv);
  }
}

function feedRow(iconName, label, value) {
  return el("div", { class: "feed-item" },
    icon(iconName),
    el("span", { class: "app-name" }, label),
    el("span", { class: "feed-time" }, value));
}

/* ---------- Sistema ---------- */

async function renderSystem() {
  const [status] = await Promise.all([api("/api/v1/status")]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  // Gauges (todos)
  v.appendChild(el("h3", { class: "section" }, "Servidor"));
  const grid = el("div", { class: "grid" });
  grid.appendChild(statCard("CPU", (status.cpu.percent ?? 0) + "%", status.cpu.percent ?? 0));
  grid.appendChild(statCard("Memória", (status.memory.percent ?? 0) + "%", status.memory.percent ?? 0));
  grid.appendChild(statCard("Disco", (status.disk.percent ?? 0) + "%", status.disk.percent ?? 0));
  grid.appendChild(statCard("Uptime", status.uptime || "—", 0));
  v.appendChild(grid);

  // Checks de serviço (todos) — estilo status page
  v.appendChild(el("h3", { class: "section" }, "Checks"));
  const checks = el("div", { class: "feed" });
  (status.services || []).forEach((s) => checks.appendChild(el("div", { class: "feed-item" },
    el("span", { class: "status-dot " + (s.status === "running" ? "ok" : "danger") }),
    el("span", {}, s.name),
    el("span", { class: "feed-time" }, badge(s.status === "running" ? "● Ativo" : "✕ Offline",
      s.status === "running" ? "ok" : "danger")))));
  v.appendChild(checks);

  // Admin: energia + hardware
  if (auth.isAdmin()) {
    const [power, hardware] = await Promise.all([
      api("/api/v1/power"),
      api("/api/v1/hardware"),
    ]);

    // Energia
    v.appendChild(el("h3", { class: "section" }, "Energia"));
    const pwr = el("div", { class: "feed" });
    pwr.appendChild(feedRow("clock", "Desliga às", power.shutdown || "—"));
    pwr.appendChild(feedRow("bell", "Liga às", power.wake || "—"));
    pwr.appendChild(feedRow("zap", "Agendado", power.enabled ? "Sim" : "Não"));
    v.appendChild(pwr);
    const editBtn = el("button", { class: "btn btn-secondary", style: "margin-top:var(--hs-space-2)" },
      icon("pencil", "ic"), " Editar agenda");
    editBtn.addEventListener("click", () => openPowerDialog(power));
    v.appendChild(editBtn);

    // Rede
    if (hardware.network) {
      v.appendChild(el("h3", { class: "section" }, "Rede"));
      const net = el("div", { class: "feed" });
      net.appendChild(feedRow("wifi", "IP", hardware.network.ip || "—"));
      v.appendChild(net);
    }

    // Temperatura (alerta ≥80°C)
    if (hardware.temperature && hardware.temperature.length) {
      v.appendChild(el("h3", { class: "section" }, "Temperatura"));
      const tgrid = el("div", { class: "grid" });
      hardware.temperature.forEach((t) => {
        const hot = t.temp >= 80;
        tgrid.appendChild(el("div", { class: "app-card", style: hot ? "border-color:var(--hs-color-danger)" : "" },
          el("span", { class: "status-dot " + (hot ? "danger" : "ok") }),
          el("span", { class: "app-name" }, (t.label || t.chip) + (hot ? " · quente" : "")),
          el("span", { class: "app-host" }, t.temp + "°C")));
      });
      v.appendChild(tgrid);
    }

    // Discos (blocos)
    if (hardware.disks && hardware.disks.blockdevices && hardware.disks.blockdevices.length) {
      v.appendChild(el("h3", { class: "section" }, "Discos"));
      const dgrid = el("div", { class: "grid" });
      hardware.disks.blockdevices.forEach((d) => {
        const size = d.size || "";
        const children = d.children ? d.children.length + " partição(ões)" : "";
        dgrid.appendChild(el("div", { class: "app-card" },
          icon("harddrive", "ic"),
          el("span", { class: "app-name" }, d.name || "?"),
          el("span", { class: "app-host" }, size + (children ? " · " + children : ""))));
      });
      v.appendChild(dgrid);
    }
  }
}

/* ---------- Dialog: agenda de energia (admin) ---------- */

function openPowerDialog(power) {
  let dialog = document.getElementById("power-dialog");
  if (!dialog) {
    dialog = el("dialog", { id: "power-dialog" },
      el("form", { method: "dialog", id: "power-form" },
        el("h3", { style: "margin-bottom:var(--hs-space-4)" }, "Agenda de energia"),
        el("div", { class: "field" },
          el("label", { for: "pw-shutdown" }, "Desligar (HH:MM)"),
          el("input", { id: "pw-shutdown", type: "time", required: true })),
        el("div", { class: "field" },
          el("label", { for: "pw-wake" }, "Ligar (HH:MM)"),
          el("input", { id: "pw-wake", type: "time", required: true })),
        el("label", { class: "check-row" },
          el("input", { id: "pw-enabled", type: "checkbox" }), " Agendado"),
        el("p", { class: "power-hint" }, "O servidor desligará e religará automaticamente."),
        el("div", { class: "dialog-actions" },
          el("button", { type: "button", class: "btn btn-secondary", id: "pw-cancel" }, "Cancelar"),
          el("button", { type: "submit", class: "btn btn-primary" }, "Salvar"))));
    document.body.appendChild(dialog);

    dialog.querySelector("#pw-cancel").addEventListener("click", () => dialog.close());
    dialog.querySelector("#power-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const shutdown = document.getElementById("pw-shutdown").value;
      const wake = document.getElementById("pw-wake").value;
      const enabled = document.getElementById("pw-enabled").checked;
      const saveBtn = dialog.querySelector('button[type="submit"]');
      saveBtn.disabled = true;
      saveBtn.textContent = "Salvando…";
      try {
        await apiOrFail("/api/v1/power", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shutdown, wake, enabled }),
        });
        toast("Agenda de energia salva.", "success");
        dialog.close();
        renderSystem();
      } catch (_) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Salvar";
      }
    });
  }

  document.getElementById("pw-shutdown").value = power.shutdown || "22:00";
  document.getElementById("pw-wake").value = power.wake || "07:00";
  document.getElementById("pw-enabled").checked = power.enabled !== false;
  dialog.showModal();
}

function badge(text, kind) {
  return el("span", { class: "badge " + kind }, text);
}

async function runModuleOp(m, op, btn) {
  if (op === "stop" && !confirm("Parar o módulo " + m.id + "?")) return;
  btn.disabled = true;
  try {
    await apiOrFail("/api/v1/modules/" + m.id + "/op", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op }),
    });
    toast(m.id + ": " + op + " concluído.", "success");
    renderAdmin();
  } catch (err) {
    toast(err.message || "Falha em " + op + ".", "error");
    btn.disabled = false;
  }
}

async function runServiceOp(name, op, btn) {
  if (op === "stop" && !confirm("Parar o serviço " + name + "?")) return;
  if (btn) btn.disabled = true;
  try {
    await apiOrFail("/api/v1/services/" + name + "/" + op, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    toast(name + ": " + op + " concluído.", "success");
    // O catálogo de Aplicações é a casa canônica do controle de serviços
    if (document.getElementById("apps-grid")) await renderApps();
    else if (document.getElementById("services-feed")) await refreshServices();
  } catch (err) {
    toast(err.message || "Falha em " + op + ".", "error");
    if (btn) btn.disabled = false;
  }
}

async function refreshServices() {
  try {
    const services = await api("/api/v1/services");
    const sfeedEl = document.getElementById("services-feed");
    if (!sfeedEl) return;
    sfeedEl.innerHTML = "";
    if (!services || !services.length) {
      sfeedEl.innerHTML = '<div class="feed-item">Nenhum serviço encontrado.</div>';
      return;
    }
    services.forEach((s) => {
      const up = s.status === "running";

      const meta = el("div", { class: "module-meta" },
        el("div", { class: "app-name" },
          s.name,
          el("span", { class: "badge " + (up ? "ok" : "danger"), style: "margin-left:var(--hs-space-2)" }, up ? "ativo" : "parado")),
        el("div", { class: "app-host" }, s.description || "Serviço do sistema"));

      const opsWrap = el("div", { class: "module-ops" });

      if (up) {
        const stopBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Parar");
        stopBtn.addEventListener("click", () => runServiceOp(s.name, "stop", stopBtn));
        opsWrap.appendChild(stopBtn);
        const restartBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Reiniciar");
        restartBtn.addEventListener("click", () => runServiceOp(s.name, "restart", restartBtn));
        opsWrap.appendChild(restartBtn);
      } else {
        const startBtn = el("button", { class: "btn btn-primary", style: "height:var(--hs-touch-compact)" }, "Iniciar");
        startBtn.addEventListener("click", () => runServiceOp(s.name, "start", startBtn));
        opsWrap.appendChild(startBtn);
      }

      const pop = el("div", { class: "ops-pop" });
      [["restart", "refresh", "Reiniciar"], ["enable", "check", "Ativar"], ["disable", "x", "Desativar"]].forEach(([op, ic, label]) => {
        const b = el("button", { type: "button", class: "ops-pop-item" }, icon(ic, "ic"), el("span", {}, label));
        b.addEventListener("click", () => runServiceOp(s.name, op, null));
        pop.appendChild(b);
      });
      const more = el("details", { class: "ops-menu" },
        el("summary", { class: "btn btn-secondary ops-menu-btn", "aria-label": "Mais operações" }, icon("dots", "ic")),
        pop);
      opsWrap.appendChild(more);

      const row = el("div", { class: "feed-item module-row" },
        el("span", { class: "status-dot " + (up ? "ok" : "danger") }),
        meta,
        opsWrap);
      sfeedEl.appendChild(row);
    });
  } catch (err) {
    const sfeedEl = document.getElementById("services-feed");
    if (sfeedEl) sfeedEl.innerHTML = '<div class="feed-item error-msg">Falha ao carregar serviços.</div>';
  }
}

/* ---------- Dialog: montar dispositivo (admin) ---------- */

function openMountDialog() {
  let dialog = document.getElementById("mount-dialog");
  if (!dialog) {
    dialog = el("dialog", { id: "mount-dialog" },
      el("form", { method: "dialog", id: "mount-form" },
        el("h3", { style: "margin-bottom:var(--hs-space-4)" }, "Montar dispositivo"),
        el("div", { class: "field" },
          el("label", { for: "md-type" }, "Tipo"),
          el("input", { id: "md-type", placeholder: "usb / sdcard / external", required: true })),
        el("div", { class: "field" },
          el("label", { for: "md-label" }, "Rótulo"),
          el("input", { id: "md-label", placeholder: "ex.: meudispositivo", required: true })),
        el("div", { class: "field" },
          el("label", { for: "md-device" }, "Dispositivo"),
          el("input", { id: "md-device", placeholder: "ex.: sdb1", required: true })),
        el("p", { class: "power-hint" }, "Monte em /srv/storage/devices/<tipo>/<rótulo>."),
        el("div", { class: "dialog-actions" },
          el("button", { type: "button", class: "btn btn-secondary", id: "md-cancel" }, "Cancelar"),
          el("button", { type: "submit", class: "btn btn-primary" }, "Montar"))));
    document.body.appendChild(dialog);

    dialog.querySelector("#md-cancel").addEventListener("click", () => dialog.close());
    dialog.querySelector("#mount-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const type = document.getElementById("md-type").value.trim();
      const label = document.getElementById("md-label").value.trim();
      const device = document.getElementById("md-device").value.trim();
      const saveBtn = dialog.querySelector('button[type="submit"]');
      saveBtn.disabled = true;
      saveBtn.textContent = "Montando…";
      try {
        await apiOrFail("/api/v1/devices/mount", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, label, device }),
        });
        toast("Dispositivo montado.", "success");
        dialog.close();
        renderStorage();
      } catch (_) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Montar";
      }
    });
  }

  dialog.showModal();
}

/* ---------- Administração (admin) ---------- */

/* ---------- Administração (em abas) ---------- */

let adminActiveTab = "users";

function adminTabBar() {
  const tabs = [
    ["users", "Usuários", "user"],
    ["tokens", "Tokens", "key"],
    ["modules", "Módulos", "box"],
    ["updates", "Atualizações", "download"],
  ];
  const bar = el("div", { class: "admin-tabs", role: "tablist", "aria-label": "Seções da administração" });
  tabs.forEach(([id, label, ic]) => {
    const b = el("button", {
      class: "admin-tab" + (adminActiveTab === id ? " active" : ""),
      role: "tab",
      "aria-selected": String(adminActiveTab === id),
      "data-tab": id,
    }, icon(ic, "ic"), el("span", {}, label));
    b.addEventListener("click", () => {
      if (adminActiveTab === id) return;
      adminActiveTab = id;
      renderAdmin();
    });
    bar.appendChild(b);
  });
  return bar;
}

async function renderAdmin() {
  // Carrega só os dados da aba ativa — menos requisições por troca de aba
  if (adminActiveTab === "users") return renderAdminUsers();
  if (adminActiveTab === "tokens") return renderAdminTokens();
  if (adminActiveTab === "modules") return renderAdminModules();
  if (adminActiveTab === "updates") return renderAdminUpdates();
}

async function renderAdminUsers() {
  const [users] = await Promise.all([api("/api/v1/users")]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Administração"));
  v.appendChild(adminTabBar());

  const createUserBtn = el("button", { class: "btn btn-primary", style: "margin-bottom:var(--hs-space-3)" },
    icon("plus", "ic"), " Novo usuário");
  createUserBtn.addEventListener("click", openUserDialog);
  v.appendChild(createUserBtn);

  if (users && users.length) {
    const t = el("table", { class: "table" });
    const head = el("tr");
    ["Usuário", "Papel", "Ações"].forEach((c) => head.appendChild(el("th", {}, c)));
    t.appendChild(el("thead", {}, head));
    const body = el("tbody");
    users.forEach((u) => {
      const tr = el("tr");
      tr.appendChild(el("td", {},
        el("strong", {}, u.username || u.id),
        el("div", { class: "app-host" }, u.perm && u.perm.scope ? "/" + u.perm.scope : "/")));
      tr.appendChild(el("td", {}, u.perm && u.perm.admin ? el("span", { class: "badge ok" }, "Admin") : "padrão"));
      const actions = el("td");
      const btns = el("span", { style: "display:inline-flex;gap:var(--hs-space-2)" });

      const pwBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Senha");
      pwBtn.addEventListener("click", () => openPasswordDialog(u.username || u.id));
      btns.appendChild(pwBtn);

      if ((u.username || u.id) !== auth.user.username) {
        const rmBtn = el("button", { class: "btn btn-danger", style: "height:var(--hs-touch-compact)" }, "Excluir");
        rmBtn.addEventListener("click", () => confirmDeleteUser(u.username || u.id));
        btns.appendChild(rmBtn);
      }

      actions.appendChild(btns);
      tr.appendChild(actions);
      body.appendChild(tr);
    });
    t.appendChild(body);
    v.appendChild(t);
  } else {
    v.appendChild(el("p", { class: "empty" }, "Nenhum usuário encontrado."));
  }
}

async function renderAdminTokens() {
  const [tokens] = await Promise.all([api("/api/v1/tokens")]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Administração"));
  v.appendChild(adminTabBar());

  const createBtn = el("button", { class: "btn btn-primary", style: "margin-bottom:var(--hs-space-3)" },
    icon("key", "ic"), " Criar token");
  createBtn.addEventListener("click", () => openTokenDialog());
  v.appendChild(createBtn);

  const tfeed = el("div", { class: "feed" });
  if (tokens && tokens.length) {
    tokens.forEach((tk) => {
      const row = el("div", { class: "feed-item" },
        icon("key"),
        el("span", { class: "app-name" }, tk.name),
        el("span", { class: "app-host" },
          tk.prefix + "… · " + (tk.lastUsedAt ? "usado" : "novo")));
      const rev = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Revogar");
      rev.addEventListener("click", async () => {
        if (!confirm("Revogar o token \"" + tk.name + "\"?")) return;
        try {
          await apiOrFail("/api/v1/tokens/" + tk.id, { method: "DELETE" });
          toast("Token revogado.", "success");
          renderAdmin();
        } catch (_) {}
      });
      row.appendChild(rev);
      tfeed.appendChild(row);
    });
  } else {
    tfeed.appendChild(el("div", { class: "feed-item" }, "Nenhum token criado."));
  }
  v.appendChild(tfeed);
}

async function renderAdminModules() {
  const [mods, instances] = await Promise.all([
    api("/api/v1/modules"),
    api("/api/v1/modules/instances"),
  ]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Administração"));
  v.appendChild(adminTabBar());

  const mfeed = el("div", { class: "feed" });
  if (mods && mods.length) {
    const instMap = {};
    (instances || []).forEach((i) => { instMap[i.definition] = i; });
    mods.forEach((m) => {
      const active = Boolean(instMap[m.id]);
      const ops = m.operations || [];
      const labels = { start: "Iniciar", stop: "Parar", restart: "Reiniciar", enable: "Ativar", disable: "Desativar", update: "Atualizar", status: "Status" };
      const primaryOp = active ? (ops.includes("stop") ? "stop" : null) : (ops.includes("start") ? "start" : null);
      const rest = ops.filter((op) => op !== primaryOp);

      const row = el("div", { class: "feed-item module-row" },
        icon("box", "ic"),
        el("div", { class: "module-meta" },
          el("div", { class: "app-name" },
            (m.title || m.id),
            active
              ? el("span", { class: "badge ok", style: "margin-left:var(--hs-space-2)" }, "ativa")
              : el("span", { class: "badge", style: "margin-left:var(--hs-space-2)" }, "ocioso")),
          el("div", { class: "app-host" }, m.id + " · v" + m.version)));

      const opsWrap = el("div", { class: "module-ops" });

      if (primaryOp) {
        const primary = el("button", {
          class: "btn btn-secondary", style: "height:var(--hs-touch-compact)",
        }, labels[primaryOp]);
        primary.addEventListener("click", () => runModuleOp(m, primaryOp, primary));
        opsWrap.appendChild(primary);
      }

      if (rest.length) {
        const more = el("details", { class: "ops-menu" },
          el("summary", { class: "btn btn-secondary ops-menu-btn", "aria-label": "Mais operações de " + m.id },
            icon("dots", "ic")),
          el("div", { class: "ops-pop" },
            ...rest.map((op) => {
              const b = el("button", { type: "button", class: "ops-pop-item" },
                icon(({ start: "play", stop: "square", restart: "refresh", enable: "check", disable: "x", update: "download", status: "eye" }[op] || "dots"), "ic"),
                el("span", {}, labels[op] || op));
              b.addEventListener("click", () => runModuleOp(m, op, b));
              return b;
            })));
        opsWrap.appendChild(more);
      }

      row.appendChild(opsWrap);
      mfeed.appendChild(row);
    });
  } else {
    mfeed.appendChild(el("div", { class: "feed-item" }, "Nenhum módulo encontrado."));
  }
  v.appendChild(mfeed);

  // Tarefas agendadas — mesma natureza de gestão que módulos
  v.appendChild(el("h3", { class: "section" }, "Tarefas agendadas"));
  const schedFeed = el("div", { class: "feed", id: "scheduler-feed" });
  v.appendChild(schedFeed);
  await refreshScheduler();
}

async function renderAdminUpdates() {
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Administração"));
  v.appendChild(adminTabBar());

  // Atualização do sistema
  const upBox = el("div", { class: "print-card" });
  const upBtn = el("button", { class: "btn btn-secondary", id: "up-check" },
    icon("refresh", "ic"), " Verificar atualização");
  const upStatus = el("p", { class: "power-hint", id: "up-status", style: "margin-top:var(--hs-space-2)" }, "");
  upBox.appendChild(upBtn);
  upBox.appendChild(upStatus);
  v.appendChild(upBox);

  upBtn.addEventListener("click", async () => {
    upBtn.disabled = true;
    upStatus.textContent = "Verificando…";
    try {
      const data = await apiOrFail("/api/v1/update");
      if (data.update) {
        upStatus.innerHTML = "Nova versão disponível: <strong>" + esc(data.latest) + "</strong> (atual: " + esc(data.current) + ")";
        const apply = el("button", { class: "btn btn-primary", style: "margin-top:var(--hs-space-2)" },
          icon("download", "ic"), " Aplicar atualização");
        apply.addEventListener("click", async () => {
          if (!confirm("Aplicar a atualização para " + data.latest + "?")) return;
          apply.disabled = true;
          apply.textContent = "Aplicando… (pode demorar)";
          try {
            await apiOrFail("/api/v1/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            });
            toast("Atualização aplicada.", "success");
            upStatus.textContent = "Atualizado para " + data.latest + ".";
          } catch (err) {
            toast(err.message || "Falha ao aplicar.", "error");
          } finally {
            apply.remove();
          }
        });
        upBox.appendChild(apply);
      } else {
        upStatus.textContent = "Você está atualizado (" + data.current + ").";
      }
    } catch (err) {
      upStatus.textContent = err.message || "Não foi possível verificar.";
    } finally {
      upBtn.disabled = false;
      upBtn.innerHTML = icon("refresh", "ic").outerHTML + " Verificar atualização";
    }
  });

  // Pacotes do sistema (apt) — fundido na aba Atualizações
  v.appendChild(el("h4", { class: "section", style: "margin-top:var(--hs-space-6)" }, "Pacotes do sistema"));
  const osBox = el("div", { class: "print-card" });
  const osBtn = el("button", { class: "btn btn-secondary", id: "up-os-check" },
    icon("toolbox", "ic"), " Verificar pacotes (apt)");
  const osStatus = el("p", { class: "power-hint", id: "up-os-status", style: "margin-top:var(--hs-space-2)" }, "");
  osBox.appendChild(osBtn);
  osBox.appendChild(osStatus);
  v.appendChild(osBox);

  osBtn.addEventListener("click", async () => {
    osBtn.disabled = true;
    osStatus.textContent = "Verificando…";
    try {
      const d = await apiOrFail("/api/v1/update/os");
      const reboot = d.reboot ? " · reinicialização pendente" : "";
      if (d.upgradable > 0) {
        osStatus.innerHTML = esc(d.upgradable) + " pacote(s) disponível(is)" + reboot + ".";
        const apply = el("button", { class: "btn btn-primary", style: "margin-top:var(--hs-space-2)" },
          icon("refresh", "ic"), " Atualizar pacotes");
        apply.addEventListener("click", async () => {
          if (!confirm("Atualizar todos os pacotes do sistema? Isso pode demorar.")) return;
          apply.disabled = true;
          apply.textContent = "Atualizando… (pode demorar)";
          try {
            const r = await apiOrFail("/api/v1/update/os", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: "{}",
            });
            toast("Pacotes atualizados.", "success");
            osStatus.innerHTML = "Atualizado." + (r.reboot ? " Recomenda-se reiniciar o servidor." : "");
          } catch (err) {
            toast(err.message || "Falha ao atualizar pacotes.", "error");
          } finally {
            apply.remove();
          }
        });
        osBox.appendChild(apply);
      } else {
        osStatus.textContent = "Sistema atualizado" + reboot + ".";
      }
    } catch (err) {
      osStatus.textContent = err.message || "Não foi possível verificar os pacotes.";
    } finally {
      osBtn.disabled = false;
    }
  });
}

/* ---------- Scheduler (admin) ---------- */

async function refreshScheduler() {
  try {
    const tasks = await api("/api/v1/scheduler");
    const sfeedEl = document.getElementById("scheduler-feed");
    if (!sfeedEl) return;
    sfeedEl.innerHTML = "";

    if (!tasks || !tasks.length) {
      sfeedEl.innerHTML = '<div class="feed-item">Nenhuma tarefa agendada.</div>';
      return;
    }

    tasks.forEach((t) => {
      const enabled = t.enabled;
      const meta = el("div", { class: "module-meta" },
        el("div", { class: "app-name" },
          t.name,
          el("span", { class: "badge " + (enabled ? "ok" : "danger"), style: "margin-left:var(--hs-space-2)" }, enabled ? "ativo" : "parado")),
        el("div", { class: "app-host" }, (t.schedule || "") + (t.next ? " · " + t.next : "")));

      const opsWrap = el("div", { class: "module-ops" });

      const enableBtn = el("button", { class: "btn " + (enabled ? "btn-secondary" : "btn-primary"), style: "height:var(--hs-touch-compact)" }, enabled ? "Desativar" : "Ativar");
      enableBtn.addEventListener("click", () => runSchedulerOp(t.name, enabled ? "disable" : "enable", enableBtn));
      opsWrap.appendChild(enableBtn);

      const runBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Executar agora");
      runBtn.addEventListener("click", () => runSchedulerOp(t.name, "run", runBtn));
      opsWrap.appendChild(runBtn);

      const row = el("div", { class: "feed-item module-row" },
        el("span", { class: "status-dot " + (enabled ? "ok" : "danger") }),
        meta,
        opsWrap);
      sfeedEl.appendChild(row);
    });
  } catch (err) {
    const sfeedEl = document.getElementById("scheduler-feed");
    if (sfeedEl) sfeedEl.innerHTML = '<div class="feed-item error-msg">Falha ao carregar tarefas.</div>';
  }
}

async function runSchedulerOp(name, op, btn) {
  if (op === "disable" && !confirm("Desativar a tarefa " + name + "?")) return;
  if (btn) btn.disabled = true;
  try {
    await apiOrFail("/api/v1/scheduler/" + name + "/" + op, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    toast(name + ": " + op + " concluído.", "success");
    await refreshScheduler();
  } catch (err) {
    toast(err.message || "Falha em " + op + ".", "error");
    if (btn) btn.disabled = false;
  }
}

/* ---------- Dialog: senha de usuário (admin) ---------- */

function openPasswordDialog(username) {
  let dialog = document.getElementById("pass-dialog");
  if (!dialog) {
    dialog = el("dialog", { id: "pass-dialog" },
      el("form", { method: "dialog", id: "pass-form" },
        el("h3", { style: "margin-bottom:var(--hs-space-4)" }, "Nova senha"),
        el("div", { class: "field" },
          el("label", { for: "ps-user" }, "Usuário"),
          el("input", { id: "ps-user", disabled: "disabled" })),
        el("div", { class: "field" },
          el("label", { for: "ps-pass" }, "Nova senha"),
          el("input", { id: "ps-pass", type: "password", required: true })),
        el("div", { class: "dialog-actions" },
          el("button", { type: "button", class: "btn btn-secondary", id: "ps-cancel" }, "Cancelar"),
          el("button", { type: "submit", class: "btn btn-primary" }, "Salvar"))));
    document.body.appendChild(dialog);

    dialog.querySelector("#ps-cancel").addEventListener("click", () => dialog.close());
    dialog.querySelector("#pass-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const uname = document.getElementById("ps-user").value;
      const pass = document.getElementById("ps-pass").value;
      const btn = dialog.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        await apiOrFail("/api/v1/users/" + encodeURIComponent(uname), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pass }),
        });
        toast("Senha atualizada: " + uname, "success");
        dialog.close();
      } catch (err) {
        toast(err.message || "Falha ao alterar senha.", "error");
      } finally {
        btn.disabled = false;
      }
    });
  }

  document.getElementById("ps-user").value = username;
  document.getElementById("ps-pass").value = "";
  dialog.showModal();
}

function confirmDeleteUser(username) {
  const del = el("dialog", { id: "del-dialog" },
    el("h3", { style: "margin-bottom:var(--hs-space-3)" }, "Excluir usuário?"),
    el("p", { class: "power-hint" }, "Remover \"" + username + "\"? O usuário perderá o acesso."),
    el("label", { class: "check-row" },
      el("input", { id: "del-folder", type: "checkbox" }), " Também remover a pasta de arquivos (irreversível)"),
    el("div", { class: "dialog-actions" },
      el("button", { class: "btn btn-secondary", id: "del-cancel" }, "Cancelar"),
      el("button", { class: "btn btn-danger", id: "del-confirm" }, "Excluir")));
  document.body.appendChild(del);

  del.querySelector("#del-cancel").addEventListener("click", () => del.close());
  del.querySelector("#del-confirm").addEventListener("click", async () => {
    const folder = document.getElementById("del-folder").checked;
    const btn = del.querySelector("#del-confirm");
    btn.disabled = true;
    try {
      await apiOrFail("/api/v1/users/" + encodeURIComponent(username) + (folder ? "?folder=1" : ""), { method: "DELETE" });
      toast("Usuário removido: " + username, "success");
      del.close();
      renderAdmin();
    } catch (err) {
      toast(err.message || "Falha ao excluir.", "error");
      btn.disabled = false;
    }
  });
  del.showModal();
}

/* ---------- Dialog: criar usuário (admin) ---------- */

function openUserDialog() {
  let dialog = document.getElementById("user-dialog");
  if (!dialog) {
    dialog = el("dialog", { id: "user-dialog" },
      el("form", { method: "dialog", id: "user-form" },
        el("h3", { style: "margin-bottom:var(--hs-space-4)" }, "Novo usuário"),
        el("div", { class: "field" },
          el("label", { for: "us-name" }, "Usuário"),
          el("input", { id: "us-name", placeholder: "ex.: usuario", pattern: "[a-z][a-z0-9_-]{1,30}", required: true })),
        el("div", { class: "field" },
          el("label", { for: "us-pass" }, "Senha"),
          el("input", { id: "us-pass", type: "password", required: true })),
        el("div", { class: "field" },
          el("label", { for: "us-email" }, "E-mail (opcional)"),
          el("input", { id: "us-email", type: "email", placeholder: "usuario@example.com" })),
        el("label", { class: "check-row" },
          el("input", { id: "us-gitea", type: "checkbox" }), " Criar também no Gitea"),
        el("p", { class: "power-hint" }, "A pasta pessoal /srv/storage/users/<nome> é criada automaticamente."),
        el("div", { class: "dialog-actions" },
          el("button", { type: "button", class: "btn btn-secondary", id: "us-cancel" }, "Cancelar"),
          el("button", { type: "submit", class: "btn btn-primary" }, "Criar"))));
    document.body.appendChild(dialog);

    dialog.querySelector("#us-cancel").addEventListener("click", () => dialog.close());
    dialog.querySelector("#user-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("us-name").value.trim();
      const password = document.getElementById("us-pass").value;
      const email = document.getElementById("us-email").value.trim();
      const gitea = document.getElementById("us-gitea").checked;
      const btn = dialog.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Criando…";
      try {
        await apiOrFail("/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email: email || undefined, gitea }),
        });
        toast("Usuário criado: " + username, "success");
        dialog.close();
        renderAdmin();
      } catch (err) {
        toast(err.message || "Falha ao criar usuário.", "error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Criar";
      }
    });
  }

  document.getElementById("us-name").value = "";
  document.getElementById("us-pass").value = "";
  document.getElementById("us-email").value = "";
  document.getElementById("us-gitea").checked = false;
  dialog.showModal();
}

/* ---------- Dialog: criar token de API (admin) ---------- */

function openTokenDialog() {
  let dialog = document.getElementById("token-dialog");
  if (!dialog) {
    dialog = el("dialog", { id: "token-dialog" },
      el("form", { method: "dialog", id: "token-form" },
        el("h3", { style: "margin-bottom:var(--hs-space-4)" }, "Criar token de API"),
        el("div", { class: "field" },
          el("label", { for: "tk-name" }, "Nome"),
          el("input", { id: "tk-name", placeholder: "ex.: homepage-widget", required: true })),
        el("p", { class: "power-hint" }, "Use como Authorization: Bearer <token>. O token é exibido uma única vez."),
        el("div", { class: "dialog-actions" },
          el("button", { type: "button", class: "btn btn-secondary", id: "tk-cancel" }, "Cancelar"),
          el("button", { type: "submit", class: "btn btn-primary" }, "Criar"))));
    document.body.appendChild(dialog);

    dialog.querySelector("#tk-cancel").addEventListener("click", () => dialog.close());
    dialog.querySelector("#token-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("tk-name").value.trim();
      const saveBtn = dialog.querySelector('button[type="submit"]');
      saveBtn.disabled = true;
      saveBtn.textContent = "Criando…";
      try {
        const data = await apiOrFail("/api/v1/tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        dialog.close();
        showCreatedToken(data);
        renderAdmin();
      } catch (_) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Criar";
      }
    });
  }

  document.getElementById("tk-name").value = "";
  dialog.showModal();
}

function showCreatedToken(data) {
  let dialog = document.getElementById("token-created");
  if (!dialog) {
    dialog = el("dialog", { id: "token-created" },
      el("h3", { style: "margin-bottom:var(--hs-space-3)" }, "Token criado"),
      el("p", { class: "power-hint" }, "Copie agora — não será exibido novamente."),
      el("code", { class: "token-code", id: "token-value" }),
      el("div", { class: "dialog-actions" },
        el("button", { type: "button", class: "btn btn-primary", id: "tk-done" }, "Entendido")));
    document.body.appendChild(dialog);
    dialog.querySelector("#tk-done").addEventListener("click", () => dialog.close());
  }
  document.getElementById("token-value").textContent = data.token;
  dialog.showModal();
}

/* ---------- Tela: Impressão (admin) ---------- */

const printState = { mode: "text", file: null };

function printerBadge(status) {
  if (!status || status.state === "unknown") {
    return el("span", { class: "badge danger" }, "Erro");
  }
  if (status.state === "disabled" || status.accepting === false) {
    return el("span", { class: "badge danger" }, "Indisponível");
  }
  if (status.activeJobs > 0 || status.state === "printing") {
    return el("span", { class: "badge warn" }, "Ocupada");
  }
  return el("span", { class: "badge ok" }, "Pronta");
}

function printerReady(status) {
  return Boolean(status && status.state !== "disabled" && status.state !== "unknown" && status.accepting !== false);
}

async function renderPrint() {
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Impressão"));

  // Status da impressora
  let printers = [];
  let statusMap = {};
  try {
    const data = await api("/api/v1/print");
    printers = data.printers || [];
    statusMap = data.status || {};
  } catch (err) {
    v.appendChild(el("div", { class: "banner danger" }, "Erro ao consultar a impressora: " + err.message));
  }

  // ---- Card 1: Impressora e configuração ----
  const card1 = el("div", { class: "print-card" },
    el("h4", { class: "print-card-title" }, "1. Impressora e configuração"));

  const pRow = el("div", { class: "print-prow" });
  const selPrinter = el("select", { id: "pr-printer", class: "select-field", style: "flex:1" });
  (printers.length ? printers : ["MG3110"]).forEach((p) =>
    selPrinter.appendChild(el("option", { value: p }, p)));
  pRow.appendChild(el("label", { class: "print-label", style: "min-width:90px" }, "Impressora"));
  pRow.appendChild(selPrinter);

  const statusWrap = el("span", { id: "pr-status", style: "display:inline-flex" });
  const selP = printers[0] || "MG3110";
  statusWrap.appendChild(printerBadge(statusMap[selP]));
  pRow.appendChild(statusWrap);
  card1.appendChild(pRow);

  if (statusMap[selP] && statusMap[selP].lastJob) {
    card1.appendChild(el("p", { class: "power-hint", id: "pr-last" },
      "Última impressão: " + timeAgo(statusMap[selP].lastJob)));
  }

  // Configurações rápidas
  const cfg = el("div", { class: "grid print-config" });
  const selColor = el("select", { id: "pr-color", class: "select-field" },
    el("option", { value: "color" }, "Colorida"),
    el("option", { value: "mono" }, "Preto e branco"));
  cfg.appendChild(field("Cor", selColor));

  const selMedia = el("select", { id: "pr-media", class: "select-field" },
    el("option", { value: "A4" }, "A4"),
    el("option", { value: "A5" }, "A5"),
    el("option", { value: "Letter" }, "Letter"),
    el("option", { value: "Legal" }, "Legal"));
  cfg.appendChild(field("Papel", selMedia));

  const selOrient = el("select", { id: "pr-orient", class: "select-field" },
    el("option", { value: "portrait" }, "Retrato"),
    el("option", { value: "landscape" }, "Paisagem"));
  cfg.appendChild(field("Orientação", selOrient));

  const inPages = el("input", { id: "pr-pages", class: "select-field", placeholder: "ex.: 1-3" });
  cfg.appendChild(field("Páginas", inPages));

  const selQuality = el("select", { id: "pr-quality", class: "select-field" },
    el("option", { value: "economico" }, "Econômico"),
    el("option", { value: "normal", selected: "selected" }, "Normal"),
    el("option", { value: "alta" }, "Alta qualidade"));
  cfg.appendChild(field("Qualidade", selQuality));

  card1.appendChild(cfg);
  v.appendChild(card1);

  selPrinter.addEventListener("change", () => {
    const name = selPrinter.value;
    const s = statusMap[name];
    statusWrap.innerHTML = "";
    statusWrap.appendChild(printerBadge(s));
    const last = document.getElementById("pr-last");
    if (last) {
      last.textContent = s && s.lastJob ? "Última impressão: " + timeAgo(s.lastJob) : "";
    }
    updatePrintDisabled();
  });

  // ---- Card 2: Conteúdo ----
  const card2 = el("div", { class: "print-card" },
    el("h4", { class: "print-card-title" }, "2. Conteúdo a imprimir"));

  const toggle = el("div", { class: "radio-row" },
    el("label", {},
      el("input", { type: "radio", name: "pr-mode", value: "text", checked: "checked" }), " Texto"),
    el("label", {},
      el("input", { type: "radio", name: "pr-mode", value: "file" }), " Arquivo"));
  card2.appendChild(toggle);

  const textArea = el("textarea", {
    id: "pr-text", class: "print-textarea", rows: 6,
    placeholder: "Digite o texto a imprimir…",
  });
  card2.appendChild(textArea);

  const fileRow = el("div", { class: "file-row", hidden: true, id: "pr-filerow" },
    el("label", { class: "btn btn-secondary", style: "cursor:pointer" },
      icon("paperclip", "ic"), " Escolher arquivo",
      el("input", { id: "pr-file", type: "file", accept: ".pdf,.txt,.png,.jpg,.jpeg", style: "display:none" })),
    el("span", { class: "power-hint", id: "pr-filename" }, "PDF, texto ou imagem"));
  card2.appendChild(fileRow);

  const previewBox = el("div", { class: "print-preview", id: "pr-preview", hidden: true });
  card2.appendChild(previewBox);

  v.appendChild(card2);

  document.querySelectorAll('input[name="pr-mode"]').forEach((r) => {
    r.addEventListener("change", () => {
      printState.mode = r.value;
      const isText = r.value === "text";
      textArea.hidden = !isText;
      fileRow.hidden = isText;
      previewBox.hidden = true;
      document.getElementById("pr-preview").innerHTML = "";
    });
  });

  document.getElementById("pr-file").addEventListener("change", () => {
    const f = document.getElementById("pr-file").files[0];
    printState.file = f || null;
    document.getElementById("pr-filename").textContent = f ? "Arquivo: " + f.name : "PDF, texto ou imagem";
    document.getElementById("pr-preview").hidden = true;
    document.getElementById("pr-preview").innerHTML = "";
  });

  // ---- Card 3: Ações ----
  const card3 = el("div", { class: "print-card print-actions" },
    el("button", { class: "btn btn-secondary", id: "pr-preview-btn" }, icon("eye", "ic"), " Visualizar"),
    el("button", { class: "btn btn-primary", id: "pr-submit" }, icon("printer", "ic"), " Imprimir"));
  v.appendChild(card3);

  const previewBtn = document.getElementById("pr-preview-btn");
  const submitBtn = document.getElementById("pr-submit");

  function updatePrintDisabled() {
    const name = document.getElementById("pr-printer").value;
    submitBtn.disabled = !printerReady(statusMap[name]);
  }
  updatePrintDisabled();

  previewBtn.addEventListener("click", renderPreview);
  submitBtn.addEventListener("click", submitPrint);

  // ---- Card 4: Fila de impressão ----
  const card4 = el("div", { class: "print-card" },
    el("h4", { class: "print-card-title" }, "Fila de impressão"),
    el("div", { id: "print-jobs" }, el("div", { class: "loader" }, "Carregando…")));
  v.appendChild(card4);

  renderPrintJobs();
}

async function renderPrintJobs() {
  const box = document.getElementById("print-jobs");
  if (!box) return;

  try {
    const data = await api("/api/v1/print/jobs");
    const jobs = data.jobs || [];
    box.innerHTML = "";

    if (!jobs.length) {
      box.appendChild(el("p", { class: "power-hint" }, "Nenhum trabalho na fila."));
      return;
    }

    const feed = el("div", { class: "feed" });
    jobs.forEach((job) => {
      const printing = job.status === "printing";
      const row = el("div", { class: "feed-item" },
        el("span", { class: "status-dot " + (printing ? "warn" : "ok") }),
        el("span", { class: "app-name" }, job.id),
        el("span", { class: "app-host" },
          printing ? "Imprimindo…" : "Concluído" +
          (job.date ? " · " + timeAgo(job.date) : "")));
      if (printing) {
        const c = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Cancelar");
        c.addEventListener("click", async () => {
          if (!confirm("Cancelar o trabalho " + job.id + "?")) return;
          try {
            await apiOrFail("/api/v1/print/jobs/" + job.id, { method: "DELETE" });
            toast("Trabalho cancelado.", "success");
            renderPrintJobs();
          } catch (_) {}
        });
        row.appendChild(c);
      }
      feed.appendChild(row);
    });
    box.appendChild(feed);
  } catch (err) {
    box.innerHTML = "";
    box.appendChild(el("p", { class: "power-hint" }, "Não foi possível carregar a fila."));
  }
}

function renderPreview() {
  const box = document.getElementById("pr-preview");
  const isText = printState.mode === "text";

  if (isText) {
    const text = document.getElementById("pr-text").value;
    if (!text.trim()) {
      toast("Digite um texto para visualizar.", "warn");
      return;
    }
    box.innerHTML = "";
    box.appendChild(el("pre", { class: "print-pre" }, text));
    box.hidden = false;
    return;
  }

  const f = printState.file;
  if (!f) {
    toast("Escolha um arquivo para visualizar.", "warn");
    return;
  }

  box.innerHTML = "";
  const url = URL.createObjectURL(f);

  if (f.type === "image/png" || f.type === "image/jpeg") {
    box.appendChild(el("img", { src: url, class: "print-img", alt: f.name }));
    box.hidden = false;
  } else if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) {
    box.appendChild(el("iframe", { src: url, class: "print-pdf", title: "Pré-visualização" }));
    box.hidden = false;
  } else if (f.type === "text/plain" || /\.txt$/i.test(f.name)) {
    const reader = new FileReader();
    reader.onload = () => {
      box.innerHTML = "";
      box.appendChild(el("pre", { class: "print-pre" }, String(reader.result)));
      box.hidden = false;
    };
    reader.readAsText(f);
  } else {
    box.innerHTML = "";
    box.appendChild(el("p", { class: "power-hint" },
      "Pré-visualização indisponível. O arquivo ainda poderá ser enviado para impressão."));
    box.hidden = false;
  }
}

async function submitPrint() {
  const submitBtn = document.getElementById("pr-submit");
  submitBtn.disabled = true;
  submitBtn.textContent = "Imprimindo…";

  try {
    const body = {
      printer: document.getElementById("pr-printer").value,
      color: document.getElementById("pr-color").value,
      media: document.getElementById("pr-media").value,
      orientation: document.getElementById("pr-orient").value,
      quality: document.getElementById("pr-quality").value,
      pages: document.getElementById("pr-pages").value.trim() || undefined,
    };
    const file = printState.file;
    const text = document.getElementById("pr-text").value;

    if (printState.mode === "file") {
      if (!file) {
        throw new Error("Escolha um arquivo para imprimir.");
      }
      if (file.size > 20 * 1024 * 1024) {
        const mb = (file.size / 1024 / 1024).toFixed(1);
        if (!confirm("Arquivo com " + mb + " MB.\nO arquivo é grande e pode demorar para ser processado.\nDeseja continuar?")) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = icon("printer", "ic").outerHTML + " Imprimir";
          return;
        }
      }
      body.file = { name: file.name, data: await fileToBase64(file) };
    } else {
      if (!text.trim()) {
        throw new Error("Digite um texto para imprimir.");
      }
      body.text = text;
    }

    await apiOrFail("/api/v1/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    toast("Enviado para a impressora.", "success");
    // Recarrega o status (última impressão atualizada).
    renderPrint();
  } catch (err) {
    toast(err.message || "Falha ao imprimir.", "error");
    submitBtn.disabled = false;
    submitBtn.innerHTML = icon("printer", "ic").outerHTML + " Imprimir";
  }
}

function field(labelText, control) {
  const wrap = el("div", { class: "print-field" },
    el("label", { class: "print-label" }, labelText));
  wrap.appendChild(control);
  return wrap;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
  router();
}

init();
