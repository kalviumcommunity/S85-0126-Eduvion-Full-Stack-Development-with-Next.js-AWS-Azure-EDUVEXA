
"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { toast } from "../../components/ui/ToastProvider";
import { useState } from "react";

const loginSchema = z.object({
  userName: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim()
    .refine((val) => val.trim().length > 0, "Name cannot be empty or just whitespace"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters")
    .toLowerCase()
    .refine((val) => val.includes('.'), "Email must contain a domain"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    .refine((val) => !val.includes(' '), "Password cannot contain spaces"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<LoginFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmLogin = async () => {
    if (!pendingData) return;

    try {
      // Show loading toast
      const loadingToast = toast.loading("Authenticating...", {
        position: "top-right",
      });

      // Call login API with JWT authentication
      const result = await login({
        name: pendingData.userName,
        email: pendingData.email,
        password: pendingData.password,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result.success) {
        // Show success toast
        toast.success(`Welcome back, ${pendingData.userName}!`, {
          position: "top-right",
        });

        // Close modal and redirect
        setShowConfirmModal(false);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        // Show error toast
        toast.error(result.error || "Login failed. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleCancelLogin = () => {
    setShowConfirmModal(false);
    setPendingData(null);
    toast("Login cancelled", {
      icon: "",
      position: "top-right",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EDUVEXA</h1>
          <p className="text-lg text-gray-600">Work Tracker System</p>
          <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
        </div>

        <Card variant="gradient" className="shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              {...register("userName")}
              error={errors.userName?.message}
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              {...register("email")}
              error={errors.email?.message}
              required
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              {...register("password")}
              error={errors.password?.message}
              required
            />

            <div className="w-full">
              <Button
                type="submit"
                label={isSubmitting ? "Processing..." : "Sign In"}
                disabled={isSubmitting}
                variant="primary"
                size="lg"
                icon={
                  isSubmitting ? (
                    <div className="w-5 h-5 animate-spin">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )
                }
              />
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign up for free
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={handleCancelLogin}
        title="Confirm Sign In"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to sign in as <strong>{pendingData?.userName}</strong>?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Email: {pendingData?.email}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <div className="flex-1">
              <Button
                label="Cancel"
                onClick={handleCancelLogin}
                variant="outline"
                size="md"
              />
            </div>
            <div className="flex-1">
              <Button
                label="Confirm Sign In"
                onClick={handleConfirmLogin}
                variant="primary"
                size="md"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
