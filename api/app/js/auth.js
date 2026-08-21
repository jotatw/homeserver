/* ============================================================
 * HomeServer App — Auth (v3.0 · Security Hardening S5)
 * Contrato: {ok, data:{user:{username, admin}, expiresIn}}
 * Token mantido em memória (não localStorage) para proteção XSS.
 * ============================================================ */

const auth = {
  token: "",
  user: null,
  expiresAt: 0,

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

    return body.data;
  },

  async logout() {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: { Authorization: "Bearer " + this.token },
      });
    } catch (_) {}
    this.token = "";
    this.user = null;
    this.expiresAt = 0;
  },

  isAdmin() {
    return this.user ? this.user.admin : false;
  },

  isExpired() {
    return !this.token || Date.now() >= this.expiresAt;
  },

  async check() {
    if (!this.token || this.isExpired()) {
      this.token = "";
      this.user = null;
      this.expiresAt = 0;
      return false;
    }
    const r = await fetch("/api/v1/auth/session", {
      headers: { Authorization: "Bearer " + this.token },
    });
    if (!r.ok) {
      this.token = "";
      this.user = null;
      this.expiresAt = 0;
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
    }
    return true;
  },
};

/* ---------- XSS sanitization ---------- */
const HTML_ESCAPE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" };
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => HTML_ESCAPE[c]);
}

function safeEl(tag, attrs, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k === "html") {
      const div = document.createElement("div");
      div.textContent = v;
      e.innerHTML = div.innerHTML;
    }
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (c === null || c === undefined) return;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}

async function api(path, options = {}) {
  if (auth.isExpired()) {
    auth.token = "";
    auth.user = null;
    auth.expiresAt = 0;
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
    auth.token = "";
    auth.user = null;
    auth.expiresAt = 0;
    window.location.hash = "#/login";
    throw new Error("Sessão expirada.");
  }
  const body = await r.json();
  if (!r.ok) throw new Error(body.error || "HTTP " + r.status);
  return body.data;
}

async function apiOrFail(path, options) {
  try {
    return await api(path, options);
  } catch (e) {
    toast(e.message, "error");
    throw e;
  }
}
