// Teste unitário de sessão (S2: inatividade, limite absoluto, renovação por atividade, polling).
// Roda com: npx tsx tests/session.test.ts (dentro de api/)

process.env.HS_SESSION_TTL_MS = "250";
process.env.HS_SESSION_ABSOLUTE_TTL_MS = "600";

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
const adminToken = createSession("usuario", true);
const userToken = createSession("convidado", false);

check("createSession(admin) retorna token", adminToken.length > 0);
check("getSession(admin) válida e role admin", getSession(adminToken)?.admin === true);
check("getSession(user) válida e role user", getSession(userToken)?.admin === false);
check("sessionExpiresIn > 0", sessionExpiresIn(getSession(adminToken)!) > 0);

const admin = getSession(adminToken)!;
check("createdAt presente", typeof admin.createdAt === "number" && admin.createdAt > 0);
check("lastUserActivityAt presente", typeof admin.lastUserActivityAt === "number" && admin.lastUserActivityAt > 0);
check("expiresAt presente (limite absoluto)", typeof admin.expiresAt === "number" && admin.expiresAt > admin.createdAt);
check("tokenVersion = 1", admin.tokenVersion === 1);

// 2. token inexistente
check("token inexistente -> null", getSession("nao-existe") === null);

// 3. expiração por inatividade (TTL 250ms; sem uso -> expira)
_clearSessionsForTest();
const expToken = createSession("usuario", true);
await sleep(400);
check("sessão expira por inatividade (400ms > 250ms)", getSession(expToken) === null);

// 4. leitura/polling NÃO renova (sem {renew: true})
_clearSessionsForTest();
const pollToken = createSession("usuario", true);
await sleep(200);
check("leitura em 200ms não renova mas continua válida", getSession(pollToken) !== null);
await sleep(200);
// total ~400ms; polling não renovou -> inatividade de 250ms estourada.
check("polling não renova: expira após 400ms sem atividade real", getSession(pollToken) === null);

// 5. atividade real renova (getSession com renew:true)
_clearSessionsForTest();
const actToken = createSession("usuario", true);
await sleep(200);
check("atividade em 200ms renova (ainda válida)", getSession(actToken, { renew: true }) !== null);
await sleep(200);
// total ~400ms; renovada em 200ms -> faltam 50ms para inatividade expirar.
check("atividade renova: ainda válida após 400ms com uso em 200ms", getSession(actToken, { renew: true }) !== null);
await sleep(300);
check("expira após 300ms sem nova atividade", getSession(actToken) === null);

// 6. limite absoluto (expiresAt = 600ms) mesmo com atividade contínua
_clearSessionsForTest();
const absToken = createSession("usuario", true);
// atividade renovando a cada 200ms — porém o limite absoluto de 600ms é intransponível.
await sleep(200);
getSession(absToken, { renew: true });
await sleep(200);
getSession(absToken, { renew: true });
check("limite absoluto: ainda válida em 400ms com atividade", getSession(absToken, { renew: true }) !== null);
await sleep(250);
check("limite absoluto: expira em ~650ms mesmo com atividade", getSession(absToken, { renew: true }) === null);

// 7. sessionExpiresIn respeita o limite mais próximo (absoluto < inatividade aqui)
_clearSessionsForTest();
const boundToken = createSession("usuario", true);
await sleep(200);
const s = getSession(boundToken)!;
const remaining = sessionExpiresIn(s);
check("sessionExpiresIn reflete limite absoluto (absoluto=600ms)", remaining <= 1);
await sleep(300);

// 8. logout/destruição
_clearSessionsForTest();
const killToken = createSession("usuario", true);
destroySession(killToken);
check("sessão destruída -> null", getSession(killToken) === null);

console.log();
console.log("Session Tests (S2)");
console.log(`Total : ${passed + failures}`);
console.log(`PASS  : ${passed}`);
console.log(`FAIL  : ${failures}`);
console.log("----------------------------------------");

process.exit(failures === 0 ? 0 : 1);