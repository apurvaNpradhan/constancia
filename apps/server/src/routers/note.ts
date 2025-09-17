import { and, asc, desc, eq, gte, ilike, lte, sql, SQL, type DrizzleError } from "drizzle-orm";
import { protectedProcedure, router } from "../lib/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { note, NoteInsertSchema } from "@/db/schema/note";
export const notesRouter = router({
   getAllNotes: protectedProcedure
      .input(
         z.object({
            limit: z.number().min(1).max(100).default(10),
            cursor: z.string().optional(),
            orderBy: z.enum(["created_asc", "created_desc"]).default("created_asc"),
            dateFrom: z.string().optional(),
            dateTo: z.string().optional(),
            search: z.string().optional(),
         })
      )
      .query(async ({ input, ctx }) => {
         try {
            const { limit, cursor, orderBy, dateFrom, dateTo, search } = input;
            const conditions = [eq(note.userId, ctx.session.user.id)];
            if (dateFrom) {
               conditions.push(gte(note.createdAt, dateFrom));
            }
            if (dateTo) {
               conditions.push(lte(note.createdAt, dateTo));
            }
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
   getNoteById: protectedProcedure
      .input(
         z.object({
            id: z.uuid(),
         })
      )
      .query(async ({ input, ctx }) => {
         try {
            const data = await ctx.db.select().from(note).where(eq(note.id, input.id));
            return data[0];
         } catch (err) {
            const e = err as DrizzleError;
            throw new TRPCError({
               cause: e.cause,
               code: "INTERNAL_SERVER_ERROR",
               message: e.message,
            });
         }
      }),
   createNote: protectedProcedure.input(NoteInsertSchema).mutation(async ({ input, ctx }) => {
      try {
         const data = await ctx.db
            .insert(note)
            .values({
               ...input,
               userId: ctx.session.user.id,
            })
            .returning();
         return data;
      } catch (err) {
         const e = err as DrizzleError;
         throw new TRPCError({
            cause: e.cause,
            code: "INTERNAL_SERVER_ERROR",
            message: e.message,
         });
      }
   }),
   updateNote: {},
   deleteNote: {},
});
