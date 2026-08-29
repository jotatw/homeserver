// Teste unitário do Executor Privilegiado (S3: Allowlist e Sanitização).
// Roda com: npx tsx tests/executor.test.ts (dentro de api/)

import { ExecutorError, runOnHost } from "../src/utils/executor.js";

let failures = 0;
let passed = 0;

function check(label: string, ok: boolean) {
    if (ok) {
        console.log(`  ${label.padEnd(60)} [PASS]`);
        passed += 1;
    } else {
        console.log(`  ${label.padEnd(60)} [FAIL]`);
        failures += 1;
    }
}

async function expectError(label: string, fn: () => Promise<unknown>, expectedMsgSubstr?: string) {
    try {
        await fn();
        check(label, false);
    } catch (err) {
        if (err instanceof ExecutorError) {
            if (expectedMsgSubstr && !err.message.includes(expectedMsgSubstr)) {
                console.log(`  [FAIL] ${label}: mensagem "${err.message}" não contém "${expectedMsgSubstr}"`);
                failures += 1;
            } else {
                check(label, true);
            }
        } else {
            console.log(`  [FAIL] ${label}: erro retornado não é ExecutorError (${err})`);
            failures += 1;
        }
    }
}

console.log("Executando testes do Executor Privilegiado (S3)...");
console.log();

// 1. Rejeição de comandos não permitidos
await expectError("Rejeita comando vazio", async () => runOnHost([]));
await expectError("Rejeita comando genérico (ls)", async () => runOnHost(["ls", "-la"]));
await expectError("Rejeita rm -rf", async () => runOnHost(["rm", "-rf", "/"]));
await expectError("Rejeita subcomando desconhecido no hs", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "unknown"]));

// 2. Validação de argumentos no `device`
await expectError("Rejeita device mount com type inválido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "device", "mount", "invalid_type", "LABEL", "sdb1"]));
await expectError("Rejeita device mount com label malicioso (;)", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "device", "mount", "usb", "LABEL; rm -rf /", "sdb1"]));
await expectError("Rejeita device mount com device malicioso (/dev/sdb1)", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "device", "mount", "usb", "LABEL", "/dev/sdb1"]));
await expectError("Rejeita device format com device malicioso (/dev/sdb)", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "device", "format", "/dev/sdb"]));
await expectError("Rejeita device format sem device", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "device", "format"]));
await expectError("Rejeita device format com device injetado (sdb; reboot)", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "device", "format", "sdb; reboot"]));

// 3. Validação de argumentos no `module`
await expectError("Rejeita module op com ID inválido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "module", "op", "Module_Invalid!", "start"]));
await expectError("Rejeita module op com operação não permitida", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "module", "op", "caddy", "destroy"]));

// 4. Validação de argumentos no `power`
await expectError("Rejeita power set com formato de hora inválido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "power", "set", "23:30:00", "07:00"]));
await expectError("Rejeita power set com injeção de comando", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "power", "set", "23:30; reboot", "07:00"]));

// 5. Validação de argumentos no `print` (lp, cancel, lpstat)
await expectError("Rejeita lp com impressora inválida", async () => runOnHost(["lp", "-d", "Printer;bad", "/srv/git/homeserver/api/data/file.txt"]));
await expectError("Rejeita lp com caminho fora de /api/data/", async () => runOnHost(["lp", "-d", "MG3110", "/etc/passwd"]));
await expectError("Rejeita cancel com jobId inválido", async () => runOnHost(["cancel", "MG3110; reboot"]));
await expectError("Rejeita lpstat com script composto arbitrário", async () => runOnHost(["bash", "-c", "lpstat -p; cat /etc/passwd"]));

// 6. Sucesso nas validações de formato (a execução em si vai falhar por falta do docker no ambiente de teste, mas a validação deve passar!)
async function expectPassValidation(label: string, fn: () => Promise<unknown>) {
    try {
        await fn();
        check(label, true);
    } catch (err) {
        // Se falhar no docker/execFile, significa que PASSOU na validação do Executor!
        if (err instanceof ExecutorError) {
            console.log(`  [FAIL] ${label}: falhou na validação (${err.message})`);
            failures += 1;
        } else {
            check(label, true);
        }
    }
}

await expectPassValidation("Aceita backup script válido", async () => runOnHost(["bash", "/srv/scripts/backup.sh"]));
await expectPassValidation("Aceita device mount válido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "device", "mount", "usb", "KINGSTON", "sdb1"]));
await expectPassValidation("Aceita device format válido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "device", "format", "sdb"]));
await expectPassValidation("Aceita module op válido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "module", "op", "caddy", "start"]));
await expectPassValidation("Aceita power set válido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "power", "set", "23:30", "07:00"]));
await expectPassValidation("Aceita update os check válido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "update", "os", "check"]));
await expectPassValidation("Aceita cancel com jobId válido", async () => runOnHost(["cancel", "MG3110-12"]));
await expectPassValidation("Aceita lp com caminho e arquivo válidos", async () => runOnHost(["lp", "-d", "MG3110", "-o", "media=A4", "/srv/git/homeserver/api/data/print-job.txt"]));

// Scheduler (Fase 8)
await expectError("Rejeita scheduler com subcomando desconhecido", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "scheduler", "foo"]));
await expectError("Rejeita scheduler enable sem nome", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "scheduler", "enable"]));
await expectError("Rejeita scheduler com nome malicioso", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "scheduler", "run", "backup;reboot"]));
await expectPassValidation("Aceita scheduler status", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "scheduler", "status"]));
await expectPassValidation("Aceita scheduler enable backup", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "scheduler", "enable", "backup"]));
await expectPassValidation("Aceita scheduler run backup", async () => runOnHost(["bash", "/srv/git/homeserver/core/hs.sh", "scheduler", "run", "backup"]));

console.log();
console.log("Executor Tests (S3)");
console.log(`Total : ${passed + failures}`);
console.log(`PASS  : ${passed}`);
console.log(`FAIL  : ${failures}`);
console.log("----------------------------------------");

process.exit(failures === 0 ? 0 : 1);