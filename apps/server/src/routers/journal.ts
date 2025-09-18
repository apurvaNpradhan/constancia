import { note } from "@/db/schema/note";
import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, gte, ilike, lte, sql, SQL, type DrizzleError } from "drizzle-orm";
import z from "zod";

export const journalRouter = router({
   getAllJournals: {},
   getJournalsByMonth: protectedProcedure
      .input(
         z.object({
            limit: z.number().min(1).max(100).default(30),
            cursor: z.string().optional(),
            orderBy: z.enum(["created_asc", "created_desc"]).default("created_asc"),
            month: z.number().min(1).max(12),
            year: z.number().min(2000).max(2100),
            search: z.string().optional(),
         })
      )
      .query(async ({ input, ctx }) => {
         try {
            const { limit, cursor, orderBy, month, year, search } = input;

            const startDate = new Date(year, month - 1, 1).toISOString();
            const endDate = new Date(year, month, 0).toISOString();

            const conditions = [eq(note.userId, ctx.session.user.id), eq(note.type, "journal")];
            conditions.push(gte(note.createdAt, startDate));
            conditions.push(lte(note.createdAt, endDate));
            if (search) {
               conditions.push(ilike(note.title, `%${search}%`));
            }
            if (cursor) {
               conditions.push(
                  orderBy.includes("asc") ? gte(note.id, cursor) : lte(note.id, cursor)
               );
            }

            let orderByClause: SQL;
            switch (orderBy) {
               case "created_asc":
                  orderByClause = asc(note.createdAt);
                  break;
               case "created_desc":
                  orderByClause = desc(note.createdAt);
                  break;
               default:
                  orderByClause = desc(note.createdAt);
            }

            const data = await ctx.db
               .select()
               .from(note)
               .where(and(...conditions))
               .orderBy(orderByClause)
               .limit(limit + 1);

            const totalCount = await ctx.db
               .select({ count: sql`count(*)` })
               .from(note)
               .where(and(...conditions));

            const hasMore = data.length > limit;
            const noteData = hasMore ? data.slice(0, limit) : data;
            const nextCursor = hasMore ? noteData[noteData.length - 1].id : null;

            return {
               notes: noteData,
               totalCount: Number(totalCount[0]?.count || 0),
               nextCursor,
               hasMore,
            };
         } catch (err) {
            const e = err as DrizzleError;
            throw new TRPCError({
               cause: e.cause,
               code: "INTERNAL_SERVER_ERROR",
               message: e.message,
            });
         }
      }),

   //    getJournalsByMonth: protectedProcedure
   //       .input(
   //          z.object({
   //             year: z.number().min(1970).max(9999),
   //             month: z.number().min(1).max(12), // 1-12 for January-December
   //             limit: z.number().min(1).max(100).default(31), // Max days in a month
   //          })
   //       )
   //       .query(async ({ input, ctx }) => {
   //          try {
   //             const { year, month, limit } = input;
   //             const monthPadded = month.toString().padStart(2, "0");
   //             // Define start and end dates for the month
   //             const startDate = `${year}-${monthPadded}-01`;
   //             const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // Last day of the month

   //             const data = await ctx.db
   //                .select()
   //                .from(note)
   //                .where(and(eq(note.type, "journal"), eq(note.userId, ctx.session.user.id)))
   //                .orderBy(asc(note.entryDate))
   //                .limit(limit);

   //             return {
   //                journals: data,
   //                year,
   //                month,
   //                total: data.length,
   //             };
   //          } catch (err) {
   //             const e = err as DrizzleError;
   //             throw new TRPCError({
   //                cause: e.cause,
   //                code: "INTERNAL_SERVER_ERROR",
   //                message: e.message,
   //             });
   //          }
   //       }),
   getJournalById: {},
   getJournalByDate: {},
});
