/* ==========================================================
   HomeServer — custom.js v3 (portal com tabs nativas)
   Especificação: DESIGN.md · ADR-005 (docs/design/)
   v3: seletor de modos e rodapé custom removidos (tabs nativas
   + rodapé nativo tematizado); Power Editor abre pelo card
   Agendamentos (âncora #power-schedule).
   ========================================================== */

(() => {
  /* ---------- Toast de feedback ---------- */
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

  /* Abre o Power Editor a partir do card "Agendamentos"
     (tab Administração — âncora id="power-schedule"). */
  function wirePowerCard() {
    const card =
      document.getElementById("power-schedule") ||
      [...document.querySelectorAll(".service-card")].find((c) =>
        /Agendamentos/i.test(c.textContent || "")
      );
    if (!card || card.dataset.hsPowerWired) return;
    card.dataset.hsPowerWired = "1";
    const link = card.querySelector("a");
    const target = link || card;
    if (!link) card.style.cursor = "pointer";
    target.addEventListener("click", (e) => {
      e.preventDefault();
      window.hsOpenPower();
    });
  }

  function init() {
    wirePowerCard();
  }

  function watch() {
    const target = document.getElementById("__next") || document.body;
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(".services-group .service-group-name").length > 0) {
        attachClickFeedback();
        wirePowerCard();
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
 * Power Schedule Editor (preservado da v1; visual via custom.css)
 * ────────────────────────── */
(() => {
  const BASE =
    window.location.hostname === "homeserver.local"
      ? ""
      : `http://${window.location.hostname}:8000`;

  function powerFetch(url, opts) {
    return fetch(url, {
      ...opts,
      headers: { "Content-Type": "application/json", ...opts?.headers },
    }).then((r) => r.json()).then((b) => (b && b.data ? b.data : b));
  }

  /* Overlay modal */
  const overlay = document.createElement("div");
  overlay.id = "hs-power-modal";
  overlay.style.cssText =
    "display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:3000;align-items:center;justify-content:center;";
  overlay.innerHTML = `
    <div style="padding:24px;min-width:280px;font-size:.9rem;">
      <h3 style="margin:0 0 16px;font-size:1rem;">Agendamento Automático</h3>
      <label style="display:block;margin-bottom:4px;">Desligar</label>
      <input type="time" id="hs-power-shutdown" value="23:30"
        style="width:100%;padding:6px 10px;margin-bottom:12px;">
      <label style="display:block;margin-bottom:4px;">Ligar</label>
      <input type="time" id="hs-power-wake" value="07:00"
        style="width:100%;padding:6px 10px;margin-bottom:16px;">
      <div style="display:flex;gap:8px;">
        <button id="hs-power-save" style="flex:1;padding:8px;border:none;cursor:pointer;">Salvar</button>
        <button id="hs-power-disable" style="flex:1;padding:8px;border:none;cursor:pointer;">Desativar</button>
        <button id="hs-power-close" style="flex:0;padding:8px 12px;border:none;cursor:pointer;">×</button>
      </div>
      <p id="hs-power-msg" style="margin:12px 0 0;font-size:.8rem;"></p>
    </div>`;
  document.body.appendChild(overlay);

  window.hsOpenPower = function () {
    powerFetch(BASE + "/api/v1/power").then((d) => {
      document.getElementById("hs-power-shutdown").value = d.shutdown || "23:30";
      document.getElementById("hs-power-wake").value = d.wake || "07:00";
    });
    overlay.style.display = "flex";
  };

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
        msg.textContent = "Agendado para " + d.shutdown + " — " + d.wake;
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
        msg.textContent = d.enabled ? "Falhou" : "Desativado";
        setTimeout(() => { overlay.style.display = "none"; }, 1500);
      })
      .catch((e) => { msg.textContent = "Erro: " + e.message; });
  });
})();
