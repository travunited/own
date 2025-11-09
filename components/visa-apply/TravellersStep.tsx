'use client';

import { useState } from 'react';
import { Plus, Trash2, User, Calendar } from 'lucide-react';

interface TravellersStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Traveller {
  id: string;
  fullName: string;
  dateOfBirth: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  gender: string;
  isLeadTraveller: boolean;
}

export default function TravellersStep({ data, onUpdate, onNext, onBack }: TravellersStepProps) {
  const [travellers, setTravellers] = useState<Traveller[]>(
    data.travellers?.length > 0
      ? data.travellers
      : [
          {
            id: '1',
            fullName: '',
            dateOfBirth: '',
            passportNumber: '',
            passportExpiry: '',
            nationality: 'Indian',
            gender: '',
            isLeadTraveller: true,
          },
        ]
  );

  const addTraveller = () => {
    const newTraveller: Traveller = {
      id: Date.now().toString(),
      fullName: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: 'Indian',
      gender: '',
      isLeadTraveller: false,
    };
    setTravellers([...travellers, newTraveller]);
  };

  const removeTraveller = (id: string) => {
    if (travellers.length > 1) {
      setTravellers(travellers.filter((t) => t.id !== id));
    }
  };

  const updateTraveller = (id: string, field: string, value: string) => {
    setTravellers(
      travellers.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleContinue = () => {
    // Validate all travellers have required fields
    const isValid = travellers.every(
      (t) =>
        t.fullName &&
        t.dateOfBirth &&
        t.passportNumber &&
        t.passportExpiry &&
        t.gender
    );

    if (isValid) {
      onUpdate({ ...data, travellers });
      onNext();
    } else {
      alert('Please fill all required fields for all travellers');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Traveller Details</h2>
        <p className="text-gray-600 mb-6">
          Please ensure details match exactly as in passport
        </p>

        {travellers.map((traveller, index) => (
          <div
            key={traveller.id}
            className="mb-6 pb-6 border-b border-gray-200 last:border-0"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                Traveller {index + 1}
                {traveller.isLeadTraveller && (
                  <span className="ml-2 badge bg-primary-100 text-primary-800 text-sm">
                    Lead Traveller
                  </span>
                )}
              </h3>
              {!traveller.isLeadTraveller && (
                <button
                  onClick={() => removeTraveller(traveller.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (as in passport) *
                </label>
                <input
                  type="text"
                  value={traveller.fullName}
                  onChange={(e) =>
                    updateTraveller(traveller.id, 'fullName', e.target.value)
                  }
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={traveller.dateOfBirth}
                  onChange={(e) =>
                    updateTraveller(traveller.id, 'dateOfBirth', e.target.value)
                  }
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Number *
                </label>
                <input
                  type="text"
                  value={traveller.passportNumber}
                  onChange={(e) =>
                    updateTraveller(traveller.id, 'passportNumber', e.target.value.toUpperCase())
                  }
                  placeholder="A1234567"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Expiry Date *
                </label>
                <input
                  type="date"
                  value={traveller.passportExpiry}
                  onChange={(e) =>
                    updateTraveller(traveller.id, 'passportExpiry', e.target.value)
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality *
                </label>
                <select
                  value={traveller.nationality}
                  onChange={(e) =>
                    updateTraveller(traveller.id, 'nationality', e.target.value)
                  }
                  className="input-field"
                  required
                >
                  <option value="Indian">Indian</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={traveller.gender}
                  onChange={(e) =>
                    updateTraveller(traveller.id, 'gender', e.target.value)
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addTraveller}
          className="btn-outline w-full flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Traveller
        </button>
      </div>

      {/* Summary */}
      <div className="card bg-gray-50">
        <h3 className="font-bold text-lg mb-2">Summary</h3>
        <p className="text-gray-600">
          Total Travellers: <span className="font-bold">{travellers.length}</span>
        </p>
        <p className="text-gray-600">
          Estimated Cost:{' '}
          <span className="font-bold text-primary-600">
            ₹{((data.basePrice || 5499) * travellers.length).toLocaleString('en-IN')}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button onClick={handleContinue} className="btn-primary">
          Continue to Documents
        </button>
      </div>
    </div>
  );
}

