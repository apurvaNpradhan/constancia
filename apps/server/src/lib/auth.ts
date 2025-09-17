import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { env } from "cloudflare:workers";
import { uuidv7 } from "uuidv7";

export function createAuth() {
   return betterAuth({
      database: drizzleAdapter(db, {
         provider: "pg",

         schema: schema,
      }),
      rateLimit: {
         window: 10,
         max: 100,
         enabled: true,
      },
      trustedOrigins: [env.CORS_ORIGIN, "mybettertapp://", "exp://"],
      emailAndPassword: {
         enabled: true,
         autoSignIn: true,
         requireEmailVerification: false,
      },
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      advanced: {
         defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            httpOnly: true,
         },

         database: {
            generateId: () => uuidv7(),
         },
      },
      plugins: [expo()],
   });
}
