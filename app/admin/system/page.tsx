'use client';

import { Settings, Mail, CreditCard, Database, FileText, Shield, Activity } from 'lucide-react';
import Link from 'next/link';

export default function SystemPage() {
  const systemSettings = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Site name, logo, contact information',
      icon: Settings,
      color: 'blue',
      href: '/admin/system/settings',
    },
    {
      id: 'email',
      title: 'Email Configuration',
      description: 'SMTP settings, email templates',
      icon: Mail,
      color: 'green',
      href: '/admin/system/email',
    },
    {
      id: 'payment',
      title: 'Payment Gateway',
      description: 'Razorpay, payment methods, currencies',
      icon: CreditCard,
      color: 'purple',
      href: '/admin/system/payment',
    },
    {
      id: 'database',
      title: 'Database',
      description: 'Backup, restore, health monitoring',
      icon: Database,
      color: 'orange',
      href: '/admin/system/database',
    },
    {
      id: 'logs',
      title: 'System Logs',
      description: 'Error logs, audit logs, activity logs',
      icon: FileText,
      color: 'red',
      href: '/admin/system/logs',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'SSL, CORS, rate limiting, firewall',
      icon: Shield,
      color: 'indigo',
      href: '/admin/system/security',
    },
  ];

  const systemHealth = {
    status: 'healthy',
    uptime: '99.9%',
    lastBackup: '2 hours ago',
    diskUsage: '23%',
    memoryUsage: '45%',
    apiLatency: '145ms',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure and monitor system settings</p>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">System Health</h2>
              <p className="text-green-100">All systems operational</p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8" />
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
            <div>
              <p className="text-xs text-green-100">Status</p>
              <p className="text-lg font-bold">{systemHealth.status}</p>
            </div>
            <div>
              <p className="text-xs text-green-100">Uptime</p>
              <p className="text-lg font-bold">{systemHealth.uptime}</p>
            </div>
            <div>
              <p className="text-xs text-green-100">Last Backup</p>
              <p className="text-lg font-bold">{systemHealth.lastBackup}</p>
            </div>
            <div>
              <p className="text-xs text-green-100">Disk</p>
              <p className="text-lg font-bold">{systemHealth.diskUsage}</p>
            </div>
            <div>
              <p className="text-xs text-green-100">Memory</p>
              <p className="text-lg font-bold">{systemHealth.memoryUsage}</p>
            </div>
            <div>
              <p className="text-xs text-green-100">API Latency</p>
              <p className="text-lg font-bold">{systemHealth.apiLatency}</p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemSettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <Link
                key={setting.id}
                href={setting.href}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
              >
                <div
                  className={`w-12 h-12 bg-${setting.color}-100 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 text-${setting.color}-600`} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {setting.title}
                </h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

