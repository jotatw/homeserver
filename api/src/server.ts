import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { requireAuth } from "./plugins/auth.js";
import { systemRoutes } from "./routes/system.js";
import { userRoutes } from "./routes/users.js";
import { storageRoutes } from "./routes/storage.js";
import { servicesRoutes } from "./routes/services.js";
import { devicesRoutes } from "./routes/devices.js";
import { eventsRoutes } from "./routes/events.js";
import { powerRoutes } from "./routes/power.js";
import { hardwareRoutes } from "./routes/hardware.js";
import { backupRoutes } from "./routes/backup.js";
import { tokenRoutes } from "./routes/tokens.js";
import { moduleRoutes } from "./routes/modules.js";
import { printRoutes } from "./routes/print.js";
import { appRoutes } from "./routes/app.js";
import { authRoutes } from "./routes/auth.js";
import { updateRoutes } from "./routes/update.js";
import { schedulerRoutes } from "./routes/scheduler.js";

const app = Fastify({
    logger: true
});

await app.register(helmet, {
    global: true,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            fontSrc: ["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "same-origin" },
    hsts: { maxAge: 86400, includeSubDomains: true },
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
});

// Rate limit global: 300 req/min por IP (homepage faz polling de widgets).
await app.register(rateLimit, {
    max: 300,
    timeWindow: "1 minute",
});

const HS_HOST_IP = (process.env.HS_HOST_IP || "").trim();

const corsOrigins: (string | RegExp)[] = [
    "http://homeserver.local",
    "http://homeserver.local:80",
    "https://homeserver.local",
    "https://homeserver.local:443",
];

if (HS_HOST_IP) {
    corsOrigins.push(
        `http://${HS_HOST_IP}:3000`,
        `http://${HS_HOST_IP}:8000`,
        `https://${HS_HOST_IP}`,
    );
}

await app.register(cors, {
    origin: corsOrigins,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
});

app.addHook("preHandler", requireAuth);

await app.register(authRoutes);
await app.register(updateRoutes);
await app.register(systemRoutes);
await app.register(userRoutes);
await app.register(storageRoutes);
await app.register(servicesRoutes);
await app.register(devicesRoutes);
await app.register(eventsRoutes);
await app.register(powerRoutes);
await app.register(hardwareRoutes);
await app.register(backupRoutes);
await app.register(tokenRoutes);
await app.register(moduleRoutes);
await app.register(printRoutes);
await app.register(appRoutes);
await app.register(schedulerRoutes);
await app.register(authRoutes);

await app.listen({
    host: "0.0.0.0",
    port: 8000
});
