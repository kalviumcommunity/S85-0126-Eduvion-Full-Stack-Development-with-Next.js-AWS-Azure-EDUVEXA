"use client";

import { Clock, Award, Target, BookOpen } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'milestone' | 'achievement' | 'task' | 'skill';
  title: string;
  description: string;
  progress?: number;
}

interface PersonalProgressTimelineProps {
  events: TimelineEvent[];
  currentLevel: number;
  totalXP: number;
}

export default function PersonalProgressTimeline({
  events,
  currentLevel,
  totalXP
}: PersonalProgressTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone':
        return <Target className="w-4 h-4" />;
      case 'achievement':
        return <Award className="w-4 h-4" />;
      case 'task':
        return <BookOpen className="w-4 h-4" />;
      case 'skill':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone':
        return 'bg-primary-100 text-primary-600 border-primary-200';
      case 'achievement':
        return 'bg-success-100 text-success-600 border-success-200';
      case 'task':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      case 'skill':
        return 'bg-warning-100 text-warning-600 border-warning-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <ProfessionalCard hover={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Progress Timeline</h3>
            <p className="text-sm text-neutral-600">Your learning journey</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary-600">Level {currentLevel}</div>
            <div className="text-sm text-neutral-600">{totalXP} XP</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                {index < events.length - 1 && (
                  <div className="w-0.5 h-16 bg-neutral-200 mt-2" />
                )}
              </div>

              {/* Event Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-neutral-900">{event.title}</h4>
                      <span className="text-xs text-neutral-500">{event.date}</span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{event.description}</p>
                    {event.progress !== undefined && (
                      <div className="w-full bg-neutral-200 rounded-full h-1.5">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${event.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-primary-900">Keep Going!</h4>
              <p className="text-xs text-primary-700">
                You're making great progress. Continue your learning streak!
              </p>
            </div>
            <div className="text-2xl">🚀</div>
          </div>
        </div>
      </div>
    </ProfessionalCard>
  );
}
