(() => {
  const MODES = [
    {
      id: "user",
      label: "Usuário",
      groups: ["Favoritos", "Arquivos", "Projetos", "Downloads", "Mídia"],
    },
    {
      id: "admin",
      label: "Administrador",
      groups: ["Favoritos", "Arquivos", "Projetos", "Downloads", "Mídia", "Serviços", "Gestão"],
    },
    {
      id: "system",
      label: "Sistema",
      groups: ["Arquivos", "Projetos", "Downloads", "Mídia", "Serviços", "Gestão", "Manutenção"],
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
    });

    setActiveButton(mode.id);
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
    applyMode(getMode());
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
  if (document.getElementById("hs-power-btn")) return;

  const BASE = "http://192.168.1.10:8000";

  function powerFetch(url, opts) {
    return fetch(url, {
      ...opts,
      headers: { "Content-Type": "application/json", ...opts?.headers },
    }).then((r) => r.json());
  }

  /* Botão ⚡ no seletor de modo */
  const btn = document.createElement("button");
  btn.id = "hs-power-btn";
  btn.className = "hs-mode-btn";
  btn.textContent = "⚡";
  btn.title = "Agendamento liga/desliga";
  document.querySelector(".hs-mode-selector")?.appendChild(btn);

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

  /* Eventos */
  btn.addEventListener("click", () => {
    powerFetch(BASE + "/api/v1/power").then((d) => {
      document.getElementById("hs-power-shutdown").value = d.shutdown || "23:30";
      document.getElementById("hs-power-wake").value = d.wake || "07:00";
    });
    overlay.style.display = "flex";
  });
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
})();
