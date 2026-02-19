'use client'
import { SubmitHandler, useForm } from "react-hook-form";
import { SignUpFormData, SignUpSchema } from '@/lib/validations/auth.validation';
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import FooterLink from "@/components/forms/FooterLink";

function SignUp() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData): Promise<void> => {
    try {
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1 className="form-title">Sign Up & Start your Momentum</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="name"
          label="Full Name"
          placeholder="John Doe"
          register={register}
          error={errors.name}
        />
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

        <InputField
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          type="password"
          register={register}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="blue-btn w-full mt-5"
        >
          {isSubmitting ? "Creating Account" : "Start Your Momentum Today"}
        </Button>
        
        <FooterLink
          text="Already have an account ?"
          linkText="Sign In"
          href="/sign-in"
        />
      </form>
    </>
  );
}

export default SignUp