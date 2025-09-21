import HomeTabs from "@/components/common/home/home-tabs";
import { Header } from "@/components/layout/headers/home/header";
import MainLayout from "@/components/layout/main-layout";
import { authClient } from "@/lib/auth-client";
import { getDayPeriod } from "@/utils/get-day-period";
import { useTRPC } from "@/utils/trpc";
import type { note } from "@constancia/server";
import { createFileRoute } from "@tanstack/react-router";
import type { User } from "better-auth";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_protected/home")({
   component: RouteComponent,
});

function RouteComponent() {
   const [activeTab, setActiveTab] = useState("overview");
   const trpc = useTRPC();
   const { data, isPending } = trpc.noteRouter.getAllNotes.infiniteQueryOptions({
      orderBy: "updated_asc",
   });

   return (
      <MainLayout
         headersNumber={2}
         header={<Header setActiveTab={setActiveTab} activeTab={activeTab} />}
      >
         <div className="  mt-10">
            <div className="flex flex-col  max-w-6xl  mx-auto">
               <FormatWelcomeMessage />
            </div>
         </div>
         {/* <HomeTabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      </MainLayout>
   );
}

const FormatWelcomeMessage = () => {
   return <span className="text-3xl font-bold text-center">Good {getDayPeriod(new Date())}</span>;
};

interface RecentActivity {
   notes: note.NoteSchema[];
}
const RecentActivities = ({ notes }: RecentActivity) => {
   return (
      <div className="flex flex-col gap-3 ">
         <span className="text-muted text-sm">Recent Activities</span>
         <div className="flex flex-row gap-2 items-center">
            {notes.map((note) => (
               <div key={note.id} className="flex flex-col gap-2 items-center">
                  <span className="text-sm text-muted">{note.title}</span>
                  <span className="text-xs text-muted">{note.updatedAt}</span>
               </div>
            ))}
         </div>
      </div>
   );
};
