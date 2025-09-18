import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { journalRouter } from "./journal";
import { notesRouter } from "./note";
import { testRouter } from "./test";

export const appRouter = router({
   testRouter: testRouter,
   noteRouter: notesRouter,
   journal: journalRouter,
});
export type AppRouter = typeof appRouter;
