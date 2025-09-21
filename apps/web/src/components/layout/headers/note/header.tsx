import type { ReactNode } from "react";
import { HeaderNav } from "./header-nav";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import type { note } from "@constancia/server";

interface HeaderProps {
   data: note.NoteSchema;
}

export function Header({ data }: HeaderProps) {
   const trpc = useTRPC();
   const mutation = useMutation({ ...trpc.noteRouter.updateNote.mutationOptions() });
   const handleFavorite = async (id: string, isFavorite: boolean) => {
      await mutation.mutateAsync({
         id: id,
         isFavorite: !isFavorite,
      });
   };
   return (
      <div className="flex flex-col w-full px-1.5 ">
         <HeaderNav data={data} handleFavorite={handleFavorite} />
         {/* <HeaderOptions /> */}
      </div>
   );
}
