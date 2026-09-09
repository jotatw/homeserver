/* ============================================================
 * HomeServer App — Auth (v3.1 · Security Hardening S5)
 * Contrato: {ok, data:{user:{username, admin}, expiresIn}}
 *
 * Token em sessionStorage: sobrevive ao reload da aba (o redirect
 * pós-login é uma navegação completa que zera a memória JS) e morre
 * ao fechar a aba — sem persistência de 30d como o localStorage.
 * ============================================================ */

const HS_SESSION_KEY = "hs_session";

function _loadSession() {
  try {
    const raw = sessionStorage.getItem(HS_SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !s.token) return null;
    return s;
  } catch (_) {
    return null;
  }
}

function _saveSession(token, expiresAt) {
  try {
    sessionStorage.setItem(HS_SESSION_KEY, JSON.stringify({ token, expiresAt }));
  } catch (_) {}
}

function _clearSession() {
  auth.token = "";
  auth.user = null;
  auth.expiresAt = 0;
  try {
    sessionStorage.removeItem(HS_SESSION_KEY);
    // Limpa token legado do localStorage (versões anteriores ao S5).
    localStorage.removeItem("hs_token");
  } catch (_) {}
}

const _boot = _loadSession();

const auth = {
  token: _boot ? _boot.token : "",
  user: null,
  expiresAt: _boot ? _boot.expiresAt : 0,

  async login(username, password) {
    const r = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const body = await r.json();
    if (!r.ok) throw new Error(body.error || "Erro ao autenticar.");

    this.token = body.data.token;
    this.user = {
      username: body.data.user.username,
      admin: body.data.user.admin,
      role: body.data.user.admin ? "admin" : "user",
    };
    this.expiresAt = Date.now() + (body.data.expiresIn || 2592000) * 1000;
    _saveSession(this.token, this.expiresAt);

    return body.data;
  },

  async logout() {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: { Authorization: "Bearer " + this.token },
      });
    } catch (_) {}
    _clearSession();
  },

  isAdmin() {
    return this.user ? this.user.admin : false;
  },

  isExpired() {
    return !this.token || Date.now() >= this.expiresAt;
  },

  async check() {
    if (!this.token || this.isExpired()) {
      _clearSession();
      return false;
    }
    const r = await fetch("/api/v1/auth/session", {
      headers: { Authorization: "Bearer " + this.token },
    });
    if (!r.ok) {
      _clearSession();
      return false;
    }
    const body = await r.json();
    this.user = {
      username: body.data.user.username,
      admin: body.data.user.admin,
      role: body.data.user.admin ? "admin" : "user",
    };
    if (body.data.expiresIn) {
      this.expiresAt = Date.now() + body.data.expiresIn * 1000;
      _saveSession(this.token, this.expiresAt);
    }
    return true;
  },
};

/* ---------- Utilidades compartilhadas (login.html e index.html) ---------- */

const HTML_ESCAPE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" };

/**
 * Escapa texto para interpolação segura em HTML. OBRIGATÓRIO para qualquer
 * dado externo (API, input) inserido via innerHTML — o modelo do app usa
 * el() com filhos texto (seguro por padrão); esc() existe para os raros
 * casos de string HTML montada (ex.: badge ADMIN no renderUser).
 * @param {unknown} str
 * @returns {string}
 */
function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => HTML_ESCAPE[c]);
}

/**
 * Toast efêmero (5s) na região global (#toast-region).
 * @param {string} message
 * @param {"info"|"success"|"warn"|"error"} [kind]
 */
function toast(message, kind = "info") {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const t = document.createElement("div");
  t.className = "toast " + kind;
  t.textContent = message;
  region.appendChild(t);
  setTimeout(() => t.remove(), 5000);
}

/**
 * Fetch autenticado. Desempacota o envelope {ok, data:{...}} da API e
 * retorna `data` direto. 401 limpa a sessão e joga para o login.
 * @template T
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<T>} o campo `data` da resposta
 * @throws {Error} mensagem da API ou "HTTP <status>"
 */
async function api(path, options = {}) {
  if (auth.isExpired()) {
    _clearSession();
    window.location.hash = "#/login";
    throw new Error("Sessão expirada.");
  }
  const r = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: "Bearer " + auth.token,
    },
  });
  if (r.status === 401) {
    _clearSession();
    window.location.hash = "#/login";
    throw new Error("Sessão expirada.");
  }
  const body = await r.json();
  if (!r.ok) throw new Error(body.error || "HTTP " + r.status);
  return body.data;
}

/**
 * Como api(), mas mostra toast com o erro antes de re-lançar — usar em
 * ações disparadas por clique, onde o erro precisa ser visível.
 * @template T
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
async function apiOrFail(path, options) {
  try {
    return await api(path, options);
  } catch (e) {
    toast(e.message, "error");
    throw e;
  }
}
