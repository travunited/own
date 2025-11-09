'use client';

import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

interface TimelineEvent {
  id: string;
  status: string;
  title: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  isSystemGenerated: boolean;
}

interface ApplicationTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

export default function ApplicationTimeline({ events, currentStatus }: ApplicationTimelineProps) {
  const getIconComponent = (iconName?: string, status?: string) => {
    if (iconName === 'check') return CheckCircle;
    if (iconName === 'clock') return Clock;
    if (iconName === 'alert') return AlertCircle;
    if (iconName === 'file') return FileText;
    
    // Default based on status
    if (status?.includes('approved') || status?.includes('verified')) return CheckCircle;
    if (status?.includes('rejected') || status?.includes('failed')) return AlertCircle;
    return Clock;
  };

  const getIconColor = (status: string) => {
    if (status.includes('approved') || status.includes('verified') || status.includes('completed')) {
      return 'text-green-600 bg-green-100';
    }
    if (status.includes('rejected') || status.includes('failed')) {
      return 'text-red-600 bg-red-100';
    }
    if (status.includes('review') || status.includes('processing')) {
      return 'text-blue-600 bg-blue-100';
    }
    if (status.includes('requested') || status.includes('pending')) {
      return 'text-yellow-600 bg-yellow-100';
    }
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const Icon = getIconComponent(event.icon, event.status);
          const iconColor = getIconColor(event.status);

          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {/* Connector Line */}
                {eventIdx !== events.length - 1 && (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-start space-x-3">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="mt-0.5 text-sm text-gray-600">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(event.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

