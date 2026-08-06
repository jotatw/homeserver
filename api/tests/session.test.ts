// Teste unitário de sessão (expiração, sliding, role, versão de token).
// Roda com: npx tsx tests/session.test.ts (dentro de api/)

process.env.HS_SESSION_TTL_MS = "250";

const {
    createSession,
    getSession,
    destroySession,
    sessionExpiresIn,
    _clearSessionsForTest,
} = await import("../src/sessions.js");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

// 1. criação e role
_clearSessionsForTest();
const adminToken = createSession("joao", true);
const userToken = createSession("convidado", false);

check("createSession(admin) retorna token", adminToken.length > 0);
check("getSession(admin) válida e role admin", getSession(adminToken)?.admin === true);
check("getSession(user) válida e role user", getSession(userToken)?.admin === false);
check("sessionExpiresIn > 0", sessionExpiresIn(getSession(adminToken)!) > 0);

const admin = getSession(adminToken)!;
check("createdAt presente", typeof admin.createdAt === "number" && admin.createdAt > 0);
check("tokenVersion = 1", admin.tokenVersion === 1);

// 2. token inexistente
check("token inexistente -> null", getSession("nao-existe") === null);

// 3. expiração (TTL 250ms; sem uso -> expira)
_clearSessionsForTest();
const expToken = createSession("joao", true);
await sleep(400);
check("sessão expira após TTL sem uso (400ms > 250ms)", getSession(expToken) === null);

// 4. sliding (uso renova a expiração)
_clearSessionsForTest();
const slideToken = createSession("joao", true);
await sleep(200);
check("uso em 200ms renova (ainda válida)", getSession(slideToken) !== null);
await sleep(200);
// total ~400ms desde a criação; se fosse fixo desde createdAt, expiraria.
// Com sliding (renovado em 200ms), faltam 50ms para expirar -> ainda válida.
check("sliding: ainda válida após 400ms com uso em 200ms", getSession(slideToken) !== null);
await sleep(300);
check("expira após 300ms sem uso", getSession(slideToken) === null);

// 5. logout/destruição
_clearSessionsForTest();
const killToken = createSession("joao", true);
destroySession(killToken);
check("sessão destruída -> null", getSession(killToken) === null);

console.log();
console.log("Session Tests");
console.log(`Total : ${passed + failures}`);
console.log(`PASS  : ${passed}`);
console.log(`FAIL  : ${failures}`);
console.log("----------------------------------------");

process.exit(failures === 0 ? 0 : 1);
