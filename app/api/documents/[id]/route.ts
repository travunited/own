/**
 * Document Management API
 * Get, delete, replace documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get document
    const { data: document, error } = await supabase
      .from('visa_application_documents')
      .select(`
        *,
        application:visa_applications!inner(user_id, application_number)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Check ownership or admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.preferences?.role === 'admin';
    const isOwner = document.application.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get document to check ownership
    const { data: document } = await supabase
      .from('visa_application_documents')
      .select('*, application:visa_applications!inner(user_id)')
      .eq('id', id)
      .single();

    if (!document || document.application.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete from storage
    const filePath = document.file_url.split('/').slice(-3).join('/');
    await supabase.storage.from('documents').remove([filePath]);

    // Delete from database
    const { error } = await supabase
      .from('visa_application_documents')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Add timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: document.application_id,
      status: 'document_deleted',
      title: `Document Deleted: ${document.document_name}`,
      icon: 'trash',
      is_system_generated: true,
      visible_to_user: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

