import { ChevronRight, type LucideIcon } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
   SidebarGroup,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuAction,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { IconType } from "react-icons/lib";

export function NavSecondary({
   items,
}: {
   items: {
      title: string;
      url: string;
      icon: IconType;
      isActive?: boolean;
      items?: {
         title: string;
         url: string;
      }[];
   }[];
}) {
   return (
      <SidebarGroup>
         <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
         <SidebarMenu>
            {items.map((item) => (
               <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                  <SidebarMenuItem>
                     <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.url}>
                           <item.icon />
                           <span>{item.title}</span>
                        </a>
                     </SidebarMenuButton>
                     {item.items?.length ? (
                        <>
                           <CollapsibleTrigger asChild>
                              <SidebarMenuAction className="data-[state=open]:rotate-90">
                                 <ChevronRight />
                                 <span className="sr-only">Toggle</span>
                              </SidebarMenuAction>
                           </CollapsibleTrigger>
                           <CollapsibleContent>
                              <SidebarMenuSub>
                                 {item.items?.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                       <SidebarMenuSubButton asChild>
                                          <a href={subItem.url} className="flex flex-row ">
                                             <div className="w-0.5 h-[calc(100%-6px)]  bg-amber-500" />
                                             <span>{subItem.title}</span>
                                          </a>
                                       </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                 ))}
                              </SidebarMenuSub>
                           </CollapsibleContent>
                        </>
                     ) : null}
                  </SidebarMenuItem>
               </Collapsible>
            ))}
         </SidebarMenu>
      </SidebarGroup>
   );
}
