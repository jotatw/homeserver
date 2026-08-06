/* ============================================================
 * HomeServer App — Workspace (v2.0 · Sprint 2)
 * Fonte: design/app/wireframes + design/app/flows
 * ============================================================ */

/* ---------- Helpers ---------- */

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else e.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (c === null || c === undefined) return;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}

function toast(message, kind = "info") {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const t = el("div", { class: "toast " + kind }, message);
  region.appendChild(t);
  setTimeout(() => t.remove(), 5000);
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
  { route: "dashboard", title: "Meu espaço", icon: "🏠", minRole: "user", desktop: true, mobile: true },
  { route: "apps", title: "Aplicações", icon: "📦", minRole: "user", desktop: true, mobile: true },
  { route: "storage", title: "Armazenamento", icon: "📁", minRole: "user", desktop: true, mobile: true },
  { route: "system", title: "Sistema", icon: "📊", minRole: "user", desktop: true, mobile: true },
  { route: "admin", title: "Administração", icon: "⚙️", minRole: "admin", desktop: true, mobile: true },
];

const roleRank = { user: 1, admin: 2 };

function userNav() {
  const rank = roleRank[auth.user.role] || 0;
  return NAV.filter((n) => roleRank[n.minRole] <= rank);
}

/* ---------- Tema (dark/light) ---------- */

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("hs_theme", theme);
}

function toggleTheme() {
  const cur = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(cur);
}

/* ---------- Build da navegação (sidebar + bottom nav) ---------- */

function buildNav() {
  const items = userNav();
  const nav = document.getElementById("sidebar-nav");
  const bottom = document.getElementById("bottom-nav");
  nav.innerHTML = "";
  bottom.innerHTML = "";

  items.forEach((n) => {
    const a = el("a", { href: "#/" + n.route, class: "nav-item", "data-route": n.route },
      el("span", {}, n.icon), el("span", {}, n.title));
    nav.appendChild(a);
    const m = el("a", { href: "#/" + n.route, class: "nav-item", "data-route": n.route },
      el("span", { class: "ic" }, n.icon), el("span", {}, n.title));
    bottom.appendChild(m);
  });
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
  document.getElementById("sidebar-user").innerHTML = "👤 " + label + badge;
  document.getElementById("topbar-user").innerHTML = "👤 " + label + badge;
}

/* ---------- Router ---------- */

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
  };

  try {
    await renders[route]();
  } catch (err) {
    v.innerHTML = "";
    v.appendChild(el("p", { class: "empty error-msg" }, "⚠️ ", err.message));
  }
}

/* ---------- Dashboard (Meu espaço) ---------- */

async function renderDashboard() {
  const [status, events] = await Promise.all([
    api("/api/v1/status"),
    api("/api/v1/events"),
  ]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  // Banner de status
  const services = status.services || [];
  const up = services.filter((s) => s.status === "running").length;
  let bannerClass = "ok", bannerText = `Servidor OK · ${up} apps em execução`;
  if (services.length > 0 && up < services.length) {
    bannerClass = "warn";
    bannerText = `${services.length - up} de ${services.length} serviços com problema`;
  } else if (services.length === 0) {
    bannerClass = "danger";
    bannerText = "Nenhum serviço reportando";
  }
  v.appendChild(el("div", { class: "banner " + bannerClass }, "●", bannerText));

  // Stat cards
  const disk = status.disk || {};
  const mem = status.memory || {};
  const cpu = status.cpu || {};
  v.appendChild(el("h3", { class: "section" }, "Servidor"));
  const grid = el("div", { class: "grid" });
  grid.appendChild(statCard("CPU", (cpu.percent ?? 0) + "%", cpu.percent ?? 0));
  grid.appendChild(statCard("Memória", (mem.percent ?? 0) + "%", mem.percent ?? 0));
  grid.appendChild(statCard("Disco", (disk.percent ?? 0) + "%", disk.percent ?? 0));
  grid.appendChild(statCard("Uptime", status.uptime || "—", 0));
  v.appendChild(grid);

  // Acesso rápido (ActionCards)
  v.appendChild(el("h3", { class: "section" }, "Acesso rápido"));
  const actions = el("div", { class: "grid" });
  actions.appendChild(actionCard("📁", "Arquivos", "/files/"));
  actions.appendChild(actionCard("📦", "Aplicações", "#/apps"));
  actions.appendChild(actionCard("📊", "Sistema", "#/system"));
  v.appendChild(actions);

  // Feed de atividades
  v.appendChild(el("h3", { class: "section" }, "Atividades"));
  if (events && events.length) {
    const feed = el("div", { class: "feed" });
    events.slice(0, 8).forEach((ev) => {
      const icon = { backup: "💾", device: "🔌", system: "⚙️", power: "🔋" }[ev.type] || "📄";
      feed.appendChild(el("div", { class: "feed-item" },
        el("span", {}, icon), el("span", {}, ev.action || ev.type),
        el("span", { class: "feed-time" }, ev.time ? timeAgo(ev.time) : "")));
    });
    v.appendChild(feed);
  } else {
    v.appendChild(el("p", { class: "empty" }, "Sem atividades registradas."));
  }
}

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

function actionCard(icon, title, href) {
  const isHash = href.startsWith("#");
  const a = el("a", { href, class: "app-card", target: isHash ? "_self" : "_blank" },
    el("span", { class: "ic" }, icon),
    el("span", { class: "app-name" }, title),
    el("span", {}, "→"));
  return a;
}

/* ---------- Aplicações ---------- */

const APP_MAP = {
  homepage: { title: "Homepage", host: "/", icon: "🏠" },
  api: { title: "HomeServer App", host: "/app", icon: "📊" },
  filebrowser: { title: "FileBrowser", host: "/files/", icon: "📁" },
  gitea: { title: "Gitea", host: "/git/", icon: "🔧" },
  caddy: { title: "Proxy (Caddy)", host: "", icon: "🛡️" },
  portainer: { title: "Portainer", host: "", icon: "🐳" },
};

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
  [["all", "Todos"], ["running", "🟢 Ativos"], ["down", "🔴 Offline"]].forEach(([key, label]) => {
    const chip = el("button", { class: "chip" + (key === "all" ? " active" : ""), "data-filter": key }, label);
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
      .filter((s) => matches(s, APP_MAP[s.name] || { title: s.name, host: "", icon: "📄" }))
      .sort((a, b) => (a.status === "running" ? -1 : 1) - (b.status === "running" ? -1 : 1));

    if (!list.length) {
      grid.appendChild(el("p", { class: "empty" },
        "Nenhuma aplicação encontrada para \"" + state.query + "\"",
        el("br", {}),
        el("button", { class: "btn btn-secondary", style: "margin-top:var(--hs-space-2)" }, "Limpar busca")));
      return;
    }

    list.forEach((s) => {
      const meta = APP_MAP[s.name] || { title: s.name, host: "", icon: "📄" };
      const up = s.status === "running";
      const card = el("div", { class: "app-card" },
        el("span", { class: "ic" }, meta.icon),
        el("span", { class: "status-dot " + (up ? "ok" : "danger") }),
        el("span", { class: "app-name" }, meta.title),
        el("span", { class: "app-host" }, up ? "● Ativo" : "✕ Offline"));
      if (meta.host && up) {
        card.addEventListener("click", () => window.open(meta.host, "_blank"));
        card.style.cursor = "pointer";
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
  dados.appendChild(feedRow("📁", "Raiz de dados", st.root || "—"));
  dados.appendChild(feedRow("💾", "Total armazenado", st.total_size_human || "—"));
  dados.appendChild(feedRow("●", "Pronto", st.ready ? "Sim" : "Não"));
  v.appendChild(dados);

  // 3. Pastas por usuário
  v.appendChild(el("h3", { class: "section" }, "Pastas"));
  const folders = [
    ["👤", "Usuários", st.users ?? 0],
    ["🤝", "Compartilhado", st.shared ?? 0],
    ["🎞️", "Mídia", st.media ?? 0],
    ["📄", "Documentos", st.documents ?? 0],
    ["🔌", "Dispositivos", st.devices ?? 0],
  ];
  const fgrid = el("div", { class: "grid" });
  folders.forEach(([icon, label, value]) =>
    fgrid.appendChild(el("div", { class: "app-card" },
      el("span", {}, icon),
      el("span", { class: "app-name" }, label),
      el("span", { class: "app-host" }, String(value)))));
  v.appendChild(fgrid);

  // 4. Dispositivos conectados
  if (devices && devices.length) {
    v.appendChild(el("h3", { class: "section" }, "Dispositivos conectados"));
    const feed = el("div", { class: "feed" });
    devices.forEach((d) => feed.appendChild(el("div", { class: "feed-item" },
      el("span", {}, "🔌"),
      el("span", {}, d.label),
      el("span", { class: "feed-time" }, (d.type || "").toUpperCase()))));
    v.appendChild(feed);
  }

  // 5. CTA honesto (gap G1: a API não navega arquivos)
  v.appendChild(el("div", { class: "empty", style: "padding-top: var(--hs-space-8)" },
    el("span", { class: "empty-icon" }, "📭"),
    "Navegação de arquivos não está disponível nesta versão.",
    el("br", {}),
    el("a", { href: "/files/", target: "_blank" }, "Ir para o FileBrowser →")));
}

function feedRow(icon, label, value) {
  return el("div", { class: "feed-item" },
    el("span", {}, icon),
    el("span", { class: "app-name" }, label),
    el("span", { class: "feed-time" }, value));
}

/* ---------- Sistema ---------- */

async function renderSystem() {
  const status = await api("/api/v1/status");
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Servidor"));
  const grid = el("div", { class: "grid" });
  grid.appendChild(statCard("CPU", (status.cpu.percent ?? 0) + "%", status.cpu.percent ?? 0));
  grid.appendChild(statCard("Memória", (status.memory.percent ?? 0) + "%", status.memory.percent ?? 0));
  grid.appendChild(statCard("Disco", (status.disk.percent ?? 0) + "%", status.disk.percent ?? 0));
  v.appendChild(grid);

  v.appendChild(el("h3", { class: "section" }, "Checks"));
  const feed = el("div", { class: "feed" });
  (status.services || []).forEach((s) => feed.appendChild(el("div", { class: "feed-item" },
    el("span", { class: "status-dot " + (s.status === "running" ? "ok" : "danger") }),
    el("span", {}, s.name),
    el("span", { class: "feed-time" }, s.status === "running" ? "● Ativo" : "✕ Offline"))));
  v.appendChild(feed);
}

/* ---------- Administração (admin) ---------- */

async function renderAdmin() {
  const users = await api("/api/v1/users");
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Usuários"));
  if (!users || !users.length) {
    v.appendChild(el("p", { class: "empty" }, "Nenhum usuário encontrado."));
    return;
  }
  const t = el("table", { class: "table" });
  const head = el("tr");
  ["Usuário", "Admin"].forEach((c) => head.appendChild(el("th", {}, c)));
  t.appendChild(el("thead", {}, head));
  const body = el("tbody");
  users.forEach((u) => {
    const tr = el("tr");
    tr.appendChild(el("td", {}, u.username || u.id));
    tr.appendChild(el("td", {}, u.perm && u.perm.admin ? "⭐ Admin" : "padrão"));
    body.appendChild(tr);
  });
  t.appendChild(body);
  v.appendChild(t);
}

/* ---------- Init ---------- */

window.addEventListener("hashchange", router);

async function init() {
  applyTheme(localStorage.getItem("hs_theme") || "dark");

  if (!(await auth.check())) {
    window.location.href = "/app/login.html";
    return;
  }

  document.getElementById("app").hidden = false;
  buildNav();
  renderUser();
  router();

  document.getElementById("btn-sair").addEventListener("click", async () => {
    await auth.logout();
    window.location.href = "/app/login.html";
  });
  document.getElementById("btn-theme").addEventListener("click", toggleTheme);
  document.getElementById("btn-theme-mobile").addEventListener("click", toggleTheme);
}

init();
