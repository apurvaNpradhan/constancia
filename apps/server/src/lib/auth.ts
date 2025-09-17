import { betterAuth, type BetterAuthOptions } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
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

      trustedOrigins: [env.CORS_ORIGIN, "mybettertapp://", "exp://"],
      emailAndPassword: {
         enabled: true,
         autoSignIn: true,
         requireEmailVerification: false,
      },
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      session: {
         expiresIn: 60 * 60 * 24 * 7,
         updateAge: 60 * 60 * 24,
         cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
         },
      },
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
      plugins: [expo(), reactStartCookies()],
   });
}
