import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id: applicationId } = await params;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('document_type') as string;
    const travelerId = formData.get('traveler_id') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: PDF, JPG, PNG' }, { status: 400 });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `applications/${applicationId}/${documentType}/${travelerId || 'main'}-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Save document metadata to database
    const { data: document, error: dbError } = await supabase
      .from('visa_application_documents')
      .insert({
        application_id: applicationId,
        traveler_id: travelerId || null,
        document_type: documentType,
        file_name: file.name,
        file_path: fileName,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        upload_status: 'uploaded',
        verification_status: 'pending',
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Update application timeline
    await supabase.from('visa_application_timeline').insert({
      application_id: applicationId,
      status: 'document_uploaded',
      title: 'Document Uploaded',
      description: `${documentType.replace('_', ' ')} uploaded successfully`,
    });

    return NextResponse.json({
      success: true,
      document,
      file_url: urlData.publicUrl,
      file_name: file.name,
    });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}

