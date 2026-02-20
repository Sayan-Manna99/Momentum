"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SignInSchema,
  
} from "@/lib/validations/auth.validation";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import FooterLink from "@/components/forms/FooterLink";

import { signInWithEmail} from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SignIn() {
   const router = useRouter();
  const {
    register,
    handleSubmit,
   
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
    
      email: "",
      password: "",
     
    },
    resolver: zodResolver(SignInSchema),
    mode: "onBlur",
  });

  
  const onSubmit: SubmitHandler<SignInFormData> = async (
    data: SignInFormData,
  ): Promise<void> => {
    try {
      const result = await signInWithEmail(data);
      if (!result.success) {
        //  Show error toast
        toast.error(result.message || "Sign in failed. Please try again.");

        return;
      }
      // Show success toast
      toast.success("You have successfully signed in.");

      // Redirect to dashboard
      router.push("/");
      router.refresh(); //  Added refresh to update session
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h1 className="form-title">Sign Up & Start your Momentum</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          type="email"
          register={register}
          error={errors.email}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="blue-btn w-full mt-5"
        >
          {isSubmitting ? "Signing In......" : "Sign in to Your Account"}
        </Button>
        <FooterLink
          text="Do not  have an account ?"
          linkText="Sign Up"
          href="/sign-up"
        />
      </form>
    </>
  );
}

export default SignIn;