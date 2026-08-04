const views = {
  dashboard: renderDashboard,
  storage: renderStorage,
  users: renderUsers,
  services: renderServices,
  devices: renderDevices,
};

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else e.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (c === null || c === undefined) return;
    if (typeof c === "string") e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}

function card(label, value) {
  return el("div", { class: "card" },
    el("div", { class: "card-label" }, label),
    el("div", { class: "card-value" }, String(value)));
}

function table(columns, rows) {
  const t = el("table", { class: "table" });
  const thead = el("thead");
  const trh = el("tr");
  columns.forEach((c) => trh.appendChild(el("th", {}, c)));
  thead.appendChild(trh);
  const tbody = el("tbody");
  rows.forEach((r) => {
    const tr = el("tr");
    r.forEach((cell) => tr.appendChild(el("td", {}, String(cell))));
    tbody.appendChild(tr);
  });
  t.appendChild(thead);
  t.appendChild(tbody);
  return t;
}

function human(bytes) {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

async function renderDashboard() {
  const [status, hw] = await Promise.all([
    api("/api/v1/status"),
    api("/api/v1/hardware"),
  ]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  const grid = el("div", { class: "grid" });
  grid.appendChild(card("Hostname", status.hostname));
  grid.appendChild(card("Sistema", status.os));
  grid.appendChild(card("Uptime", status.uptime));
  grid.appendChild(card("CPU", status.cpu.percent + "%"));
  grid.appendChild(card("Memória", status.memory.percent + "%"));
  grid.appendChild(card("Disco", status.disk.percent + "%"));
  grid.appendChild(card("Backup", status.backup));
  grid.appendChild(card("Wake-on-LAN", status.wol));
  v.appendChild(grid);

  const temps = (hw.temperature || []).map((s) => card(s.chip + " / " + s.label, s.temp + "°C"));
  if (temps.length) {
    v.appendChild(el("h3", { class: "section" }, "Temperaturas"));
    const tg = el("div", { class: "grid" });
    temps.forEach((c) => tg.appendChild(c));
    v.appendChild(tg);
  }
}

async function renderStorage() {
  const s = await api("/api/v1/storage");
  const v = document.getElementById("view");
  v.innerHTML = "";
  const grid = el("div", { class: "grid" });
  grid.appendChild(card("Pronto", s.ready ? "Sim" : "Não"));
  grid.appendChild(card("Usuários", s.users));
  grid.appendChild(card("Compartilhado", s.shared));
  grid.appendChild(card("Mídia", s.media));
  grid.appendChild(card("Documentos", s.documents));
  grid.appendChild(card("Dispositivos", s.devices));
  grid.appendChild(card("Total", s.total_size_human));
  v.appendChild(grid);
}

async function renderUsers() {
  const users = await api("/api/v1/users");
  const v = document.getElementById("view");
  v.innerHTML = "";
  v.appendChild(table(
    ["Usuário", "Escopo", "Admin"],
    users.map((u) => [u.username, u.scope, u.perm.admin ? "Sim" : "Não"]),
  ));
}

async function renderServices() {
  const services = await api("/api/v1/services");
  const v = document.getElementById("view");
  v.innerHTML = "";
  v.appendChild(table(
    ["Serviço", "Status"],
    services.map((s) => [s.name, s.status]),
  ));
}

async function renderDevices() {
  const devices = await api("/api/v1/devices");
  const v = document.getElementById("view");
  v.innerHTML = "";
  if (!devices.length) {
    v.appendChild(el("p", { class: "empty" }, "Nenhum dispositivo conectado."));
    return;
  }
  v.appendChild(table(
    ["Rótulo", "Tipo", "Tamanho"],
    devices.map((d) => [d.label, d.type, human(d.size)]),
  ));
}

async function show(view) {
  document.querySelectorAll("nav button").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === view));
  const v = document.getElementById("view");
  v.innerHTML = "Carregando...";
  try {
    await views[view]();
  } catch (e) {
    v.innerHTML = "";
    v.appendChild(el("p", { class: "empty" }, "Erro ao carregar: " + e.message));
  }
}

document.querySelectorAll("nav button").forEach((b) => {
  b.addEventListener("click", () => show(b.dataset.view));
});

(async function init() {
  if (!(await auth.check())) {
    window.location.href = "/app/login.html";
    return;
  }

  const header = document.querySelector("header");
  const sair = el("button", { id: "btn-sair" }, "Sair");
  sair.addEventListener("click", async () => {
    await auth.logout();
    window.location.href = "/app/login.html";
  });
  header.appendChild(sair);

  // Exibe a versão instalada no header
  try {
    const v = await api("/api/v1/version");
    const badge = el("span", { id: "ver-badge" }, "v" + v.version);
    header.insertBefore(badge, sair);
  } catch (_) {}

  show("dashboard");
})();
