'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function AdminReportsPage() {
  const [reportConfig, setReportConfig] = useState({
    type: '',
    dateFrom: '',
    dateTo: '',
    format: 'pdf',
  });

  const reportTypes = [
    {
      id: 'daily-sales',
      name: 'Daily Sales Report',
      description: 'Revenue breakdown by service type',
      category: 'Financial',
      icon: DollarSign,
    },
    {
      id: 'application-summary',
      name: 'Application Summary',
      description: 'Visa application statistics and trends',
      category: 'Operations',
      icon: FileText,
    },
    {
      id: 'tour-bookings',
      name: 'Tour Bookings Report',
      description: 'Tour booking analysis and occupancy',
      category: 'Operations',
      icon: Calendar,
    },
    {
      id: 'team-performance',
      name: 'Team Performance',
      description: 'Individual and team metrics',
      category: 'Operations',
      icon: Users,
    },
    {
      id: 'revenue-trends',
      name: 'Revenue Trends',
      description: 'Monthly revenue analysis',
      category: 'Financial',
      icon: TrendingUp,
    },
    {
      id: 'customer-analytics',
      name: 'Customer Analytics',
      description: 'User behavior and LTV analysis',
      category: 'Analytics',
      icon: Users,
    },
  ];

  const recentReports = [
    {
      name: 'Daily Sales Report - Nov 7, 2024',
      generatedAt: '2024-11-07T23:00:00',
      format: 'PDF',
      size: '2.3 MB',
    },
    {
      name: 'Weekly Application Summary',
      generatedAt: '2024-11-06T18:00:00',
      format: 'Excel',
      size: '1.8 MB',
    },
    {
      name: 'Monthly Revenue Report - October',
      generatedAt: '2024-11-01T09:00:00',
      format: 'PDF',
      size: '3.1 MB',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate and download business reports</p>
      </div>

      {/* Generate Report */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Generate New Report</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type *
            </label>
            <select
              value={reportConfig.type}
              onChange={(e) => setReportConfig({ ...reportConfig, type: e.target.value })}
              className="input-field"
            >
              <option value="">Select Report Type</option>
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={reportConfig.format}
              onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
              className="input-field"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date *
            </label>
            <input
              type="date"
              value={reportConfig.dateFrom}
              onChange={(e) =>
                setReportConfig({ ...reportConfig, dateFrom: e.target.value })
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date *
            </label>
            <input
              type="date"
              value={reportConfig.dateTo}
              onChange={(e) => setReportConfig({ ...reportConfig, dateTo: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <button className="btn-primary flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Generate Report
          </button>
          <button className="btn-outline">Schedule Report</button>
        </div>
      </div>

      {/* Available Reports */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Available Report Types</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setReportConfig({ ...reportConfig, type: report.id })}
              >
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-3">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{report.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <span className="badge bg-gray-100 text-gray-800 text-xs">
                      {report.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Reports</h2>

        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="bg-primary-100 p-3 rounded-lg mr-4">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-600">
                    Generated: {new Date(report.generatedAt).toLocaleString()} •{' '}
                    {report.format} • {report.size}
                  </p>
                </div>
              </div>
              <button className="btn-outline flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

