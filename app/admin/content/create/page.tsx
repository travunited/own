'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Upload, Image as ImageIcon } from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    featuredImage: null,
  });

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    });
  };

  const handleSave = (status: 'draft' | 'published') => {
    // TODO: Implement save to database
    console.log('Saving post:', { ...formData, status });
    alert(`Post ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
    router.push('/admin/content');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/content"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Content
        </Link>
        <div className="flex items-center space-x-3">
          <button className="btn-outline flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </button>
          <button onClick={() => handleSave('draft')} className="btn-secondary flex items-center">
            Save Draft
          </button>
          <button onClick={() => handleSave('published')} className="btn-primary flex items-center">
            <Save className="w-5 h-5 mr-2" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className="input-field text-lg"
                required
              />
            </div>

            {/* Slug */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-url-slug"
                  className="input-field flex-1"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the post (shown in listing)..."
                rows={3}
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length}/200 characters
              </p>
            </div>

            {/* Content Editor */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="border border-gray-300 rounded-lg">
                {/* Toolbar */}
                <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">
                    <strong>B</strong>
                  </button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">
                    <em>I</em>
                  </button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">
                    H1
                  </button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">
                    H2
                  </button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">
                    List
                  </button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">
                    Link
                  </button>
                  <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">
                    Image
                  </button>
                </div>
                {/* Editor Area */}
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post content here... (Supports HTML)"
                  rows={20}
                  className="w-full px-4 py-3 outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rich text editor with HTML support
              </p>
            </div>
          </div>

          {/* SEO Section */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">SEO Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO optimized title..."
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 characters (optimal: 50-60)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDescription: e.target.value })
                  }
                  placeholder="SEO optimized description..."
                  rows={3}
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 characters (optimal: 150-160)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Featured Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Organization</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="visa-guides">Visa Guides</option>
                  <option value="travel-tips">Travel Tips</option>
                  <option value="destinations">Destinations</option>
                  <option value="news">News</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="visa, dubai, travel (comma separated)"
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Publish Settings</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-sm">Featured post</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-sm">Allow comments</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-sm">Send email notification</span>
              </label>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Post (Optional)
              </label>
              <input
                type="datetime-local"
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

