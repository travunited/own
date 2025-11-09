import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = await params;
    
    // Check if user is super admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { subject, body: emailBody } = body;

    // Update template
    const { data: template, error } = await supabase
      .from('email_templates')
      .update({
        subject,
        body: emailBody,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'email_template_updated',
      entity_type: 'email_template',
      entity_id: id,
      metadata: { template_name: template.name },
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error: any) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update email template' },
      { status: 500 }
    );
  }
}

