import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTRPC } from "@/utils/trpc";
import { note } from "../../../../../server/src/db/schema/index";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import React, { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const tabs = [
   {
      name: "Notes",
      value: "notes",
      component: <AllNotesTab />,
   },
];

interface allTabsProps {
   activeTab: string;
   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

function AllTabs({ activeTab, setActiveTab }: allTabsProps) {
   return (
      <div className="w-full">
         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="gap-4"
            defaultValue="notes"
         >
            {tabs.map((tab) => (
               <TabsContent key={tab.value} value={tab.value}>
                  {tab.component}
               </TabsContent>
            ))}
         </Tabs>
      </div>
   );
}

const groupNoteByDate = (notes: note.NoteSchema[]) => {
   return notes.reduce(
      (acc, note) => {
         const date = format(new Date(note.createdAt), "yyyy-MM-dd");
         if (!acc[date]) {
            acc[date] = [];
         }
         acc[date].push(note);
         return acc;
      },
      {} as Record<string, note.NoteSchema[]>
   );
};

function AllNotesTab() {
   const trpc = useTRPC();
   const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
      useInfiniteQuery({
         ...trpc.noteRouter.getAllNotes.infiniteQueryOptions({}),
         getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      });

   const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

   if (!data) {
      return <LoadingNotes />;
   }

   const allNotes = data.pages.flatMap((page) => page.notes);
   const groupedNotes = groupNoteByDate(allNotes);

   const toggleSection = (date: string) => {
      setOpenSections((prev) => ({
         ...prev,
         [date]: prev[date] === undefined ? false : !prev[date],
      }));
   };

   return (
      <div className="p-4">
         {Object.entries(groupedNotes)
            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
            .map(([date, notes]) => (
               <div key={date} className="mb-4">
                  <div className="flex flex-row gap-2 justify-start text-muted-foreground items-center group relative text-sm hover:bg-accent/70 rounded-sm py-1 px-2 transition-colors duration-200">
                     <span className="flex flex-row items-center">
                        {format(new Date(date), "MMMM d, yyyy")}
                     </span>
                     <div className="h-1 w-1 rounded-full bg-primary" />
                     <span>{notes.length}</span>
                     <button
                        onClick={() => toggleSection(date)}
                        className="opacity-0 p-0 group-hover:opacity-100 duration-200 transition-opacity hover:bg-accent rounded-md"
                     >
                        {openSections[date] === false ? (
                           <TiArrowSortedDown className="text-muted-foreground" />
                        ) : (
                           <TiArrowSortedUp className="text-muted-foreground" />
                        )}
                     </button>
                  </div>
                  {openSections[date] !== false && (
                     <div className="mt-2">
                        {notes.map((note) => (
                           <div
                              key={note.id}
                              className="flex flex-row gap-2 justify-start text-muted-foreground items-center group relative text-sm hover:bg-accent/70 rounded-sm py-1 px-2 transition-colors duration-200"
                           >
                              <p className="text-sm flex flex-row items-center gap-4">
                                 <IoDocumentTextOutline className="text-muted-foreground" />
                                 {note.title}
                              </p>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         {hasNextPage && (
            <div className="mt-4 text-center">
               <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
               >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
               </button>
            </div>
         )}
      </div>
   );
}

function LoadingNotes() {
   return (
      <div className="flex flex-col gap-4 p-4">
         <Skeleton className="w-[100px] h-4" />
         <Skeleton className="w-full h-4" />
         <Skeleton className="w-full h-4" />
      </div>
   );
}

export default AllTabs;
