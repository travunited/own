'use client';

import { useState, useEffect } from 'react';
import { Shield, Zap, FileCheck, Headphones, Camera, Truck, CheckCircle } from 'lucide-react';

interface AddonsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const iconMap: Record<string, any> = {
  Shield,
  Zap,
  FileCheck,
  Headphones,
  Camera,
  Truck,
};

export default function AddonsStep({ data, onUpdate, onNext, onBack }: AddonsStepProps) {
  const [addons, setAddons] = useState<any[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(data.addons || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddons();
  }, []);

  const loadAddons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/visa-apply/load-data');
      const result = await response.json();

      if (result.success) {
        setAddons(result.addons || []);
      }
    } catch (error) {
      console.error('Error loading add-ons:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const calculateAddonsTotal = () => {
    return addons
      .filter((addon) => selectedAddons.includes(addon.id))
      .reduce((sum, addon) => sum + (addon.price || 0), 0);
  };

  const handleContinue = () => {
    const selectedAddonData = addons.filter((addon) => selectedAddons.includes(addon.id));
    
    onUpdate({
      ...data,
      addons: selectedAddons,
      addon_details: selectedAddonData,
      addons_charge: calculateAddonsTotal(),
      total_amount: (data.base_price || 0) + (data.service_charge || 0) + (data.processing_charge || 0) + calculateAddonsTotal(),
    });
    onNext();
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading add-on services...</p>
      </div>
    );
  }

  // Group add-ons by category
  const groupedAddons = addons.reduce((acc: any, addon) => {
    const category = addon.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(addon);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    insurance: 'Insurance & Protection',
    processing: 'Processing Options',
    assistance: 'Document Assistance',
    support: 'Support Services',
    other: 'Other Services',
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Optional Add-on Services</h2>
        <p className="text-gray-600 mb-6">
          Enhance your application with our premium services (optional)
        </p>

        {addons.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No add-on services available at this time</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAddons).map(([category, categoryAddons]: [string, any]) => (
              <div key={category}>
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  {categoryLabels[category] || category}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryAddons.map((addon: any) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    const Icon = iconMap[addon.icon] || FileCheck;

                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                          isSelected
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-primary-600' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            <h4 className="font-bold text-gray-900 ml-3">{addon.name}</h4>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-primary-600" />
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{addon.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600">
                            ₹{(addon.price || 0).toLocaleString('en-IN')}
                          </span>
                          {isSelected && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                              Added
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price Summary */}
        {selectedAddons.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Selected Add-ons</h3>
            <div className="space-y-2 text-sm mb-4">
              {addons
                .filter((addon) => selectedAddons.includes(addon.id))
                .map((addon) => (
                  <div key={addon.id} className="flex justify-between">
                    <span className="text-gray-600">{addon.name}</span>
                    <span className="font-medium">₹{(addon.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              <div className="border-t border-primary-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Add-ons Total</span>
                <span className="font-bold text-primary-600">
                  ₹{calculateAddonsTotal().toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All add-ons are optional. You can skip this step if you don't need any additional services.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-outline px-8">
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onUpdate({ ...data, addons: [], addons_charge: 0 });
              onNext();
            }}
            className="btn-outline px-6"
          >
            Skip Add-ons
          </button>
          <button onClick={handleContinue} className="btn-primary px-8">
            Continue to Review
          </button>
        </div>
      </div>
    </div>
  );
}
