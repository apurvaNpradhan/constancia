import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboardIcon } from "lucide-react";
import { BsFillJournalBookmarkFill, BsGift } from "react-icons/bs";
import { CiDumbbell } from "react-icons/ci";
import DashboardOverview from "./dashboard-overview";

interface Tab {
   name: string;
   value: string;
   icon: React.ComponentType<any>;
   content: React.ReactNode;
}

interface Props {
   activeTab?: string;
   setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

function DashboardTabs({ activeTab, setActiveTab }: Props) {
   const tabs: Tab[] = [
      {
         name: "Overview",
         value: "overview",
         icon: LayoutDashboardIcon,
         content: <DashboardOverview />,
      },
      {
         name: "Journal",
         value: "journal",
         icon: BsFillJournalBookmarkFill,
         content: <div>Journal</div>,
      },
      { name: "Workouts", value: "workouts", icon: CiDumbbell, content: <div>Workouts</div> },
      { name: "Habits", value: "habits", icon: BsGift, content: <div>Habits</div> },
   ];

   return (
      <div className="w-full">
         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="gap-4"
            defaultValue="overview"
         >
            {tabs.map((tab) => (
               <TabsContent key={tab.value} value={tab.value}>
                  <div>{tab.content}</div>
               </TabsContent>
            ))}
         </Tabs>
      </div>
   );
}

export default DashboardTabs;
