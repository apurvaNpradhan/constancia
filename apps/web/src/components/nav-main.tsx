import { type LucideIcon } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import type { IconType } from "react-icons/lib";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useIsRouteActive } from "@/utils/is-route-active";

export function NavMain({
   items,
}: {
   items: {
      title: string;
      url: string;
      icon: IconType;
      isActive?: boolean;
   }[];
}) {
   const isActive = useIsRouteActive;
   return (
      <SidebarMenu>
         {items.map((item) => (
            <SidebarMenuItem key={item.title}>
               <SidebarMenuButton asChild isActive={isActive(item.url)}>
                  <a href={item.url}>
                     <item.icon className="text-muted-foreground" />
                     <span>{item.title}</span>
                  </a>
               </SidebarMenuButton>
            </SidebarMenuItem>
         ))}
      </SidebarMenu>
   );
}
