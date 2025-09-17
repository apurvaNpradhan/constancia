import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function HeaderOptions() {
   return (
      <div className="flex flex-row gap-1 items-center h-[50px]">
         <Plus className="w-4 h-4 text-muted-foreground" />
      </div>
   );
}
