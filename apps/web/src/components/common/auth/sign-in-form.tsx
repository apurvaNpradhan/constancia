import { useForm } from "@tanstack/react-form";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useNavigate } from "@tanstack/react-router";
import Loader from "@/components/loader";
import { useState } from "react";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
   const navigate = useNavigate();
   const { isPending } = authClient.useSession();
   const [showPassword, setShowPassword] = useState(false);
   const form = useForm({
      defaultValues: {
         email: "",
         password: "",
      },
      onSubmit: async ({ value }) => {
         await authClient.signIn.email(
            {
               email: value.email,
               password: value.password,
            },
            {
               onSuccess: () => {
                  navigate({ to: "/home" });
                  toast.success("Sign in successful");
               },
               onError: (error) => {
                  toast.error(error.error.message || error.error.statusText);
               },
            }
         );
      },
      validators: {
         onSubmit: z.object({
            email: z.string().email("Invalid email address"),
            password: z.string().min(8, "Password must be at least 8 characters"),
         }),
      },
   });

   if (isPending) {
      return <Loader />;
   }

   return (
      <div className="mx-auto mt-12 w-full max-w-md p-8">
         <h1 className="mb-8 text-center font-bold text-3xl text-foreground tracking-tight">
            Welcome Back
         </h1>

         <form
            onSubmit={(e) => {
               e.preventDefault();
               e.stopPropagation();
               form.handleSubmit();
            }}
            className="space-y-6"
         >
            <div>
               <form.Field name="email">
                  {(field) => (
                     <div className="space-y-3">
                        <Label htmlFor={field.name} className="font-medium text-foreground text-sm">
                           Email
                        </Label>
                        <Input
                           id={field.name}
                           name={field.name}
                           type="email"
                           value={field.state.value}
                           onBlur={field.handleBlur}
                           onChange={(e) => field.handleChange(e.target.value)}
                           className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                           placeholder="Enter your email"
                        />
                        {field.state.meta.errors.map((error) => (
                           <p key={error?.message} className="mt-1 text-red-500 text-sm">
                              {error?.message}
                           </p>
                        ))}
                     </div>
                  )}
               </form.Field>
            </div>

            <div>
               <form.Field name="password">
                  {(field) => (
                     <div className="space-y-3">
                        <Label htmlFor={field.name} className="font-medium text-foreground text-sm">
                           Password
                        </Label>
                        <div className="relative">
                           <div className="relative">
                              <Input
                                 id={field.name}
                                 name={field.name}
                                 type={showPassword ? "text" : "password"}
                                 value={field.state.value}
                                 onBlur={field.handleBlur}
                                 onChange={(e) => field.handleChange(e.target.value)}
                                 className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                 placeholder="Enter your password"
                              />
                              <Button
                                 size={"icon"}
                                 variant={"ghost"}
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground"
                                 aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                 {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </Button>
                           </div>
                           <Button
                              size={"icon"}
                              variant={"ghost"}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                           >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                           </Button>
                        </div>
                        {field.state.meta.errors.map((error) => (
                           <p key={error?.message} className="mt-1 text-red-500 text-sm">
                              {error?.message}
                           </p>
                        ))}
                     </div>
                  )}
               </form.Field>
            </div>
            <form.Subscribe>
               {(state) => (
                  <div className="space-y-6">
                     <Button
                        type="submit"
                        className="w-full rounded-md py-2.5 font-medium text-secondary"
                        disabled={!state.canSubmit || state.isSubmitting}
                     >
                        {state.isSubmitting ? (
                           <span className="flex items-center justify-center">Submitting...</span>
                        ) : (
                           "Login"
                        )}
                     </Button>
                  </div>
               )}
            </form.Subscribe>
            <div className="relative text-center text-sm">
               <span className="relative bg-background px-3 text-muted-foreground">
                  Or continue with
               </span>
            </div>
            <Button
               variant="outline"
               className="flex w-full items-center justify-center gap-2 rounded-md border border-input py-2.5 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
               disabled
            >
               <FaGithub />
               Login with Github
            </Button>
         </form>

         <div className="mt-6 text-center">
            <Button
               variant="link"
               onClick={onSwitchToSignUp}
               className="font-medium text-muted-foreground text-sm"
            >
               Need an account? Sign Up
            </Button>
         </div>
      </div>
   );
}
