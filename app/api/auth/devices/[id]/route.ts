/**
 * Device Management API Route
 * Remove or trust a specific device
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getTrustExpirationDate } from '@/lib/auth/device';
import { createSecurityEvent } from '@/lib/auth/security';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Delete device
    const { error } = await supabase
      .from('user_devices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Revoke sessions for this device
    await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revocation_reason: 'device_removed',
      })
      .eq('device_id', id)
      .eq('is_active', true);

    // Log device removal
    await logSecurityEvent(supabase, {
      userId: user.id,
      eventType: 'device_removed',
      ipAddress,
      deviceId: id,
      metadata: {},
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Device removed successfully',
    });
  } catch (error) {
    console.error('Remove device error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { trust, trustDays = 30 } = body;

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Update device trust
    const trustExpiresAt = trust ? getTrustExpirationDate(trustDays) : null;

    const { error } = await supabase
      .from('user_devices')
      .update({
        is_trusted: trust,
        trust_expires_at: trustExpiresAt?.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Log device trust change
    await logSecurityEvent(supabase, {
      userId: user.id,
      eventType: 'device_trusted',
      ipAddress,
      deviceId: id,
      metadata: { trusted: trust },
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: trust ? 'Device trusted successfully' : 'Device trust removed',
    });
  } catch (error) {
    console.error('Update device error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper to log security events
async function logSecurityEvent(supabase: any, event: any) {
  try {
    const securityEvent = createSecurityEvent(
      event.userId,
      event.eventType,
      {
        ipAddress: event.ipAddress,
        deviceId: event.deviceId,
        metadata: event.metadata,
        success: event.success,
      }
    );

    await supabase.from('security_events').insert({
      user_id: securityEvent.userId,
      event_type: securityEvent.eventType,
      event_category: securityEvent.eventCategory,
      severity: securityEvent.severity,
      ip_address: securityEvent.ipAddress,
      device_id: securityEvent.deviceId,
      metadata: securityEvent.metadata,
      success: securityEvent.success,
    });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

