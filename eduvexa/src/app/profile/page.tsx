"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from "@/components";
import FormInput from "@/components/ui/FormInput";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>();

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('bio', user.bio || '');
    }
  }, [user, setValue]);

  const handleSaveProfile = async (data: ProfileFormData) => {
    setSaveLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await response.json();
        await refreshUser();
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('bio', user.bio || '');
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse space-y-4 w-64">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your profile.</p>
          <Button 
            label="Go to Login" 
            onClick={() => router.push('/login')}
            variant="primary"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Edit/Cancel Buttons */}
        {!isEditing ? (
          <Button
            label="Edit Profile"
            onClick={() => setIsEditing(true)}
            variant="primary"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          />
        ) : (
          <div className="flex gap-2">
            <Button
              label="Cancel"
              onClick={handleCancelEdit}
              variant="outline"
            />
            <Button
              label={saveLoading ? "Saving..." : "Save Changes"}
              onClick={handleSubmit(handleSaveProfile)}
              disabled={saveLoading}
              loading={saveLoading}
              variant="primary"
            />
          </div>
        )}
      </div>

      <div className="max-w-4xl">
        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2">
            <Card title="Profile Information" variant="default">
              <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-2 ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : user.role === 'INSTRUCTOR'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <FormInput
                      label="Full Name"
                      {...register('name')}
                      error={errors.name?.message}
                    />

                    <FormInput
                      label="Email Address"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        {...register('bio')}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        placeholder="Tell us about yourself..."
                      />
                      {errors.bio?.message && (
                        <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Full Name</h3>
                      <p className="text-lg text-gray-900 dark:text-white">{user.name}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email Address</h3>
                      <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
                    </div>

                    {user.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bio</h3>
                        <p className="text-lg text-gray-900 dark:text-white">{user.bio}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Member Since</h3>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card title="Account Stats" variant="bordered">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Account Status</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Role</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">User ID</span>
                  <span className="font-medium text-gray-900 dark:text-white">#{user.id}</span>
                </div>
              </div>
            </Card>

            <Card title="Quick Actions" variant="bordered">
              <div className="space-y-3">
                <Button
                  label="Change Password"
                  onClick={() => router.push('/change-password')}
                  variant="outline"
                  fullWidth
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 012 12m-2 0h-4m-2 0h-4" />
                    </svg>
                  }
                />
                <Button
                  label="Export Data"
                  onClick={() => alert('Export functionality coming soon!')}
                  variant="outline"
                  fullWidth
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
                <Button
                  label="Delete Account"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      alert('Delete account functionality coming soon!');
                    }
                  }}
                  variant="danger"
                  fullWidth
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  }
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
