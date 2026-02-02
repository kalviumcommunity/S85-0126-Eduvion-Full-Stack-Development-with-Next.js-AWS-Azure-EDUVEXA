"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CleanCard from "@/components/ui/CleanCard";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data);
    if (!result.success) {
      setError("root", { message: result.error || "Login failed" });
    }
  };

  return (
    <div className="max-w-md">
      <CleanCard>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Access your EDUVEXA workspace</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

            {errors.root?.message && (
              <p className="text-sm text-red-500">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              label={isSubmitting ? "Signing in..." : "Sign in"}
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </form>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Create one
            </Link>
          </div>
        </div>
      </CleanCard>
    </div>
  );
}
