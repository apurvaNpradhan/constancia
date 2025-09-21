import type { note } from "@constancia/server";
import { Plate, usePlateEditor } from "platejs/react";
import { TrailingBlockPlugin, type Value } from "platejs";

//Plate components

import { Editor, EditorContainer } from "@/components/ui/editor";
import { BasicBlocksKit } from "@/components/editor/plugins/basic-blocks-kit";
import { CodeBlockKit } from "@/components/editor/plugins/code-block-kit";
import { DateKit } from "@/components/editor/plugins/date-kit";
import { LinkKit } from "@/components/editor/plugins/link-kit";
import { TableKit } from "@/components/editor/plugins/table-kit";
import { BasicMarksKit } from "@/components/editor/plugins/basic-marks-kit";
import { ToggleKit } from "@/components/editor/plugins/toggle-kit";
import { FontKit } from "@/components/editor/plugins/font-kit";
import { MarkdownKit } from "@/components/editor/plugins/markdown-kit";
import { ListKit } from "@/components/editor/plugins/list-kit";
import { TocKit } from "@/components/editor/plugins/toc-kit";
import { ColumnKit } from "@/components/editor/plugins/column-kit";
import { AlignKit } from "@/components/editor/plugins/align-kit";
import { LineHeightKit } from "@/components/editor/plugins/line-height-kit";
import { SlashKit } from "@/components/editor/plugins/slash-kit";
import { CursorOverlayKit } from "@/components/editor/plugins/cursor-overlay-kit";
import { BlockMenuKit } from "@/components/editor/plugins/block-menu-kit";
import { EmojiKit } from "@/components/editor/plugins/emoji-kit";
import { BlockPlaceholderKit } from "@/components/editor/plugins/block-placeholder-kit";
import { DndKit } from "@/components/editor/plugins/dnd-kit";
import { FloatingToolbarKit } from "@/components/editor/plugins/floating-toolbar-kit";
import { CalloutKit } from "@/components/editor/plugins/callout-kit";
import { AutoformatKit } from "@/components/editor/plugins/autoformat-kit";
import { FixedToolbarKit } from "@/components/editor/plugins/fixed-toolbar-kit";
interface NoteEditorProps {
   data: note.NoteSchema;
   debouncedSave: (value: Value) => void;
}

const initialValue: Value = [
   {
      children: [{ text: "Title" }],
      type: "h3",
   },
   {
      children: [{ text: "This is a quote." }],
      type: "blockquote",
   },
   {
      children: [
         { text: "With some " },
         { bold: true, text: "bold" },
         { text: " text for emphasis!" },
      ],
      type: "p",
   },
];
export default function NoteEditor({ data, debouncedSave }: NoteEditorProps) {
   const editor = usePlateEditor({
      value: () => {
         return data.content as Value;
      },
      plugins: [
         ...BasicBlocksKit,
         ...CodeBlockKit,
         ...TableKit,
         ...ToggleKit,
         ...TocKit,
         ...CalloutKit,
         ...ColumnKit,
         ...DateKit,
         ...LinkKit,
         ...BasicMarksKit,
         ...FontKit,
         ...ListKit,
         ...AlignKit,
         ...LineHeightKit,
         ...SlashKit,
         ...AutoformatKit,
         ...CursorOverlayKit,
         ...BlockMenuKit,
         ...DndKit,
         ...EmojiKit,
         TrailingBlockPlugin,
         ...MarkdownKit,
         ...BlockPlaceholderKit,
         ...FloatingToolbarKit,
         ...ToggleKit,
         ...FixedToolbarKit,
      ],
   });

   return (
      <Plate
         editor={editor}
         onChange={({ value }) => {
            debouncedSave(value);
         }}
      >
         <EditorContainer>
            <Editor placeholder="Write something..." variant={"fullWidth"} />
         </EditorContainer>
      </Plate>
   );
}
