import { useTRPC } from "@/utils/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

export const TestingNote = () => {
   const trpc = useTRPC();
   const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
      useInfiniteQuery({
         ...trpc.noteRouter.getAllNotes.infiniteQueryOptions({}),
         getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      });

   return status === "pending" ? (
      <p>Loading...</p>
   ) : status === "error" ? (
      <p>Error: {error.message}</p>
   ) : (
      <>
         {data.pages.map((group, i) => (
            <React.Fragment key={i}>
               {group.notes.map((project) => (
                  <p key={project.id}>{project.title}</p>
               ))}
            </React.Fragment>
         ))}
         <div>
            <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
               {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                    ? "Load More"
                    : "Nothing more to load"}
            </button>
         </div>
         <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      </>
   );
};
``;
