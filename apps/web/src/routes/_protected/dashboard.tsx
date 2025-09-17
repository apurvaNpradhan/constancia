import DashboardTabs from "@/components/common/dashboard/dashboard-tabs";
import { Header } from "@/components/layout/headers/dashboard/header";
import MainLayout from "@/components/layout/main-layout";
import { authClient } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_protected/dashboard")({
   component: RouteComponent,
});

function RouteComponent() {
   const navigate = Route.useNavigate();
   const [activeTab, setActiveTab] = useState("overview");

   return (
      <MainLayout
         headersNumber={2}
         header={<Header setActiveTab={setActiveTab} activeTab={activeTab} />}
      >
         <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </MainLayout>
   );
}
