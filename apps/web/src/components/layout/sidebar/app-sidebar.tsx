import {
   AudioWaveform,
   Blocks,
   Calendar,
   Command,
   MessageCircleQuestion,
   Settings2,
   Trash2,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { MdHome, MdSettings, MdCalendarToday, MdOutlineSearch } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import { FaDumbbell } from "react-icons/fa";
import { PiPlantFill } from "react-icons/pi";
import { useSettingsStore } from "@/store/settings";
import { Button } from "@/components/ui/button";

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
         { title: "Search", url: "#", icon: MdOutlineSearch },
         { title: "Home", url: "/home", icon: MdHome, isActive: true },
         { title: "All notes", url: "/notes/all", icon: IoDocumentsOutline },
         { title: "Journals", url: "/journals", icon: MdCalendarToday },
         { title: "Workouts", url: "/workouts", icon: FaDumbbell },
         { title: "Habits", url: "/habits", icon: PiPlantFill },
         {
            title: "Settings",
            isActive: isOpen,
            icon: MdSettings,
            Action: () => {
               openModal();
            },
         },
      ],
      navSecondary: [
         { title: "Calendar", url: "#", icon: Calendar },
         { title: "Settings", url: "#", icon: Settings2 },
         { title: "Templates", url: "#", icon: Blocks },
         { title: "Trash", url: "#", icon: Trash2 },
         { title: "Help", url: "#", icon: MessageCircleQuestion },
      ],
   };

   return (
      <Sidebar variant="sidebar" collapsible="icon" className="border-r-0" {...props}>
         <SidebarHeader>
            <NavUser />
            <NavMain items={data.navMain} />
         </SidebarHeader>
         <SidebarContent />
         <SidebarRail />
      </Sidebar>
   );
}
