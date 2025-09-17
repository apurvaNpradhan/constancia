import { createRouter as createTanStackRouter, Navigate } from "@tanstack/react-router";
import { MdNearbyError } from "react-icons/md";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../server/src/routers";
import { routeTree } from "./routeTree.gen";
import { TRPCProvider } from "./utils/trpc";
import { StrictMode } from "react";
import { getServerHeaders } from "./lib/server-headers";
import MainLayout from "./components/layout/main-layout";
import { MdError } from "react-icons/md";
import { authClient } from "./lib/auth-client";
import Loader from "./components/loader";

function makeQueryClient() {
   return new QueryClient({
      defaultOptions: {
         queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: import.meta.env.PROD,
         },
      },
   });
}

let browserQueryClient: QueryClient | undefined = undefined;
export function getQueryClient() {
   if (typeof window === "undefined") {
      // Server: always make a new query client
      return makeQueryClient();
   }
   // Browser: make a new query client if we don't already have one
   // This is very important, so we don't re-make a new client if React
   // suspends during the initial render. This may not be needed if we
   // have a suspense boundary BELOW the creation of the query client
   if (!browserQueryClient) browserQueryClient = makeQueryClient();
   return browserQueryClient;
}
const trpcClient = createTRPCClient<AppRouter>({
   links: [
      httpBatchLink({
         url: `${import.meta.env.VITE_SERVER_URL}/trpc`,
         fetch(url, options) {
            return fetch(url, {
               ...options,
               credentials: "include",
            });
         },
         headers: async () => getServerHeaders(),
      }),
   ],
});

const trpc = createTRPCOptionsProxy({
   client: trpcClient,
   queryClient: getQueryClient(),
});

export const createRouter = () => {
   const queryClient = getQueryClient();
   const router = createTanStackRouter({
      routeTree,
      scrollRestoration: true,
      defaultPreloadStaleTime: 60 * 1000,
      defaultPreload: "intent",
      context: { trpc, queryClient },
      defaultNotFoundComponent: () => <DefaultNotFoundScreen />,
      Wrap: ({ children }) => (
         <StrictMode>
            <QueryClientProvider client={queryClient}>
               <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                  {children}
               </TRPCProvider>
            </QueryClientProvider>
         </StrictMode>
      ),
   });
   return router;
};
import { useRouter } from "@tanstack/react-router";

function DefaultNotFoundScreen() {
   const { data: session, isPending } = authClient.useSession();
   const router = useRouter();

   if (isPending) {
      return <Loader />;
   }

   if (!session?.user) {
      router.history.push("/sign-in");
      return null;
   }

   return (
      <MainLayout>
         <div className="mx-auto w-full flex items-center justify-center min-h-dvh flex-col gap-2">
            <MdNearbyError className="text-9xl text-muted-foreground" />
            <span className="font-semibold">Not Found</span>
            <span className="text-muted-foreground">
               We could not find the page you were looking for
            </span>
         </div>
      </MainLayout>
   );
}
declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>;
   }
}
