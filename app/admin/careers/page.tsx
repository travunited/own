'use client';

import { useState } from 'react';
import { UserPlus, Plus, Edit, Trash2, Eye, MapPin, Briefcase, Clock } from 'lucide-react';

export default function CareersPage() {
  // Mock data - will be replaced with real database
  const jobs = [
    {
      id: '1',
      title: 'Senior Visa Processing Officer',
      department: 'Operations',
      location: 'Bangalore',
      type: 'Full-time',
      status: 'active',
      applicants: 23,
      postedDate: '2025-01-05',
    },
    {
      id: '2',
      title: 'Customer Support Executive',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      status: 'active',
      applicants: 45,
      postedDate: '2025-01-03',
    },
    {
      id: '3',
      title: 'Tour Operations Manager',
      department: 'Tours',
      location: 'Mumbai',
      type: 'Full-time',
      status: 'active',
      applicants: 12,
      postedDate: '2024-12-28',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Careers</h1>
            <p className="text-gray-600 mt-2">Manage job postings and applications</p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="text-3xl font-bold text-primary-600">
              {jobs.reduce((sum, j) => sum + j.applicants, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-3xl font-bold text-green-600">32</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">Hired</p>
            <p className="text-3xl font-bold text-blue-600">8</p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {job.department}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.type}
                    </span>
                    <span className="flex items-center">
                      <UserPlus className="w-4 h-4 mr-1" />
                      {job.applicants} applicants
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Posted on {new Date(job.postedDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

