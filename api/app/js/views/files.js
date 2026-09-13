/* ============================================================
 * HomeServer App — view: Arquivos (tela embutida do FileBrowser)
 * Auditoria UX 2026-09-13: "Abrir Arquivos" era uma aba externa.
 * Embed same-origin via Caddy (/files/*), custo zero no servidor:
 * o iframe carrega a UI do Quantum com a sessão própria dele.
 * Sem polling: apenas o toolbar de janela (recarregar/externo).
 * ============================================================ */

async function renderFiles() {
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Arquivos"));

  const head = el("div", { class: "embed-toolbar" },
    el("span", { class: "embed-caption" }, "FileBrowser — ", el("code", {}, "/srv/storage")),
    el("div", { class: "embed-actions" },
      button({
        label: " Recarregar", variant: "secondary", icon: "refresh",
        onClick: () => { frame.src = "/files/"; },
      }),
      el("a", {
        href: "/files/", target: "_blank", rel: "noopener",
        class: "btn btn-secondary",
      }, icon("download", "ic"), " Nova aba")));

  const frame = el("iframe", {
    class: "embed-frame",
    id: "files-frame",
    src: "/files/",
    title: "FileBrowser",
    loading: "lazy",
  });

  const wrap = el("div", { class: "embed-wrap" }, head, frame);
  v.appendChild(wrap);

  // altura = viewport menos o que já passou acima do iframe (o app-shell
  // reserva sidebar/topbar; CSS cuida do mínimo em telas pequenas)
  const fit = () => {
    if (!document.body.contains(frame)) { window.removeEventListener("resize", fit); return; }
    const top = wrap.getBoundingClientRect().top;
    frame.style.height = Math.max(420, window.innerHeight - top - 24) + "px";
  };
  fit();
  window.addEventListener("resize", fit);
}
