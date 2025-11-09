'use client';

import { useState } from 'react';
import { CheckCircle, Zap, Shield, HeadphonesIcon, FileCheck } from 'lucide-react';

interface AddonsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AddonsStep({ data, onUpdate, onNext, onBack }: AddonsStepProps) {
  const availableAddons = [
    {
      id: 'express',
      name: 'Express Processing',
      description: 'Get your visa faster with priority processing',
      icon: Zap,
      price: 2000,
      perPerson: true,
      popular: true,
    },
    {
      id: 'doc-verification',
      name: 'Document Verification Service',
      description: 'Expert review of your documents before submission',
      icon: FileCheck,
      price: 500,
      perPerson: false,
      popular: false,
    },
    {
      id: 'insurance',
      name: 'Travel Insurance',
      description: 'Comprehensive travel insurance coverage',
      icon: Shield,
      price: 800,
      perPerson: true,
      popular: true,
    },
    {
      id: 'premium-support',
      name: 'Premium WhatsApp Support',
      description: '24/7 dedicated support via WhatsApp',
      icon: HeadphonesIcon,
      price: 300,
      perPerson: false,
      popular: false,
    },
  ];

  const [selectedAddons, setSelectedAddons] = useState<string[]>(data.addons || []);

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const calculateTotal = () => {
    const basePrice = (data.basePrice || 5499) * (data.travellers?.length || 1);
    const addonsTotal = availableAddons
      .filter((addon) => selectedAddons.includes(addon.id))
      .reduce((total, addon) => {
        const price = addon.perPerson ? addon.price * (data.travellers?.length || 1) : addon.price;
        return total + price;
      }, 0);
    
    const expressCharge = data.processingType === 'EXPRESS' ? 2000 * (data.travellers?.length || 1) : 0;
    return basePrice + addonsTotal + expressCharge;
  };

  const handleContinue = () => {
    onUpdate({
      ...data,
      addons: selectedAddons,
      totalAmount: calculateTotal(),
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enhance Your Experience</h2>
        <p className="text-gray-600 mb-6">
          Add optional services to make your visa application smoother
        </p>

        <div className="space-y-4">
          {availableAddons.map((addon) => {
            const Icon = addon.icon;
            const isSelected = selectedAddons.includes(addon.id);
            const priceDisplay = addon.perPerson
              ? `₹${addon.price} × ${data.travellers?.length || 1} = ₹${(addon.price * (data.travellers?.length || 1)).toLocaleString('en-IN')}`
              : `₹${addon.price.toLocaleString('en-IN')}`;

            return (
              <button
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary-600' : 'bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg text-gray-900">{addon.name}</h3>
                      {addon.popular && (
                        <span className="badge bg-orange-100 text-orange-800 text-xs">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{addon.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {addon.perPerson ? 'Per person' : 'One-time charge'}
                      </p>
                      <p className="font-bold text-primary-600">{priceDisplay}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-gray-50">
        <h3 className="font-bold text-lg mb-4">Cost Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Base Visa Fee ({data.travellers?.length || 1} traveller(s))
            </span>
            <span className="font-medium">
              ₹{((data.basePrice || 5499) * (data.travellers?.length || 1)).toLocaleString('en-IN')}
            </span>
          </div>
          
          {data.processingType === 'EXPRESS' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Express Processing</span>
              <span className="font-medium">
                ₹{(2000 * (data.travellers?.length || 1)).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {selectedAddons.map((addonId) => {
            const addon = availableAddons.find((a) => a.id === addonId);
            if (!addon) return null;
            const price = addon.perPerson
              ? addon.price * (data.travellers?.length || 1)
              : addon.price;
            return (
              <div key={addonId} className="flex justify-between">
                <span className="text-gray-600">{addon.name}</span>
                <span className="font-medium">₹{price.toLocaleString('en-IN')}</span>
              </div>
            );
          })}

          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-bold text-2xl text-primary-600">
                ₹{calculateTotal().toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button onClick={handleContinue} className="btn-primary">
          Continue to Review
        </button>
      </div>
    </div>
  );
}

