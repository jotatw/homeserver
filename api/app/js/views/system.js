/* ============================================================
 * HomeServer App — view: Sistema (inclui dialogs de energia, montagem e ops de serviços/módulos)
 * Extraída de app.js (split 2026-09-07). Padrão globals:
 * depende de el()/icon()/button()/api()/toast() em runtime.
 * ============================================================ */

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
    statusDot(serviceState(s.status)),
    el("span", {}, s.name),
    el("span", { class: "feed-time" }, stateBadge(s.status)))));
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
      const st = serviceState(s.status);

      const meta = el("div", { class: "module-meta" },
        el("div", { class: "app-name" },
          s.name,
          el("span", { style: "margin-left:var(--hs-space-2)" }, stateBadge(s.status))),
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
        statusDot(st),
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
