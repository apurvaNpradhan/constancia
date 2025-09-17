import Header from "@/components/header";
import MainLayout from "@/components/layout/main-layout";
import { useTRPC } from "@/utils/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/notes/$id")({
   component: RouteComponent,
   beforeLoad: async ({ params, context: c }) => {
      await c.queryClient.ensureQueryData(
         c.trpc.noteRouter.getNoteById.queryOptions({ id: params.id })
      );
   },
});

function RouteComponent() {
   const { id } = Route.useParams();
   const trpc = useTRPC();
   const { data, isPending } = useSuspenseQuery(
      trpc.noteRouter.getNoteById.queryOptions({
         id,
      })
   );
   if (isPending) {
      return <div>Loading...</div>;
   }
   switch (data?.type) {
      case "note":
         return (
            <MainLayout header={<Header />}>
               <div className="p-4">
                  <h1 className="text-2xl font-semibold text-foreground">{data.title}</h1>
               </div>
            </MainLayout>
         );
      case "journal":
         return <MainLayout>Hello "/_protected/$id"!{id}</MainLayout>;
      case "workout":
         return <MainLayout>Hello "/_protected/$id"!{id}</MainLayout>;
      case "habit":
         return <MainLayout>Hello "/_protected/$id"!{id}</MainLayout>;
      default:
         return <MainLayout>Hello "/_protected/$id"!{id}</MainLayout>;
   }
}
