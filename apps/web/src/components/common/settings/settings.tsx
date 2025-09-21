import { Button } from "@/components/ui/button";

import * as React from "react";
import {
   Bell,
   Check,
   Globe,
   Home,
   Keyboard,
   Link,
   Lock,
   Menu,
   MessageCircle,
   Paintbrush,
   Video,
} from "lucide-react";

import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarProvider,
} from "@/components/ui/sidebar";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { useSettingsStore } from "@/store/settings";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SettingsSidebar } from "@/components/layout/sidebar/settings-sidebar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ThemePicker } from "../../ui/theme-picker";

const SettingTabs = [
   {
      name: "Appearance",
      value: "appearance",
      component: <AppearanceTab />,
   },
   {
      name: "Editor",
      value: "editor",
      component: <div>Editor</div>,
   },
];

export function Settings() {
   const { closeModal, isOpen, openModal } = useSettingsStore();
   const [activeTab, setActiveTab] = React.useState("appearance");
   return (
      <Dialog
         open={isOpen}
         onOpenChange={(value) => {
            if (value !== isOpen) {
               value ? openModal() : closeModal();
            }
         }}
      >
         <DialogTrigger asChild>
            <Button size="sm">Settings</Button>
         </DialogTrigger>
         <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
            <DialogTitle className="sr-only">Settings</DialogTitle>
            <DialogDescription className="sr-only">Customize your settings here.</DialogDescription>
            <SidebarProvider>
               <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
               <main className="flex h-[480px] flex-1 flex-col overflow-hidden ">
                  <Tabs
                     value={activeTab}
                     onValueChange={setActiveTab}
                     className="gap-4  "
                     defaultValue="notes"
                  >
                     {SettingTabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                           {tab.component}
                        </TabsContent>
                     ))}
                  </Tabs>
               </main>
            </SidebarProvider>
            {/* <Sidebar collapsible="none" className="hidden md:flex">
                  <SidebarContent>
                  d
               </Sidebar> */}
         </DialogContent>
      </Dialog>
   );
}

function AppearanceTab() {
   return (
      <div className="w-full flex flex-col gap-3 p-5">
         <span className="text-muted-foreground text-md">Theme</span>
         <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
               <span className="text-sm">Colour mode</span>
               <span className="text-muted-foreground text-xs">Choose your colour mode</span>
            </div>
            <ThemePicker />
         </div>
      </div>
   );
}
