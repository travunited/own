'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Users,
  Upload,
  CreditCard,
  FileText,
  Calendar,
  Info,
} from 'lucide-react';

// Step components
import SelectVisaStep from '@/components/visa-apply/SelectVisaStep';
import TravellersStep from '@/components/visa-apply/TravellersStep';
import DocumentsStep from '@/components/visa-apply/DocumentsStep';
import AddonsStep from '@/components/visa-apply/AddonsStep';
import ReviewStep from '@/components/visa-apply/ReviewStep';
import PaymentStep from '@/components/visa-apply/PaymentStep';

export default function VisaApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    country: '',
    visaType: '',
    processingType: 'STANDARD',
    travellers: [],
    documents: {},
    addons: [],
    totalAmount: 0,
  });

  const steps = [
    { number: 1, title: 'Select Visa', icon: MapPin, component: SelectVisaStep },
    { number: 2, title: 'Travellers', icon: Users, component: TravellersStep },
    { number: 3, title: 'Documents', icon: Upload, component: DocumentsStep },
    { number: 4, title: 'Add-ons', icon: FileText, component: AddonsStep },
    { number: 5, title: 'Review', icon: Check, component: ReviewStep },
    { number: 6, title: 'Payment', icon: CreditCard, component: PaymentStep },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Travunited
            </Link>
            <div className="text-right">
              <p className="text-sm text-gray-600">Need help?</p>
              <a href="tel:+911234567890" className="text-primary-600 font-medium">
                +91 123 456 7890
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div
                    className={`flex items-center cursor-pointer ${
                      step.number <= currentStep ? '' : 'opacity-50'
                    }`}
                    onClick={() => handleStepClick(step.number)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className="text-xs text-gray-600">Step {step.number}</p>
                      <p className="font-medium text-gray-900">{step.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <CurrentStepComponent
            data={applicationData}
            onUpdate={setApplicationData}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}

