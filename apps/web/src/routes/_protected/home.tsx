// RouteComponent.tsx (update to pass status to RecentActivities and NoteCarousel)
import HomeTabs from "@/components/common/home/home-tabs";
import { Header } from "@/components/layout/headers/home/header";
import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { getDayPeriod } from "@/utils/get-day-period";
import { useTRPC } from "@/utils/trpc";
import type { note } from "@constancia/server";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import NoteCarousel from "@/components/common/home/activities-carousel"; // Import NoteCarousel

export const Route = createFileRoute("/_protected/home")({
   component: RouteComponent,
});

function RouteComponent() {
   const [activeTab, setActiveTab] = useState("overview");
   const trpc = useTRPC();
   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
      ...trpc.noteRouter.getAllNotes.infiniteQueryOptions({
         limit: 30,
         orderBy: "updated_desc",
      }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });

   function PendingActivitySkeleton() {
      return (
         <div className="flex flex-col gap-3 ">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex flex-row gap-2 items-center">
               <Skeleton className="h-6 w-1/3" />
               <Skeleton className="h-4 w-1/3" />
            </div>
         </div>
      );
   }

   return (
      <MainLayout
         headersNumber={2}
         header={<Header setActiveTab={setActiveTab} activeTab={activeTab} />}
      >
         <div className="mt-10">
            <div className="flex flex-col max-w-6xl mx-auto space-y-8">
               <FormatWelcomeMessage />
               <RecentActivities
                  notes={data?.pages.flatMap((page) => page.notes) ?? []}
                  status={status}
               />
            </div>
         </div>
      </MainLayout>
   );
}

const FormatWelcomeMessage = () => {
   return <span className="text-3xl font-bold text-center">Good {getDayPeriod(new Date())}</span>;
};

interface RecentActivity {
   notes: note.NoteSchema[];
   status?: "pending" | "error" | "success"; // Pass status to RecentActivities
}

const RecentActivities = ({ notes, status }: RecentActivity) => {
   return (
      <div className="flex flex-col">
         <span className="text-muted-foreground text-xs flex flex-row gap-2 items-center">
            <Clock className="h-4 w-4" />
            Recent Activities
         </span>
         <NoteCarousel notes={notes} status={status} /> {/* Pass status to NoteCarousel */}
      </div>
   );
};
