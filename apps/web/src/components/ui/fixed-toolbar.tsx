import { cn } from "@/lib/utils";

import { Toolbar } from "./toolbar";

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
   return (
      <Toolbar
         {...props}
         className={cn(
            "   mx-auto max-w-3xl   scrollbar-hide w-full  justify-between overflow-x-auto rounded-t-lg border-b border-b-border bg-background/95 p-1 backdrop-blur-sm supports-backdrop-blur:bg-background/60",
            props.className
         )}
      />
   );
}
