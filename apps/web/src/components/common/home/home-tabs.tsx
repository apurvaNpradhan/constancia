import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BsFillJournalBookmarkFill, BsGift } from "react-icons/bs";
import { CiDumbbell } from "react-icons/ci";
import HomeOverview from "./home-overview";
import JournalOverview from "./journal-overview";
import WorkoutOverview from "./workout-overview";
import HabitOverview from "./habit-overview";
import type { GoHomeFill } from "react-icons/go";
import { Home } from "lucide-react";

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

function HomeTabs({ activeTab, setActiveTab }: Props) {
   const tabs: Tab[] = [
      {
         name: "Overview",
         value: "overview",
         icon: Home,
         content: <HomeOverview />,
      },
      {
         name: "Journal",
         value: "journal",
         icon: BsFillJournalBookmarkFill,
         content: <JournalOverview />,
      },
      { name: "Workouts", value: "workouts", icon: CiDumbbell, content: <WorkoutOverview /> },
      { name: "Habits", value: "habits", icon: BsGift, content: <HabitOverview /> },
   ];

   return (
      <div className="w-full mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 space-y-6">
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

export default HomeTabs;
