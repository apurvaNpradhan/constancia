import SignUpForm from "@/components/common/auth/sign-up-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-up/")({
   component: RouteComponent,
});

function RouteComponent() {
   const navigate = useNavigate();
   return (
      <SignUpForm
         onSwitchToSignIn={() => {
            navigate({
               to: "/sign-in",
            });
         }}
      />
   );
}
