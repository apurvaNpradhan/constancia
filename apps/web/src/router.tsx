import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../server/src/routers";
import { routeTree } from "./routeTree.gen";
import { TRPCProvider } from "./utils/trpc";
import { StrictMode } from "react";
import { getServerHeaders } from "./lib/server-headers";

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
      defaultPreloadStaleTime: 0,
      defaultPreload: "intent",
      context: { trpc, queryClient },
      defaultNotFoundComponent: () => <div>Not Found</div>,
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

declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>;
   }
}
