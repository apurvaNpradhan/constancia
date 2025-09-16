import SignInForm from "@/components/common/auth/sign-in-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-in/")({
   component: RouteComponent,
});

function RouteComponent() {
   const navigate = useNavigate();

   return <SignInForm onSwitchToSignUp={() => navigate({ to: "/sign-up" })} />;
}
