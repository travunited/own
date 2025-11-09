'use client';

import { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Users, CheckCircle } from 'lucide-react';

export default function RolesPage() {
  const roles = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Full system access and control',
      permissions: ['all'],
      userCount: 1,
      color: 'red',
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Manage applications, documents, and content',
      permissions: [
        'manage_applications',
        'verify_documents',
        'manage_content',
        'handle_support',
      ],
      userCount: 3,
      color: 'purple',
    },
    {
      id: 'sub_admin',
      name: 'Sub Admin',
      description: 'Review applications and verify documents',
      permissions: ['review_applications', 'verify_documents'],
      userCount: 5,
      color: 'blue',
    },
    {
      id: 'regional_admin',
      name: 'Regional Admin',
      description: 'Manage regional operations',
      permissions: ['manage_regional_applications', 'regional_analytics'],
      userCount: 2,
      color: 'green',
    },
    {
      id: 'maintenance_admin',
      name: 'Maintenance Admin',
      description: 'System health and technical operations',
      permissions: ['system_health', 'logs', 'backups'],
      userCount: 1,
      color: 'gray',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
            <p className="text-gray-600 mt-2">Manage user roles and access control</p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Create Role
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-${role.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <Shield className={`w-6 h-6 text-${role.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {perm.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{role.userCount} users</span>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Users →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

