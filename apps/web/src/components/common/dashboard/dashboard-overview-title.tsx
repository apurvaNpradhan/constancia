import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { getDayPeriod } from "@/utils/get-day-period";
import type { User } from "better-auth";
interface WelcomeMessageProps {
   user: User | undefined;
}
function formatWelcomeMessage({ user }: WelcomeMessageProps) {
   if (!user) {
      return `Good  ${getDayPeriod(new Date())}!`;
   }
   return `Good  ${getDayPeriod(new Date())}, ${user.name.split(" ")[0]}`;
}
function DashboardOverviewTitle() {
   const { data, isPending } = authClient.useSession();

   if (isPending) {
      return <Skeleton className="h-10 w-3/4 max-w-md" />;
   }

   return (
      <div className="space-y-1">
         <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
            {formatWelcomeMessage({
               user: data?.user,
            })}
         </h1>
         <p className="text-muted-foreground text-base lg:text-lg">Here's today's focus</p>
      </div>
   );
}

export default DashboardOverviewTitle;
