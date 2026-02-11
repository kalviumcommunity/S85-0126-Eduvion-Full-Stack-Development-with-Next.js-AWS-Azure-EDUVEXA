"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    // Add confirmPassword to defaultValues
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignupFormData) => {
    // Remove confirmPassword before sending, set role as STUDENT by default
    const result = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
      role: "STUDENT",
    });
    if (!result.success) {
      setError("root", { message: result.error });
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#c7d2fe] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-2">
      <div className="backdrop-blur-2xl bg-white/60 dark:bg-gray-900/70 shadow-2xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 w-full max-w-md mx-auto relative overflow-hidden ring-1 ring-purple-100 dark:ring-purple-900/30">
        {/* Animated gradient accent */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-purple-400/40 via-blue-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-pink-400/30 via-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse z-0" />
        <div className="relative z-10 space-y-12">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight drop-shadow-lg bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">Create your EDUVEXA account</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Join EDUVEXA to track your progress</p>
          </div>



          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              error={errors.name?.message}
            />
            <FormInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <FormInput
              label="Password"
              type="password"
              placeholder="********"
              {...register("password")}
              error={errors.password?.message}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="********"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />


            {errors.root?.message && (
              <p className="text-sm text-red-500">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              label={isSubmitting ? "Creating account..." : "Create account"}
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          <div className="flex items-center gap-2 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-800" />
            <span className="text-xs text-purple-500 dark:text-purple-300 font-bold tracking-widest drop-shadow">OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-300 to-transparent dark:via-purple-800" />
          </div>
          <div className="flex flex-row gap-4">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition font-bold text-gray-800 dark:text-gray-100 text-base group min-w-0 backdrop-blur-sm"
              // onClick={handleGoogleSignup}
            >
              <span className="bg-white rounded-full p-1 border border-gray-200 group-hover:scale-110 transition"><Image src="/google.svg" alt="Google" width={22} height={22} /></span>
              <span className="ml-1 truncate">Google</span>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-2xl bg-gradient-to-r from-[#1877F3] to-[#145db2] hover:from-[#145db2] hover:to-[#1877F3] transition font-bold text-white text-base shadow-xl min-w-0 backdrop-blur-sm"
              // onClick={handleFacebookSignup}
            >
              <span className="bg-white rounded-full p-1"><Image src="/facebook.svg" alt="Facebook" width={22} height={22} /></span>
              <span className="ml-1 truncate">Facebook</span>
            </button>
          </div>
          </form>

          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 font-semibold transition-colors duration-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:px-2 hover:py-1 hover:rounded-lg hover:shadow-lg hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    // </div>
  );
}
