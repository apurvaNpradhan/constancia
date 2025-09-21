import {
   ClientOnly,
   createRootRouteWithContext,
   HeadContent,
   Outlet,
   Scripts,
   useRouterState,
} from "@tanstack/react-router";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import Loader from "@/components/loader";
import { Toaster } from "@/components/ui/sonner";
import type { AppRouter } from "../../../server/src/routers";
import appCss from "../index.css?url";
import type { QueryClient } from "@tanstack/react-query";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";

const TanStackRouterDevtools = import.meta.env.PROD
   ? () => null
   : React.lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
           default: res.TanStackRouterDevtools,
        }))
     );
const TanStackQueryDevtools = import.meta.env.PROD
   ? () => null
   : React.lazy(() =>
        import("@tanstack/react-query-devtools").then((res) => ({
           default: res.ReactQueryDevtools,
        }))
     );
export interface RouterAppContext {
   trpc: TRPCOptionsProxy<AppRouter>;
   queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
   head: () => ({
      meta: [
         {
            charSet: "utf-8", // Ensure this is first
         },
         {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
         },
         {
            title: "My App",
         },
      ],
      links: [
         {
            rel: "icon",
            href: "/favicon.ico",
         },
         {
            rel: "stylesheet",
            href: appCss, // Ensure appCss does not include dynamic query params
         },
      ],
   }),

   component: RootDocument,
});

function RootDocument() {
   return (
      <html lang="en" suppressHydrationWarning>
         <head>
            <HeadContent />
         </head>
         <body>
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               <div className="mx-auto w-full flex items-center justify-center min-h-svh font-sans antialiased flex-col gap-2">
                  <Outlet />
               </div>
               <Toaster richColors />
            </ThemeProvider>
            <ClientOnly>
               <React.Suspense>
                  <TanStackRouterDevtools position="bottom-left" />
                  <TanStackQueryDevtools buttonPosition="bottom-right" />
               </React.Suspense>
            </ClientOnly>
            <Scripts />
         </body>
      </html>
   );
}
