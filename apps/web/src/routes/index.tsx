import { authClient } from "@/lib/auth-client";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hammer, User } from "lucide-react";
export const Route = createFileRoute("/")({
   component: RouteComponent,
});
import { Badge } from "@/components/ui/badge";

function RouteComponent() {
   return (
      <div className="w-full min-h-dvh flex  flex-col">
         <header className="flex flex-row justify-between items-center  p-2 border-b">
            <span className="font-bold text-xl">Constancia</span>
            <SignInComponent />
         </header>
         <div className="container mx-auto px-4 sm:px-6">
            <div className="flex gap-6 sm:gap-8 py-12 sm:py-20 lg:py-32 items-center justify-center flex-col text-center">
               <div>
                  <Badge className="bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 shadow-none rounded-full">
                     <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" /> In Progress
                  </Badge>
               </div>

               <div className="flex gap-3 sm:gap-4 flex-col max-w-4xl">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-semibold leading-tight">
                     Your Life, Organized with <span className="text-primary">Constancia</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl sm:max-w-2xl mx-auto">
                     Your personal Life OS. Journal, track workouts, build habits—all in one place.
                  </p>
               </div>

               <div className=" gap-3 w-full sm:w-auto"></div>
            </div>
         </div>
      </div>
   );
}

function SignInComponent() {
   const { data: session, isPending } = authClient.useSession();
   return (
      <Button
         variant="outline"
         asChild
         size="lg"
         className={cn(
            "transition-colors text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3",
            isPending && "opacity-50 cursor-not-allowed"
         )}
         disabled={isPending}
      >
         <Link to={session ? "/home" : "/sign-in"} className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{session ? "Home" : "Sign In"}</span>
         </Link>
      </Button>
   );
}
