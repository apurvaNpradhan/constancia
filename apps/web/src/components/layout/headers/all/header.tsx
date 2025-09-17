import { HeaderNav } from "./header-nav";
import { HeaderOptions } from "./header-options";

interface HeaderProps {
   activeTab: string;
   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
   return (
      <div className="flex flex-col w-full px-1.5 ">
         <HeaderNav activeTab={activeTab} setActiveTab={setActiveTab} />
         {/* <HeaderOptions /> */}
      </div>
   );
}
