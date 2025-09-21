import * as React from "react";
import { Moon, Sun } from "lucide-react"; // Optional: For icons; install lucide-react if needed
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "next-themes";

export function ThemePicker() {
   const { setTheme, theme } = useTheme();

   return (
      <ToggleGroup
         type="single"
         value={theme}
         onValueChange={(value) => setTheme(value)}
         aria-label="Select theme"
      >
         <ToggleGroupItem
            value="system"
            aria-label="System theme"
            size={"sm"}
            className="w-[200px]"
         >
            <span className="sr-only">System</span>
            System
         </ToggleGroupItem>
         <ToggleGroupItem value="light" aria-label="Light theme">
            <Sun className="h-3 w-3" />
            <span className="sr-only">Light</span>
         </ToggleGroupItem>
         <ToggleGroupItem value="dark" aria-label="Dark theme">
            <Moon className="h-3 w-3" />
            <span className="sr-only">Dark</span>
         </ToggleGroupItem>
      </ToggleGroup>
   );
}
