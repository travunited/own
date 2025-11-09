'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, User, Calendar } from 'lucide-react';

export default function DashboardTravellersPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const travellers = [
    {
      id: '1',
      fullName: 'John Doe',
      dateOfBirth: '1985-01-15',
      passportNumber: 'A1234567',
      passportExpiry: '2028-12-20',
      nationality: 'Indian',
      gender: 'Male',
      timesUsed: 5,
    },
    {
      id: '2',
      fullName: 'Jane Doe',
      dateOfBirth: '1987-03-10',
      passportNumber: 'B7654321',
      passportExpiry: '2027-11-15',
      nationality: 'Indian',
      gender: 'Female',
      timesUsed: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Travellers</h1>
          <p className="text-gray-600 mt-1">
            Manage traveller profiles for quick application
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Traveller
        </button>
      </div>

      {/* Add Traveller Form */}
      {showAddForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Traveller</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input type="text" placeholder="Full Name" className="input-field" />
            <input type="date" placeholder="Date of Birth" className="input-field" />
            <input type="text" placeholder="Passport Number" className="input-field" />
            <input type="date" placeholder="Passport Expiry" className="input-field" />
            <select className="input-field">
              <option value="">Select Nationality</option>
              <option value="Indian">Indian</option>
              <option value="Other">Other</option>
            </select>
            <select className="input-field">
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <button className="btn-primary">Save Traveller</button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Travellers Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {travellers.map((traveller) => (
          <div key={traveller.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{traveller.fullName}</h3>
                  <p className="text-sm text-gray-600">
                    Used in {traveller.timesUsed} applications
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-primary-600 hover:text-primary-700">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Date of Birth</p>
                <p className="font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(traveller.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Gender</p>
                <p className="font-medium">{traveller.gender}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Passport Number</p>
                <p className="font-medium">{traveller.passportNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Passport Expiry</p>
                <p className="font-medium">
                  {new Date(traveller.passportExpiry).toLocaleDateString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 mb-1">Nationality</p>
                <p className="font-medium">{traveller.nationality}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {travellers.length === 0 && (
        <div className="card text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Travellers</h3>
          <p className="text-gray-600 mb-6">
            Add traveller profiles for quick visa and tour applications
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Traveller
          </button>
        </div>
      )}
    </div>
  );
}

