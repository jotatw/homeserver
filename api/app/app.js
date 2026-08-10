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
  { route: "print", title: "Impressão", icon: "🖨️", minRole: "admin", desktop: true, mobile: false },
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

  // Overflow: abre o drawer com perfil, tema e sair (design navigation.md).
  const plus = el("button", { class: "nav-item", id: "bottom-plus", "aria-label": "Mais opções" },
    el("span", { class: "ic" }, "＋"),
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
        el("span", { class: "ic" }, "👤"),
        el("span", { class: "app-name", id: "sheet-user" })),
      el("button", { class: "sheet-item", id: "sheet-print" },
        el("span", { class: "ic" }, "🖨️"), el("span", {}, "Impressão")),
      el("button", { class: "sheet-item", id: "sheet-theme" },
        el("span", { class: "ic" }, "🌗"), el("span", {}, "Tema")),
      el("button", { class: "sheet-item sheet-danger", id: "sheet-sair" },
        el("span", { class: "ic" }, "⏻"), el("span", {}, "Sair")));
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
  document.getElementById("sidebar-user").innerHTML = "👤 " + label + badge;
  document.getElementById("topbar-user").innerHTML = "👤 " + label + badge;
}

/* ---------- Router ---------- */

let dashboardTimer = null;

function clearDashboardPolling() {
  if (dashboardTimer) {
    clearInterval(dashboardTimer);
    dashboardTimer = null;
  }
}

async function router() {
  clearDashboardPolling();
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
    v.appendChild(el("p", { class: "empty error-msg" }, "⚠️ ", err.message));
  }
}

/* ---------- Dashboard (Meu espaço) ---------- */

async function renderDashboard() {
  const v = document.getElementById("view");
  v.innerHTML = "";

  // Estrutura com ids (banner, stats, ações, feed) — polling atualiza os valores.
  v.appendChild(el("div", { class: "banner", id: "db-banner" }, "●", "Carregando…"));

  v.appendChild(el("h3", { class: "section" }, "Servidor"));
  const grid = el("div", { class: "grid", id: "db-stats" });
  ["cpu", "mem", "disk", "uptime"].forEach((k) => grid.appendChild(el("div", { class: "stat-card skeleton" })));
  v.appendChild(grid);

  v.appendChild(el("h3", { class: "section" }, "Acesso rápido"));
  const actions = el("div", { class: "grid" });
  actions.appendChild(actionCard("📁", "Arquivos", "/files/"));
  actions.appendChild(actionCard("📦", "Aplicações", "#/apps"));
  actions.appendChild(actionCard("📊", "Sistema", "#/system"));
  if (auth.isAdmin()) {
    actions.appendChild(actionCard("🖨️", "Imprimir", "#/print"));
  }
  v.appendChild(actions);

  v.appendChild(el("h3", { class: "section" }, "Atividades"));
  v.appendChild(el("div", { class: "feed", id: "db-feed" }));

  await refreshDashboard();
  dashboardTimer = setInterval(refreshDashboard, 30000);
}

async function refreshDashboard() {
  try {
    const [status, events] = await Promise.all([
      api("/api/v1/status"),
      api("/api/v1/events"),
    ]);

    // Banner de status
    const banner = document.getElementById("db-banner");
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
    banner.className = "banner " + bannerClass;
    banner.textContent = "● " + bannerText;

    // Stat cards
    const disk = status.disk || {};
    const mem = status.memory || {};
    const cpu = status.cpu || {};
    const stats = document.getElementById("db-stats");
    stats.innerHTML = "";
    stats.appendChild(statCard("CPU", (cpu.percent ?? 0) + "%", cpu.percent ?? 0));
    stats.appendChild(statCard("Memória", (mem.percent ?? 0) + "%", mem.percent ?? 0));
    stats.appendChild(statCard("Disco", (disk.percent ?? 0) + "%", disk.percent ?? 0));
    stats.appendChild(statCard("Uptime", status.uptime || "—", 0));

    // Feed de atividades
    const feed = document.getElementById("db-feed");
    feed.innerHTML = "";
    if (events && events.length) {
      events.slice(0, 8).forEach((ev) => {
        const icon = { backup: "💾", device: "🔌", system: "⚙️", power: "🔋" }[ev.type] || "📄";
        feed.appendChild(el("div", { class: "feed-item" },
          el("span", {}, icon), el("span", {}, ev.action || ev.type),
          el("span", { class: "feed-time" }, ev.time ? timeAgo(ev.time) : "")));
      });
    } else {
      feed.appendChild(el("div", { class: "feed-item" }, "Sem atividades registradas."));
    }
  } catch (_) {
    // api() já trata 401 (logout). Erros de rede ficam silenciosos no polling.
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

  // 4. Dispositivos conectados (sempre visível)
  v.appendChild(el("h3", { class: "section" }, "Dispositivos conectados"));
  const feed = el("div", { class: "feed" });
  if (devices && devices.length) {
    devices.forEach((d) => {
      const row = el("div", { class: "feed-item" },
        el("span", {}, "🔌"),
        el("span", { class: "app-name", style: "overflow:hidden;text-overflow:ellipsis;white-space:nowrap" }, d.label),
        el("span", { class: "feed-time" }, (d.type || "").toUpperCase()));
      if (auth.isAdmin()) {
        const act = el("span", { class: "device-actions" },
          el("button", { class: "btn btn-secondary", "data-label": d.label, style: "height:var(--hs-touch-compact)" }, "Desmontar"));
        act.addEventListener("click", async () => {
          const btn = act.querySelector("button");
          if (btn.disabled) return;
          btn.disabled = true;
          btn.textContent = "…";
          try {
            await apiOrFail("/api/v1/devices/unmount", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: d.type, label: d.label }),
            });
            toast("Dispositivo desmontado: " + d.label, "success");
            renderStorage();
          } catch (err) {
            toast(err.message || "Falha ao desmontar.", "error");
            btn.disabled = false;
            btn.textContent = "Desmontar";
          }
        });
        row.appendChild(act);
      }
      feed.appendChild(row);
    });
  } else {
    feed.appendChild(el("div", { class: "feed-item" }, "Nenhum dispositivo conectado."));
  }
  v.appendChild(feed);

  if (auth.isAdmin()) {
    const mountBtn = el("button", { class: "btn btn-secondary", style: "margin-top:var(--hs-space-2)" }, "🔌 Montar dispositivo");
    mountBtn.addEventListener("click", () => openMountDialog());
    v.appendChild(mountBtn);
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
    pwr.appendChild(feedRow("⏰", "Desliga às", power.shutdown || "—"));
    pwr.appendChild(feedRow("🔔", "Liga às", power.wake || "—"));
    pwr.appendChild(feedRow("⚡", "Agendado", power.enabled ? "Sim" : "Não"));
    v.appendChild(pwr);
    const editBtn = el("button", { class: "btn btn-secondary", style: "margin-top:var(--hs-space-2)" }, "✏️ Editar agenda");
    editBtn.addEventListener("click", () => openPowerDialog(power));
    v.appendChild(editBtn);

    // Rede
    if (hardware.network) {
      v.appendChild(el("h3", { class: "section" }, "Rede"));
      const net = el("div", { class: "feed" });
      net.appendChild(feedRow("🌐", "IP", hardware.network.ip || "—"));
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
          el("span", { class: "app-name" }, (t.label || t.chip) + (hot ? " ⚠" : "")),
          el("span", { class: "app-host" }, t.temp + "°C")));
      });
      v.appendChild(tgrid);
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

async function renderAdmin() {
  const [users, tokens] = await Promise.all([
    api("/api/v1/users"),
    api("/api/v1/tokens"),
  ]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  // Usuários
  v.appendChild(el("h3", { class: "section" }, "Usuários"));
  if (users && users.length) {
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
  } else {
    v.appendChild(el("p", { class: "empty" }, "Nenhum usuário encontrado."));
  }

  const createUserBtn = el("button", { class: "btn btn-secondary", style: "margin-top:var(--hs-space-2)" }, "＋ Novo usuário");
  createUserBtn.addEventListener("click", openUserDialog);
  v.appendChild(createUserBtn);

  // Tokens de API
  v.appendChild(el("h3", { class: "section" }, "Tokens de API"));
  const tfeed = el("div", { class: "feed" });
  if (tokens && tokens.length) {
    tokens.forEach((tk) => {
      const row = el("div", { class: "feed-item" },
        el("span", {}, "🔑"),
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

  const createBtn = el("button", { class: "btn btn-secondary", style: "margin-top:var(--hs-space-2)" }, "🔑 Criar token");
  createBtn.addEventListener("click", () => openTokenDialog());
  v.appendChild(createBtn);
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
          el("input", { id: "us-name", placeholder: "ex.: jota", pattern: "[a-z][a-z0-9_-]{1,30}", required: true })),
        el("div", { class: "field" },
          el("label", { for: "us-pass" }, "Senha"),
          el("input", { id: "us-pass", type: "password", required: true })),
        el("div", { class: "field" },
          el("label", { for: "us-email" }, "E-mail (opcional)"),
          el("input", { id: "us-email", type: "email", placeholder: "ex.: jota@exemplo.com" })),
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
    return el("span", { class: "badge danger" }, "🔴 Erro");
  }
  if (status.state === "disabled" || status.accepting === false) {
    return el("span", { class: "badge danger" }, "🔴 Indisponível");
  }
  if (status.activeJobs > 0 || status.state === "printing") {
    return el("span", { class: "badge warn" }, "🟡 Ocupada");
  }
  return el("span", { class: "badge ok" }, "🟢 Pronta");
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
    v.appendChild(el("div", { class: "banner danger" }, "🔴", "Erro ao consultar a impressora: " + err.message));
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
    el("option", { value: "economico" }, "♻ Econômico"),
    el("option", { value: "normal", selected: "selected" }, "Normal"),
    el("option", { value: "alta" }, "✨ Alta qualidade"));
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
      "📎 Escolher arquivo",
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
    el("button", { class: "btn btn-secondary", id: "pr-preview-btn" }, "👁 Visualizar"),
    el("button", { class: "btn btn-primary", id: "pr-submit" }, "🖨️ Imprimir"));
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
        el("span", {}, printing ? "🟡" : "✅"),
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
          submitBtn.textContent = "🖨️ Imprimir";
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
    submitBtn.textContent = "🖨️ Imprimir";
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

  if (!(await auth.check())) {
    window.location.href = "/app/login.html";
    return;
  }

  document.getElementById("app").hidden = false;
  buildNav();
  renderUser();
  router();

  // Refresh ao focar a aba (se estiver no dashboard com polling).
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && dashboardTimer) {
      refreshDashboard();
    }
  });
}

init();
