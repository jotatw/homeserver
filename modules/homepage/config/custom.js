(() => {
  const MODES = [
    {
      id: "user",
      label: "Usuário",
      groups: ["Meu espaço", "Aplicações"],
    },
    {
      id: "admin",
      label: "Administrador",
      groups: ["Meu espaço", "Aplicações", "Administração"],
    },
    {
      id: "system",
      label: "Sistema",
      groups: ["Meu espaço", "Aplicações", "Administração", "Sistema"],
    },
  ];

  const STORAGE_KEY = "hs_mode";

  function getMode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return MODES.some((m) => m.id === saved) ? saved : "user";
  }

  function setActiveButton(modeId) {
    document.querySelectorAll(".hs-mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === modeId);
    });
  }

  function applyMode(modeId) {
    const mode = MODES.find((m) => m.id === modeId) || MODES[0];
    localStorage.setItem(STORAGE_KEY, mode.id);

    const visible = new Set(mode.groups);

    document.querySelectorAll(".services-group").forEach((group) => {
      const h2 = group.querySelector(".service-group-name");
      if (!h2) return;
      const name = (h2.textContent || "").trim();
      group.style.display = visible.has(name) ? "" : "none";

      // Hierarquia visual por grupo (v1.4.2)
      group.classList.remove("hs-group-primary", "hs-group-secondary", "hs-group-tertiary");
      if (name === "Meu espaço") group.classList.add("hs-group-primary");
      else if (name === "Aplicações" || name === "Administração") group.classList.add("hs-group-secondary");
      else group.classList.add("hs-group-tertiary");
    });

    setActiveButton(mode.id);
    highlightApp();
  }

  // Destaque do HomeServer App como ação principal (v1.4.3)
  function highlightApp() {
    document.querySelectorAll(".service-card").forEach((card) => {
      const nameEl = card.querySelector(".service-card-name, .name, [class*='name']");
      const text = card.textContent || "";
      const isApp = /HomeServer App/i.test(text);
      card.classList.toggle("hs-app-cta", isApp);
    });
  }

  // Atalho "Abrir App" no seletor de modos — reduz cliques (v1.4.3)
  function buildAppShortcut() {
    if (document.getElementById("hs-app-shortcut")) return;
    const selector = document.querySelector(".hs-mode-selector");
    if (!selector) return;

    const link = document.createElement("a");
    link.id = "hs-app-shortcut";
    link.className = "hs-mode-btn hs-app-shortcut";
    link.href = "/app";
    link.textContent = "Abrir App";
    link.title = "Administração — HomeServer App";
    selector.appendChild(link);
  }

  function buildSelector() {
    if (document.querySelector(".hs-mode-selector")) return;

    const wrap = document.createElement("div");
    wrap.className = "hs-mode-selector";
    wrap.setAttribute("aria-label", "Modo de exibição");

    MODES.forEach((m) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hs-mode-btn";
      btn.dataset.mode = m.id;
      btn.textContent = m.label;
      btn.title = `Modo ${m.label}`;
      btn.addEventListener("click", () => applyMode(m.id));
      wrap.appendChild(btn);
    });

    document.body.appendChild(wrap);
  }

  function init() {
    buildSelector();
    buildAppShortcut();
    applyMode(getMode());
    buildFooter();
  }

  function buildFooter() {
    if (document.getElementById("hs-footer")) return;

    const footer = document.createElement("footer");
    footer.id = "hs-footer";
    footer.className = "hs-footer";

    const line = document.createElement("div");
    line.className = "hs-footer-line";

    const versionSpan = document.createElement("span");
    versionSpan.id = "hs-footer-version";
    versionSpan.textContent = "HomeServer";

    const statusSpan = document.createElement("span");
    statusSpan.id = "hs-footer-status";
    statusSpan.textContent = "Verificando...";

    line.appendChild(versionSpan);
    line.appendChild(statusSpan);
    footer.appendChild(line);

    const main = document.querySelector("main") || document.body;
    main.appendChild(footer);

    const BASE =
      window.location.hostname === "homeserver.local"
        ? ""
        : "http://192.168.0.10:8000";

    Promise.all([
      fetch(BASE + "/api/v1/version").then((r) => r.json()).catch(() => null),
      fetch(BASE + "/api/v1/status").then((r) => r.json()).catch(() => null),
    ]).then(([v, s]) => {
      if (v) versionSpan.textContent = "HomeServer " + v.version;
      if (s) {
        const ok = s.services && s.services.every((x) => x.status === "running");
        const dot = document.createElement("span");
        dot.className = "hs-dot " + (ok ? "ok" : "warn");
        statusSpan.textContent = "";
        statusSpan.appendChild(dot);
        statusSpan.appendChild(
          document.createTextNode(ok ? "Sistema saudável" : "Verificar serviços")
        );
      } else {
        statusSpan.textContent = "Sistema indisponível";
      }
    });
  }

  function showToast(message) {
    let toast = document.getElementById("hs-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "hs-toast";
      toast.className = "hs-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1200);
  }

  function attachClickFeedback() {
    document.querySelectorAll(".service-card a[href]").forEach((a) => {
      if (a.dataset.hsFeedback) return;
      a.dataset.hsFeedback = "1";
      a.addEventListener("click", () => showToast("Abrindo..."));
    });
  }

  function watch() {
    const target = document.getElementById("__next") || document.body;

    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(".services-group .service-group-name").length > 0) {
        buildAppShortcut();
        applyMode(getMode());
        attachClickFeedback();
      }
    });

    observer.observe(target, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      watch();
    });
  } else {
    init();
    watch();
  }
})();

/* ──────────────────────────
 * Power Schedule Editor
 * ────────────────────────── */
(() => {
  const BASE =
    window.location.hostname === "homeserver.local"
      ? ""
      : "http://192.168.0.10:8000";

  function powerFetch(url, opts) {
    return fetch(url, {
      ...opts,
      headers: { "Content-Type": "application/json", ...opts?.headers },
    }).then((r) => r.json());
  }

  /* Overlay modal */
  const overlay = document.createElement("div");
  overlay.id = "hs-power-modal";
  overlay.style.cssText =
    "display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:3000;align-items:center;justify-content:center;";
  overlay.innerHTML = `
    <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;min-width:280px;color:#e2e8f0;font-size:.9rem;">
      <h3 style="margin:0 0 16px;font-size:1rem;">Agendamento Automático</h3>
      <label style="display:block;margin-bottom:4px;">Desligar</label>
      <input type="time" id="hs-power-shutdown" value="23:30"
        style="width:100%;padding:6px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#e2e8f0;margin-bottom:12px;">
      <label style="display:block;margin-bottom:4px;">Ligar</label>
      <input type="time" id="hs-power-wake" value="07:00"
        style="width:100%;padding:6px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#e2e8f0;margin-bottom:16px;">
      <div style="display:flex;gap:8px;">
        <button id="hs-power-save" style="flex:1;padding:8px;border:none;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer;">Salvar</button>
        <button id="hs-power-disable" style="flex:1;padding:8px;border:none;border-radius:6px;background:#475569;color:#94a3b8;cursor:pointer;">Desativar</button>
        <button id="hs-power-close" style="flex:0;padding:8px 12px;border:none;border-radius:6px;background:#334155;color:#94a3b8;cursor:pointer;">×</button>
      </div>
      <p id="hs-power-msg" style="margin:12px 0 0;font-size:.8rem;color:#94a3b8;"></p>
    </div>`;
  document.body.appendChild(overlay);

  function openPower() {
    powerFetch(BASE + "/api/v1/power").then((d) => {
      document.getElementById("hs-power-shutdown").value = d.shutdown || "23:30";
      document.getElementById("hs-power-wake").value = d.wake || "07:00";
    });
    overlay.style.display = "flex";
  }

  /* Botão ⚡ — criado quando o seletor de modos existir */
  function ensurePowerButton() {
    if (document.getElementById("hs-power-btn")) return;
    const selector = document.querySelector(".hs-mode-selector");
    if (!selector) return;

    const btn = document.createElement("button");
    btn.id = "hs-power-btn";
    btn.className = "hs-mode-btn";
    btn.textContent = "⚡";
    btn.title = "Agendamento liga/desliga";
    btn.addEventListener("click", openPower);
    selector.appendChild(btn);
  }

  /* Eventos do modal */
  document.getElementById("hs-power-close").addEventListener("click", () => {
    overlay.style.display = "none";
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.style.display = "none";
  });
  document.getElementById("hs-power-save").addEventListener("click", () => {
    const s = document.getElementById("hs-power-shutdown").value;
    const w = document.getElementById("hs-power-wake").value;
    const msg = document.getElementById("hs-power-msg");
    msg.textContent = "Salvando...";
    powerFetch(BASE + "/api/v1/power", {
      method: "PUT",
      body: JSON.stringify({ shutdown: s, wake: w, enabled: true }),
    })
      .then((d) => {
        msg.textContent = "✓ Agendado para " + d.shutdown + " — " + d.wake;
        setTimeout(() => { overlay.style.display = "none"; }, 1500);
      })
      .catch((e) => { msg.textContent = "Erro: " + e.message; });
  });
  document.getElementById("hs-power-disable").addEventListener("click", () => {
    const msg = document.getElementById("hs-power-msg");
    msg.textContent = "Desativando...";
    powerFetch(BASE + "/api/v1/power", {
      method: "PUT",
      body: JSON.stringify({ enabled: false }),
    })
      .then((d) => {
        msg.textContent = d.enabled ? "✗ Falhou" : "✓ Desativado";
        setTimeout(() => { overlay.style.display = "none"; }, 1500);
      })
      .catch((e) => { msg.textContent = "Erro: " + e.message; });
  });

  /* Cria o botão quando o seletor de modos estiver pronto */
  function boot() {
    ensurePowerButton();
    setTimeout(ensurePowerButton, 500);
    setTimeout(ensurePowerButton, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
