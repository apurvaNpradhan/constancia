import * as React from "react";
import {
   AudioWaveform,
   Blocks,
   Calendar,
   Command,
   Home,
   Inbox,
   MessageCircleQuestion,
   Search,
   Settings2,
   Sparkles,
   Trash2,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { MdDashboard, MdSettings } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdCalendarToday } from "react-icons/md";
import { FaDumbbell } from "react-icons/fa";
import { PiPlantFill } from "react-icons/pi";
import { MdOutlineSearch } from "react-icons/md";
const data = {
   teams: [
      {
         name: "Acme Inc",
         logo: Command,
         plan: "Enterprise",
      },
      {
         name: "Acme Corp.",
         logo: AudioWaveform,
         plan: "Startup",
      },
      {
         name: "Evil Corp.",
         logo: Command,
         plan: "Free",
      },
   ],
   navMain: [
      {
         title: "Search",
         url: "#",
         icon: MdOutlineSearch,
      },
      {
         title: "Dashobard",
         url: "/dashboard",
         icon: MdDashboard,
         isActive: true,
      },
      {
         title: "All notes",
         url: "/all",
         icon: IoDocumentsOutline,
      },
      {
         title: "Journals",
         url: "/journals",
         icon: MdCalendarToday,
      },
      {
         title: "Workouts",
         url: "/workouts",
         icon: FaDumbbell,
      },
      {
         title: "Habits",
         url: "/habits",
         icon: PiPlantFill,
      },
      {
         title: "Settings",
         url: "#",
         icon: MdSettings,
      },
   ],
   navSecondary: [
      {
         title: "Calendar",
         url: "#",
         icon: Calendar,
      },
      {
         title: "Settings",
         url: "#",
         icon: Settings2,
      },
      {
         title: "Templates",
         url: "#",
         icon: Blocks,
      },
      {
         title: "Trash",
         url: "#",
         icon: Trash2,
      },
      {
         title: "Help",
         url: "#",
         icon: MessageCircleQuestion,
      },
   ],
   favorites: [
      {
         name: "Project Management & Task Tracking",
         url: "#",
         emoji: "📊",
      },
      {
         name: "Family Recipe Collection & Meal Planning",
         url: "#",
         emoji: "🍳",
      },
      {
         name: "Fitness Tracker & Workout Routines",
         url: "#",
         emoji: "💪",
      },
      {
         name: "Book Notes & Reading List",
         url: "#",
         emoji: "📚",
      },
      {
         name: "Sustainable Gardening Tips & Plant Care",
         url: "#",
         emoji: "🌱",
      },
      {
         name: "Language Learning Progress & Resources",
         url: "#",
         emoji: "🗣️",
      },
      {
         name: "Home Renovation Ideas & Budget Tracker",
         url: "#",
         emoji: "🏠",
      },
      {
         name: "Personal Finance & Investment Portfolio",
         url: "#",
         emoji: "💰",
      },
      {
         name: "Movie & TV Show Watchlist with Reviews",
         url: "#",
         emoji: "🎬",
      },
      {
         name: "Daily Habit Tracker & Goal Setting",
         url: "#",
         emoji: "✅",
      },
   ],
   workspaces: [
      {
         name: "Personal Life Management",
         emoji: "🏠",
         pages: [
            {
               name: "Daily Journal & Reflection",
               url: "#",
               emoji: "📔",
            },
            {
               name: "Health & Wellness Tracker",
               url: "#",
               emoji: "🍏",
            },
            {
               name: "Personal Growth & Learning Goals",
               url: "#",
               emoji: "🌟",
            },
         ],
      },
      {
         name: "Professional Development",
         emoji: "💼",
         pages: [
            {
               name: "Career Objectives & Milestones",
               url: "#",
               emoji: "🎯",
            },
            {
               name: "Skill Acquisition & Training Log",
               url: "#",
               emoji: "🧠",
            },
            {
               name: "Networking Contacts & Events",
               url: "#",
               emoji: "🤝",
            },
         ],
      },
      {
         name: "Creative Projects",
         emoji: "🎨",
         pages: [
            {
               name: "Writing Ideas & Story Outlines",
               url: "#",
               emoji: "✍️",
            },
            {
               name: "Art & Design Portfolio",
               url: "#",
               emoji: "🖼️",
            },
            {
               name: "Music Composition & Practice Log",
               url: "#",
               emoji: "🎵",
            },
         ], //          <div className="h-svh overflow-hidden lg:p-2 w-full">
         //             <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full">
         //                {header}
         //                <div className={cn("overflow-auto w-full")}>{children}</div>
         //             </div>
         //          </div>
      },
      {
         name: "Home Management",
         emoji: "🏡",
         pages: [
            {
               name: "Household Budget & Expense Tracking",
               url: "#",
               emoji: "💰",
            },
            {
               name: "Home Maintenance Schedule & Tasks",
               url: "#",
               emoji: "🔧",
            },
            {
               name: "Family Calendar & Event Planning",
               url: "#",
               emoji: "📅",
            },
         ],
      },
      {
         name: "Travel & Adventure",
         emoji: "🧳",
         pages: [
            {
               name: "Trip Planning & Itineraries",
               url: "#",
               emoji: "🗺️",
            },
            {
               name: "Travel Bucket List & Inspiration",
               url: "#",
               emoji: "🌎",
            },
            {
               name: "Travel Journal & Photo Gallery",
               url: "#",
               emoji: "📸",
            },
         ],
      },
   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
