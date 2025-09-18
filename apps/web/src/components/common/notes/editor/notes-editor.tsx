import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useDebouncedCallback } from "@mantine/hooks";
import type { note } from "@constancia/server";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { BlockNoteEditor, type Block, type PartialBlock } from "@blocknote/core";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { getQueryClient } from "@/router";

interface NoteEditorProps {
   data: note.NoteSchema;
   handleSave: (value: note.NoteUpdateSchema) => void;
}

export default function NoteEditor({ data, handleSave }: NoteEditorProps) {
   const trpc = useTRPC();
   const { id } = data;
   const queryClient = getQueryClient();
   const mutation = useMutation({
      ...trpc.noteRouter.updateNote.mutationOptions(),
      // onMutate: async (data) => {
      //    queryClient.setQueryData(
      //       trpc.noteRouter.getNoteById.queryOptions({
      //          id,
      //       }).queryKey,
      //       (oldData) =>
      //          oldData
      //             ? {
      //                  ...oldData,
      //                  title: data.title ?? oldData.title,
      //                  content: data.content ?? oldData.content,
      //               }
      //             : oldData
      //    );

      //    return undefined;
      // },
      onSettled: () => {
         queryClient.invalidateQueries({
            queryKey: trpc.noteRouter.getNotesByMonth.queryKey(),
         });
      },
   });
   const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined | "loading">(
      "loading"
   );
   const [error, setError] = useState<string | null>(null);
   const theme = useTheme();

   const debouncedSave = useDebouncedCallback(async (jsonBlocks: Block[]) => {
      try {
         await mutation.mutateAsync({
            id: data.id,
            content: JSON.stringify(jsonBlocks),
         });
      } catch (err) {
         setError("Failed to save note. Please try again.");
      }
   }, 1000);

   const isDark = theme.theme === "dark";

   useEffect(() => {
      if (data?.content) {
         try {
            const content = data.content as PartialBlock[];
            setInitialContent(content);
         } catch (err) {
            setError("Failed to load note content.");
            setInitialContent(undefined);
         }
      } else {
         setInitialContent(undefined);
      }
   }, [data]);

   const editor = useMemo(() => {
      if (initialContent === "loading") {
         return undefined;
      }
      try {
         return BlockNoteEditor.create({ initialContent });
      } catch (err) {
         setError("Failed to initialize editor.");
         return undefined;
      }
   }, [initialContent]);

   if (error) {
      return <div>Error: {error}</div>;
   }

   if (editor === undefined) {
      return <div>Loading content...</div>;
   }

   return (
      <BlockNoteView
         editor={editor}
         theme={isDark ? "dark" : "light"}
         data-theming-css
         onChange={() => {
            debouncedSave(editor.document);
         }}
      />
   );
}
