import { FavoriteToggle } from "@/components/common/notes/favorite-toggle";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { note } from "@constancia/server";
import { Ellipsis, Info } from "lucide-react";
import type { ReactNode } from "react";
import { BsInfo, BsInfoCircle } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { MdInfo, MdInfoOutline } from "react-icons/md";

const tabs = [
   {
      name: "Journal",
      value: "journal",
   },
];

interface HeaderProps {
   data: note.NoteSchema;
   isSaving?: boolean;
   handleFavorite?: (id: string, isFavorite: boolean) => void;
}

export function HeaderNav({ data, handleFavorite, isSaving }: HeaderProps) {
   const { title } = data;
   return (
      <div className="w-full flex justify-between py-1 items-center h-10 relative">
         <div className="flex items-center gap-1.5 w-full">
            <SidebarTrigger />
            {title && <span className="text-sm font-bold">{title}</span>}
            {!title && <span className="text-sm text-muted-foreground font-bold">Untitled</span>}
            <FavoriteToggle note={data} onToggle={handleFavorite ?? (() => {})} />
            <MdInfoOutline className="text-sm text-muted-foreground" />
            <IoEllipsisHorizontal className="text-sm text-muted-foreground" />
         </div>
         {isSaving && <span className="pr-3 text-sm text-muted-foreground">Saving...</span>}
      </div>
   );
}
