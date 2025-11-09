'use client';

import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description?: string;
}

interface ApplicationStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export default function ApplicationStepper({
  steps,
  currentStep,
  completedSteps,
}: ApplicationStepperProps) {
  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber) || stepNumber < currentStep;
  };

  const isStepCurrent = (stepNumber: number) => {
    return stepNumber === currentStep;
  };

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all
                    ${isStepCompleted(step.number)
                      ? 'bg-green-500 border-green-500 text-white'
                      : isStepCurrent(step.number)
                      ? 'bg-primary-600 border-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isStepCompleted(step.number) ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step Label */}
                <div className="text-center mt-2">
                  <p
                    className={`text-sm font-medium ${
                      isStepCurrent(step.number) || isStepCompleted(step.number)
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mb-8">
                  <div
                    className={`h-full transition-all ${
                      isStepCompleted(step.number)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <p className="font-semibold text-gray-900">{steps[currentStep - 1]?.title}</p>
          {steps[currentStep - 1]?.description && (
            <p className="text-sm text-gray-600 mt-1">{steps[currentStep - 1]?.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

