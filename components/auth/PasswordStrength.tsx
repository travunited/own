'use client';

import { validatePassword, PasswordStrength as PasswordStrengthType } from '@/lib/auth/password';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<PasswordStrengthType | null>(null);

  useEffect(() => {
    if (password) {
      setStrength(validatePassword(password));
    } else {
      setStrength(null);
    }
  }, [password]);

  if (!strength) return null;

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-red-500';
    if (score === 1) return 'bg-red-400';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = (score: number) => {
    if (score <= 1) return 'text-red-600';
    if (score === 2) return 'text-yellow-600';
    if (score === 3) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password Strength</span>
          <span className={`font-semibold ${getStrengthTextColor(strength.score)}`}>
            {strength.feedback}
          </span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full transition-colors ${
                level <= strength.score ? getStrengthColor(strength.score) : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <div className="text-xs text-gray-600">Requirements:</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(strength.requirements).map(([key, met]) => (
            <div key={key} className="flex items-center text-xs">
              {met ? (
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <XCircle className="w-3 h-3 text-gray-300 mr-1" />
              )}
              <span className={met ? 'text-green-600' : 'text-gray-500'}>
                {getRequirementLabel(key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getRequirementLabel(key: string): string {
  const labels: Record<string, string> = {
    minLength: '8+ characters',
    hasUppercase: 'Uppercase letter',
    hasLowercase: 'Lowercase letter',
    hasNumber: 'Number',
    hasSpecialChar: 'Special character',
  };
  return labels[key] || key;
}

