import React, { useRef } from "react";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import {
   useContentObserver,
   useTocElement,
   useTocElementState,
   type TocSideBarProps,
} from "@platejs/toc/react";
import type { PlateEditor } from "platejs/react";
import { ScrollArea } from "../ui/scroll-area";

const headingItemVariants = cva(
   "block h-auto w-full  truncate w-[360px] cursor-pointer truncate rounded-none px-0.5 py-1.5 text-left font-medium text-muted-foreground underline decoration-[0.5px] underline-offset-4 hover:bg-accent hover:text-muted-foreground",
   {
      variants: {
         depth: {
            1: "pl-0.5",
            2: "pl-[26px]",
            3: "pl-[50px]",
         },
      },
   }
);

const getBarStyles = (depth: number) => {
   const baseWidth = 16;
   const width = baseWidth - (depth - 1) * 4;
   const marginLeft = (depth - 1) * 4;
   return { width: `${width}px`, marginLeft: `${marginLeft}px` };
};

interface StickyTocProps extends TocSideBarProps {
   editor?: PlateEditor;
}
export default function StickyToc({
   open = true,
   rootMargin = "0px",
   topOffset = 0,
   editor,
}: StickyTocProps) {
   const state = useTocElementState();
   const { props: btnProps } = useTocElement(state);

   const tocRef = useRef<HTMLElement | null>(null);

   const { activeId } = useContentObserver({
      editorContentRef: useRef(null),
      isObserve: true,
      isScroll: true,
      rootMargin,
      status: 0,
   });

   return (
      <ScrollArea className="w-full h-[40%]">
         {state.headingList.length > 0 ? (
            state.headingList.map((item) => (
               <Button
                  key={item.id}
                  size={"sm"}
                  variant="ghost"
                  className={headingItemVariants()}
                  onClick={(e) => btnProps.onClick(e, item, "smooth")}
                  aria-current
               >
                  {item.title}
               </Button>
            ))
         ) : (
            <div className="text-sm text-gray-500">
               Create a heading to display the table of contents.
            </div>
         )}
      </ScrollArea>
   );
}
