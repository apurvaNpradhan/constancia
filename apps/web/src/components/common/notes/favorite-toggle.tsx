import { Button } from "@/components/ui/button";
import type { note } from "@constancia/server";
import { useState, useEffect } from "react";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";

export function FavoriteToggle({
   note,
   onToggle,
}: {
   note: note.NoteSchema;
   onToggle: (id: string, isFavorite: boolean) => void;
}) {
   const [value, setValue] = useState(note.isFavorite);
   useEffect(() => {
      setValue(note.isFavorite);
   }, [note.isFavorite]);
   const handleToggle = (e: React.MouseEvent<HTMLButtonElement>, isFavorite: boolean) => {
      e.stopPropagation(); // Prevent the click event from bubbling to the Link
      setValue(isFavorite);
      onToggle(note.id, isFavorite);
   };
   return (
      <Button
         type="button"
         onClick={(e) => handleToggle(e, !value)}
         variant="ghost"
         size="sm"
         className="h-4 w-4 text-xs hover:bg-primary/10 hover:text-primary opacity-60 group-hover:opacity-100 transition-opacity"
      >
         {value ? <MdOutlineStar /> : <MdOutlineStarBorder />}
      </Button>
   );
}
