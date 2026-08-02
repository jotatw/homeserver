(() => {
  const MODES = [
    { id: "simple", label: "Simples", hide: ["Status", "Administração", "Sistema"] },
    { id: "admin", label: "Admin", hide: ["Sistema"] },
    { id: "maintenance", label: "Manutenção", hide: [] },
  ];

  const STORAGE_KEY = "hs_mode";

  function getMode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return MODES.some((m) => m.id === saved) ? saved : "simple";
  }

  function setActiveButton(modeId) {
    document.querySelectorAll(".hs-mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === modeId);
    });
  }

  function applyMode(modeId) {
    const mode = MODES.find((m) => m.id === modeId) || MODES[0];
    localStorage.setItem(STORAGE_KEY, mode.id);

    document.querySelectorAll(".services-group").forEach((group) => {
      const h2 = group.querySelector(".service-group-name");
      if (!h2) return;
      const name = (h2.textContent || "").trim();
      group.style.display = mode.hide.includes(name) ? "none" : "";
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

  // Observable: aplica o modo sempre que novos grupos surgirem no DOM
  function watch() {
    const target = document.getElementById("__next") || document.body;

    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(".services-group .service-group-name").length > 0) {
        applyMode(getMode());
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