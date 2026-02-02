"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CleanCard from "@/components/ui/CleanCard";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "INSTRUCTOR"]),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", role: "STUDENT" },
  });

  const onSubmit = async (data: SignupFormData) => {
    const result = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    if (!result.success) {
      setError("root", { message: result.error });
    }
  };

  return (
    <div className="max-w-md">
      <CleanCard>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create account
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Join EDUVEXA to track your progress
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
              </select>
            </div>

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
          </form>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </CleanCard>
    </div>
  );
}
