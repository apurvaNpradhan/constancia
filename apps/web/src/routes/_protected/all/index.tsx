import AllTabs from "@/components/common/notes/all-tabs";
import { Header } from "@/components/layout/headers/all/header";
import MainLayout from "@/components/layout/main-layout";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_protected/all/")({
   component: RouteComponent,
});

function RouteComponent() {
   const [activeTab, setActiveTab] = useState("notes");
   return (
      <MainLayout
         header={<Header activeTab={activeTab} setActiveTab={setActiveTab} />}
         headersNumber={2}
      >
         <AllTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </MainLayout>
   );
}
