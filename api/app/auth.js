/* ============================================================
 * HomeServer App — Auth (v2.0 · Identity & Authentication)
 * Contrato: {ok, data:{user:{username, admin}, expiresIn}}
 * ============================================================ */

const auth = {
  token: localStorage.getItem("hs_token") || "",
  user: null, // { username, admin, role }

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
    localStorage.setItem("hs_token", this.token);
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
    localStorage.removeItem("hs_token");
  },

  isAdmin() {
    return this.user ? this.user.admin : false;
  },

  /** Verifica a sessão no boot e carrega a role. */
  async check() {
    if (!this.token) return false;
    const r = await fetch("/api/v1/auth/session", {
      headers: { Authorization: "Bearer " + this.token },
    });
    if (!r.ok) {
      this.token = "";
      this.user = null;
      localStorage.removeItem("hs_token");
      return false;
    }
    const body = await r.json();
    this.user = {
      username: body.data.user.username,
      admin: body.data.user.admin,
      role: body.data.user.admin ? "admin" : "user",
    };
    return true;
  },
};

async function api(path, options = {}) {
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
    localStorage.removeItem("hs_token");
    window.location.hash = "#/login";
    throw new Error("Sessão expirada.");
  }
  const body = await r.json();
  if (!r.ok) throw new Error(body.error || "HTTP " + r.status);
  return body.data;
}

/** Central de erros global (fluxo errors.md): toast + logout limpo. */
async function apiOrFail(path, options) {
  try {
    return await api(path, options);
  } catch (e) {
    toast(e.message, "error");
    throw e;
  }
}
