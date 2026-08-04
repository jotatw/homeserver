import Fastify from "fastify";
import cors from "@fastify/cors";
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
import { appRoutes } from "./routes/app.js";
import { authRoutes } from "./routes/auth.js";
import { updateRoutes } from "./routes/update.js";

const app = Fastify({
    logger: true
});

await app.register(cors, {
    origin: [
        "http://192.168.1.10:3000",
        "http://homeserver.local",
        "http://homeserver.local:80",
        "https://homeserver.local",
        "https://homeserver.local:443",
        /\.192\.168\.0\.10(:30)?$/,
    ],
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
await app.register(appRoutes);

await app.listen({
    host: "0.0.0.0",
    port: 8000
});
