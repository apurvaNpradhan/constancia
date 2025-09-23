import { LuBox, LuBoxes } from "react-icons/lu";
import {
   AudioWaveform,
   Blocks,
   Calendar,
   Command,
   MessageCircleQuestion,
   Settings2,
   Trash2,
} from "lucide-react";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUser } from "@/components/nav-user";
import { MdHome, MdSettings, MdCalendarToday, MdOutlineSearch } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import { FaDumbbell } from "react-icons/fa";
import { PiPlantFill } from "react-icons/pi";
import { useSettingsStore } from "@/store/settings";
import { Button } from "@/components/ui/button";
import { NavSecondary } from "./nav-secondary";

interface Items {
   title: string;
   icon: any;
   url?: string;
   Action?: () => void;
   isActive?: boolean;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const { openModal, isOpen } = useSettingsStore();

   const data = {
      navMain: [
         // { title: "Search", url: "#", icon: MdOutlineSearch },
         { title: "Home", url: "/home", icon: MdHome, isActive: true },
         { title: "Journals", url: "/journals", icon: MdCalendarToday },
         { title: "Workouts", url: "/workouts", icon: FaDumbbell },
         { title: "Habits", url: "/habits", icon: PiPlantFill },

         { title: "All Notes", url: "/notes/all", icon: IoDocumentsOutline },
      ],
      navSecondary: [
         {
            title: "Spaces",
            url: "/spaces",
            icon: LuBoxes,
            isActive: true,
            items: [
               {
                  title: "Coding",
                  url: "#",
               },
            ],
         },
      ],
   };
   const footerData = [
      {
         title: "Settings",
         isActive: isOpen,
         icon: MdSettings,
         Action: () => {
            openModal();
         },
      },
   ];

   return (
      <Sidebar variant="sidebar" collapsible="icon" className="border-r-0" {...props}>
         <SidebarHeader>
            <NavUser />
            <NavMain items={data.navMain} />
         </SidebarHeader>
         <SidebarContent>
            <NavSecondary items={data.navSecondary} />
            <SidebarFooter>
               <NavMain items={footerData} />
            </SidebarFooter>
         </SidebarContent>
         <SidebarContent />
         <SidebarRail />
      </Sidebar>
   );
}
