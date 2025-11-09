/**
 * Document Verification API
 * Admin endpoint to verify/reject documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, reason, notes } = body; // action: 'approve' | 'reject' | 'request_reupload'

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    if (profile?.preferences?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get document
    const { data: document, error: docError } = await supabase
      .from('visa_application_documents')
      .select('*, application:visa_applications(application_number, user_id)')
      .eq('id', id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update document based on action
    let updateData: any = {
      verified_by: user.id,
      verified_at: new Date().toISOString(),
    };

    if (action === 'approve') {
      updateData.verification_status = 'verified';
      updateData.rejection_reason = null;
    } else if (action === 'reject') {
      updateData.verification_status = 'rejected';
      updateData.rejection_reason = reason;
    } else if (action === 'request_reupload') {
      updateData.verification_status = 'reupload_required';
      updateData.admin_notes = notes;
    }

    const { error: updateError } = await supabase
      .from('visa_application_documents')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    // Add timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: document.application_id,
      status: action === 'approve' ? 'documents_verified' : 'documents_rejected',
      title: action === 'approve' 
        ? `Document Verified: ${document.document_name}`
        : action === 'reject'
        ? `Document Rejected: ${document.document_name}`
        : `Reupload Requested: ${document.document_name}`,
      description: action === 'reject' ? reason : notes,
      icon: action === 'approve' ? 'check' : 'alert',
      is_system_generated: false,
      visible_to_user: true,
    });

    // TODO: Send notification to user

    return NextResponse.json({
      success: true,
      message: `Document ${action}d successfully`,
    });
  } catch (error) {
    console.error('Document verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

