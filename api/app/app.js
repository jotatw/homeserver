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

  // Refresh ao focar a aba (se estiver no dashboard com polling).
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && dashboardTimer) {
      refreshDashboard();
    }
  });
}

init();
