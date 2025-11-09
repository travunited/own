/**
 * Next.js Middleware - Route Protection & Role-Based Access
 */

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Public routes (no authentication required)
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/about', '/contact', '/visas', '/tours', '/blog'];
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // API routes - handle separately
  if (pathname.startsWith('/api/')) {
    return res;
  }

  // If not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated, check role-based access
  if (session) {
    // Get user role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, preferences')
      .eq('id', session.user.id)
      .single();

    const userRole = profile?.role || profile?.preferences?.role || 'user';

    // Super Admin routes
    if (pathname.startsWith('/super-admin')) {
      if (userRole !== 'super_admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }

    // Admin routes (admin, sub_admin)
    if (pathname.startsWith('/admin')) {
      if (!['super_admin', 'admin', 'sub_admin'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Regional Admin routes
    if (pathname.startsWith('/regional-admin')) {
      if (!['super_admin', 'regional_admin'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Maintenance Admin routes
    if (pathname.startsWith('/maintenance')) {
      if (!['super_admin', 'maintenance_admin'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // User dashboard routes
    if (pathname.startsWith('/dashboard')) {
      // All authenticated users can access
      // Admins redirected to their dashboards if they go to /dashboard directly
      if (pathname === '/dashboard' && ['super_admin', 'admin', 'sub_admin', 'regional_admin', 'maintenance_admin'].includes(userRole)) {
        const roleRoutes: Record<string, string> = {
          super_admin: '/super-admin',
          admin: '/admin',
          sub_admin: '/admin',
          regional_admin: '/regional-admin',
          maintenance_admin: '/maintenance',
        };
        return NextResponse.redirect(new URL(roleRoutes[userRole], request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

