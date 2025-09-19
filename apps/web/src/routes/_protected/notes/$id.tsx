import NoteEditor from "@/components/common/notes/editor/notes-editor";
import Header from "@/components/header";
import MainLayout from "@/components/layout/main-layout";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { getQueryClient } from "@/router";
import { useTRPC } from "@/utils/trpc";
import type { Block } from "@blocknote/core";
import type { note } from "@constancia/server";
import { useDebouncedCallback } from "@mantine/hooks";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_protected/notes/$id")({
   component: RouteComponent,
   beforeLoad: async ({ params, context: c }) => {
      await c.queryClient.ensureQueryData(
         c.trpc.noteRouter.getNoteById.queryOptions({ id: params.id })
      );
   },
});

function RouteComponent() {
   const { id } = Route.useParams();
   const trpc = useTRPC();
   const { data, isPending } = useSuspenseQuery(trpc.noteRouter.getNoteById.queryOptions({ id }));
   if (isPending) {
      return <div>Loading...</div>;
   }

   const [error, setError] = useState<string | null>(null);
   const [title, setTitle] = useState(data.title ?? "");
   const queryClient = getQueryClient();
   const mutation = useMutation({
      ...trpc.noteRouter.updateNote.mutationOptions(),
      onSettled: (data) => {
         if (data?.id) {
            queryClient.invalidateQueries({
               queryKey: trpc.noteRouter.getNoteById.queryKey({ id: data.id }),
            });
            if (data.type === "journal" && data.entryDate) {
               const entryDate = new Date(data.entryDate);
               if (!isNaN(entryDate.getTime())) {
                  queryClient.invalidateQueries({
                     queryKey: trpc.journal.getJournalsByMonth.queryKey({
                        month: entryDate.getMonth() + 1, // Months are 1-12
                        year: entryDate.getFullYear(),
                     }),
                  });
               }
            }

            queryClient.invalidateQueries({
               queryKey: trpc.noteRouter.getAllNotes.infiniteQueryKey({ limit: 30 }),
            });
         }
      },
      onError: (error) => {
         setError("Failed to save note. Please try again.");
      },
   });

   const debouncedTitleSave = useDebouncedCallback(async (value: note.NoteUpdateSchema) => {
      try {
         await mutation.mutateAsync({
            id: data.id,
            title: value.title ?? "",
         });
      } catch (err) {
         setError("Failed to save note. Please try again.");
      }
   }, 1000);

   const debouncedContentSave = useDebouncedCallback(async (jsonBlocks: Block[]) => {
      try {
         await mutation.mutateAsync({
            id: data.id,
            content: JSON.stringify(jsonBlocks),
         });
      } catch (err) {
         setError("Failed to save note. Please try again.");
      }
   }, 1000);

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   const handleSave = (value: string) => {
      setTitle(value);
      debouncedTitleSave({ title: value });
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         e.preventDefault();
         handleSave(e.currentTarget.value);
      }
   };

   const inputProps = {
      placeholder: "Untitled",
      className:
         "border-none shadow-none outline-none text-2xl lg:text-5xl font-semibold px-0 focus-visible:ring-0 overflow-hidden text-ellipsis whitespace-normal p-14 dark:bg-background",
      value: title,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => handleSave(e.target.value),
      onKeyDown: handleKeyDown,
   };

   switch (data?.type) {
      case "note":
         return (
            <MainLayout header={<Header />}>
               <div className="p-4 max-w-4xl mx-auto">
                  <Input {...inputProps} />

                  <NoteEditor data={data} debouncedSave={debouncedContentSave} />
               </div>
            </MainLayout>
         );
      case "journal":
         return (
            <MainLayout header={<Header />}>
               <div className="p-4 w-full max-w-5xl mx-auto">
                  <Input {...inputProps} />
                  <NoteEditor data={data} debouncedSave={debouncedContentSave} />
               </div>
            </MainLayout>
         );
      case "workout":
         return <MainLayout>Hello "/_protected/$id"!{id}</MainLayout>;
      case "habit":
         return <MainLayout>Hello "/_protected/$id"!{id}</MainLayout>;
      default:
         return <MainLayout>Hello "/_protected/$id"!{id}</MainLayout>;
   }
}
