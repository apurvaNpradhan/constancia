import { Card, CardContent } from "@/components/ui/card";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import type { note } from "@constancia/server";
import { Link } from "@tanstack/react-router";
import { formatDistance } from "date-fns";
import React from "react";
import { IoCalendarOutline, IoDocumentTextOutline } from "react-icons/io5";

interface NoteCarouselProps {
   notes: note.NoteSchema[];
   status?: "pending" | "error" | "success";
}

export default function NoteCarousel({ notes, status }: NoteCarouselProps) {
   const CarouselItemSkeleton = () => (
      <CarouselItem className="md:basis-1/2 lg:basis-1/5 p-4">
         <div className="p-1">
            <Card className="shadow-none">
               <CardContent className="flex h-[100px] space-y-4 flex-col">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
               </CardContent>
            </Card>
         </div>
      </CarouselItem>
   );

   // Empty state component
   const EmptyState = () => (
      <div className="flex flex-col items-center justify-center h-[100px] w-full text-center">
         <p className="text-muted-foreground text-sm">No notes found.</p>
         <p className="text-muted-foreground text-xs">Create a new note to get started!</p>
      </div>
   );

   if (notes.length === 0 && status !== "pending") {
      return <EmptyState />;
   }

   return (
      <Carousel
         opts={{
            align: "start",
         }}
         className="w-full"
      >
         <CarouselContent>
            {status === "pending"
               ? Array.from({ length: 5 }).map((_, index) => <CarouselItemSkeleton key={index} />)
               : notes.map((note, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/6">
                       <Link className="p-1" to="/notes/$id" params={{ id: note.id }}>
                          <Card className="shadow-none">
                             <CardContent className="flex h-[100px] space-y-4 flex-col">
                                {note.type === "journal" ? (
                                   <IoCalendarOutline size={24} className="text-muted-foreground" />
                                ) : (
                                   <IoDocumentTextOutline
                                      size={24}
                                      className="text-muted-foreground"
                                   />
                                )}
                                <span className="text-sm font-medium overflow-hidden  ">
                                   {note.title?.length! > 0
                                      ? note.title?.length! > 20
                                         ? note.title?.slice(0, 20) + "..."
                                         : note.title
                                      : "Untitled"}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                   {formatDistance(new Date(note.updatedAt ?? ""), new Date(), {
                                      addSuffix: true,
                                   })}
                                </span>
                             </CardContent>
                          </Card>
                       </Link>
                    </CarouselItem>
                 ))}
         </CarouselContent>
         <CarouselPrevious />
         <CarouselNext />
      </Carousel>
   );
}
