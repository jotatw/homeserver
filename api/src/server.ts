import Fastify from "fastify";
import { systemRoutes } from "./routes/system.js";
import { userRoutes } from "./routes/users.js";
import { storageRoutes } from "./routes/storage.js";
import { servicesRoutes } from "./routes/services.js";
import { backupRoutes } from "./routes/backup.js";

const app = Fastify({
    logger: true
});

await app.register(systemRoutes);
await app.register(userRoutes);
await app.register(storageRoutes);
await app.register(servicesRoutes);
await app.register(backupRoutes);

await app.listen({
    host: "0.0.0.0",
    port: 8000
});
