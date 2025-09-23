import { FavoriteToggle } from "@/components/common/notes/favorite-toggle";
import StickyToc from "@/components/editor/sticky-toc";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Sheet,
   SheetClose,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { note } from "@constancia/server";
import { PanelRightIcon, TableOfContents } from "lucide-react";
import type { PlateEditor } from "platejs/react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { MdInfoOutline } from "react-icons/md";

interface HeaderProps {
   data: note.NoteSchema;
   isSaving?: boolean;
   handleFavorite?: (id: string, isFavorite: boolean) => void;
   editor?: PlateEditor | null;
   editorContentRef?: React.RefObject<HTMLDivElement>;
}

export function HeaderNav({
   data,
   handleFavorite,
   isSaving,
   editor,
   editorContentRef,
}: HeaderProps) {
   const { title } = data;

   return (
      <div className="w-full flex justify-between py-1 items-center h-10 relative">
         <div className="flex items-center gap-1.5 w-full">
            <SidebarTrigger />
            {title && <span className="text-sm font-bold">{title}</span>}
            {!title && <span className="text-sm text-muted-foreground font-bold">Untitled</span>}
            <FavoriteToggle note={data} onToggle={handleFavorite ?? (() => {})} />
            <MdInfoOutline className="text-sm text-muted-foreground" />
            <IoEllipsisHorizontal className="text-sm text-muted-foreground" />
         </div>
         {isSaving && <span className="pr-3 text-sm text-muted-foreground">Saving...</span>}
         <NoteSheet editor={editor} editorContentRef={editorContentRef} />
      </div>
   );
}

interface NoteSheetProps {
   editor?: PlateEditor | null;
   editorContentRef?: React.RefObject<HTMLDivElement>;
}

const NoteSheet = ({ editor, editorContentRef }: NoteSheetProps) => {
   const tabs = [
      {
         name: "Table of Contents",
         value: "toc",
         icon: TableOfContents,
         content: editor ? (
            <StickyToc editor={editor} />
         ) : (
            <div className="text-sm text-gray-500">Editor not available</div>
         ),
      },
   ];

   return (
      <Sheet modal={false}>
         <SheetTrigger asChild>
            <Button variant={"ghost"}>
               <PanelRightIcon />
            </Button>
         </SheetTrigger>
         <SheetContent className="h-[calc(100svh-40px)] lg:h-[calc(100svh-56px)] top-auto p-3 flex flex-col">
            <SheetHeader>
               <Tabs defaultValue={tabs[0].value}>
                  <TabsList className="grid grid-cols-1 gap-2">
                     {tabs.map(({ icon: Icon, name, value }) => (
                        <Tooltip key={value}>
                           <TooltipTrigger asChild>
                              <span>
                                 <TabsTrigger
                                    value={value}
                                    className="flex flex-col items-center gap-1"
                                    aria-label="tab-trigger"
                                 >
                                    <Icon />
                                 </TabsTrigger>
                              </span>
                           </TooltipTrigger>
                           <TooltipContent className="px-2 py-1 text-xs">{name}</TooltipContent>
                        </Tooltip>
                     ))}
                  </TabsList>
               </Tabs>
            </SheetHeader>
            <Tabs defaultValue={tabs[0].value} className="flex-1 flex flex-col">
               {tabs.map((tab) => (
                  <div key={tab.value}>
                     <SheetTitle className="px-3 py-2">{tab.name}</SheetTitle>
                     <TabsContent
                        value={tab.value}
                        className="px-3 pb-3 mt-0"
                        style={{ maxHeight: "calc(100% - 4rem)" }} // Adjust for header and footer
                     >
                        <div className="max-h-full overflow-auto">{tab.content}</div>
                     </TabsContent>
                  </div>
               ))}
            </Tabs>
            <SheetFooter className="pt-3">
               <SheetClose asChild>
                  <Button type="submit">Accept</Button>
               </SheetClose>
               <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
               </SheetClose>
            </SheetFooter>
         </SheetContent>
      </Sheet>
   );
};
