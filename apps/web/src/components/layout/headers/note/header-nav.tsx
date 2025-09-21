import { FavoriteToggle } from "@/components/common/notes/favorite-toggle";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { note } from "@constancia/server";
import { Ellipsis } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
   {
      name: "Journal",
      value: "journal",
   },
];

interface HeaderProps {
   data: note.NoteSchema;
   handleFavorite?: (id: string, isFavorite: boolean) => void;
}

export function HeaderNav({ data, handleFavorite }: HeaderProps) {
   const { title } = data;
   return (
      <div className="w-full flex justify-between py-1 items-center h-10 relative">
         <div className="flex items-center gap-2 w-full">
            <SidebarTrigger />
            {title && <span className="text-sm font-bold">{title}</span>}
            {!title && <span className="text-sm text-muted-foreground font-bold">Untitled</span>}
            <FavoriteToggle note={data} onToggle={handleFavorite ?? (() => {})} />
         </div>
      </div>
   );
}
