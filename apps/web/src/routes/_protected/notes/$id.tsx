import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/headers/note/header";
import MainLayout from "@/components/layout/main-layout";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { getQueryClient } from "@/router";
import { useTRPC } from "@/utils/trpc";
import type { note } from "@constancia/server";
import { useDebouncedCallback } from "@mantine/hooks";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Value } from "platejs";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import NoteEditor from "@/components/common/notes/editor/notes-editor";

const ErrorFallback = ({ error }: { error: Error }) => (
   <MainLayout>
      <div className="max-w-6xl mx-auto p-14">
         <p className="text-red-500">Error: {error.message}</p>
         <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
         >
            Retry
         </button>
      </div>
   </MainLayout>
);

export const Route = createFileRoute("/_protected/notes/$id")({
   component: RouteComponent,
   errorComponent: ErrorFallback,
   pendingComponent: () => (
      <MainLayout
         header={
            <div className="flex w-full  p-4">
               <Skeleton className="h-8 justify-start w-[200px]" />
            </div>
         }
      >
         <div className="max-w-6xl mx-auto flex flex-col p-14">
            <Skeleton className="h-10 w-3/4 mb-4 rounded-md" />
            <Skeleton className="h-[400px] w-full rounded-md" />
         </div>
      </MainLayout>
   ),
});

function RouteComponent() {
   const { id } = Route.useParams();
   const trpc = useTRPC();
   const { data } = useSuspenseQuery(trpc.noteRouter.getNoteById.queryOptions({ id }));
   const [error, setError] = useState<string | null>(null);
   const [title, setTitle] = useState(data?.title ?? "");
   const [isSaving, setIsSaving] = useState(false);
   const queryClient = getQueryClient();

   const mutation = useMutation({
      ...trpc.noteRouter.updateNote.mutationOptions(),
      onMutate: () => {
         setIsSaving(true);
         return undefined;
      },
      onSettled: (data) => {
         setIsSaving(false);
         if (data?.id) {
            queryClient.invalidateQueries({
               queryKey: trpc.noteRouter.getNoteById.queryKey({ id: data.id }),
            });
            if (data.type === "journal" && data.entryDate) {
               const entryDate = new Date(data.entryDate);
               if (!isNaN(entryDate.getTime())) {
                  queryClient.invalidateQueries({
                     queryKey: trpc.journal.getJournalsByMonth.queryKey({
                        month: entryDate.getMonth() + 1,
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
         setIsSaving(false);
      },
   });

   const toggleFavorite = async (id: string, isFavorite: boolean) => {
      if (window.event) {
         window.event.preventDefault();
         window.event.stopPropagation();
      }
      await mutation.mutateAsync({
         id,
         isFavorite: !isFavorite,
      });
   };

   const debouncedTitleSave = useDebouncedCallback(
      async (value: note.NoteUpdateSchema) => {
         if (value.title === data.title) return;
         try {
            await mutation.mutateAsync({
               id: data.id,
               title: value.title ?? "",
            });
         } catch (err) {
            setError("Failed to save note. Please try again.");
         }
      },
      {
         delay: 1000,
      }
   );

   const debouncedContentSave = useDebouncedCallback(
      async (jsonBlocks: Value) => {
         try {
            await mutation.mutateAsync({
               id: data.id,
               content: jsonBlocks,
            });
         } catch (err) {
            setError("Failed to save note. Please try again.");
         }
      },
      {
         delay: 1000,
         flushOnUnmount: true,
         leading: false,
      }
   );

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
         "border-none shadow-none outline-none text-2xl md:text-4xl font-semibold focus-visible:ring-0 overflow-hidden text-ellipsis whitespace-normal dark:bg-background my-4 md:py-10 ",
      value: title,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
         if (e.target.value !== data.title) {
            handleSave(e.target.value);
         }
      },
      onKeyDown: handleKeyDown,
   };

   if (!data) {
      return <ErrorFallback error={new Error("Note not found")} />;
   }

   return (
      <MainLayout header={<Header data={data} isSaving={isSaving} />}>
         <div className="max-w-5xl mx-auto flex flex-col">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
               <Input {...inputProps} />
            </div>
            <NoteEditor data={data} debouncedSave={debouncedContentSave} />
         </div>
      </MainLayout>
   );
}
