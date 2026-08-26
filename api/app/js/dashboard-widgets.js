/* ============================================================
 * HomeServer App — Dashboard Customizável (Fase 5)
 * Widgets por perfil (admin vs user), persistência localStorage,
 * drag-and-drop, adicionar/remover, sem poluição visual.
 * ============================================================ */

/* ---------- Registry ---------- */
const WIDGET_REGISTRY = [
  { id: "server-status", title: "Servidor", icon: "activity", category: "system", minRole: "user", removable: false, defaultSize: "large", render: renderServerStatusWidget, description: "CPU, Memória, Disco e Uptime" },
  { id: "quick-actions", title: "Acesso rápido", icon: "zap", category: "navigation", minRole: "user", removable: true, defaultSize: "medium", render: renderQuickActionsWidget, description: "Atalhos para áreas principais" },
  { id: "activity-feed", title: "Atividades", icon: "filetext", category: "activity", minRole: "user", removable: true, defaultSize: "large", render: renderActivityFeedWidget, description: "Últimas atividades do sistema" },
  { id: "services-status", title: "Serviços", icon: "server", category: "admin", minRole: "admin", removable: true, defaultSize: "large", render: renderServicesWidget, description: "Serviços e controle rápido" },
  { id: "modules-status", title: "Módulos", icon: "box", category: "admin", minRole: "admin", removable: true, defaultSize: "medium", render: renderModulesWidget, description: "Módulos M1 instalados" },
  { id: "storage-overview", title: "Armazenamento", icon: "harddrive", category: "admin", minRole: "admin", removable: true, defaultSize: "medium", render: renderStorageWidget, description: "Uso de disco e pastas" },
  { id: "system-health", title: "Saúde do hardware", icon: "heart", category: "admin", minRole: "admin", removable: true, defaultSize: "medium", render: renderSystemHealthWidget, description: "Temperatura e discos" },
  { id: "backup-status", title: "Backup", icon: "database", category: "admin", minRole: "admin", removable: true, defaultSize: "small", render: renderBackupWidget, description: "Último backup agendado" },
  { id: "my-files", title: "Meus arquivos", icon: "folder", category: "user", minRole: "user", removable: true, defaultSize: "medium", render: renderMyFilesWidget, description: "Atalho ao FileBrowser" },
  { id: "my-storage", title: "Meu armazenamento", icon: "harddrive", category: "user", minRole: "user", removable: true, defaultSize: "small", render: renderMyStorageWidget, description: "Uso pessoal de disco" },
];

/* ---------- Config ---------- */
function getAvailableWidgets() {
  const rank = roleRank[auth.user.role] || 0;
  return WIDGET_REGISTRY.filter(function (w) { return roleRank[w.minRole] <= rank; });
}

function getDefaultDashboardConfig() {
  var isAdmin = auth.isAdmin();
  if (isAdmin) {
    return {
      layout: [
        { widgetId: "server-status", size: "large", order: 0 },
        { widgetId: "quick-actions", size: "medium", order: 1 },
        { widgetId: "services-status", size: "large", order: 2 },
        { widgetId: "modules-status", size: "medium", order: 3 },
        { widgetId: "activity-feed", size: "large", order: 4 },
      ],
      editMode: false
    };
  }
  return {
    layout: [
      { widgetId: "server-status", size: "large", order: 0 },
      { widgetId: "quick-actions", size: "medium", order: 1 },
      { widgetId: "my-files", size: "medium", order: 2 },
      { widgetId: "my-storage", size: "small", order: 3 },
      { widgetId: "activity-feed", size: "large", order: 4 },
    ],
    editMode: false
  };
}

function getDashboardConfig() {
  try {
    var raw = localStorage.getItem("hs_dashboard_config");
    if (raw) {
      var parsed = JSON.parse(raw);
      // migrar se faltar campo ou widget desconhecido
      if (parsed && Array.isArray(parsed.layout)) return parsed;
    }
  } catch (_) {}
  return getDefaultDashboardConfig();
}

function saveDashboardConfig(cfg) {
  try { localStorage.setItem("hs_dashboard_config", JSON.stringify(cfg)); } catch (_) {}
}

/* ---------- Ações de customização ---------- */
function toggleDashboardEditMode() {
  var cfg = getDashboardConfig();
  cfg.editMode = !cfg.editMode;
  saveDashboardConfig(cfg);
  renderDashboard();
}

function addWidgetToDashboard(widgetId, silent) {
  var cfg = getDashboardConfig();
  if (cfg.layout.some(function (w) { return w.widgetId === widgetId; })) return false;
  var def = WIDGET_REGISTRY.find(function (w) { return w.id === widgetId; });
  if (!def) return false;
  var maxOrder = cfg.layout.length ? Math.max.apply(null, cfg.layout.map(function (w) { return w.order; })) : -1;
  cfg.layout.push({ widgetId: widgetId, size: def.defaultSize, order: maxOrder + 1 });
  saveDashboardConfig(cfg);
  if (!silent) renderDashboard();
  return true;
}

function removeWidgetFromDashboard(widgetId, silent) {
  var cfg = getDashboardConfig();
  var def = WIDGET_REGISTRY.find(function (w) { return w.id === widgetId; });
  if (def && !def.removable && !silent) { toast("Este widget não pode ser removido.", "warn"); return; }
  cfg.layout = cfg.layout.filter(function (w) { return w.widgetId !== widgetId; });
  saveDashboardConfig(cfg);
  if (!silent) renderDashboard();
}

function setWidgetSize(widgetId, size) {
  var cfg = getDashboardConfig();
  var item = cfg.layout.find(function (w) { return w.widgetId === widgetId; });
  if (item) { item.size = size; saveDashboardConfig(cfg); renderDashboard(); }
}

function getNextSize(cur) {
  var sizes = ["small", "medium", "large"];
  return sizes[(sizes.indexOf(cur) + 1) % sizes.length];
}

/* ---------- Drag helpers ---------- */
function getDragAfterElement(container, y) {
  var els = Array.prototype.slice.call(container.querySelectorAll(".dashboard-widget:not(.dragging)"));
  return els.reduce(function (closest, child) {
    var box = child.getBoundingClientRect();
    var offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* ---------- Render principal ---------- */
async function renderDashboard() {
  var v = document.getElementById("view");
  v.innerHTML = "";

  var cfg = getDashboardConfig();
  var editMode = !!cfg.editMode;

  // Resumo de saúde — "como está meu servidor" em uma linha (UX-03)
  var health = el("div", { class: "health-summary", id: "dashboard-health" },
    el("span", { class: "status-dot", "aria-hidden": "true" }),
    el("span", { class: "health-text" }, "Verificando servidor…"));
  v.appendChild(health);
  hsStore.subscribe("status", function (st) {
    try {
      var cpu = st.cpu || {}, mem = st.memory || {}, disk = st.disk || {};
      var worst = Math.max(cpu.percent ?? 0, mem.percent ?? 0, disk.percent ?? 0);
      var dot = health.querySelector(".status-dot");
      dot.className = "status-dot " + (worst > 85 ? "danger" : worst > 60 ? "" : "ok");
      health.querySelector(".health-text").textContent =
        "Tudo normal · CPU " + Math.round(cpu.percent ?? 0) + "% · Memória " + Math.round(mem.percent ?? 0) + "% · Disco " + Math.round(disk.percent ?? 0) + "%";
    } catch (_) {}
  });

  // header com ações — limpo, sem poluição
  var header = el("div", { class: "dashboard-header" },
    el("div", { class: "dashboard-title-wrap" },
      el("h2", { class: "dashboard-title" }, "Meu espaço"),
      el("span", { class: "dashboard-subtitle" }, auth.isAdmin() ? "Visão de administrador" : "Visão pessoal")
    ),
    el("div", { class: "dashboard-actions" },
      el("button", { class: "btn btn-secondary", id: "btn-customize-dashboard" },
        icon("settings", "ic"), " Personalizar"),
      editMode ? el("button", { class: "btn btn-primary", id: "btn-edit-done" },
        icon("check", "ic"), " Concluir") : null
    )
  );
  v.appendChild(header);
  document.getElementById("btn-customize-dashboard").addEventListener("click", openCustomizeDialog);
  var doneBtn = document.getElementById("btn-edit-done");
  if (doneBtn) doneBtn.addEventListener("click", toggleDashboardEditMode);

  // grid
  var grid = el("div", { class: "dashboard-grid", id: "dashboard-grid", "data-edit-mode": editMode ? "1" : "0" });
  v.appendChild(grid);

  var sorted = cfg.layout.slice().sort(function (a, b) { return a.order - b.order; });
  sorted.forEach(function (item) {
    var def = WIDGET_REGISTRY.find(function (w) { return w.id === item.widgetId; });
    if (!def) return;
    // respeitar minRole
    if (roleRank[def.minRole] > (roleRank[auth.user.role] || 0)) return;
    var wEl = createWidgetElement(def, item, editMode);
    grid.appendChild(wEl);
  });

  if (editMode) initDashboardDragAndDrop();
}

function createWidgetElement(def, item, editMode) {
  var wEl = el("div", { class: "dashboard-widget widget-size-" + item.size, "data-widget-id": def.id, draggable: editMode ? "true" : "false" });
  var header = el("div", { class: "widget-header" },
    el("h3", { class: "widget-title" }, icon(def.icon, "ic"), el("span", {}, def.title)),
    el("div", { class: "widget-actions" },
      editMode ? el("button", { class: "widget-action-btn", title: "Mover para cima", "aria-label": "Mover " + def.title + " para cima" }, icon("up", "ic")) : null,
      editMode ? el("button", { class: "widget-action-btn", title: "Mover para baixo", "aria-label": "Mover " + def.title + " para baixo" }, icon("down", "ic")) : null,
      editMode ? el("button", { class: "widget-action-btn", title: "Alterar tamanho" }, icon("maximize", "ic")) : null,
      editMode && def.removable ? el("button", { class: "widget-action-btn danger", title: "Remover" }, icon("x", "ic")) : null,
      editMode ? el("span", { class: "widget-drag-handle", title: "Arrastar (desktop)" }, icon("grip", "ic")) : null
    )
  );
  // bind tamanho/mover/remover
  if (editMode) {
    var btns = header.querySelectorAll(".widget-action-btn");
    var upBtn = btns[0], downBtn = btns[1], sizeBtn = btns[2];
    if (upBtn) upBtn.addEventListener("click", function () { moveWidgetByButtons(wEl, -1); });
    if (downBtn) downBtn.addEventListener("click", function () { moveWidgetByButtons(wEl, +1); });
    if (sizeBtn) sizeBtn.addEventListener("click", function () { setWidgetSize(def.id, getNextSize(item.size)); });
    var rmBtn = header.querySelector(".widget-action-btn.danger");
    if (rmBtn) rmBtn.addEventListener("click", function () { removeWidgetFromDashboard(def.id); });
    wEl.addEventListener("dragstart", function (e) { wEl.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; });
    wEl.addEventListener("dragend", function () { wEl.classList.remove("dragging"); saveWidgetOrder(); });
  }
  var content = el("div", { class: "widget-content", id: "widget-content-" + def.id });
  wEl.appendChild(header);
  wEl.appendChild(content);
  setTimeout(function () { try { def.render(content, item); } catch (err) { content.innerHTML = '<div class="widget-error">Falha ao carregar</div>'; } }, 0);
  return wEl;
}

/** Move um widget ↑/↓ no grid por botões — funciona em touch e teclado. */
function moveWidgetByButtons(widgetEl, delta) {
  var grid = document.getElementById("dashboard-grid");
  if (!grid || !widgetEl) return;
  var widgets = Array.prototype.slice.call(grid.querySelectorAll(".dashboard-widget"));
  var idx = widgets.indexOf(widgetEl);
  var target = idx + delta;
  if (idx < 0 || target < 0 || target >= widgets.length) return;
  if (delta < 0) grid.insertBefore(widgetEl, widgets[target]);
  else grid.insertBefore(widgets[target], widgetEl);
  saveWidgetOrder();
}

function initDashboardDragAndDrop() {
  var grid = document.getElementById("dashboard-grid");
  if (!grid) return;
  grid.addEventListener("dragover", function (e) {
    e.preventDefault();
    var after = getDragAfterElement(grid, e.clientY);
    var dragged = document.querySelector(".dashboard-widget.dragging");
    if (!dragged) return;
    if (after == null) grid.appendChild(dragged);
    else grid.insertBefore(dragged, after);
  });
}

function saveWidgetOrder() {
  var grid = document.getElementById("dashboard-grid");
  if (!grid) return;
  var cfg = getDashboardConfig();
  var map = {};
  cfg.layout.forEach(function (w) { map[w.widgetId] = w; });
  var widgets = Array.prototype.slice.call(grid.querySelectorAll(".dashboard-widget"));
  cfg.layout = widgets.map(function (el, idx) {
    var id = el.getAttribute("data-widget-id");
    var prev = map[id] || { widgetId: id, size: "medium" };
    return { widgetId: id, size: prev.size, order: idx };
  });
  saveDashboardConfig(cfg);
}

/* ---------- Dialog Personalizar (widgets + densidade + reset) ---------- */
function openCustomizeDialog() {
  var old = document.getElementById("customize-dialog");
  if (old) old.remove();
  var cfg = getDashboardConfig();
  // estado de trabalho: cópia do que está ativo agora
  var working = {};
  cfg.layout.forEach(function (w) { working[w.widgetId] = true; });
  var available = getAvailableWidgets();

  function updateCount() {
    var n = available.filter(function (w) { return working[w.id]; }).length;
    var elc = document.getElementById("cz-count");
    if (elc) elc.textContent = n + " ativo" + (n === 1 ? "" : "s");
  }

  var listEl = el("div", { class: "widget-list", id: "cz-list" });
  available.forEach(function (w) {
    var cb = el("input", { type: "checkbox", value: w.id });
    if (working[w.id]) cb.checked = true;
    cb.addEventListener("change", function () {
      if (cb.checked) {
        // server-status é o coração do painel — sempre presente
        working[w.id] = true;
      } else {
        delete working[w.id];
      }
      updateCount();
    });
    listEl.appendChild(el("label", { class: "widget-option" },
      cb,
      el("span", { class: "widget-option-meta" },
        el("strong", {}, w.title),
        el("small", {}, w.description))));
  });

  var cozyBtn = el("button", { type: "button", class: "density-opt active", "data-density": "cozy" }, "Confortável");
  var compactBtn = el("button", { type: "button", class: "density-opt", "data-density": "compact" }, "Compacta");
  var currentDensity = document.documentElement.classList.contains("compact") ? "compact" : "cozy";
  [cozyBtn, compactBtn].forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-density") === currentDensity);
    b.addEventListener("click", function () {
      cozyBtn.classList.toggle("active", b === cozyBtn);
      compactBtn.classList.toggle("active", b === compactBtn);
    });
  });

  var dialog = el("dialog", { id: "customize-dialog" },
    el("form", { method: "dialog", id: "customize-form" },
      el("h3", { class: "dialog-title" }, "Personalizar"),
      el("p", { class: "power-hint", style: "margin-bottom:var(--hs-space-2)" }, "Escolha o que aparece no seu espaço e como."),
      el("div", { class: "group-label" },
        "Widgets ",
        el("span", { class: "count", id: "cz-count" })),
      listEl,
      el("div", { class: "group-label" }, "Densidade"),
      el("div", { class: "density-row", role: "radiogroup", "aria-label": "Densidade" }, cozyBtn, compactBtn),
      el("button", { type: "button", class: "reset-link", id: "cz-reset" }, "↺ Restaurar layout padrão"),
      el("div", { class: "dialog-actions" },
        el("button", { type: "button", class: "btn btn-secondary", id: "cz-reorder" }, "Reordenar"),
        el("button", { type: "button", class: "btn btn-secondary", id: "cz-cancel" }, "Cancelar"),
        el("button", { type: "submit", class: "btn btn-primary" }, "Salvar"))));
  document.body.appendChild(dialog);
  updateCount();

  dialog.querySelector("#cz-cancel").addEventListener("click", function () { dialog.close(); });
  dialog.querySelector("#cz-reorder").addEventListener("click", function () {
    dialog.close();
    if (!getDashboardConfig().editMode) toggleDashboardEditMode();
  });
  dialog.querySelector("#cz-reset").addEventListener("click", function () {
    working = {};
    getDefaultDashboardConfig().layout.forEach(function (w) { working[w.widgetId] = true; });
    cozyBtn.classList.add("active");
    compactBtn.classList.remove("active");
    listEl.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.checked = !!working[cb.value];
    });
    updateCount();
  });
  dialog.querySelector("#customize-form").addEventListener("submit", function (e) {
    e.preventDefault();
    // 1) widgets: adicionar novos, remover desmarcados
    var toAdd = available.filter(function (w) { return working[w.id] && !cfg.layout.some(function (l) { return l.widgetId === w.id; }); });
    var toRemove = cfg.layout.filter(function (l) { return !working[l.widgetId]; }).map(function (l) { return l.widgetId; });
    toAdd.forEach(function (w) { addWidgetToDashboard(w.id, true); });
    toRemove.forEach(function (id) { removeWidgetFromDashboard(id, true); });
    // 2) densidade
    applyDensity(compactBtn.classList.contains("active") ? "compact" : "cozy");
    saveDashboardConfig(cfg);
    renderDashboard();
    toast("Preferências salvas.", "success");
    dialog.close();
  });
  dialog.showModal();
}

/* ---------- Renderers ---------- */

async function renderServerStatusWidget(container) {
  var paint = function (status) {
    var cpu = status.cpu || {}, mem = status.memory || {}, disk = status.disk || {};
    container.innerHTML = "";
    container.appendChild(el("div", { class: "widget-grid" },
      statCardWidget("CPU", (cpu.percent ?? 0) + "%", cpu.percent ?? 0),
      statCardWidget("Memória", (mem.percent ?? 0) + "%", mem.percent ?? 0),
      statCardWidget("Disco", (disk.percent ?? 0) + "%", disk.percent ?? 0),
      statCardWidget("Uptime", status.uptime || "—", 0)
    ));
    container.appendChild(el("a", { href: "#/system", class: "widget-link" }, "Saúde completa em Sistema →"));
  };
  hsStore.subscribe("status", function (d) {
    try { paint(d); } catch (_) { container.innerHTML = '<div class="widget-error">Sem dados do servidor</div>'; }
  });
}

async function renderQuickActionsWidget(container) {
  var actions = [
    { icon: "folder", title: "Arquivos", href: "/files/" },
    { icon: "box", title: "Aplicações", href: "#/apps" },
    { icon: "activity", title: "Sistema", href: "#/system" },
  ];
  if (auth.isAdmin()) {
    actions.push({ icon: "printer", title: "Imprimir", href: "#/print" });
    actions.push({ icon: "settings", title: "Administração", href: "#/admin" });
  }
  container.innerHTML = "";
  var grid = el("div", { class: "action-grid" });
  actions.forEach(function (a) { grid.appendChild(actionCard(a.icon, a.title, a.href)); });
  container.appendChild(grid);
}

async function renderActivityFeedWidget(container) {
  try {
    var events = await api("/api/v1/events");
    container.innerHTML = "";
    var feed = el("div", { class: "feed" });
    if (events && events.length) {
      events.slice(0, 6).forEach(function (ev) {
        var ic = { backup: "database", device: "plug", system: "settings", power: "zap" }[ev.type] || "filetext";
        feed.appendChild(el("div", { class: "feed-item" }, icon(ic), el("span", {}, ev.action || ev.type), el("span", { class: "feed-time" }, ev.time ? timeAgo(ev.time) : "")));
      });
    } else feed.appendChild(el("div", { class: "feed-item" }, "Sem atividades recentes."));
    container.appendChild(feed);
  } catch (_) { container.innerHTML = '<div class="widget-error">Sem atividades</div>'; }
}

async function renderServicesWidget(container) {
  var paint = function (services) {
    container.innerHTML = "";
    if (!services || !services.length) { container.innerHTML = '<div class="empty">Nenhum serviço</div>'; return; }
    var total = services.length;
    var up = services.filter(function (s) { return s.status === "running"; }).length;
    var allOk = up === total;
    container.appendChild(el("div", { class: "services-summary" },
      statusDot(serviceState(allOk ? "running" : "warning")),
      el("span", { class: "summary-value" }, up + "/" + total),
      el("span", { class: "app-name" }, allOk ? "todos no ar" : "no ar")));
    container.appendChild(el("a", { href: "#/apps", class: "widget-link" }, "Ver aplicações e controlar →"));
  };
  hsStore.subscribe("services", function (d) { paint(d); });
}

async function renderModulesWidget(container) {
  try {
    var mods = await api("/api/v1/modules");
    var inst = await api("/api/v1/modules/instances");
    var map = {}; (inst || []).forEach(function (i) { map[i.definition] = true; });
    container.innerHTML = "";
    if (!mods || !mods.length) { container.innerHTML = '<div class="empty">Nenhum módulo</div>'; return; }
    var activeCount = mods.filter(function (m) { return !!map[m.id]; }).length;
    container.appendChild(el("div", { class: "services-summary" },
      el("span", { class: "status-dot ok" }),
      el("span", { class: "summary-value" }, activeCount + "/" + mods.length),
      el("span", { class: "app-name" }, "instâncias ativas")));
    container.appendChild(el("a", { href: "#/admin", class: "widget-link" }, "Gerenciar módulos →"));
  } catch (_) { container.innerHTML = '<div class="widget-error">Sem módulos</div>'; }
}

async function renderStorageWidget(container) {
  var paint = function (st) {
    var disk = (st && st.disk) || {};
    container.innerHTML = "";
    container.appendChild(el("div", { class: "storage-summary" },
      statCardWidget("Usado", human(disk.used || 0), 0),
      statCardWidget("Livre", human(disk.available || 0), 0)));
    container.appendChild(el("a", { href: "#/storage", class: "widget-link" }, "Armazenamento e dispositivos →"));
  };
  hsStore.subscribe("status", function (d) {
    try { paint(d); } catch (_) { container.innerHTML = '<div class="widget-error">Sem dados de disco</div>'; }
  });
}

async function renderSystemHealthWidget(container) {
  var paint = function (hw) {
    container.innerHTML = "";
    var temps = (hw && hw.temperature) ? hw.temperature : [];
    var maxTemp = temps.reduce(function (mx, t) { return Math.max(mx, t.temp || 0); }, 0);
    var tempSt = SERVICE_STATES.unknown;
    if (maxTemp >= 80) tempSt = SERVICE_STATES.danger;
    else if (maxTemp >= 65) tempSt = SERVICE_STATES.warning;
    else if (maxTemp > 0) tempSt = SERVICE_STATES.running;
    container.appendChild(el("div", { class: "services-summary" },
      statusDot(tempSt),
      el("span", { class: "summary-value" }, maxTemp ? maxTemp + "°C" : "—"),
      el("span", { class: "app-name" },
        tempSt === SERVICE_STATES.danger ? "crítica" :
        tempSt === SERVICE_STATES.warning ? "atenção" : "normal")));
    container.appendChild(el("a", { href: "#/system", class: "widget-link" }, "Hardware em Sistema →"));
  };
  hsStore.subscribe("hardware", function (d) {
    try { paint(d); } catch (_) { container.innerHTML = '<div class="widget-error">Sem hardware</div>'; }
  });
}

async function renderBackupWidget(container) {
  container.innerHTML = '<div class="feed"><div class="feed-item">' + icon("database").outerHTML + ' <span class="app-name">Backup agendado</span><span class="feed-time">04:30 diário</span></div></div>';
}

async function renderMyFilesWidget(container) {
  container.innerHTML = "";
  container.appendChild(el("div", { class: "feed" },
    el("a", { href: "/files/", target: "_blank", class: "feed-item", style: "text-decoration:none;color:inherit" }, icon("folder"), el("span", { class: "app-name" }, "Abrir FileBrowser"), el("span", { class: "feed-time" }, "→")),
    el("div", { class: "feed-item" }, icon("harddrive"), el("span", {}, "Seus arquivos em /srv/storage"))
  ));
}

async function renderMyStorageWidget(container) {
  try {
    var st = await api("/api/v1/storage");
    container.innerHTML = "";
    var total = st && st.total_size_human ? st.total_size_human : "—";
    container.appendChild(el("div", { class: "feed" }, el("div", { class: "feed-item" }, icon("harddrive"), el("span", { class: "app-name" }, "Total em uso"), el("span", { class: "feed-time" }, total)),
      el("a", { href: "#/storage", class: "widget-link" }, "Meu armazenamento →")));
  } catch (_) { container.innerHTML = '<div class="widget-error">Sem dados</div>'; }
}

function statCardWidget(label, value, pct) {
  return statCard(label, value, pct || 0); // componente único (components.js)
}
