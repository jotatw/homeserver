const auth = {
  token: localStorage.getItem("hs_token") || "",

  async login(username, password) {
    const r = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const body = await r.json();
    if (!r.ok) throw new Error(body.error || "Erro ao autenticar.");
    this.token = body.data.token;
    localStorage.setItem("hs_token", body.data.token);
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
    localStorage.removeItem("hs_token");
  },

  async check() {
    if (!this.token) return false;
    const r = await fetch("/api/v1/auth/session", {
      headers: { Authorization: "Bearer " + this.token },
    });
    if (!r.ok) {
      this.token = "";
      localStorage.removeItem("hs_token");
      return false;
    }
    return true;
  },
};

async function api(path) {
  const r = await fetch(path, {
    headers: { Authorization: "Bearer " + auth.token },
  });
  if (r.status === 401) {
    auth.token = "";
    localStorage.removeItem("hs_token");
    window.location.href = "/app/login.html";
    throw new Error("Sessão expirada.");
  }
  const body = await r.json();
  if (!r.ok) throw new Error(body.error || "HTTP " + r.status);
  return body.data;
}
