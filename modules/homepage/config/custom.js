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
    let toast = document.getElementById('hs-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hs-toast';
      toast.className = 'hs-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1200);
  }

  function attachClickFeedback() {
    document.querySelectorAll('.service-card a[href]').forEach((a) => {
      if (a.dataset.hsFeedback) return;
      a.dataset.hsFeedback = '1';
      a.addEventListener('click', () => showToast('Abrindo...'));
    });
  }

  /* ---------- Power Editor ---------- */
  function wirePowerCard() {
    const card =
      document.getElementById('power-schedule') ||
      [...document.querySelectorAll('.service-card')].find((c) =>
        /Agendamentos/i.test(c.textContent || '')
      );
    if (!card || card.dataset.hsPowerWired) return;
    card.dataset.hsPowerWired = '1';
    const link = card.querySelector('a');
    const target = link || card;
    if (!link) card.style.cursor = 'pointer';
    target.addEventListener('click', (e) => {
      e.preventDefault();
      window.hsOpenPower();
    });
  }

  function init() {
    wirePowerCard();
  }

  function watch() {
    const target = document.getElementById('__next') || document.body;
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll('.services-group .service-group-name').length > 0) {
        attachClickFeedback();
        wirePowerCard();
      }
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      watch();
    });
  } else {
    init();
    watch();
  }
})();

/* ──────────────────────────
 * Power Schedule — visualização somente-leitura (portal)
 * A escrita (PUT /api/v1/power) é admin-only e exige sessão do App;
 * o portal não autentica, então o modal mostra o estado atual e
 * orienta gerenciar pelo App. (ADR-0010)
 * ────────────────────────── */
(() => {
  const overlay = document.createElement('div');
  overlay.id = 'hs-power-modal';
  overlay.style.cssText =
    'display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:3000;align-items:center;justify-content:center;';
  overlay.innerHTML = `
    <div style="padding:24px;min-width:280px;font-size:.9rem;">
      <h3 style="margin:0 0 16px;font-size:1rem;">Agendamento Automático</h3>
      <div id="hs-power-rows" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;"><span>Desligar</span><b id="hs-power-shutdown">—</b></div>
        <div style="display:flex;justify-content:space-between;"><span>Ligar</span><b id="hs-power-wake">—</b></div>
        <div style="display:flex;justify-content:space-between;"><span>Ativo</span><b id="hs-power-enabled">—</b></div>
      </div>
      <p style="margin:0 0 16px;font-size:.8rem;opacity:.7;">Para alterar os horários, use o App (Hermes Remote) — a edição exige login de administrador.</p>
      <div style="display:flex;justify-content:flex-end;">
        <button id="hs-power-close" style="padding:8px 16px;border:none;cursor:pointer;">Fechar</button>
      </div>
      <p id="hs-power-msg" style="margin:12px 0 0;font-size:.8rem;"></p>
    </div>`;
  document.body.appendChild(overlay);

  window.hsOpenPower = function () {
    overlay.style.display = 'flex';
    const msg = document.getElementById('hs-power-msg');
    msg.textContent = 'Carregando...';
    /* GET anônimo: o Caddy injeta o token de serviço em /api/v1/power/status */
    fetch('/api/v1/power/status', { headers: { Accept: 'application/json' } })
      .then((r) => r.json())
      .then((b) => {
        const d = b && b.data ? b.data : b;
        document.getElementById('hs-power-shutdown').textContent = d.shutdown || '—';
        document.getElementById('hs-power-wake').textContent = d.wake || '—';
        document.getElementById('hs-power-enabled').textContent = d.enabled ? 'Sim' : 'Não';
        msg.textContent = '';
      })
      .catch(() => { msg.textContent = 'Não foi possível carregar o agendamento.'; });
  };

  document.getElementById('hs-power-close').addEventListener('click', () => {
    overlay.style.display = 'none';
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
})();
