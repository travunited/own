/**
 * Admin Blog Management API
 * Create, list, and manage blog posts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
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

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

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

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Create blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 160),
        category: category || 'general',
        tags: tags || [],
        featured_image: featuredImage,
        seo_title: seoTitle || title,
        seo_description: seoDescription || excerpt,
        author_id: user.id,
        status: status || 'draft',
        reading_time: readingTime,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_admin_id: user.id,
      p_action: 'create_blog_post',
      p_resource_type: 'blog_post',
      p_resource_id: post.id,
      p_details: { title, status },
    });

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('Create blog post error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:user_profiles!author_id(full_name, username)
      `);

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Search
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data: posts, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get stats
    const { data: allPosts } = await supabase.from('blog_posts').select('status, view_count');

    const stats = {
      total: allPosts?.length || 0,
      published: allPosts?.filter((p) => p.status === 'published').length || 0,
      drafts: allPosts?.filter((p) => p.status === 'draft').length || 0,
      totalViews: allPosts?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0,
    };

    return NextResponse.json({
      success: true,
      posts: posts || [],
      stats,
      total: count,
    });
  } catch (error: any) {
    console.error('Get blog posts error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

