import * as Toggle from "@/components/ui/toggle";
import * as Checkbox from "@/components/ui/checkbox";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import type { note } from "@constancia/server";
import { BlockNoteEditor, type Block, type PartialBlock } from "@blocknote/core";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

interface NoteEditorProps {
   data: note.NoteSchema;
   debouncedSave: (value: Block[]) => void;
}

export default function NoteEditor({ data, debouncedSave }: NoteEditorProps) {
   const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined | "loading">(
      "loading"
   );
   const [error, setError] = useState<string | null>(null);
   const theme = useTheme();
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
         return BlockNoteEditor.create({ domAttributes: {}, initialContent });
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
         // shadCNComponents={{}}
         data-theming-css
         onChange={() => {
            if (editor) {
               debouncedSave(editor.document);
            }
         }}
      />
   );
}
