import { Button } from "@/components/ui/button";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import {
   addMonths,
   format,
   subMonths,
   getDaysInMonth,
   eachDayOfInterval,
   startOfMonth,
   endOfMonth,
   isToday,
} from "date-fns";
import { GoTriangleRight, GoTriangleLeft } from "react-icons/go";
import { useState, type PropsWithChildren, type PropsWithoutRef } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/headers/journals/header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/main-layout";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { note } from "@constancia/server";

export const Route = createFileRoute("/_protected/journals/")({
   component: RouteComponent,
});

const JournalTab = ({ currentDate }: { currentDate: Date }) => {
   const month = currentDate.getMonth() + 1; // 1-12
   const year = currentDate.getFullYear();
   const trpc = useTRPC();

   const { data, isLoading, error } = useQuery(
      trpc.journal.getJournalsByMonth.queryOptions({
         month,
         year,
      })
   );

   const start = startOfMonth(new Date(year, month - 1));
   const end = endOfMonth(new Date(year, month - 1));
   const daysInMonth = eachDayOfInterval({ start, end });

   const noteMap = new Map();
   if (data?.notes) {
      data.notes.forEach((note) => {
         const noteDate = format(new Date(note.entryDate ?? ""), "yyyy-MM-dd");
         noteMap.set(noteDate, note);
      });
   }
   const mutation = useMutation(trpc.noteRouter.createNote.mutationOptions());
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const createJournalNote = async (
      e: React.MouseEvent,
      { note }: { note: note.NoteInsertSchema }
   ) => {
      e.stopPropagation();
      const [data] = await mutation.mutateAsync({
         type: "journal",
         entryDate: note.entryDate,
         title: note.title,
      });
      queryClient.invalidateQueries({
         queryKey: trpc.journal.getJournalsByMonth.queryKey(),
      });
      toast.success("Journal entry created successfully");
      navigate({
         to: "/notes/$id",
         params: {
            id: data.id,
         },
      });
   };
   if (isLoading) {
      return (
         <div className="p-4 max-w-4xl mx-auto">
            <div className="space-y-2">
               {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                     <div className="flex items-center justify-between p-1 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-4 bg-muted-foreground/20 rounded"></div>
                           <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
                           <div className="w-24 h-4 bg-muted-foreground/20 rounded"></div>
                        </div>
                        <div className="w-16 h-8 bg-muted-foreground/20 rounded"></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="p-4 max-w-4xl mx-auto">
            <div className="bg-destructive/10 text-destructive p-1 rounded-lg text-sm">
               Error loading journal entries: {error.message}
            </div>
         </div>
      );
   }

   return (
      <div className="p-4 max-w-4xl mx-auto">
         <div className="space-y-1">
            {daysInMonth.map((day) => {
               const dateStr = format(day, "yyyy-MM-dd");
               const note = noteMap.get(dateStr);
               const isCurrentDay = isToday(day);

               return (
                  <div
                     key={dateStr}
                     className={cn(
                        "group flex items-center justify-between p-1 rounded-lg transition-all duration-200 hover:bg-muted/50",
                        note ? " " : "bg-muted/ hover:bg-muted/40",
                        isCurrentDay && "  bg-primary/5"
                     )}
                  >
                     <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                           className={cn(
                              "text-sm tabular-nums w-6 text-right flex-shrink-0",
                              note ? "text-foreground" : "text-muted-foreground",
                              isCurrentDay && "text-primary"
                           )}
                        >
                           {format(day, "dd")}
                        </div>

                        <div
                           className={cn(
                              "text-xs font-medium w-4 text-center uppercase flex-shrink-0",
                              note ? "text-muted-foreground" : "text-muted-foreground/60",
                              isCurrentDay && "text-primary/80"
                           )}
                        >
                           {format(day, "E").charAt(0)}
                        </div>

                        <div
                           className={cn(
                              "text-sm truncate flex flex-col gap-1 flex-1",
                              note
                                 ? "text-foreground font-medium"
                                 : "text-muted-foreground/40 italic text-xs"
                           )}
                        >
                           <span className="text-sm">
                              {note ? (note.title ? note.title : "Untitled") : "No entry"}
                           </span>
                           <span className="text-xs text-muted-foreground/60 truncate">
                              {note?.content?.[0].content[0]?.text}
                           </span>
                        </div>
                     </div>

                     <div className="flex-shrink-0 ml-4">
                        {note ? (
                           <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 text-xs hover:bg-primary/10 hover:text-primary opacity-60 group-hover:opacity-100 transition-opacity"
                           >
                              <Link to="/notes/$id" params={{ id: note.id }}>
                                 Visit
                              </Link>
                           </Button>
                        ) : (
                           <Button
                              onClick={(e) =>
                                 createJournalNote(e, {
                                    note: { entryDate: dateStr, title: dateStr },
                                 })
                              }
                              variant="ghost"
                              size="sm"
                              className={cn(
                                 "h-8 px-3 text-xs transition-all duration-200",
                                 "opacity-40 group-hover:opacity-100",
                                 "hover:bg-primary/10 hover:text-primary hover:border-primary/20",
                                 "border border-transparent hover:shadow-sm"
                              )}
                           >
                              Create
                           </Button>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>

         {daysInMonth.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
               No days found for this month
            </div>
         )}
      </div>
   );
};

const tabs = [
   {
      name: "Journal",
      value: "journal",
      component: (props: any) => <JournalTab {...props} />,
   },
];

function RouteComponent() {
   const [activeTab, setActiveTab] = useState("journal");
   const [currentDate, setCurrentDate] = useState(new Date());

   const handlePrevMonth = () => {
      setCurrentDate(subMonths(currentDate, 1));
   };

   const handleNextMonth = () => {
      setCurrentDate(addMonths(currentDate, 1));
   };

   return (
      <MainLayout
         header={
            <Header
               activeTab={activeTab}
               setActiveTab={setActiveTab}
               monthPicker={
                  <div className="flex items-center  rounded-lg px-2 ">
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-background/80"
                        onClick={handlePrevMonth}
                     >
                        <GoTriangleLeft className="h-4 w-4" />
                     </Button>
                     <h1 className="text-sm font-medium px-3 tabular-nums min-w-[120px] text-center">
                        {format(currentDate, "MMMM yyyy")}
                     </h1>
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-background/80"
                        onClick={handleNextMonth}
                     >
                        <GoTriangleRight className="h-4 w-4" />
                     </Button>
                  </div>
               }
            />
         }
      >
         <div className="w-full">
            <Tabs
               value={activeTab}
               onValueChange={setActiveTab}
               className="w-full"
               defaultValue="journal"
            >
               {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="mt-0">
                     {tab.component({ currentDate })}
                  </TabsContent>
               ))}
            </Tabs>
         </div>
      </MainLayout>
   );
}
