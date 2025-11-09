'use client';

import {
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plane,
  Package,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, {
      label: string;
      color: string;
      bg: string;
      icon: any;
    }> = {
      draft: {
        label: 'Draft',
        color: 'text-gray-700',
        bg: 'bg-gray-100',
        icon: FileText,
      },
      submitted: {
        label: 'Submitted',
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        icon: CheckCircle,
      },
      under_review: {
        label: 'Under Review',
        color: 'text-yellow-700',
        bg: 'bg-yellow-100',
        icon: Clock,
      },
      documents_requested: {
        label: 'Documents Requested',
        color: 'text-orange-700',
        bg: 'bg-orange-100',
        icon: AlertCircle,
      },
      documents_verified: {
        label: 'Documents Verified',
        color: 'text-green-700',
        bg: 'bg-green-100',
        icon: CheckCircle,
      },
      in_processing: {
        label: 'In Processing',
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        icon: Clock,
      },
      approved: {
        label: 'Approved',
        color: 'text-green-700',
        bg: 'bg-green-100',
        icon: CheckCircle,
      },
      rejected: {
        label: 'Rejected',
        color: 'text-red-700',
        bg: 'bg-red-100',
        icon: XCircle,
      },
      visa_issued: {
        label: 'Visa Issued',
        color: 'text-green-700',
        bg: 'bg-green-100',
        icon: Plane,
      },
      delivered: {
        label: 'Delivered',
        color: 'text-green-700',
        bg: 'bg-green-100',
        icon: Package,
      },
      completed: {
        label: 'Completed',
        color: 'text-green-700',
        bg: 'bg-green-100',
        icon: CheckCircle,
      },
    };

    return configs[status] || {
      label: status,
      color: 'text-gray-700',
      bg: 'bg-gray-100',
      icon: FileText,
    };
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.bg} ${config.color} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} mr-1.5`} />}
      {config.label}
    </span>
  );
}

