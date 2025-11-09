/**
 * Role-Based Auth Helper Functions
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AdminRole, getRoleDashboardRoute } from './permissions';

export interface UserWithRole {
  id: string;
  email: string;
  role: AdminRole;
  regionalAccess?: any;
}

/**
 * Get current user with role
 */
export async function getCurrentUserWithRole(): Promise<UserWithRole | null> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Get user profile with role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, regional_access')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    role: (profile?.role as AdminRole) || 'user',
    regionalAccess: profile?.regional_access,
  };
}

/**
 * Require authentication
 */
export async function requireAuth(): Promise<UserWithRole> {
  const user = await getCurrentUserWithRole();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Require specific role(s)
 */
export async function requireRole(allowedRoles: AdminRole[]): Promise<UserWithRole> {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}

/**
 * Require admin role (any admin type)
 */
export async function requireAdmin(): Promise<UserWithRole> {
  return requireRole(['super_admin', 'admin', 'sub_admin', 'regional_admin', 'maintenance_admin']);
}

/**
 * Get redirect URL after login based on role
 */
export function getPostLoginRedirect(role: AdminRole): string {
  return getRoleDashboardRoute(role);
}

/**
 * Check if user is admin
 */
export function isUserAdmin(role: AdminRole): boolean {
  return role !== 'user';
}

