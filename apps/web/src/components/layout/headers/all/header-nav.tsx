import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { useNavigate } from "@tanstack/react-router";

const tabs = [
   {
      name: "Notes",
      value: "notes",
   },
   {
      name: "Collections",
      value: "collections",
   },
];
interface HeaderProps {
   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
   activeTab: string;
}
export function HeaderNav({ activeTab, setActiveTab }: HeaderProps) {
   const trpc = useTRPC();
   const createPageMutation = useMutation({
      ...trpc.noteRouter.createNote.mutationOptions(),
   });
   const navigate = useNavigate();
   const handleCreatePage = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const [data] = await createPageMutation.mutateAsync({
         type: "note",
      });
      if (data) {
         navigate({
            to: "/notes/$id",
            params: {
               id: data.id,
            },
         });
      }
   };
   return (
      <div className="w-full flex justify-between py-1 items-center border-b h-10">
         <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Breadcrumb className="">
               <BreadcrumbList>
                  <Tabs
                     value={activeTab}
                     onValueChange={setActiveTab}
                     className="items-center hidden md:flex"
                  >
                     <TabsList className="bg-background ">
                        {tabs.map((tab) => (
                           <TabsTrigger
                              key={tab.value}
                              value={tab.value}
                              className="text-xs data-[state=active]:bg-secondary data-[state=active]:text-primary dark:data-[state=active]:text-primary dark:data-[state=active]:bg-secondary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent"
                           >
                              {tab.name}
                           </TabsTrigger>
                        ))}
                     </TabsList>
                  </Tabs>
               </BreadcrumbList>
            </Breadcrumb>
         </div>
         <div className="flex items-center gap-2">
            <Button size={"sm"} variant={"secondary"} onClick={handleCreatePage}>
               New Doc
            </Button>
         </div>
      </div>
   );
}
