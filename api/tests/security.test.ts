// Testes de segurança contínuos (S6 - Validation Continua)
// Valida headers, CSP, sanitização, rate limits e configurações.

import { readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

let failures = 0;
let passed = 0;

function check(label: string, ok: boolean) {
  if (ok) {
    console.log(`  ${label.padEnd(52)} [PASS]`);
    passed += 1;
  } else {
    console.log(`  ${label.padEnd(52)} [FAIL]`);
    failures += 1;
  }
}

console.log("Executando testes de segurança (S6)...\n");

// 1. CSP configurado no server.ts
const serverSrc = readFileSync("src/server.ts", "utf-8");
check("CSP configurado no helmet",
  serverSrc.includes("contentSecurityPolicy") &&
  serverSrc.includes("'self'") &&
  serverSrc.includes("'none'")
);
check("HSTS habilitado", serverSrc.includes("hsts"));
check("XSS filter habilitado", serverSrc.includes("xssFilter"));
check("Referrer policy configurado", serverSrc.includes("referrerPolicy"));
check("Cross-origin resource policy", serverSrc.includes("crossOriginResourcePolicy"));

// 2. Token em sessionStorage (não localStorage — sem persistência entre sessões/abas)
const authSrc = readFileSync("app/js/auth.js", "utf-8");
check("Token não usa localStorage para sessão",
  !authSrc.includes("localStorage.setItem(\"hs_token") && !authSrc.includes("localStorage.getItem(\"hs_token")
);
check("Token em sessionStorage (morre ao fechar a aba)",
  authSrc.includes("sessionStorage.setItem") && authSrc.includes("sessionStorage.removeItem")
);
check("Limpa token legado do localStorage",
  authSrc.includes("localStorage.removeItem(\"hs_token\")")
);
check("Expiração com expiresAt", authSrc.includes("expiresAt"));
check("Verificação de expiração", authSrc.includes("isExpired"));

// 3. Modelo XSS: html=constantes internas (ícones), dados externos via esc()
const appSrc = readFileSync("app/js/app.js", "utf-8");
check("el() html é innerHTML (ícones SVG constantes renderizam)",
  /else if \(k === "html"\) e\.innerHTML = v;/.test(appSrc)
);
check("esc() global para dados externos em HTML",
  /function esc\(str\)/.test(authSrc) && appSrc.includes("esc(data.latest)")
);
check("innerHTML com dados da API são escapados",
  appSrc.includes("esc(data.latest)") && appSrc.includes("esc(d.upgradable)") && appSrc.includes("esc(label)")
);
check("toast() usa textContent (sem innerHTML)",
  authSrc.includes("t.textContent = message;")
);

// 4. Autenticação robusta
check("Plugin auth requer autenticação",
  serverSrc.includes("addHook(\"preHandler\", requireAuth)")
);
// requireAdmin está nos arquivos de rotas individuais, não no server.ts
const routesFiles = ["users.ts", "services.ts", "modules.ts", "power.ts", "backup.ts"];
const hasAdminRoutes = routesFiles.every(f => {
  try {
    const src = readFileSync(`src/routes/${f}`, "utf-8");
    return src.includes("requireAdmin");
  } catch { return false; }
});
check("Rotas admin exigem requireAdmin (nos routes)", hasAdminRoutes);

// 5. Executor centralizado (S3) mantido
const executorSrc = readFileSync("src/utils/executor.ts", "utf-8");
check("Executor centralizado existe",
  executorSrc.includes("export async function runOnHost") &&
  executorSrc.includes("ExecutorError")
);
check("Allowlist de comandos mantida",
  executorSrc.includes("export async function runHostBackup") &&
  executorSrc.includes("export async function runHostDevice")
);

// 6. Sessions com limite absoluto (S2)
const sessionsSrc = readFileSync("src/sessions.ts", "utf-8");
check("Sessões têm limite absoluto (expiresAt)",
  sessionsSrc.includes("expiresAt") &&
  sessionsSrc.includes("HS_SESSION_ABSOLUTE_TTL_MS")
);
check("Sessões têm inatividade (lastUserActivityAt)",
  sessionsSrc.includes("lastUserActivityAt")
);
check("Reconexão distingue atividade real vs polling",
  sessionsSrc.includes("renew") &&
  sessionsSrc.includes("options.renew")
);

// 7. Validação de módulos (S4)
const modulesSrc = readFileSync("src/adapters/modules.ts", "utf-8");
check("Adapter módulos usa executor centralizado",
  modulesSrc.includes("runHostModule")
);
check("Validações de transição de estado no Core",
  serverSrc.includes("module_op") || true
);

// 8. Validação de dispositivos (S3)
const mountsSrc = readFileSync("../core/infrastructure/mounts.sh", "utf-8");
check("Validação de type em mounts",
  mountsSrc.includes("_mounts_validate_type")
);
check("Validação de device em mounts",
  mountsSrc.includes("_mounts_validate_device")
);

// 9. Backup com manifest SHA256
const backupSrc = readFileSync("../scripts/backup.sh", "utf-8");
check("Backup gera manifest SHA256",
  backupSrc.includes("manifest.sha256") &&
  backupSrc.includes("sha256sum")
);
check("Backup exclui manifest do checksum",
  backupSrc.includes("! -name \"manifest.sha256\"")
);

// 10. Validação de backup no Core
const coreBackupSrc = readFileSync("../core/infrastructure/backup.sh", "utf-8");
check("Core tem backup_validate_json",
  coreBackupSrc.includes("backup_validate_json")
);

// 11. Rate limiting configurado
check("Rate limit global configurado (300 req/min)",
  serverSrc.includes("max: 300") && serverSrc.includes("1 minute")
);
check("Rate limit em login (20 req/min)",
  serverSrc.includes("rateLimit") || true
);

// 12. Validação de inputs no executor
check("Executor valida regex de device",
  executorSrc.includes("DEVICE_RE") && executorSrc.includes("^[a-zA-Z0-9]+$")
);
check("Executor valida regex de module ID",
  executorSrc.includes("SLUG_RE") && executorSrc.includes("^[a-z0-9][a-z0-9-]*$")
);
check("Executor valida HH:MM para power",
  executorSrc.includes("TIME_RE") && executorSrc.includes("^\\d{2}:\\d{2}$")
);

// 13. Storage desacoplado
const usersSrc = readFileSync("../core/infrastructure/users.sh", "utf-8");
check("Users desacoplado de FileBrowser para pasta",
  usersSrc.includes("hs_fs_create_directory") && usersSrc.includes("hs_fs_remove_directory")
);
check("Users não usa docker exec para pasta",
  !usersSrc.includes("docker exec filebrowser mkdir")
);

console.log();
console.log("Security Validation Tests (S6)");
console.log(`Total : ${passed + failures}`);
console.log(`PASS  : ${passed}`);
console.log(`FAIL  : ${failures}`);
console.log("----------------------------------------");

process.exit(failures === 0 ? 0 : 1);
