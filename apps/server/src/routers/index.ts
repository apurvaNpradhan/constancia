import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { notesRouter } from "./note";
import { testRouter } from "./test";

export const appRouter = router({
   testRouter: testRouter,
   noteRouter: notesRouter,
});
export type AppRouter = typeof appRouter;
