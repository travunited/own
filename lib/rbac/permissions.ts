/**
 * RBAC Permissions & Role Checking Utilities
 */

export type AdminRole = 'user' | 'sub_admin' | 'admin' | 'regional_admin' | 'maintenance_admin' | 'super_admin';

export interface RolePermissions {
  applications?: {
    view: 'all' | 'assigned' | 'region' | 'none';
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    approve?: boolean;
    reject?: boolean;
    export?: boolean;
  };
  users?: {
    view: 'all' | 'region' | 'none';
    create?: boolean;
    edit?: boolean;
    suspend?: boolean;
    delete?: boolean;
    assignRoles?: boolean;
  };
  payments?: {
    view: 'all' | 'region' | 'assigned' | 'none';
    refund?: boolean;
    export?: boolean;
  };
  documents?: {
    view: 'all' | 'assigned' | 'region' | 'none';
    verify?: boolean;
    delete?: boolean;
  };
  system?: {
    configuration?: boolean;
    maintenance?: boolean;
    backups?: boolean;
    logs?: boolean;
  };
  analytics?: {
    view: 'all' | 'region' | 'basic' | 'system' | 'none';
    export?: boolean;
  };
  content?: {
    blog?: boolean;
    pages?: boolean;
    faqs?: boolean;
  };
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<AdminRole, RolePermissions> = {
  super_admin: {
    applications: { view: 'all', create: true, edit: true, delete: true, approve: true, reject: true, export: true },
    users: { view: 'all', create: true, edit: true, suspend: true, delete: true, assignRoles: true },
    payments: { view: 'all', refund: true, export: true },
    documents: { view: 'all', verify: true, delete: true },
    system: { configuration: true, maintenance: true, backups: true, logs: true },
    analytics: { view: 'all', export: true },
    content: { blog: true, pages: true, faqs: true },
  },
  admin: {
    applications: { view: 'all', create: false, edit: true, delete: false, approve: true, reject: true, export: true },
    users: { view: 'all', create: false, edit: true, suspend: true, delete: false, assignRoles: false },
    payments: { view: 'all', refund: true, export: true },
    documents: { view: 'all', verify: true, delete: false },
    system: { configuration: false, maintenance: false, backups: false, logs: false },
    analytics: { view: 'all', export: true },
    content: { blog: true, pages: true, faqs: true },
  },
  sub_admin: {
    applications: { view: 'assigned', create: false, edit: false, delete: false, approve: false, reject: false, export: false },
    users: { view: 'none', create: false, edit: false, suspend: false, delete: false, assignRoles: false },
    payments: { view: 'assigned', refund: false, export: false },
    documents: { view: 'assigned', verify: true, delete: false },
    system: { configuration: false, maintenance: false, backups: false, logs: false },
    analytics: { view: 'basic', export: false },
    content: { blog: false, pages: false, faqs: false },
  },
  regional_admin: {
    applications: { view: 'region', create: false, edit: true, delete: false, approve: true, reject: true, export: true },
    users: { view: 'region', create: false, edit: true, suspend: true, delete: false, assignRoles: false },
    payments: { view: 'region', refund: false, export: true },
    documents: { view: 'region', verify: true, delete: false },
    system: { configuration: false, maintenance: false, backups: false, logs: false },
    analytics: { view: 'region', export: true },
    content: { blog: false, pages: false, faqs: false },
  },
  maintenance_admin: {
    applications: { view: 'none', create: false, edit: false, delete: false, approve: false, reject: false, export: false },
    users: { view: 'none', create: false, edit: false, suspend: false, delete: false, assignRoles: false },
    payments: { view: 'none', refund: false, export: false },
    documents: { view: 'none', verify: false, delete: false },
    system: { configuration: false, maintenance: true, backups: true, logs: true },
    analytics: { view: 'system', export: false },
    content: { blog: false, pages: false, faqs: false },
  },
  user: {
    applications: { view: 'none' },
    users: { view: 'none' },
    payments: { view: 'none' },
    documents: { view: 'none' },
    system: {},
    analytics: { view: 'none' },
    content: {},
  },
};

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY: Record<AdminRole, number> = {
  user: 0,
  sub_admin: 1,
  regional_admin: 2,
  admin: 3,
  maintenance_admin: 3, // Same level as admin but different permissions
  super_admin: 4,
};

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userRole: AdminRole,
  resource: keyof RolePermissions,
  action: string
): boolean {
  // Super admin has all permissions
  if (userRole === 'super_admin') return true;

  const permissions = ROLE_PERMISSIONS[userRole];
  const resourcePermissions = permissions[resource] as any;

  if (!resourcePermissions) return false;

  return resourcePermissions[action] === true;
}

/**
 * Check if user can access a specific view level
 */
export function canAccessView(
  userRole: AdminRole,
  resource: keyof RolePermissions,
  viewLevel: string
): boolean {
  // Super admin can access all
  if (userRole === 'super_admin') return true;

  const permissions = ROLE_PERMISSIONS[userRole];
  const resourcePermissions = permissions[resource] as any;

  if (!resourcePermissions) return false;

  return resourcePermissions.view === viewLevel || resourcePermissions.view === 'all';
}

/**
 * Get role's dashboard route
 */
export function getRoleDashboardRoute(role: AdminRole): string {
  switch (role) {
    case 'super_admin':
      return '/super-admin';
    case 'admin':
      return '/admin';
    case 'sub_admin':
      return '/admin';
    case 'regional_admin':
      return '/regional-admin';
    case 'maintenance_admin':
      return '/maintenance';
    default:
      return '/dashboard';
  }
}

/**
 * Check if role is admin (any type)
 */
export function isAdmin(role: AdminRole): boolean {
  return role !== 'user';
}

/**
 * Check if role has higher or equal privileges than another role
 */
export function hasHigherOrEqualRole(userRole: AdminRole, targetRole: AdminRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: AdminRole): string {
  const names: Record<AdminRole, string> = {
    user: 'User',
    sub_admin: 'Sub Admin',
    admin: 'Admin',
    regional_admin: 'Regional Admin',
    maintenance_admin: 'Maintenance Admin',
    super_admin: 'Super Admin',
  };
  return names[role];
}

/**
 * Get role color for UI
 */
export function getRoleColor(role: AdminRole): string {
  const colors: Record<AdminRole, string> = {
    user: 'gray',
    sub_admin: 'blue',
    admin: 'purple',
    regional_admin: 'indigo',
    maintenance_admin: 'cyan',
    super_admin: 'red',
  };
  return colors[role];
}

/**
 * Check if user can assign a specific role
 */
export function canAssignRole(adminRole: AdminRole, targetRole: AdminRole): boolean {
  // Only super admin can assign roles
  if (adminRole !== 'super_admin') return false;

  // Super admin can assign any role except super admin
  return targetRole !== 'super_admin';
}

