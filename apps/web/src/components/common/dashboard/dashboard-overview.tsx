import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getDayPeriod } from "@/utils/get-day-period";
import type { User } from "better-auth";

interface WelcomeMessageProps {
   user: User | undefined;
}

function formatWelcomeMessage({ user }: WelcomeMessageProps) {
   if (!user) {
      return `Good ${getDayPeriod(new Date())}!`;
   }
   return `Good ${getDayPeriod(new Date())}, ${user.name?.split(" ")[0] || ""}`;
}

// Individual Widget Component
function Widget({
   title,
   addActionText,
   onAddClick,
}: {
   title: string;
   addActionText: string;
   onAddClick: () => void;
}) {
   return (
      <Card className="border-none shadow-none">
         <CardContent className="p-4 pt-0">
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
               <p className="text-sm mb-4">No entries yet</p>
               <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={onAddClick}
               >
                  <Plus className="h-4 w-4" />
                  {addActionText}
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}

// Loading Skeleton for Widget
function WidgetSkeleton() {
   return (
      <Card className="border-none shadow-sm">
         <CardHeader className="p-4">
            <Skeleton className="h-6 w-1/3" />
         </CardHeader>
         <CardContent className="p-4 pt-0">
            <div className="flex flex-col items-center justify-center h-32">
               <Skeleton className="h-4 w-24 mb-4" />
               <Skeleton className="h-8 w-32" />
            </div>
         </CardContent>
      </Card>
   );
}

function DashboardOverview() {
   const { data, isPending } = authClient.useSession();

   if (isPending) {
      return (
         <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 max-w-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <WidgetSkeleton />
               <WidgetSkeleton />
               <WidgetSkeleton />
               <WidgetSkeleton />
            </div>
         </div>
      );
   }

   return (
      <div className=" space-y-6">
         <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
               {formatWelcomeMessage({ user: data?.user })}
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg">Here's today's overview</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Widget
               title="Journal"
               addActionText="Add Journal Entry"
               onAddClick={() => console.log("Add journal entry")}
            />
            <Widget
               title="Workout"
               addActionText="Add Workout"
               onAddClick={() => console.log("Add workout")}
            />
            <Widget
               title="Expenses"
               addActionText="Add Expense"
               onAddClick={() => console.log("Add expense")}
            />
            <Widget
               title="Habits"
               addActionText="Add Habit"
               onAddClick={() => console.log("Add habit")}
            />
         </div>
      </div>
   );
}
export default DashboardOverview;
