/* ============================================================
 * HomeServer App — view: Aplicações
 * Extraída de app.js (split 2026-09-07). Padrão globals:
 * depende de el()/icon()/button()/api()/toast() em runtime.
 * ============================================================ */

/* ---------- Aplicações ---------- */

const APP_MAP = {
  homepage: { title: "Homepage", host: "/", icon: "home" },
  api: { title: "HomeServer App", host: "/app", icon: "monitor" },
  files: { title: "Arquivos (FileBrowser)", host: "/files/", icon: "folder" },
  gitea: { title: "Gitea", host: "/git/", icon: "code" },
  caddy: { title: "Proxy (Caddy)", host: "", icon: "shield" },
  portainer: { title: "Portainer", host: "", icon: "layers" },
};

/** Retorna os metadados amigáveis de um serviço, derivando do APP_MAP estático
 *  ou gerando dinamicamente para novos serviços/módulos não mapeados. */
function getAppMeta(s) {
  if (!s) return { title: "Aplicação", host: "", icon: "box" };
  const known = APP_MAP[s.name];
  if (known) return known;

  // Fallback dinâmico gracioso
  const title = s.title || s.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let icon = "box";
  const n = s.name.toLowerCase();
  if (n.includes("media") || n.includes("jelly") || n.includes("plex")) icon = "monitor";
  else if (n.includes("net") || n.includes("dns") || n.includes("pihole")) icon = "shield";
  else if (n.includes("store") || n.includes("drive") || n.includes("cloud")) icon = "folder";
  else if (n.includes("db") || n.includes("sql") || n.includes("postgres")) icon = "database";

  const host = s.url || s.host || (s.port ? "http://" + window.location.hostname + ":" + s.port : "");
  return { title, host, icon };
}

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
  [["all", "Todos"], ["running", "Ativos", "ok"], ["down", "Offline", "danger"]].forEach(([key, label, cls]) => {
    const chip = el("button", { class: "chip" + (key === "all" ? " active" : ""), "data-filter": key },
      cls ? el("span", { class: "chip-dot " + cls }, "") : null,
      el("span", {}, label));
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
      .filter((s) => matches(s, getAppMeta(s)))
      .sort((a, b) => (a.status === "running" ? -1 : 1) - (b.status === "running" ? -1 : 1));

    if (!list.length) {
      grid.appendChild(el("p", { class: "empty" },
        "Nenhuma aplicação encontrada para \"" + state.query + "\"",
        el("br", {}),
        el("button", { class: "btn btn-secondary", style: "margin-top:var(--hs-space-2)" }, "Limpar busca")));
      return;
    }

    list.forEach((s) => {
      const meta = getAppMeta(s);
      const up = s.status === "running";
      const st = serviceState(s.status);
      const card = el("div", { class: "app-card" },
        icon(meta.icon, "ic"),
        statusDot(st),
        el("span", { class: "app-name" }, meta.title),
        el("span", { class: "app-host" }, st.label));

      if (meta.host && up) {
        card.addEventListener("click", () => window.open(meta.host, "_blank"));
        card.style.cursor = "pointer";
      }

      // Controle de serviços (admin) — casa canônica: Aplicações
      if (auth.isAdmin()) {
        const ops = el("div", { class: "app-card-ops" });
        if (up) {
          const stopBtn = el("button", {
            class: "btn btn-secondary", style: "height:var(--hs-touch-compact)",
            title: "Parar " + (meta.title || s.name),
          }, "Parar");
          stopBtn.addEventListener("click", (e) => { e.stopPropagation(); runServiceOp(s.name, "stop", stopBtn); });
          ops.appendChild(stopBtn);
        } else {
          const startBtn = el("button", {
            class: "btn btn-primary", style: "height:var(--hs-touch-compact)",
            title: "Iniciar " + (meta.title || s.name),
          }, "Iniciar");
          startBtn.addEventListener("click", (e) => { e.stopPropagation(); runServiceOp(s.name, "start", startBtn); });
          ops.appendChild(startBtn);
        }
        card.appendChild(ops);
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
