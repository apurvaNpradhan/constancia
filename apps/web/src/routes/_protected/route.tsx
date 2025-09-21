import { SettingsModalProvider } from "@/components/common/settings/settings-modal-provider";
import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
   component: RouteComponent,
});

function RouteComponent() {
   const { data: session, isPending } = authClient.useSession();

   if (isPending) {
      return <Loader />;
   }

   if (!session?.user) {
      return <Navigate to="/sign-in" />;
   }

   return (
      <div className="w-full">
         <Outlet />
      </div>
   );
}
