'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Plane,
  FileText,
  CheckSquare,
  CreditCard,
  Users,
  Shield,
  Briefcase,
  UserPlus,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface AdminSidebarProps {
  userRole?: string;
}

export default function AdminSidebar({ userRole = 'admin' }: AdminSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/admin',
      roles: ['super_admin', 'admin', 'sub_admin'],
    },
    {
      id: 'countries',
      label: 'Countries',
      icon: Globe,
      href: '/admin/countries',
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'tours',
      label: 'Tours',
      icon: Plane,
      href: '/admin/tours',
      roles: ['super_admin', 'admin'],
      subItems: [
        { label: 'All Tours', href: '/admin/tours' },
        { label: 'Add New Tour', href: '/admin/tours/create' },
        { label: 'Tour Categories', href: '/admin/tours/categories' },
        { label: 'Tour Themes', href: '/admin/tours/themes' },
      ],
    },
    {
      id: 'blogs',
      label: 'Blogs',
      icon: FileText,
      href: '/admin/content/blog',
      roles: ['super_admin', 'admin'],
      subItems: [
        { label: 'All Posts', href: '/admin/content/blog' },
        { label: 'Create Post', href: '/admin/content/blog/create' },
        { label: 'Categories', href: '/admin/content/categories' },
        { label: 'Tags', href: '/admin/content/tags' },
      ],
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: CheckSquare,
      href: '/admin/applications',
      roles: ['super_admin', 'admin', 'sub_admin'],
      badge: 'pendingReview',
      subItems: [
        { label: 'All Applications', href: '/admin/applications' },
        { label: 'Pending Review', href: '/admin/applications?status=under_review' },
        { label: 'Documents', href: '/admin/documents' },
        { label: 'Approved', href: '/admin/applications?status=approved' },
        { label: 'Rejected', href: '/admin/applications?status=rejected' },
      ],
    },
    {
      id: 'tour-applications',
      label: 'Tour Applications',
      icon: Plane,
      href: '/admin/tour-applications',
      roles: ['super_admin', 'admin'],
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      href: '/admin/payments',
      roles: ['super_admin', 'admin'],
      subItems: [
        { label: 'All Transactions', href: '/admin/payments' },
        { label: 'Pending', href: '/admin/payments?status=pending' },
        { label: 'Completed', href: '/admin/payments?status=completed' },
        { label: 'Refunds', href: '/admin/payments/refunds' },
      ],
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      href: '/admin/users',
      roles: ['super_admin', 'admin'],
      subItems: [
        { label: 'All Users', href: '/admin/users' },
        { label: 'Admins', href: '/admin/users?role=admin' },
        { label: 'Active Users', href: '/admin/users?status=active' },
        { label: 'Suspended', href: '/admin/users?status=suspended' },
      ],
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: Shield,
      href: '/admin/roles',
      roles: ['super_admin'],
    },
    {
      id: 'team',
      label: 'Team',
      icon: Briefcase,
      href: '/admin/team',
      roles: ['super_admin', 'admin'],
      subItems: [
        { label: 'Team Members', href: '/admin/team' },
        { label: 'Add Member', href: '/admin/team/add' },
        { label: 'Departments', href: '/admin/team/departments' },
      ],
    },
    {
      id: 'careers',
      label: 'Careers',
      icon: UserPlus,
      href: '/admin/careers',
      roles: ['super_admin', 'admin'],
      subItems: [
        { label: 'Job Postings', href: '/admin/careers' },
        { label: 'Add Job', href: '/admin/careers/create' },
        { label: 'Applications', href: '/admin/careers/applications' },
      ],
    },
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      href: '/admin/system',
      roles: ['super_admin', 'maintenance_admin'],
      subItems: [
        { label: 'Settings', href: '/admin/system/settings' },
        { label: 'Email Config', href: '/admin/system/email' },
        { label: 'Payment Gateway', href: '/admin/system/payment' },
        { label: 'Logs', href: '/admin/system/logs' },
        { label: 'Backups', href: '/admin/system/backups' },
      ],
    },
  ];

  // Filter menu items by role
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    // TODO: Implement logout
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="text-2xl font-bold text-primary-600">
            Travunited
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedSection === item.id;

            return (
              <div key={item.id}>
                {/* Main Item */}
                <div
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors
                    ${
                      active
                        ? 'bg-primary-50 text-primary-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleSection(item.id);
                    } else {
                      window.location.href = item.href;
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {hasSubItems && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      3
                    </span>
                  )}
                </div>

                {/* Sub Items */}
                {hasSubItems && isExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`
                          block px-4 py-2 text-sm rounded-lg transition-colors
                          ${
                            pathname === subItem.href
                              ? 'bg-primary-50 text-primary-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500 capitalize">{userRole.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

