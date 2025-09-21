import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ellipsis, Home } from "lucide-react";
import { BsFillJournalBookmarkFill, BsGift } from "react-icons/bs";
import { CiDumbbell } from "react-icons/ci";
interface HeaderProps {
   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
   activeTab: string;
}

export const Header = ({ setActiveTab, activeTab }: HeaderProps) => {
   interface Tab {
      name: string;
      value: string;
      icon: React.ComponentType<any>;
   }

   const tabs: Tab[] = [
      { name: "Overview", value: "overview", icon: Home },
      { name: "Journal", value: "journal", icon: BsFillJournalBookmarkFill },
      { name: "Workouts", value: "workouts", icon: CiDumbbell },
      { name: "Habits", value: "habits", icon: BsGift },
   ];

   return (
      <div className="flex flex-col w-full ">
         <div className="w-full flex justify-between py-1 items-center border-b h-10">
            <div className="flex items-center gap-2">
               <SidebarTrigger />
               <Breadcrumb className="">
                  <BreadcrumbList>
                     <BreadcrumbItem className="hidden lg:block text-xs">
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                     </BreadcrumbItem>
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <Ellipsis className="text-foreground/50 h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="p-0" sideOffset={5}>
                           <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                     <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="items-center hidden md:flex"
                     >
                        <TabsList className="bg-background">
                           {tabs.map((tab) => (
                              <TabsTrigger
                                 key={tab.value}
                                 value={tab.value}
                                 className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 data-[state=active]:shadow-none dark:data-[state=active]:border-transparent"
                              >
                                 {tab.name}
                              </TabsTrigger>
                           ))}
                        </TabsList>
                     </Tabs>
                  </BreadcrumbList>
               </Breadcrumb>
            </div>
         </div>
         <Tabs value={activeTab} onValueChange={setActiveTab} className="flex md:hidden py-1">
            <TabsList className="bg-background">
               {tabs.map((tab) => (
                  <TabsTrigger
                     key={tab.value}
                     value={tab.value}
                     className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 data-[state=active]:shadow-none dark:data-[state=active]:border-transparent"
                  >
                     {tab.name}
                  </TabsTrigger>
               ))}
            </TabsList>
         </Tabs>
      </div>
   );
};
