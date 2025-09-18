import type { ReactNode } from "react";
import { HeaderNav } from "./header-nav";

interface HeaderProps {
   activeTab: string;
   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
   monthPicker: ReactNode;
}

export function Header({ activeTab, setActiveTab, monthPicker }: HeaderProps) {
   return (
      <div className="flex flex-col w-full px-1.5 ">
         <HeaderNav activeTab={activeTab} setActiveTab={setActiveTab} monthPicker={monthPicker} />
         {/* <HeaderOptions /> */}
      </div>
   );
}
