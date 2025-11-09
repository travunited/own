'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudOff, Check } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSavedAt: Date | null;
  error?: string;
}

export default function AutoSaveIndicator({
  isSaving,
  lastSavedAt,
  error,
}: AutoSaveIndicatorProps) {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    if (lastSavedAt) {
      setFormattedTime(formatTime(lastSavedAt));
      
      // Update every minute
      const interval = setInterval(() => {
        setFormattedTime(formatTime(lastSavedAt));
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [lastSavedAt]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  if (error) {
    return (
      <div className="flex items-center text-sm text-red-600">
        <CloudOff className="w-4 h-4 mr-2 animate-pulse" />
        <span>Save failed</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center text-sm text-gray-600">
        <Cloud className="w-4 h-4 mr-2 animate-pulse" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSavedAt) {
    return (
      <div className="flex items-center text-sm text-green-600">
        <Check className="w-4 h-4 mr-2" />
        <span>Saved {formattedTime}</span>
      </div>
    );
  }

  return null;
}

