import { ModeToggle } from "@/components/mode-toggle";
import {
   Breadcrumb,
   BreadcrumbList,
   BreadcrumbItem,
   BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ellipsis } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
   {
      name: "Journal",
      value: "journal",
   },
];

interface HeaderProps {
   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
   activeTab: string;
   monthPicker: ReactNode;
}

export function HeaderNav({ activeTab, setActiveTab, monthPicker }: HeaderProps) {
   return (
      <div className="w-full flex justify-between py-1 items-center h-10 relative">
         <div className="flex items-center gap-2 w-full">
            <SidebarTrigger />
            <Breadcrumb className="items-center flex w-full flex-row">
               <BreadcrumbList className="">
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
               <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center">
                  {monthPicker}
               </div>
            </Breadcrumb>
         </div>
         <div className="flex items-center">
            <ModeToggle />
         </div>
      </div>
   );
}
