"use client";

import { AlertTriangle, TrendingDown, Clock, MessageSquare, User, Mail } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalButton from '@/components/ui/ProfessionalButton';

interface AtRiskStudent {
  id: string;
  name: string;
  email: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
  lastActive: string;
  engagementScore: number;
  completionRate: number;
  recentFeedback: number;
  interventionHistory: Array<{
    date: string;
    type: string;
    outcome: string;
  }>;
}

interface AtRiskDetectionProps {
  students: AtRiskStudent[];
  onIntervention: (studentId: string, interventionType: string) => void;
}

export default function AtRiskDetection({
  students,
  onIntervention
}: AtRiskDetectionProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'medium':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low':
        return 'bg-info-100 text-info-700 border-info-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const sortedStudents = [...students].sort((a, b) => {
    const riskOrder = { high: 3, medium: 2, low: 1 };
    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-error-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">At-Risk Students</h3>
            <p className="text-sm text-neutral-600">Early intervention detection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Total students needing attention:</span>
          <span className="text-lg font-bold text-error-600">{students.length}</span>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {sortedStudents.map((student) => (
          <ProfessionalCard key={student.id} hover={true}>
            <div className="space-y-4">
              {/* Student Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">{student.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(student.riskLevel)}`}>
                        {getRiskIcon(student.riskLevel)}
                        {student.riskLevel.toUpperCase()} RISK
                      </span>
                      <span className="text-xs text-neutral-500">Last active: {student.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ProfessionalButton
                    variant="ghost"
                    size="sm"
                    icon={<Mail className="w-4 h-4" />}
                    onClick={() => onIntervention(student.id, 'email')}
                  >
                    Contact
                  </ProfessionalButton>
                  <ProfessionalButton
                    variant="primary"
                    size="sm"
                    icon={<MessageSquare className="w-4 h-4" />}
                    onClick={() => onIntervention(student.id, 'meeting')}
                  >
                    Schedule
                  </ProfessionalButton>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-neutral-700">Risk Factors:</h5>
                <div className="flex flex-wrap gap-2">
                  {student.riskFactors.map((factor, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-error-50 text-error-700"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <div className={`text-lg font-bold ${getEngagementColor(student.engagementScore)}`}>
                    {student.engagementScore}%
                  </div>
                  <div className="text-xs text-neutral-600">Engagement</div>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <div className={`text-lg font-bold ${getEngagementColor(student.completionRate)}`}>
                    {student.completionRate}%
                  </div>
                  <div className="text-xs text-neutral-600">Completion</div>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <div className="text-lg font-bold text-neutral-900">{student.recentFeedback}</div>
                  <div className="text-xs text-neutral-600">Feedback Count</div>
                </div>
              </div>

              {/* Intervention History */}
              {student.interventionHistory.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-neutral-700">Recent Interventions:</h5>
                  <div className="space-y-1">
                    {student.interventionHistory.slice(0, 2).map((intervention, index) => (
                      <div key={index} className="flex items-center justify-between text-xs p-2 bg-neutral-50 rounded">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-700">{intervention.type}</span>
                          <span className="text-neutral-500">{intervention.date}</span>
                        </div>
                        <span className={`font-medium ${
                          intervention.outcome === 'successful' ? 'text-success-600' :
                          intervention.outcome === 'pending' ? 'text-warning-600' : 'text-error-600'
                        }`}>
                          {intervention.outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ProfessionalCard>
        ))}
      </div>

      {/* Recommendations */}
      <ProfessionalCard hover={true}>
        <div className="bg-warning-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-warning-900 mb-2">Intervention Recommendations</h4>
              <div className="space-y-2 text-xs text-warning-700">
                <p>• High-risk students: Immediate contact within 24 hours</p>
                <p>• Medium-risk students: Schedule check-in within 3 days</p>
                <p>• Low-risk students: Monitor progress and send encouragement</p>
                <p>• Consider peer mentoring for students with low engagement</p>
              </div>
            </div>
          </div>
        </div>
      </ProfessionalCard>
    </div>
  );
}
