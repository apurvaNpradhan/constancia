import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTRPC } from "@/utils/trpc";
import { note } from "../../../../../server/src/db/schema/index";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import { IoCalendarOutline, IoDocumentTextOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { getQueryClient } from "@/router";
import { toast } from "sonner";

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
function FavouriteToggle({
   note,
   onToggle,
}: {
   note: note.NoteSchema;
   onToggle: (id: string, isFavorite: boolean) => void;
}) {
   const [value, setValue] = useState(note.isFavorite);
   useEffect(() => {
      setValue(note.isFavorite);
   }, [note.isFavorite]);
   const handleToggle = (e: React.MouseEvent<HTMLButtonElement>, isFavorite: boolean) => {
      e.stopPropagation(); // Prevent the click event from bubbling to the Link
      setValue(isFavorite);
      onToggle(note.id, isFavorite);
   };
   return (
      <Button
         type="button"
         onClick={(e) => handleToggle(e, !value)}
         variant="ghost"
         size="sm"
         className="h-4 w-4 text-xs hover:bg-primary/10 hover:text-primary opacity-60 group-hover:opacity-100 transition-opacity"
      >
         {value ? <MdOutlineStar /> : <MdOutlineStarBorder />}
      </Button>
   );
}
function AllNotesTab() {
   const trpc = useTRPC();
   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
      ...trpc.noteRouter.getAllNotes.infiniteQueryOptions({
         limit: 30,
      }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });
   const queryClient = getQueryClient();
   const mutation = useMutation({
      ...trpc.noteRouter.updateNote.mutationOptions(),
      onSettled: (data) => {
         if (data?.id) {
            // Invalidate the specific note query
            queryClient.invalidateQueries({
               queryKey: trpc.noteRouter.getNoteById.queryKey({ id: data.id }),
            });

            // Invalidate the infinite query for all notes
            queryClient.invalidateQueries({
               queryKey: trpc.noteRouter.getAllNotes.infiniteQueryKey({ limit: 30 }),
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
         }
      },
      onError: () => {
         toast.error("Failed to update favorite status.");
      },
   });

   const toggleFavorite = async (id: string, isFavorite: boolean) => {
      window.event?.preventDefault();
      window.event?.stopPropagation();
      await mutation.mutateAsync({
         id,
         isFavorite: !isFavorite,
      });
   };

   const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

   if (!data || status === "error") {
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
                     <div className="mt-2 space-y-2">
                        {notes.map((note) => (
                           <Link
                              to="/notes/$id"
                              params={{ id: note.id }}
                              key={note.id}
                              className="flex flex-row justify-between items-center hover:bg-accent/70 rounded-sm p-2 transition-colors duration-200"
                           >
                              <div className="flex flex-row justify-start text-muted-foreground items-center group relative text-sm ">
                                 <p className="text-sm flex flex-row items-center gap-3">
                                    {note.type === "journal" ? (
                                       <IoCalendarOutline className="text-muted-foreground" />
                                    ) : (
                                       <IoDocumentTextOutline className="text-muted-foreground" />
                                    )}
                                    <span className="dark:text-white text-black">
                                       {note.type === "journal" ? note.entryDate : note.title}
                                    </span>
                                 </p>
                              </div>
                              <div className="flex flex-row items-center">
                                 <FavouriteToggle
                                    note={note}
                                    onToggle={() => toggleFavorite(note.id, note.isFavorite)}
                                 />
                              </div>
                           </Link>
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
