/* ============================================================
 * HomeServer App — view: Armazenamento e dispositivos
 * Extraída de app.js (split 2026-09-07). Padrão globals:
 * depende de el()/icon()/button()/api()/toast() em runtime.
 * ============================================================ */

/* ---------- Armazenamento (Fase 1: painel de uso) ---------- */

async function renderStorage() {
  const [st, status, devices] = await Promise.all([
    api("/api/v1/storage"),
    api("/api/v1/status"),
    api("/api/v1/devices"),
  ]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  // 1. Disco principal
  const disk = status.disk || {};
  v.appendChild(el("h3", { class: "section" }, "Disco principal"));
  const grid = el("div", { class: "grid" });
  grid.appendChild(statCard("Disco", (disk.percent ?? 0) + "%", disk.percent ?? 0));
  grid.appendChild(statCard("Usado", human(disk.used || 0), 0));
  grid.appendChild(statCard("Disponível", human(disk.available || 0), 0));
  grid.appendChild(statCard("Total", human(disk.total || 0), 0));
  v.appendChild(grid);

  // 2. Raiz de dados
  v.appendChild(el("h3", { class: "section" }, "Dados"));
  const dados = el("div", { class: "feed" });
  dados.appendChild(feedRow("folder", "Raiz de dados", st.root || "—"));
  dados.appendChild(feedRow("harddrive", "Total em /srv/storage", st.total_size_human || "—"));
  dados.appendChild(feedRow("check", "Pronto", st.ready ? "Sim" : "Não"));
  v.appendChild(dados);

  // 3. Pastas por usuário (contagem + tamanho em disco, quando houver)
  v.appendChild(el("h3", { class: "section" }, "Pastas"));
  const folders = [
    ["user", "Usuários", st.users ?? 0, st.users_size_human],
    ["users", "Compartilhado", st.shared ?? 0, st.shared_size_human],
    ["film", "Mídia", st.media ?? 0, st.media_size_human],
    ["filetext", "Documentos", st.documents ?? 0, st.documents_size_human],
    // Conta subpastas da árvore de armazenamento (usb/sdcard), NÃO
    // dispositivos conectados agora — os conectados são a seção abaixo.
    ["plug", "Pastas de dispositivos", st.devices ?? 0, st.devices_size_human],
  ];
  const fgrid = el("div", { class: "grid" });
  folders.forEach(([iconName, label, value, sizeHuman]) =>
    fgrid.appendChild(el("div", { class: "app-card" },
      icon(iconName, "ic"),
      el("span", { class: "app-name" }, label),
      el("span", { class: "app-host" },
        value + (value === 1 ? " pasta" : " pastas") +
        (value > 0 && sizeHuman && sizeHuman !== "0 B" ? " · " + sizeHuman : "")))));
  v.appendChild(fgrid);

  // 4. Dispositivos conectados — descoberta automática (montados ou não)
  v.appendChild(el("h3", { class: "section" }, "Dispositivos"));
  await renderDevicesSection(devices);

  // 5. Navegação de arquivos (FileBrowser)
  v.appendChild(el("div", { class: "empty", style: "padding-top: var(--hs-space-8)" },
    icon("folder", "empty-icon"),
    "Os arquivos são gerenciados pelo FileBrowser.",
    el("br", {}),
    el("a", { href: "/files/", target: "_blank" }, "Abrir Arquivos →")));
}

/* ---------- Dispositivos (descoberta + 1 clique) ---------- */

async function renderDevicesSection(mountedDevices) {
  const wrap = el("div");
  const v = document.getElementById("view");
  v.appendChild(wrap);

  const feed = el("div", { class: "feed", id: "devices-feed" });
  wrap.appendChild(feed);

  let available = [];
  if (auth.isAdmin()) {
    try {
      available = await api("/api/v1/devices/available");
    } catch (_) { /* segue com montados apenas */ }
  }

  // Índice de removíveis por mountpoint para cruzar com montados
  const availByMp = {};
  available.forEach((d) => {
    if (d.mountpoint) availByMp[d.mountpoint] = d;
  });

  // --- Removíveis NÃO montados: Conectar com 1 clique ---
  const unmounted = available.filter((d) => !d.mounted);
  if (unmounted.length) {
    feed.appendChild(el("div", { class: "feed-item", style: "background:var(--hs-color-info-soft);font-size:.85rem" },
      icon("zap"), el("span", {}, "Prontos para conectar")));
    unmounted.forEach((d) => {
      const row = el("div", { class: "feed-item module-row" },
        icon("plug"),
        el("div", { class: "module-meta" },
          el("div", { class: "app-name" }, d.label),
          el("div", { class: "app-host" },
            `${d.size} · ${d.fstype || "fs?"} · ${d.model || d.transport}`)));
      if (auth.isAdmin()) {
        const act = el("span", { class: "device-actions" });
        const btn = el("button", { class: "btn btn-primary", style: "height:var(--hs-touch-compact)" }, "Conectar");
        btn.addEventListener("click", async () => {
          btn.disabled = true;
          btn.textContent = "Conectando…";
          try {
            await apiOrFail("/api/v1/devices/mount", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: d.type, label: d.label, device: d.device }),
            });
            toast(`${d.label} conectado.`, "success");
            renderStorage();
          } catch (err) {
            toast(err.message || "Falha ao conectar.", "error");
            btn.disabled = false;
            btn.textContent = "Conectar";
          }
        });
        act.appendChild(btn);
        // Formatar (apenas disco inteiro, ex.: sdb — não sdb1)
        if (!/[0-9]+$/.test(d.device)) {
          const fmtBtn = el("button", { class: "btn btn-secondary btn-danger-ghost", style: "height:var(--hs-touch-compact)" }, "Formatar");
          fmtBtn.addEventListener("click", async () => {
            if (!confirm(`Formatar ${d.device} (${d.label})?`)) return;
            if (!confirm(`APAGARÁ TODOS OS DADOS de ${d.device}. Tem certeza?`)) return;
            fmtBtn.disabled = true;
            fmtBtn.textContent = "Formatando…";
            try {
              await apiOrFail("/api/v1/devices/format", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ device: d.device }),
              });
              toast(`${d.device} formatado (FAT32).`, "success");
              renderStorage();
            } catch (err) {
              toast(err.message || "Falha ao formatar.", "error");
              fmtBtn.disabled = false;
              fmtBtn.textContent = "Formatar";
            }
          });
          act.appendChild(fmtBtn);
        }
        row.appendChild(act);
      }
      feed.appendChild(row);
    });
  }

  // --- Montados ---
  if (mountedDevices && mountedDevices.length) {
    mountedDevices.forEach((d) => {
      const extra = availByMp[d.mountpoint] || {};
      const sizeUsed = human(Number(d.size || 0));
      const modelInfo = extra.model ? ` · ${extra.model}` : "";
      const managed = d.managed !== false;

      const row = el("div", { class: "feed-item module-row" },
        el("span", { class: "status-dot ok" }),
        el("div", { class: "module-meta" },
          el("div", { class: "app-name" }, d.label),
          el("div", { class: "app-host" },
            `${(d.type || "").toUpperCase()}${sizeUsed !== "0 B" ? " · " + sizeUsed : ""}${modelInfo} · ${d.mountpoint}${managed ? "" : " · fora da pasta gerenciada"}`)));

      if (auth.isAdmin()) {
        const act = el("span", { class: "device-actions" });

        // Abrir arquivos (rota /files/ via Caddy — HTTPS) — só gerenciados
        if (managed) {
          const openLink = el("a", {
            href: "/files/",
            target: "_blank",
            class: "btn btn-secondary", style: "height:var(--hs-touch-compact);text-decoration:none",
          }, "Abrir");
          act.appendChild(openLink);
        }

        // Ejetar (seguro p/ pendrive/SD): desmonta + ejeta em um clique
        if (extra.device) {
          const ejBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Ejetar");
          ejBtn.addEventListener("click", async () => {
            if (!confirm(`Ejetar ${d.label}? Aguarde o LED apagar antes de remover.`)) return;
            ejBtn.disabled = true;
            ejBtn.textContent = "…";
            try {
              await apiOrFail("/api/v1/devices/unmount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: d.type, label: d.label }),
              });
              try {
                await apiOrFail("/api/v1/devices/eject", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ device: extra.device }),
                });
                toast(`${d.label} pode ser removido com segurança.`, "success");
              } catch (ejectErr) {
                // eject é best-effort (alguns HDs externos não suportam)
                // o desmontamento já foi feito com segurança
                console.warn("Falha ao ejectar dispositivo (mas desmontamento OK):", ejectErr);
                toast(`${d.label} desmontado com segurança. Eject falhou (normal para alguns dispositivos).`, "warning");
              }
              renderStorage();
            } catch (err) {
              toast(err.message || "Falha ao ejetar.", "error");
              ejBtn.disabled = false;
              ejBtn.textContent = "Ejetar";
            }
          });
          act.appendChild(ejBtn);
        }

        // Desmontar (sem eject — HD externo que fica conectado) — só gerenciados
        if (managed) {
          const umBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Desmontar");
          umBtn.addEventListener("click", async () => {
            if (!confirm(`Desmontar ${d.label}?`)) return;
            umBtn.disabled = true;
            umBtn.textContent = "…";
            try {
              await apiOrFail("/api/v1/devices/unmount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: d.type, label: d.label }),
              });
              toast(`${d.label} desmontado.`, "success");
              renderStorage();
            } catch (err) {
              toast(err.message || "Falha ao desmontar.", "error");
              umBtn.disabled = false;
              umBtn.textContent = "Desmontar";
            }
          });
          act.appendChild(umBtn);
        }

        row.appendChild(act);
      }
      feed.appendChild(row);
    });
  } else if (!unmounted.length) {
    feed.appendChild(el("div", { class: "feed-item" }, "Nenhum dispositivo conectado."));
  }

  // Dialog manual continua disponível como fallback avançado
  if (auth.isAdmin()) {
    const adv = el("details", { class: "ops-menu", style: "margin-top:var(--hs-space-2)" },
      el("summary", { class: "btn btn-secondary", style: "width:auto;height:var(--hs-touch-compact)" },
        icon("toolbox", "ic"), " Montagem manual (avançado)"));
    adv.addEventListener("toggle", () => { if (adv.open && !adv.dataset.ready) { adv.dataset.ready = "1"; openMountDialog(); adv.open = false; } });
    wrap.appendChild(adv);
  }
}
