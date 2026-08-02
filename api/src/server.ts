import Fastify from "fastify";
import { systemRoutes } from "./routes/system.js";
import { userRoutes } from "./routes/users.js";

const app = Fastify({
    logger: true
});

await app.register(systemRoutes);
await app.register(userRoutes);

await app.listen({
    host: "0.0.0.0",
    port: 8000
});
