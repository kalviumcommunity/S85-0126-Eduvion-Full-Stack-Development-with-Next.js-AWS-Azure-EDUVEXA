"use client";

import { TrendingUp, TrendingDown, BarChart3, MessageSquare, Star, Users } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalProgressBar from '@/components/ui/ProfessionalProgressBar';

interface FeedbackAnalytics {
  totalFeedback: number;
  averageRating: number;
  ratingTrend: number;
  categoryBreakdown: {
    collaboration: number;
    technical: number;
    communication: number;
    initiative: number;
    quality: number;
  };
  recentFeedback: Array<{
    id: string;
    fromUser: string;
    rating: number;
    comment: string;
    date: string;
    anonymous: boolean;
  }>;
  responseRate: number;
}

interface FeedbackAnalyticsProps {
  analytics: FeedbackAnalytics;
}

export default function FeedbackAnalytics({
  analytics
}: FeedbackAnalyticsProps) {
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-success-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-error-600" />;
    return <div className="w-4 h-4 bg-neutral-300 rounded-full" />;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-success-600';
    if (rating >= 3.5) return 'text-warning-600';
    if (rating >= 2.5) return 'text-error-600';
    return 'text-neutral-600';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 4.5) return 'bg-success-100';
    if (rating >= 3.5) return 'bg-warning-100';
    if (rating >= 2.5) return 'bg-error-100';
    return 'bg-neutral-100';
  };

  const categories = [
    { key: 'collaboration', label: 'Collaboration', icon: '🤝' },
    { key: 'technical', label: 'Technical Skills', icon: '💻' },
    { key: 'communication', label: 'Communication', icon: '💬' },
    { key: 'initiative', label: 'Initiative', icon: '🚀' },
    { key: 'quality', label: 'Work Quality', icon: '✨' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900">{analytics.totalFeedback}</div>
            <div className="text-xs text-neutral-600">Total Feedback</div>
          </div>
        </ProfessionalCard>

        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className={`w-10 h-10 ${getRatingBg(analytics.averageRating)} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Star className={`w-5 h-5 ${getRatingColor(analytics.averageRating)}`} />
            </div>
            <div className={`text-2xl font-bold ${getRatingColor(analytics.averageRating)}`}>
              {analytics.averageRating.toFixed(1)}
            </div>
            <div className="text-xs text-neutral-600">Average Rating</div>
          </div>
        </ProfessionalCard>

        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              {getTrendIcon(analytics.ratingTrend)}
            </div>
            <div className={`text-2xl font-bold ${
              analytics.ratingTrend >= 0 ? 'text-success-600' : 'text-error-600'
            }`}>
              {analytics.ratingTrend >= 0 ? '+' : ''}{analytics.ratingTrend}%
            </div>
            <div className="text-xs text-neutral-600">Rating Trend</div>
          </div>
        </ProfessionalCard>

        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-warning-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-900">{analytics.responseRate}%</div>
            <div className="text-xs text-neutral-600">Response Rate</div>
          </div>
        </ProfessionalCard>
      </div>

      {/* Category Breakdown */}
      <ProfessionalCard hover={true}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-neutral-600" />
            <h3 className="text-lg font-semibold text-neutral-900">Performance by Category</h3>
          </div>
          
          <div className="space-y-3">
            {categories.map((category) => {
              const rating = analytics.categoryBreakdown[category.key as keyof typeof analytics.categoryBreakdown];
              return (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium text-neutral-900">{category.label}</span>
                    </div>
                    <span className={`text-sm font-semibold ${getRatingColor(rating)}`}>
                      {rating.toFixed(1)}
                    </span>
                  </div>
                  <ProfessionalProgressBar 
                    value={(rating / 5) * 100} 
                    variant="primary"
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </ProfessionalCard>

      {/* Recent Feedback */}
      <ProfessionalCard hover={true}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-neutral-600" />
            <h3 className="text-lg font-semibold text-neutral-900">Recent Feedback</h3>
          </div>
          
          <div className="space-y-3">
            {analytics.recentFeedback.slice(0, 5).map((feedback) => (
              <div key={feedback.id} className="p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-neutral-700">
                        {feedback.anonymous ? '👤' : feedback.fromUser.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">
                        {feedback.anonymous ? 'Anonymous' : feedback.fromUser}
                      </div>
                      <div className="text-xs text-neutral-500">{feedback.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= feedback.rating
                            ? 'fill-warning-400 text-warning-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {feedback.comment && (
                  <p className="text-sm text-neutral-600">{feedback.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </ProfessionalCard>

      {/* Insights */}
      <ProfessionalCard hover={true}>
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-primary-900 mb-1">Key Insights</h4>
              <p className="text-xs text-primary-700">
                {analytics.averageRating >= 4.0 ?
                  "Excellent performance! You're consistently receiving high ratings across all categories." :
                  analytics.averageRating >= 3.0 ?
                  "Good performance with room for improvement in specific areas." :
                  "Focus on the lower-rated categories to enhance your overall performance."
                }
              </p>
            </div>
          </div>
        </div>
      </ProfessionalCard>
    </div>
  );
}
