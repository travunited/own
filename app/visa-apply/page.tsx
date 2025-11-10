'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Save,
} from 'lucide-react';

// Step components
import SelectVisaStep from '@/components/visa-apply/SelectVisaStep';
import TravellersStep from '@/components/visa-apply/TravellersStep';
import DocumentsStep from '@/components/visa-apply/DocumentsStep';
import AddonsStep from '@/components/visa-apply/AddonsStep';
import ReviewStep from '@/components/visa-apply/ReviewStep';
import PaymentStep from '@/components/visa-apply/PaymentStep';

export const dynamic = 'force-dynamic';

function VisaApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [applicationData, setApplicationData] = useState({
    application_id: null as string | null,
    country_id: searchParams.get('country') || '',
    visa_type_id: searchParams.get('visa_type') || '',
    country_name: '',
    visa_type_name: '',
    processing_type: 'STANDARD',
    travellers: [],
    documents: {},
    addons: [],
    total_amount: 0,
    base_price: 0,
    service_charge: 0,
    processing_charge: 0,
    addons_charge: 0,
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

  // Create application when Step 1 is complete
  const handleStepComplete = async (stepNumber: number, stepData: any) => {
    if (stepNumber === 1 && !applicationId) {
      // Create application draft
      try {
        const response = await fetch('/api/visa-applications/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            country_id: stepData.country_id,
            visa_type_id: stepData.visa_type_id,
            processing_type: stepData.processing_type,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setApplicationId(result.application.id);
          setApplicationNumber(result.application_number);
          setApplicationData({
            ...applicationData,
            ...stepData,
            application_id: result.application.id,
          });
        } else {
          alert('Failed to create application. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error creating application:', error);
        alert('Failed to create application. Please try again.');
        return;
      }
    } else {
      setApplicationData({ ...applicationData, ...stepData });
    }
  };

  const handleNext = async () => {
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

  const handleSaveAndExit = async () => {
    if (!applicationId) {
      router.push('/dashboard/applications');
      return;
    }

    setSaving(true);
    try {
      await fetch(`/api/visa-applications/${applicationId}/auto-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          data: applicationData,
        }),
      });

      alert('Application saved! You can resume it later from your dashboard.');
      router.push('/dashboard/applications');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save application');
    } finally {
      setSaving(false);
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
            <div className="flex items-center gap-4">
              {applicationNumber && (
                <div className="text-sm">
                  <p className="text-gray-600">Application #</p>
                  <p className="font-mono font-bold text-primary-600">{applicationNumber}</p>
                </div>
              )}
              <button
                onClick={handleSaveAndExit}
                disabled={saving}
                className="btn-outline text-sm flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save & Exit'}
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-600">Need help?</p>
                <a href="tel:+911234567890" className="text-primary-600 font-medium text-sm">
                  +91 123 456 7890
                </a>
              </div>
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
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
                      <p className={`font-medium ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-all ${
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
            onUpdate={(newData: any) => {
              handleStepComplete(currentStep, newData);
            }}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}

export default function VisaApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    }>
      <VisaApplyContent />
    </Suspense>
  );
}
