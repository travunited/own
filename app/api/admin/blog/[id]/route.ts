/**
 * Admin Blog Post Management API
 * Get, update, delete specific blog post
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:user_profiles!author_id(full_name, username, email)
      `)
      .eq('id', id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      seoTitle,
      seoDescription,
      status,
    } = body;

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!['super_admin', 'admin'].includes(profile?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Calculate reading time
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Update post
    const updateData: any = {
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      featured_image: featuredImage,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      reading_time: readingTime,
      updated_at: new Date().toISOString(),
    };

    // Update published_at if status changed to published
    if (status === 'published') {
      const { data: currentPost } = await supabase
        .from('blog_posts')
        .select('status')
        .eq('id', id)
        .single();

      if (currentPost?.status !== 'published') {
        updateData.published_at = new Date().toISOString();
      }
    }

    updateData.status = status;

    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_admin_id: user.id,
      p_action: 'update_blog_post',
      p_resource_type: 'blog_post',
      p_resource_id: id,
      p_details: { title, status },
    });

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!['super_admin', 'admin'].includes(profile?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete post
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      throw error;
    }

    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_admin_id: user.id,
      p_action: 'delete_blog_post',
      p_resource_type: 'blog_post',
      p_resource_id: id,
      p_details: {},
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

