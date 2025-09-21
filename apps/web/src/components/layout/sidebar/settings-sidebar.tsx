import { NavUser } from "@/components/nav-user";
import { MdOutlineColorLens } from "react-icons/md";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Settings2, Blocks, Trash2, MessageCircleQuestion } from "lucide-react";
import { FaDumbbell } from "react-icons/fa";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdOutlineSearch, MdHome, MdCalendarToday, MdSettings } from "react-icons/md";
import { PiPlantFill } from "react-icons/pi";
import { MdEdit } from "react-icons/md";

interface SettingsSidebarProps {
   activeTab: string;
   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const SettingTabs = [
   {
      name: "Appearance",
      value: "appearance",
      icon: MdOutlineColorLens,
   },
   {
      name: "Editor",
      value: "editor",
      icon: MdEdit,
   },
];

const data = {
   navMain: [
      { title: "Search", url: "#", icon: MdOutlineSearch },
      { title: "Home", url: "/home", icon: MdHome, isActive: true },
      { title: "All notes", url: "/notes/all", icon: IoDocumentsOutline },
      { title: "Journals", url: "/journals", icon: MdCalendarToday },
      { title: "Workouts", url: "/workouts", icon: FaDumbbell },
      { title: "Habits", url: "/habits", icon: PiPlantFill },
   ],
   navSecondary: [
      { title: "Calendar", url: "#", icon: Calendar },
      { title: "Settings", url: "#", icon: Settings2 },
      { title: "Templates", url: "#", icon: Blocks },
      { title: "Trash", url: "#", icon: Trash2 },
      { title: "Help", url: "#", icon: MessageCircleQuestion },
   ],
};

export function SettingsSidebar({
   activeTab,
   setActiveTab,
   ...props
}: React.ComponentProps<typeof Sidebar> & SettingsSidebarProps) {
   return (
      <Sidebar variant="sidebar" collapsible="icon" className="hidden md:flex" {...props}>
         <SidebarHeader>
            <span className="font-bold p-2">Settings</span>
            <NavUser />
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>General</SidebarGroupLabel>
               <SidebarGroupContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                     <TabsList asChild>
                        <NavMain items={SettingTabs} />
                     </TabsList>
                  </Tabs>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   );
}
import type { IconType } from "react-icons/lib";
import { Link, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useIsRouteActive } from "@/utils/is-route-active";

export function NavMain({
   items,
}: {
   items: {
      name: string;
      value: string;
      icon: IconType;
      //   isActive?: boolean;
      //   Action?: () => void;
   }[];
}) {
   //    const isActive = useIsRouteActive;
   return (
      <SidebarMenu>
         {items.map((item) => (
            <TabsTrigger
               key={item.value}
               value={item.value}
               asChild
               className="hover:bg-none data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full w-full justify-start rounded-none border-0 border-l-2 border-transparent data-[state=active]:shadow-none"
            >
               <SidebarMenuItem key={item.value} className="flex flex-row gap-2">
                  <item.icon className="text-muted-foreground" />
                  <span className="cursor-pointer">{item.name}</span>
               </SidebarMenuItem>
            </TabsTrigger>
         ))}
      </SidebarMenu>
   );
}
