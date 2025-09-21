import React from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { SettingsModalProvider } from "../common/settings/settings-modal-provider";

interface MainLayoutProps {
   children: React.ReactNode;
   className?: string;
   header?: React.ReactNode;
   headersNumber?: 1 | 2;
}

const isEmptyHeader = (header: React.ReactNode | undefined): boolean => {
   if (!header) return true;
   if (React.isValidElement(header) && header.type === React.Fragment) {
      const props = header.props as { children?: React.ReactNode };
      if (!props.children) return true;
      if (Array.isArray(props.children) && props.children.length === 0) return true;
   }
   return false;
};

export default function MainLayout({
   children,
   header,
   headersNumber = 1,
   className,
}: MainLayoutProps) {
   const height = {
      1: "h-[calc(100svh-40px)] lg:h-[calc(100svh-56px)]",
      2: "h-[calc(100svh-60px)] lg:h-[calc(100svh-76px)]",
   };
   return (
      <div>
         <SidebarProvider>
            <AppSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
               <div
                  className={cn(
                     "lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full",
                     className
                  )}
               >
                  {header}
                  <div
                     className={cn(
                        "overflow-auto w-full",
                        isEmptyHeader(header)
                           ? "h-full"
                           : height[headersNumber as keyof typeof height]
                     )}
                  >
                     {children}
                  </div>
               </div>
            </div>
         </SidebarProvider>

         <SettingsModalProvider />
      </div>
      // <SidebarProvider open={rightOpen} onOpenChange={setRightOpen}>
      //    <SidebarProvider open={leftOpen} onOpenChange={setLeftOpen}>
      //       <SidebarLeft side="left" />
      //       <SidebarInset>
      //          <div className="h-svh overflow-hidden lg:p-2 w-full">
      //             <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full">
      //                {header}
      //                <div className={cn("overflow-auto w-full")}>{children}</div>
      //             </div>
      //          </div>
      //       </SidebarInset>
      //    </SidebarProvider>
      //    <SidebarRight side="right" />
      // </SidebarProvider>
   );
}
