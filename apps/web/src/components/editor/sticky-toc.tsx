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

const headingItemVariants = cva(
   "block h-auto w-full cursor-pointer truncate rounded-none px-0.5 py-1.5 text-left ",
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

export default function StickyToc({
   open = true,
   rootMargin = "0px",
   topOffset = 0,
}: TocSideBarProps) {
   const { headingList, onContentScroll, editor } = useTocElementState();
   const { props: btnProps } = useTocElement({ editor, headingList, onContentScroll });
   const tocRef = useRef<HTMLElement | null>(null);

   const { activeId } = useContentObserver({
      editorContentRef: useRef(null),
      isObserve: true,
      isScroll: true,
      rootMargin,
      status: 0,
   });

   return (
      <div className="group absolute top-0 right-0  z-10 max-h-[400px]">
         <div className="relative z-10 mr-2.5 flex flex-col justify-center pr-2 pb-3">
            <div className="flex flex-col gap-3 pb-3 pl-5">
               {headingList.map((item) => (
                  <div key={item.id}>
                     <div
                        className="h-0.5 rounded-[2px] bg-primary/20"
                        style={getBarStyles(item.depth)}
                     />
                  </div>
               ))}
            </div>
         </div>

         <nav
            className={clsx(
               "absolute -top-2.5 right-0 px-2.5 transition-all duration-300",
               "pointer-events-none translate-x-[10px] opacity-0",
               open &&
                  "group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100",
               "touch:opacity-100 touch:translate-x-0 touch:pointer-events-auto"
            )}
            aria-label="Table of contents"
            ref={tocRef}
         >
            <div
               id="toc_wrap"
               className="group/popover z-50 max-w-[calc(100vw-24px)] bg-popover text-popover-foreground shadow-floating outline-none -mr-2.5 max-h-[80vh] w-[242px] overflow-auto rounded-2xl p-3"
            >
               <div className="relative z-10 p-1.5">
                  <Button
                     variant="ghost"
                     className={clsx()}
                     type="button"
                     id="toc_item"
                     aria-current="false"
                  >
                     <div className="p-1">Table of Contents</div>
                  </Button>
                  {headingList.length > 0 ? (
                     headingList.map((item) => (
                        <Button
                           key={item.id}
                           variant="ghost"
                           className={headingItemVariants({ depth: item.depth as 1 | 2 | 3 })}
                           onClick={(e) => btnProps.onClick(e, item, "smooth")}
                           aria-current={activeId === item.id ? "true" : "false"}
                        >
                           {item.title}
                        </Button>
                     ))
                  ) : (
                     <div className="text-sm text-gray-500">
                        Create a heading to display the table of contents.
                     </div>
                  )}
               </div>
            </div>
         </nav>
      </div>
   );
}
