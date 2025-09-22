import {
   BoldIcon,
   ItalicIcon,
   UnderlineIcon,
   HighlighterIcon,
   MoreHorizontalIcon,
   StrikethroughIcon,
   Code2Icon,
   BaselineIcon,
   PaintBucketIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorReadOnly } from "platejs/react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AICommentToolbarButton, AIToolbarButton } from "./ai-toolbar-button";
import { AlignToolbarButton } from "./align-toolbar-button";
import { CommentToolbarButton } from "./comment-toolbar-button";
import { EmojiToolbarButton } from "./emoji-toolbar-button";
import { ExportToolbarButton } from "./export-toolbar-button";
import { FontColorToolbarButton } from "./font-color-toolbar-button";
import { FontSizeToolbarButton } from "./font-size-toolbar-button";
import { RedoToolbarButton, UndoToolbarButton } from "./history-toolbar-button";
import { ImportToolbarButton } from "./import-toolbar-button";
import { IndentToolbarButton, OutdentToolbarButton } from "./indent-toolbar-button";
import { InsertToolbarButton } from "./insert-toolbar-button";
import { LineHeightToolbarButton } from "./line-height-toolbar-button";
import { LinkToolbarButton } from "./link-toolbar-button";
import {
   BulletedListToolbarButton,
   NumberedListToolbarButton,
   TodoListToolbarButton,
} from "./list-toolbar-button";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { MediaToolbarButton } from "./media-toolbar-button";
import { ModeToolbarButton } from "./mode-toolbar-button";
import { MoreToolbarButton } from "./more-toolbar-button";
import { TableToolbarButton } from "./table-toolbar-button";
import { ToggleToolbarButton } from "./toggle-toolbar-button";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoToolbarButton } from "./turn-into-toolbar-button";
import { Button } from "./button";

export function FixedToolbarButtons() {
   const readOnly = useEditorReadOnly();

   return (
      <div className="relative flex w-full justify-center">
         {!readOnly && (
            <>
               <ToolbarGroup>
                  <InsertToolbarButton />
                  <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
                     <BoldIcon />
                  </MarkToolbarButton>
                  <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
                     <ItalicIcon />
                  </MarkToolbarButton>
                  <MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline (⌘+U)">
                     <UnderlineIcon />
                  </MarkToolbarButton>
                  <MarkToolbarButton nodeType={KEYS.strikethrough} tooltip="Strikethrough (⌘+⇧+M)">
                     <StrikethroughIcon />
                  </MarkToolbarButton>
                  <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
                     <BaselineIcon />
                  </FontColorToolbarButton>
                  <FontColorToolbarButton
                     nodeType={KEYS.backgroundColor}
                     tooltip="Background color"
                  >
                     <PaintBucketIcon />
                  </FontColorToolbarButton>
                  {/* <CommentToolbarButton /> */}
               </ToolbarGroup>

               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant={"ghost"} aria-label="More options" size={"sm"}>
                        <MoreHorizontalIcon />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuItem asChild>
                        <UndoToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <RedoToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <ExportToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <ImportToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <TurnIntoToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <FontSizeToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild></DropdownMenuItem>
                     <DropdownMenuItem asChild></DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <AlignToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <EmojiToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <LineHeightToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <OutdentToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <IndentToolbarButton />
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <MoreToolbarButton />
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </>
         )}

         <div className="grow" />
         <ToolbarGroup>
            <ModeToolbarButton />
         </ToolbarGroup>
      </div>
   );
}
