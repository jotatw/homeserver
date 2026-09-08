/* ============================================================
 * HomeServer App — view: Administração
 * Extraída de app.js (split 2026-09-07). Padrão globals:
 * depende de el()/icon()/button()/api()/toast() em runtime.
 * ============================================================ */

/* ---------- Administração (admin) ---------- */

/* ---------- Administração (em abas) ---------- */

let adminActiveTab = "users";

function adminTabBar() {
  const tabs = [
    ["users", "Usuários", "user"],
    ["tokens", "Tokens", "key"],
    ["modules", "Módulos", "box"],
    ["updates", "Atualizações", "download"],
  ];
  const bar = el("div", { class: "admin-tabs", role: "tablist", "aria-label": "Seções da administração" });
  tabs.forEach(([id, label, ic]) => {
    const b = el("button", {
      class: "admin-tab" + (adminActiveTab === id ? " active" : ""),
      role: "tab",
      "aria-selected": String(adminActiveTab === id),
      "data-tab": id,
    }, icon(ic, "ic"), el("span", {}, label));
    b.addEventListener("click", () => {
      if (adminActiveTab === id) return;
      adminActiveTab = id;
      renderAdmin();
    });
    bar.appendChild(b);
  });
  return bar;
}

async function renderAdmin() {
  // Carrega só os dados da aba ativa — menos requisições por troca de aba
  if (adminActiveTab === "users") return renderAdminUsers();
  if (adminActiveTab === "tokens") return renderAdminTokens();
  if (adminActiveTab === "modules") return renderAdminModules();
  if (adminActiveTab === "updates") return renderAdminUpdates();
}

async function renderAdminUsers() {
  const [users] = await Promise.all([api("/api/v1/users")]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Administração"));
  v.appendChild(adminTabBar());

  const createUserBtn = el("button", { class: "btn btn-primary", style: "margin-bottom:var(--hs-space-3)" },
    icon("plus", "ic"), " Novo usuário");
  createUserBtn.addEventListener("click", openUserDialog);
  v.appendChild(createUserBtn);

  if (users && users.length) {
    const cards = el("div", { class: "feed" });
    users.forEach((u) => {
      const card = el("div", { class: "feed-item" },
        el("div", { class: "module-meta" },
          el("div", { class: "app-name" },
            el("strong", {}, u.username || u.id),
            u.perm && u.perm.admin ? el("span", { class: "badge ok", style: "margin-left:var(--hs-space-2)" }, "Admin") : el("span", { class: "badge", style: "margin-left:var(--hs-space-2)" }, "padrão")),
          el("div", { class: "app-host" }, u.perm && u.perm.scope ? "/" + u.perm.scope : "/")),
        el("div", { class: "module-ops" },
          el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Senha"),
          (u.username || u.id) !== auth.user.username ? el("button", { class: "btn btn-danger", style: "height:var(--hs-touch-compact)" }, "Excluir") : null));
      cards.appendChild(card);
      // Bind buttons after append
      const pwBtn = card.querySelector(".btn-secondary");
      if (pwBtn) pwBtn.addEventListener("click", () => openPasswordDialog(u.username || u.id));
      const rmBtn = card.querySelector(".btn-danger");
      if (rmBtn) rmBtn.addEventListener("click", () => confirmDeleteUser(u.username || u.id));
    });
    v.appendChild(cards);
  } else {
    v.appendChild(el("p", { class: "empty" }, "Nenhum usuário encontrado."));
  }
}

async function renderAdminTokens() {
  const tokens = await api("/api/v1/tokens");
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Administração"));
  v.appendChild(adminTabBar());

  const createBtn = el("button", { class: "btn btn-primary", style: "margin-bottom:var(--hs-space-3)" },
    icon("plus", "ic"), " Novo token");
  createBtn.addEventListener("click", () => openTokenDialog());
  v.appendChild(createBtn);

  const cards = el("div", { class: "feed" });
  if (tokens && tokens.length) {
    tokens.forEach((tk) => {
      const card = el("div", { class: "feed-item" },
        el("div", { class: "module-meta" },
          el("div", { class: "app-name" },
            el("strong", {}, tk.name),
            el("span", { class: "badge", style: "margin-left:var(--hs-space-2)" }, tk.lastUsedAt ? "usado" : "novo")),
          el("div", { class: "app-host" }, tk.prefix + "…")),
        el("div", { class: "module-ops" },
          el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Revogar")));
      cards.appendChild(card);
      const revBtn = card.querySelector(".btn-secondary");
      if (revBtn) revBtn.addEventListener("click", async () => {
        if (!confirm("Revogar o token \"" + tk.name + "\"?")) return;
        try {
          await apiOrFail("/api/v1/tokens/" + tk.id, { method: "DELETE" });
          toast("Token revogado.", "success");
          renderAdmin();
        } catch (_) {}
      });
    });
  } else {
    cards.appendChild(el("div", { class: "feed-item" }, "Nenhum token criado."));
  }
  v.appendChild(cards);
}

async function renderAdminModules() {
  const [mods, instances] = await Promise.all([
    api("/api/v1/modules"),
    api("/api/v1/modules/instances"),
  ]);
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Administração"));
  v.appendChild(adminTabBar());

  const cards = el("div", { class: "feed" });
  if (mods && mods.length) {
    const instMap = {};
    (instances || []).forEach((i) => { instMap[i.definition] = i; });
    mods.forEach((m) => {
      const active = Boolean(instMap[m.id]);
      const ops = m.operations || [];
      const labels = { start: "Iniciar", stop: "Parar", restart: "Reiniciar", enable: "Ativar", disable: "Desativar", update: "Atualizar", status: "Status" };
      const primaryOp = active ? (ops.includes("stop") ? "stop" : null) : (ops.includes("start") ? "start" : null);
      const rest = ops.filter((op) => op !== primaryOp);

      const card = el("div", { class: "feed-item module-row" },
        el("div", { class: "module-meta" },
          el("div", { class: "app-name" },
            el("strong", {}, m.title || m.id),
            active ? el("span", { class: "badge ok", style: "margin-left:var(--hs-space-2)" }, "ativa") : el("span", { class: "badge", style: "margin-left:var(--hs-space-2)" }, "ocioso")),
          el("div", { class: "app-host" }, m.id + " · v" + m.version)),
        el("div", { class: "module-ops" },
          primaryOp ? el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, labels[primaryOp]) : null,
          rest.length ? el("details", { class: "ops-menu" },
            el("summary", { class: "btn btn-secondary ops-menu-btn", "aria-label": "Mais operações de " + m.id }, icon("dots", "ic")),
            el("div", { class: "ops-pop" },
              ...rest.map((op) => {
                const b = el("button", { type: "button", class: "ops-pop-item" },
                  icon(({ start: "play", stop: "square", restart: "refresh", enable: "check", disable: "x", update: "download", status: "eye" }[op] || "dots"), "ic"),
                  el("span", {}, labels[op] || op));
                b.addEventListener("click", () => runModuleOp(m, op, b));
                return b;
              }))) : null));
      cards.appendChild(card);
      // Bind primary button
      if (primaryOp) {
        const btn = card.querySelector(".btn-secondary");
        if (btn) btn.addEventListener("click", () => runModuleOp(m, primaryOp, btn));
      }
    });
  } else {
    cards.appendChild(el("div", { class: "feed-item" }, "Nenhum módulo instalado."));
  }
  v.appendChild(cards);

  // Tarefas agendadas — mesma natureza de gestão que módulos
  v.appendChild(el("h3", { class: "section" }, "Tarefas agendadas"));
  const schedFeed = el("div", { class: "feed", id: "scheduler-feed" });
  v.appendChild(schedFeed);
  await refreshScheduler();
}

async function renderAdminUpdates() {
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Administração"));
  v.appendChild(adminTabBar());

  // Atualização do sistema
  const upBox = el("div", { class: "print-card" });
  const upBtn = el("button", { class: "btn btn-secondary", id: "up-check" },
    icon("refresh", "ic"), " Verificar atualização");
  const upStatus = el("p", { class: "power-hint", id: "up-status", style: "margin-top:var(--hs-space-2)" }, "");
  upBox.appendChild(upBtn);
  upBox.appendChild(upStatus);
  v.appendChild(upBox);

  upBtn.addEventListener("click", async () => {
    upBtn.disabled = true;
    upStatus.textContent = "Verificando…";
    try {
      const data = await apiOrFail("/api/v1/update");
      if (data.update) {
        upStatus.innerHTML = "Nova versão disponível: <strong>" + esc(data.latest) + "</strong> (atual: " + esc(data.current) + ")";
        const apply = el("button", { class: "btn btn-primary", style: "margin-top:var(--hs-space-2)" },
          icon("download", "ic"), " Aplicar atualização");
        apply.addEventListener("click", async () => {
          if (!confirm("Aplicar a atualização para " + data.latest + "?")) return;
          apply.disabled = true;
          apply.textContent = "Aplicando… (pode demorar)";
          try {
            await apiOrFail("/api/v1/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            });
            toast("Atualização aplicada.", "success");
            upStatus.textContent = "Atualizado para " + data.latest + ".";
          } catch (err) {
            toast(err.message || "Falha ao aplicar.", "error");
          } finally {
            apply.remove();
          }
        });
        upBox.appendChild(apply);
      } else {
        upStatus.textContent = "Você está atualizado (" + data.current + ").";
      }
    } catch (err) {
      upStatus.textContent = err.message || "Não foi possível verificar.";
    } finally {
      upBtn.disabled = false;
      upBtn.innerHTML = icon("refresh", "ic").outerHTML + " Verificar atualização";
    }
  });

  // Pacotes do sistema (apt) — fundido na aba Atualizações
  v.appendChild(el("h4", { class: "section", style: "margin-top:var(--hs-space-6)" }, "Pacotes do sistema"));
  const osBox = el("div", { class: "print-card" });
  const osBtn = el("button", { class: "btn btn-secondary", id: "up-os-check" },
    icon("toolbox", "ic"), " Verificar pacotes (apt)");
  const osStatus = el("p", { class: "power-hint", id: "up-os-status", style: "margin-top:var(--hs-space-2)" }, "");
  osBox.appendChild(osBtn);
  osBox.appendChild(osStatus);
  v.appendChild(osBox);

  osBtn.addEventListener("click", async () => {
    osBtn.disabled = true;
    osStatus.textContent = "Verificando…";
    try {
      const d = await apiOrFail("/api/v1/update/os");
      const reboot = d.reboot ? " · reinicialização pendente" : "";
      if (d.upgradable > 0) {
        osStatus.innerHTML = esc(d.upgradable) + " pacote(s) disponível(is)" + reboot + ".";
        const apply = el("button", { class: "btn btn-primary", style: "margin-top:var(--hs-space-2)" },
          icon("refresh", "ic"), " Atualizar pacotes");
        apply.addEventListener("click", async () => {
          if (!confirm("Atualizar todos os pacotes do sistema? Isso pode demorar.")) return;
          apply.disabled = true;
          apply.textContent = "Atualizando… (pode demorar)";
          try {
            const r = await apiOrFail("/api/v1/update/os", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: "{}",
            });
            toast("Pacotes atualizados.", "success");
            osStatus.innerHTML = "Atualizado." + (r.reboot ? " Recomenda-se reiniciar o servidor." : "");
          } catch (err) {
            toast(err.message || "Falha ao atualizar pacotes.", "error");
          } finally {
            apply.remove();
          }
        });
        osBox.appendChild(apply);
      } else {
        osStatus.textContent = "Sistema atualizado" + reboot + ".";
      }
    } catch (err) {
      osStatus.textContent = err.message || "Não foi possível verificar os pacotes.";
    } finally {
      osBtn.disabled = false;
    }
  });
}

/* ---------- Scheduler (admin) ---------- */

async function refreshScheduler() {
  try {
    const tasks = await api("/api/v1/scheduler");
    const sfeedEl = document.getElementById("scheduler-feed");
    if (!sfeedEl) return;
    sfeedEl.innerHTML = "";

    if (!tasks || !tasks.length) {
      sfeedEl.innerHTML = '<div class="feed-item">Nenhuma tarefa agendada.</div>';
      return;
    }

    tasks.forEach((t) => {
      const enabled = t.enabled;
      const meta = el("div", { class: "module-meta" },
        el("div", { class: "app-name" },
          t.name,
          el("span", { style: "margin-left:var(--hs-space-2)" },
            enabled ? badge("Ativa", "ok") : badge("Inativa", "warn"))),
        el("div", { class: "app-host" }, (t.schedule || "") + (t.next ? " · " + t.next : "")));

      const opsWrap = el("div", { class: "module-ops" });

      const enableBtn = el("button", { class: "btn " + (enabled ? "btn-secondary" : "btn-primary"), style: "height:var(--hs-touch-compact)" }, enabled ? "Desativar" : "Ativar");
      enableBtn.addEventListener("click", () => runSchedulerOp(t.name, enabled ? "disable" : "enable", enableBtn));
      opsWrap.appendChild(enableBtn);

      const runBtn = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Executar agora");
      runBtn.addEventListener("click", () => runSchedulerOp(t.name, "run", runBtn));
      opsWrap.appendChild(runBtn);

      const row = el("div", { class: "feed-item module-row" },
        el("span", { class: "status-dot " + (enabled ? "ok" : ""), "aria-hidden": "true" }),
        meta,
        opsWrap);
      sfeedEl.appendChild(row);
    });
  } catch (err) {
    const sfeedEl = document.getElementById("scheduler-feed");
    if (sfeedEl) sfeedEl.innerHTML = '<div class="feed-item error-msg">Falha ao carregar tarefas.</div>';
  }
}

async function runSchedulerOp(name, op, btn) {
  if (op === "disable" && !confirm("Desativar a tarefa " + name + "?")) return;
  if (btn) btn.disabled = true;
  try {
    await apiOrFail("/api/v1/scheduler/" + name + "/" + op, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    toast(name + ": " + op + " concluído.", "success");
    await refreshScheduler();
  } catch (err) {
    toast(err.message || "Falha em " + op + ".", "error");
    if (btn) btn.disabled = false;
  }
}

/* ---------- Dialog: senha de usuário (admin) ---------- */

function openPasswordDialog(username) {
  let dialog = document.getElementById("pass-dialog");
  if (!dialog) {
    dialog = el("dialog", { id: "pass-dialog" },
      el("form", { method: "dialog", id: "pass-form" },
        el("h3", { style: "margin-bottom:var(--hs-space-4)" }, "Nova senha"),
        el("div", { class: "field" },
          el("label", { for: "ps-user" }, "Usuário"),
          el("input", { id: "ps-user", disabled: "disabled" })),
        el("div", { class: "field" },
          el("label", { for: "ps-pass" }, "Nova senha"),
          el("input", { id: "ps-pass", type: "password", required: true })),
        el("div", { class: "dialog-actions" },
          el("button", { type: "button", class: "btn btn-secondary", id: "ps-cancel" }, "Cancelar"),
          el("button", { type: "submit", class: "btn btn-primary" }, "Salvar"))));
    document.body.appendChild(dialog);

    dialog.querySelector("#ps-cancel").addEventListener("click", () => dialog.close());
    dialog.querySelector("#pass-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const uname = document.getElementById("ps-user").value;
      const pass = document.getElementById("ps-pass").value;
      const btn = dialog.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        await apiOrFail("/api/v1/users/" + encodeURIComponent(uname), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pass }),
        });
        toast("Senha atualizada: " + uname, "success");
        dialog.close();
      } catch (err) {
        toast(err.message || "Falha ao alterar senha.", "error");
      } finally {
        btn.disabled = false;
      }
    });
  }

  document.getElementById("ps-user").value = username;
  document.getElementById("ps-pass").value = "";
  dialog.showModal();
}

function confirmDeleteUser(username) {
  const del = el("dialog", { id: "del-dialog" },
    el("h3", { style: "margin-bottom:var(--hs-space-3)" }, "Excluir usuário?"),
    el("p", { class: "power-hint" }, "Remover \"" + username + "\"? O usuário perderá o acesso."),
    el("label", { class: "check-row" },
      el("input", { id: "del-folder", type: "checkbox" }), " Também remover a pasta de arquivos (irreversível)"),
    el("div", { class: "dialog-actions" },
      el("button", { class: "btn btn-secondary", id: "del-cancel" }, "Cancelar"),
      el("button", { class: "btn btn-danger", id: "del-confirm" }, "Excluir")));
  document.body.appendChild(del);

  del.querySelector("#del-cancel").addEventListener("click", () => del.close());
  del.querySelector("#del-confirm").addEventListener("click", async () => {
    const folder = document.getElementById("del-folder").checked;
    const btn = del.querySelector("#del-confirm");
    btn.disabled = true;
    try {
      await apiOrFail("/api/v1/users/" + encodeURIComponent(username) + (folder ? "?folder=1" : ""), { method: "DELETE" });
      toast("Usuário removido: " + username, "success");
      del.close();
      renderAdmin();
    } catch (err) {
      toast(err.message || "Falha ao excluir.", "error");
      btn.disabled = false;
    }
  });
  del.showModal();
}

/* ---------- Dialog: criar usuário (admin) ---------- */

function openUserDialog() {
  let dialog = document.getElementById("user-dialog");
  if (!dialog) {
    dialog = el("dialog", { id: "user-dialog" },
      el("form", { method: "dialog", id: "user-form" },
        el("h3", { style: "margin-bottom:var(--hs-space-4)" }, "Novo usuário"),
        el("div", { class: "field" },
          el("label", { for: "us-name" }, "Usuário"),
          el("input", { id: "us-name", placeholder: "ex.: usuario", pattern: "[a-z][a-z0-9_-]{1,30}", required: true })),
        el("div", { class: "field" },
          el("label", { for: "us-pass" }, "Senha"),
          el("input", { id: "us-pass", type: "password", required: true })),
        el("div", { class: "field" },
          el("label", { for: "us-email" }, "E-mail (opcional)"),
          el("input", { id: "us-email", type: "email", placeholder: "usuario@example.com" })),
        el("label", { class: "check-row" },
          el("input", { id: "us-gitea", type: "checkbox" }), " Criar também no Gitea"),
        el("p", { class: "power-hint" }, "A pasta pessoal /srv/storage/users/<nome> é criada automaticamente."),
        el("div", { class: "dialog-actions" },
          el("button", { type: "button", class: "btn btn-secondary", id: "us-cancel" }, "Cancelar"),
          el("button", { type: "submit", class: "btn btn-primary" }, "Criar"))));
    document.body.appendChild(dialog);

    dialog.querySelector("#us-cancel").addEventListener("click", () => dialog.close());
    dialog.querySelector("#user-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("us-name").value.trim();
      const password = document.getElementById("us-pass").value;
      const email = document.getElementById("us-email").value.trim();
      const gitea = document.getElementById("us-gitea").checked;
      const btn = dialog.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Criando…";
      try {
        await apiOrFail("/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email: email || undefined, gitea }),
        });
        toast("Usuário criado: " + username, "success");
        dialog.close();
        renderAdmin();
      } catch (err) {
        toast(err.message || "Falha ao criar usuário.", "error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Criar";
      }
    });
  }

  document.getElementById("us-name").value = "";
  document.getElementById("us-pass").value = "";
  document.getElementById("us-email").value = "";
  document.getElementById("us-gitea").checked = false;
  dialog.showModal();
}

/* ---------- Dialog: criar token de API (admin) ---------- */

function openTokenDialog() {
  let dialog = document.getElementById("token-dialog");
  if (!dialog) {
    dialog = el("dialog", { id: "token-dialog" },
      el("form", { method: "dialog", id: "token-form" },
        el("h3", { style: "margin-bottom:var(--hs-space-4)" }, "Criar token de API"),
        el("div", { class: "field" },
          el("label", { for: "tk-name" }, "Nome"),
          el("input", { id: "tk-name", placeholder: "ex.: homepage-widget", required: true })),
        el("p", { class: "power-hint" }, "Use como Authorization: Bearer <token>. O token é exibido uma única vez."),
        el("div", { class: "dialog-actions" },
          el("button", { type: "button", class: "btn btn-secondary", id: "tk-cancel" }, "Cancelar"),
          el("button", { type: "submit", class: "btn btn-primary" }, "Criar"))));
    document.body.appendChild(dialog);

    dialog.querySelector("#tk-cancel").addEventListener("click", () => dialog.close());
    dialog.querySelector("#token-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("tk-name").value.trim();
      const saveBtn = dialog.querySelector('button[type="submit"]');
      saveBtn.disabled = true;
      saveBtn.textContent = "Criando…";
      try {
        const data = await apiOrFail("/api/v1/tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        dialog.close();
        showCreatedToken(data);
        renderAdmin();
      } catch (_) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Criar";
      }
    });
  }

  document.getElementById("tk-name").value = "";
  dialog.showModal();
}

function showCreatedToken(data) {
  let dialog = document.getElementById("token-created");
  if (!dialog) {
    dialog = el("dialog", { id: "token-created" },
      el("h3", { style: "margin-bottom:var(--hs-space-3)" }, "Token criado"),
      el("p", { class: "power-hint" }, "Copie agora — não será exibido novamente."),
      el("code", { class: "token-code", id: "token-value" }),
      el("div", { class: "dialog-actions" },
        el("button", { type: "button", class: "btn btn-primary", id: "tk-done" }, "Entendido")));
    document.body.appendChild(dialog);
    dialog.querySelector("#tk-done").addEventListener("click", () => dialog.close());
  }
  document.getElementById("token-value").textContent = data.token;
  dialog.showModal();
}
