/**
 * Documents Management API Route
 * Upload and manage visa application documents
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
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const travelerId = formData.get('travelerId') as string;
    const documentRequirementId = formData.get('documentRequirementId') as string;
    const documentName = formData.get('documentName') as string;
    const documentType = formData.get('documentType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are allowed' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify application ownership
    const { data: application } = await supabase
      .from('visa_applications')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Upload file to Supabase Storage
    const fileName = `${id}/${travelerId}/${documentType}-${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('visa_application_documents')
      .insert({
        application_id: id,
        traveler_id: travelerId,
        document_requirement_id: documentRequirementId,
        document_name: documentName,
        document_type: documentType,
        file_url: publicUrl,
        file_size: file.size,
        file_mime_type: file.type,
        upload_status: 'uploaded',
        verification_status: 'pending',
      })
      .select()
      .single();

    if (docError) {
      throw docError;
    }

    // Add timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: id,
      status: 'documents_uploaded',
      title: 'Document Uploaded',
      description: `${documentName} uploaded successfully`,
      icon: 'file',
      is_system_generated: true,
      visible_to_user: true,
    });

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('Upload document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get all documents
    const { data: documents, error } = await supabase
      .from('visa_application_documents')
      .select('*')
      .eq('application_id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      documents: documents || [],
    });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

