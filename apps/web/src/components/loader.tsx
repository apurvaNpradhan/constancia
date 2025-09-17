import { Loader2 } from "lucide-react";
import { Spinner } from "./ui/spinner";

export default function Loader() {
   return (
      <div className="flex h-full justify-center my-auto">
         <Spinner variant="bars" className="text-primary/80" />
      </div>
   );
}
