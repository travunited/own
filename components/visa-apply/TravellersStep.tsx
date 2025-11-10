'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, User, Calendar, AlertCircle, CheckCircle, Save } from 'lucide-react';

interface TravellersStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Traveller {
  id?: string;
  full_name: string;
  date_of_birth: string;
  passport_number: string;
  passport_expiry: string;
  nationality: string;
  gender: string;
  is_lead_traveller: boolean;
}

export default function TravellersStep({ data, onUpdate, onNext, onBack }: TravellersStepProps) {
  const [travellers, setTravellers] = useState<Traveller[]>(
    data.travellers?.length > 0
      ? data.travellers
      : [
          {
            full_name: '',
            date_of_birth: '',
            passport_number: '',
            passport_expiry: '',
            nationality: 'Indian',
            gender: '',
            is_lead_traveller: true,
          },
        ]
  );
  
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<number, string[]>>({});

  // Auto-save every 3 seconds when data changes
  useEffect(() => {
    if (data.application_id) {
      const timer = setTimeout(() => {
        autoSave();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [travellers]);

  const autoSave = async () => {
    if (!data.application_id) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/visa-applications/${data.application_id}/auto-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'travellers',
          data: { travellers },
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTraveller = () => {
    const newTraveller: Traveller = {
      full_name: '',
      date_of_birth: '',
      passport_number: '',
      passport_expiry: '',
      nationality: 'Indian',
      gender: '',
      is_lead_traveller: false,
    };
    setTravellers([...travellers, newTraveller]);
  };

  const removeTraveller = (index: number) => {
    if (travellers.length > 1) {
      setTravellers(travellers.filter((_, i) => i !== index));
    } else {
      alert('At least one traveller is required');
    }
  };

  const updateTraveller = (index: number, field: keyof Traveller, value: any) => {
    setTravellers(
      travellers.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
    
    // Clear error for this field
    if (errors[index]) {
      setErrors({
        ...errors,
        [index]: errors[index].filter(e => !e.includes(field)),
      });
    }
  };

  const validateTraveller = (traveller: Traveller, index: number): string[] => {
    const issues: string[] = [];

    if (!traveller.full_name || traveller.full_name.trim().length < 3) {
      issues.push('Full name must be at least 3 characters');
    }

    if (!traveller.date_of_birth) {
      issues.push('Date of birth is required');
    } else {
      const dob = new Date(traveller.date_of_birth);
      const age = (new Date().getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 0 || age > 150) {
        issues.push('Invalid date of birth');
      }
    }

    if (!traveller.passport_number || traveller.passport_number.trim().length < 6) {
      issues.push('Valid passport number is required');
    }

    if (!traveller.passport_expiry) {
      issues.push('Passport expiry date is required');
    } else {
      const expiry = new Date(traveller.passport_expiry);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      
      if (expiry < sixMonthsFromNow) {
        issues.push('Passport must be valid for at least 6 months');
      }
    }

    if (!traveller.gender) {
      issues.push('Gender is required');
    }

    return issues;
  };

  const validateAllTravellers = () => {
    const allErrors: Record<number, string[]> = {};
    let isValid = true;

    travellers.forEach((traveller, index) => {
      const issues = validateTraveller(traveller, index);
      if (issues.length > 0) {
        allErrors[index] = issues;
        isValid = false;
      }
    });

    setErrors(allErrors);
    return isValid;
  };

  const handleContinue = async () => {
    // Validate all travellers
    if (!validateAllTravellers()) {
      alert('Please fix all errors before continuing');
      return;
    }

    // Save travelers to database if we have application ID
    if (data.application_id) {
      try {
        const response = await fetch(`/api/visa-applications/${data.application_id}/travelers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ travelers: travellers }),
        });

        if (!response.ok) {
          throw new Error('Failed to save travelers');
        }
      } catch (error) {
        console.error('Error saving travelers:', error);
        alert('Failed to save traveler details. Please try again.');
        return;
      }
    }

    onUpdate({ ...data, travellers });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Traveller Details</h2>
            <p className="text-gray-600">
              Please ensure details match exactly as in passport
            </p>
          </div>
          
          {/* Auto-save indicator */}
          {data.application_id && (
            <div className="text-sm text-gray-600 flex items-center">
              {saving ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </>
              ) : null}
            </div>
          )}
        </div>

        {travellers.map((traveller, index) => (
          <div
            key={index}
            className="mb-8 pb-8 border-b border-gray-200 last:border-0"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-600" />
                {traveller.is_lead_traveller ? 'Lead Traveller' : `Traveller ${index + 1}`}
              </h3>
              {!traveller.is_lead_traveller && (
                <button
                  onClick={() => removeTraveller(index)}
                  className="text-red-600 hover:text-red-700 flex items-center text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              )}
            </div>

            {/* Error Summary */}
            {errors[index] && errors[index].length > 0 && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 mb-1">Please fix these issues:</p>
                    <ul className="text-sm text-red-800 space-y-1">
                      {errors[index].map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (as in Passport) *
                </label>
                <input
                  type="text"
                  value={traveller.full_name}
                  onChange={(e) => updateTraveller(index, 'full_name', e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={traveller.date_of_birth}
                  onChange={(e) => updateTraveller(index, 'date_of_birth', e.target.value)}
                  className="input-field"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={traveller.gender}
                  onChange={(e) => updateTraveller(index, 'gender', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Number *
                </label>
                <input
                  type="text"
                  value={traveller.passport_number}
                  onChange={(e) => updateTraveller(index, 'passport_number', e.target.value.toUpperCase())}
                  className="input-field uppercase"
                  placeholder="A1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Expiry Date *
                </label>
                <input
                  type="date"
                  value={traveller.passport_expiry}
                  onChange={(e) => updateTraveller(index, 'passport_expiry', e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
                {traveller.passport_expiry && (
                  <p className="text-xs text-gray-600 mt-1">
                    {(() => {
                      const expiry = new Date(traveller.passport_expiry);
                      const sixMonths = new Date();
                      sixMonths.setMonth(sixMonths.getMonth() + 6);
                      
                      if (expiry < sixMonths) {
                        return (
                          <span className="text-red-600 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Passport must be valid for at least 6 months
                          </span>
                        );
                      }
                      return (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Valid for visa application
                        </span>
                      );
                    })()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality *
                </label>
                <select
                  value={traveller.nationality}
                  onChange={(e) => updateTraveller(index, 'nationality', e.target.value)}
                  className="input-field"
                >
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="British">British</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Australian">Australian</option>
                  {/* Add more nationalities as needed */}
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Add Traveller Button */}
        <button
          onClick={addTraveller}
          className="btn-outline w-full flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Traveller
        </button>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Important Information</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure all details match your passport exactly</li>
                <li>• Passport must be valid for at least 6 months from travel date</li>
                <li>• Lead traveller will be the primary contact</li>
                <li>• Changes auto-saved every few seconds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-outline px-8">
          Back
        </button>
        <button
          onClick={handleContinue}
          className="btn-primary px-8"
        >
          Continue to Documents
        </button>
      </div>
    </div>
  );
}
