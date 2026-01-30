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

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<SignupFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmSignup = async () => {
    if (!pendingData) return;
    try {
      const loadingToast = toast.loading("Creating account...", { position: "top-right" });
      const result = await signup({
        name: pendingData.name,
        email: pendingData.email,
        password: pendingData.password,
      });
      toast.dismiss(loadingToast);
      if (result.success) {
        toast.success(`Account created successfully! Welcome, ${pendingData.name}!`, { position: "top-right" });
        setShowConfirmModal(false);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        toast.error(result.error || "Account creation failed. Please try again.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("An unexpected error occurred. Please try again.", { position: "top-right" });
    }
  };

  const handleCancelSignup = () => {
    setShowConfirmModal(false);
    setPendingData(null);
    toast("Account creation cancelled", {
      icon: "",
      position: "top-right",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EDUVEXA</h1>
          <p className="text-lg text-gray-600">Work Tracker System</p>
          <p className="text-gray-500 mt-2">Create your account to get started</p>
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
              {...register("name")}
              error={errors.name?.message}
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
              placeholder="Create a password"
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
                label={isSubmitting ? "Processing..." : "Create Account"}
                disabled={isSubmitting}
                variant="success"
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
              Already have an account?{" "}
              <a 
                href="/login" 
                className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                Sign in instead
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={handleCancelSignup}
        title="Confirm Account Creation"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to create an account for <strong>{pendingData?.name}</strong>?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Email: {pendingData?.email}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <div className="flex-1">
              <Button
                label="Cancel"
                onClick={handleCancelSignup}
                variant="outline"
                size="md"
              />
            </div>
            <div className="flex-1">
              <Button
                label="Create Account"
                onClick={handleConfirmSignup}
                variant="success"
                size="md"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
