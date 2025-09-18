import NoteEditor from "@/components/common/notes/editor/notes-editor";
import Header from "@/components/header";
import MainLayout from "@/components/layout/main-layout";
import { Input } from "@/components/ui/input";
import { getQueryClient } from "@/router";
import { useTRPC } from "@/utils/trpc";
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
   const { data, isPending } = useSuspenseQuery(
      trpc.noteRouter.getNoteById.queryOptions({
         id,
      })
   );
   if (isPending) {
      return <div>Loading...</div>;
   }

   const [error, setError] = useState<string | null>(null);
   const [title, setTitle] = useState(data.title ?? "");
   const queryClient = getQueryClient();
   const mutation = useMutation({
      ...trpc.noteRouter.updateNote.mutationOptions(),
      onMutate: async (data) => {
         queryClient.setQueryData(
            trpc.noteRouter.getNoteById.queryOptions({
               id,
            }).queryKey,
            (oldData) =>
               oldData
                  ? {
                       ...oldData,
                       title: data.title ?? oldData.title,
                       content: data.content ?? oldData.content,
                    }
                  : oldData
         );
         return undefined;
      },
   });
   const debouncedSave = useDebouncedCallback(async (value: note.NoteUpdateSchema) => {
      try {
         await mutation.mutateAsync({
            id: data.id,
            title: value.title ?? "",
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
      debouncedSave({ title: value });
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
                  <NoteEditor data={data} />
               </div>
            </MainLayout>
         );
      case "journal":
         return (
            <MainLayout header={<Header />}>
               <div className="p-4 w-full max-w-5xl mx-auto">
                  <Input {...inputProps} />
                  <NoteEditor data={data} />
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
