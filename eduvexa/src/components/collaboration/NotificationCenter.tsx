"use client";

import { useState } from 'react';
import { Bell, Check, X, MessageSquare, Award, AlertTriangle, Users, Calendar, Filter } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalButton from '@/components/ui/ProfessionalButton';

interface Notification {
  id: string;
  type: 'mention' | 'feedback' | 'achievement' | 'alert' | 'team_update' | 'deadline' | 'comment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    fromUser?: string;
    projectName?: string;
    teamName?: string;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
  onFilterChange: (filter: string) => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onFilterChange
}: NotificationCenterProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'mention':
        return <MessageSquare className="w-4 h-4" />;
      case 'feedback':
        return <Award className="w-4 h-4" />;
      case 'achievement':
        return <Award className="w-4 h-4" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />;
      case 'team_update':
        return <Users className="w-4 h-4" />;
      case 'deadline':
        return <Calendar className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'bg-error-100 text-error-600 border-error-200';
    
    switch (type) {
      case 'mention':
        return 'bg-primary-100 text-primary-600 border-primary-200';
      case 'feedback':
        return 'bg-success-100 text-success-600 border-success-200';
      case 'achievement':
        return 'bg-warning-100 text-warning-600 border-warning-200';
      case 'alert':
        return 'bg-error-100 text-error-600 border-error-200';
      case 'team_update':
        return 'bg-info-100 text-info-600 border-info-200';
      case 'deadline':
        return 'bg-warning-100 text-warning-600 border-warning-200';
      case 'comment':
        return 'bg-primary-100 text-primary-600 border-primary-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'yesterday';
    return date.toLocaleDateString();
  };

  const filters = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'mentions', label: 'Mentions', count: notifications.filter(n => n.type === 'mention').length },
    { id: 'feedback', label: 'Feedback', count: notifications.filter(n => n.type === 'feedback').length },
    { id: 'alerts', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    if (selectedFilter === 'mentions') return notification.type === 'mention';
    if (selectedFilter === 'feedback') return notification.type === 'feedback';
    if (selectedFilter === 'alerts') return notification.type === 'alert';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Notifications</h3>
            <p className="text-sm text-neutral-600">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <ProfessionalButton
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            icon={<Check className="w-4 h-4" />}
          >
            Mark all as read
          </ProfessionalButton>
        )}
      </div>

      {/* Filters */}
      <ProfessionalCard>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-neutral-600 flex-shrink-0" />
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setSelectedFilter(filter.id);
                onFilterChange(filter.id);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedFilter === filter.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  selectedFilter === filter.id
                    ? 'bg-primary-700 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </ProfessionalCard>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <ProfessionalCard>
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h4 className="text-sm font-medium text-neutral-900 mb-1">No notifications</h4>
              <p className="text-sm text-neutral-600">
                {selectedFilter === 'unread' ? 'All notifications have been read' : 'No notifications match this filter'}
              </p>
            </div>
          </ProfessionalCard>
        ) : (
          filteredNotifications.map((notification) => (
            <ProfessionalCard
              key={notification.id}
              hover={true}
              className={`transition-all duration-200 ${
                !notification.read ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Notification Icon */}
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type, notification.priority)}`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium text-neutral-900 mb-1 ${
                        !notification.read ? 'font-semibold' : ''
                      }`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-neutral-600 mb-2">{notification.message}</p>
                      
                      {/* Metadata */}
                      {notification.metadata && (
                        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
                          {notification.metadata.fromUser && (
                            <span>From {notification.metadata.fromUser}</span>
                          )}
                          {notification.metadata.projectName && (
                            <span>Project: {notification.metadata.projectName}</span>
                          )}
                          {notification.metadata.teamName && (
                            <span>Team: {notification.metadata.teamName}</span>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      {notification.actionUrl && notification.actionText && (
                        <ProfessionalButton
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Handle navigation to action URL
                            if (notification.actionUrl) {
                              window.location.href = notification.actionUrl;
                            }
                          }}
                        >
                          {notification.actionText}
                        </ProfessionalButton>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="p-1 text-neutral-400 hover:text-primary-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteNotification(notification.id)}
                        className="p-1 text-neutral-400 hover:text-error-600 transition-colors"
                        title="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-neutral-500 mt-2">
                    {formatTimestamp(notification.timestamp)}
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          ))
        )}
      </div>
    </div>
  );
}
