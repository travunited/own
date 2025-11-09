'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // TODO: Get actual user role from session
  const userRole = 'super_admin'; // This will come from auth

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar userRole={userRole} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {children}
      </div>
    </div>
  );
}
