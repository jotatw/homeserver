/* ============================================================
 * HomeServer App — Login (v2.0 · Sprint 1 auth)
 * POST /auth/login → {ok,data:{token, user, expiresIn}}
 * ============================================================ */

const form = document.getElementById("login-form");
const btn = document.getElementById("btn-login");
const host = document.getElementById("login-host");

host.textContent = "Servidor: " + window.location.hostname;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  btn.disabled = true;
  btn.textContent = "Entrando…";

  try {
    await auth.login(username, password);
    window.location.href = "/app";
  } catch (err) {
    toast(err.message || "Usuário ou senha inválidos.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
});
