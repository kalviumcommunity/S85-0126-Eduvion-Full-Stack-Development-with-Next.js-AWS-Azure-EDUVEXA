"use client";

import { useState } from 'react';
import { MessageSquare, Star, Send, Eye, EyeOff } from 'lucide-react';
import ProfessionalButton from '@/components/ui/ProfessionalButton';
import ProfessionalCard from '@/components/ui/ProfessionalCard';

interface FeedbackCategory {
  id: string;
  name: string;
  description: string;
  rating: number;
  comment: string;
}

interface StructuredFeedbackFormProps {
  recipientName: string;
  recipientId: string;
  onSubmit: (feedback: {
    categories: FeedbackCategory[];
    overallRating: number;
    anonymous: boolean;
    comment: string;
  }) => void;
}

const defaultCategories: Omit<FeedbackCategory, 'rating' | 'comment'>[] = [
  {
    id: 'collaboration',
    name: 'Collaboration',
    description: 'How well they work with others in team settings'
  },
  {
    id: 'technical',
    name: 'Technical Skills',
    description: 'Quality of technical work and problem-solving abilities'
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Clarity and effectiveness in sharing ideas'
  },
  {
    id: 'initiative',
    name: 'Initiative',
    description: 'Proactiveness and taking ownership of tasks'
  },
  {
    id: 'quality',
    name: 'Work Quality',
    description: 'Overall quality and attention to detail'
  }
];

export default function StructuredFeedbackForm({
  recipientName,
  recipientId,
  onSubmit
}: StructuredFeedbackFormProps) {
  const [categories, setCategories] = useState<FeedbackCategory[]>(
    defaultCategories.map(cat => ({
      ...cat,
      rating: 0,
      comment: ''
    }))
  );
  const [overallRating, setOverallRating] = useState(0);
  const [anonymous, setAnonymous] = useState(false);
  const [generalComment, setGeneralComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (categoryId: string, rating: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, rating } : cat
    ));
  };

  const handleCommentChange = (categoryId: string, comment: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, comment } : cat
    ));
  };

  const calculateOverallRating = () => {
    const ratedCategories = categories.filter(cat => cat.rating > 0);
    if (ratedCategories.length === 0) return 0;
    const sum = ratedCategories.reduce((acc, cat) => acc + cat.rating, 0);
    return Math.round(sum / ratedCategories.length);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        categories,
        overallRating: calculateOverallRating(),
        anonymous,
        comment: generalComment
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = categories.some(cat => cat.rating > 0);

  return (
    <ProfessionalCard className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            Feedback for {recipientName}
          </h3>
          <p className="text-sm text-neutral-600">
            Share constructive feedback to help them grow
          </p>
        </div>

        {/* Anonymous Toggle */}
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-3">
            {anonymous ? <EyeOff className="w-4 h-4 text-neutral-600" /> : <Eye className="w-4 h-4 text-neutral-600" />}
            <span className="text-sm font-medium text-neutral-900">
              {anonymous ? 'Anonymous feedback' : 'Your name will be visible'}
            </span>
          </div>
          <button
            onClick={() => setAnonymous(!anonymous)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              anonymous ? 'bg-primary-600' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                anonymous ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Category Ratings */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-neutral-900">Rate their performance</h4>
          {categories.map((category) => (
            <div key={category.id} className="space-y-3 p-4 bg-neutral-50 rounded-lg">
              <div>
                <h5 className="text-sm font-medium text-neutral-900">{category.name}</h5>
                <p className="text-xs text-neutral-600">{category.description}</p>
              </div>
              
              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(category.id, star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= category.rating
                            ? 'fill-warning-400 text-warning-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-sm text-neutral-600 mb-1 block">
                  Specific feedback (optional):
                </label>
                <textarea
                  value={category.comment}
                  onChange={(e) => handleCommentChange(category.id, e.target.value)}
                  placeholder="Share specific examples or suggestions..."
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>

        {/* General Comment */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-900">Additional Comments</h4>
          <textarea
            value={generalComment}
            onChange={(e) => setGeneralComment(e.target.value)}
            placeholder="Any other feedback or suggestions..."
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <ProfessionalButton
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
            icon={<Send className="w-4 h-4" />}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </ProfessionalButton>
        </div>
      </div>
    </ProfessionalCard>
  );
}
