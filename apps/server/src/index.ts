import { env } from "cloudflare:workers";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createContext } from "./lib/context";
import { appRouter, type AppRouter } from "./routers/index";
import { createAuth } from "./lib/auth";

const app = new Hono();

app.use(logger());
app.use(
   "/*",
   cors({
      origin: env.CORS_ORIGIN || "",
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
   })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
   const auth = createAuth();
   if (!auth) {
      return c.text("Error creating auth");
   }
   return auth.handler(c.req.raw);
});

app.use(
   "/trpc/*",
   trpcServer({
      router: appRouter,
      createContext: (_opts, context) => {
         return createContext({ context });
      },
   })
);

app.get("/", (c) => {
   return c.text("OK");
});

export { appRouter };
export type { AppRouter };
export type * from "./lib/context";
export default app;
