"use client";

import { useState, useEffect } from "react";
import { Card, Button, Badge } from "@/components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

const feedbackSchema = z.object({
  toUserId: z.string().min(1, "Please select a team member"),
  category: z.string().min(1, "Please select a feedback category"),
  rating: z.number().min(1).max(5),
  strengths: z.string().min(10, "Please provide at least 10 characters for strengths"),
  improvements: z.string().min(10, "Please provide at least 10 characters for improvements"),
  comment: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Feedback {
  id: string;
  fromUser: User;
  toUser: User;
  rating: number;
  comment: string;
  category: string;
  strengths?: string;
  improvements?: string;
  createdAt: string;
}

export default function PeerFeedbackPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'give' | 'received'>('give');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [receivedFeedback, setReceivedFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const feedbackCategories = [
    { value: "collaboration", label: "Team Collaboration" },
    { value: "communication", label: "Communication Skills" },
    { value: "technical", label: "Technical Skills" },
    { value: "problem-solving", label: "Problem Solving" },
    { value: "leadership", label: "Leadership" },
    { value: "time-management", label: "Time Management" },
  ];

  useEffect(() => {
    fetchTeamMembers();
    fetchReceivedFeedback();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.data.users.filter((member: User) => String(member.id) !== String(user?.id)));
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    }
  };

  const fetchReceivedFeedback = async () => {
    try {
      const response = await fetch('/api/feedback?type=received');
      if (response.ok) {
        const data = await response.json();
        setReceivedFeedback(data.data.feedback);
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await response.json();
        alert(`Feedback submitted successfully to ${teamMembers.find(m => String(m.id) === data.toUserId)?.name}!`);
        reset();
        fetchReceivedFeedback(); // Refresh received feedback
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (value: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            className={`text-2xl transition-colors ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Peer Feedback System</h1>
          <p className="text-gray-600 dark:text-gray-300">Give and receive constructive feedback to improve team performance</p>
        </div>
        <Button 
          label="Feedback Guidelines" 
          variant="outline"
          onClick={() => alert('Opening feedback guidelines...')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Feedback Given</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">15</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Feedback Received</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mb-3">
              <span className="text-2xl font-bold">4.5</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">4.5</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Average Rating</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Pending Reviews</p>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('give')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'give'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Give Feedback
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Received Feedback
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'give' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card title="Submit Peer Feedback" variant="bordered">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Team Member Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Team Member *
                  </label>
                  <select
                    {...register('toUserId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select a team member...</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                  {errors.toUserId && (
                    <p className="mt-1 text-sm text-red-600">{errors.toUserId.message}</p>
                  )}
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feedback Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select a category...</option>
                    {feedbackCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="hidden"
                      {...register('rating', { valueAsNumber: true })}
                    />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl transition-colors cursor-pointer hover:scale-110"
                          style={{ color: star <= (watch('rating') || 3) ? '#fbbf24' : '#d1d5db' }}
                          onClick={() => setValue('rating', star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {watch('rating') || 3}/5
                    </span>
                  </div>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                  )}
                </div>

                {/* Strengths */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What are their strengths? *
                  </label>
                  <textarea
                    {...register('strengths')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Highlight specific skills, behaviors, or contributions that you appreciate..."
                  />
                  {errors.strengths && (
                    <p className="mt-1 text-sm text-red-600">{errors.strengths.message}</p>
                  )}
                </div>

                {/* Areas for Improvement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Areas for improvement *
                  </label>
                  <textarea
                    {...register('improvements')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Provide constructive suggestions for growth and development..."
                  />
                  {errors.improvements && (
                    <p className="mt-1 text-sm text-red-600">{errors.improvements.message}</p>
                  )}
                </div>

                {/* Additional Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    {...register('comment')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Any additional thoughts or observations..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    label={isSubmitting ? "Submitting..." : "Submit Feedback"}
                    disabled={isSubmitting}
                    variant="primary"
                  />
                  <Button
                    type="button"
                    label="Clear Form"
                    variant="outline"
                    onClick={() => reset()}
                  />
                </div>
              </form>
            </Card>
          </div>

          {/* Guidelines Panel */}
          <div className="lg:col-span-1">
            <Card title="Feedback Guidelines" variant="bordered">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📝 Be Specific</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Provide concrete examples and specific situations rather than general statements.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Be Constructive</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Focus on behaviors and actions that can be improved, not personal characteristics.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚖️ Be Balanced</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Include both strengths and areas for improvement to provide a complete picture.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🤝 Be Respectful</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Use professional language and maintain a supportive tone throughout your feedback.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⏰ Be Timely</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Provide feedback as close to the observed behavior as possible for maximum impact.
                  </p>
                </div>
              </div>
            </Card>

            {/* Recent Feedback Stats */}
            <Card title="Your Feedback Impact" variant="bordered" className="mt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">This Month</span>
                  <span className="text-sm font-semibold">8 feedback given</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Response Rate</span>
                  <span className="text-sm font-semibold">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Helpfulness Score</span>
                  <span className="text-sm font-semibold">4.7/5.0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Received Feedback Tab */
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
              </div>
            </div>
          ) : receivedFeedback.length === 0 ? (
            <Card variant="bordered">
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Feedback Received</h3>
                <p className="text-gray-600 dark:text-gray-300">You haven't received any feedback yet. Keep up the great work!</p>
              </div>
            </Card>
          ) : (
            receivedFeedback.map((feedback) => (
              <Card key={feedback.id} variant="bordered">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {feedback.fromUser.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {feedback.fromUser.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feedback.fromUser.role} • {feedback.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1">{renderStars(feedback.rating)}</div>
                    <Badge 
                      label={`${feedback.rating}/5`} 
                      variant={getRatingColor(feedback.rating) as any}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {feedback.strengths && (
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">💪 Strengths</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.strengths}</p>
                    </div>
                  )}
                  {feedback.improvements && (
                    <div>
                      <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">🎯 Areas for Improvement</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.improvements}</p>
                    </div>
                  )}
                </div>

                {feedback.comment && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">💬 Additional Comments</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feedback.comment}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Received on {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      label="Thank You" 
                      variant="outline" 
                      size="sm"
                      onClick={() => alert(`Sending thank you to ${feedback.fromUser.name}...`)}
                    />
                    <Button 
                      label="Follow Up" 
                      variant="secondary" 
                      size="sm"
                      onClick={() => alert(`Opening follow-up conversation with ${feedback.fromUser.name}...`)}
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
