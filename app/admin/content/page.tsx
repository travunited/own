'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, FileText } from 'lucide-react';

export default function AdminContentPage() {
  const [activeSection, setActiveSection] = useState('blog');

  const blogPosts = [
    {
      id: 1,
      title: 'Complete Dubai Visa Guide for Indians 2024',
      slug: 'dubai-visa-guide-for-indians-2024',
      author: 'Priya Sharma',
      category: 'Visa Guides',
      status: 'Published',
      publishedAt: '2024-11-01',
      views: 2456,
    },
    {
      id: 2,
      title: 'Top 10 Schengen Countries to Visit',
      slug: 'top-10-schengen-countries-to-visit',
      author: 'Rahul Verma',
      category: 'Destinations',
      status: 'Published',
      publishedAt: '2024-10-28',
      views: 1892,
    },
    {
      id: 3,
      title: 'Visa Interview Preparation Guide',
      slug: 'visa-interview-preparation-guide',
      author: 'Amit Singh',
      category: 'Visa Guides',
      status: 'Draft',
      publishedAt: null,
      views: 0,
    },
  ];

  const sections = [
    { id: 'blog', label: 'Blog Posts', count: 25 },
    { id: 'pages', label: 'Pages', count: 8 },
    { id: 'banners', label: 'Banners', count: 5 },
    { id: 'faqs', label: 'FAQs', count: 42 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage website content, blog posts, and pages</p>
        </div>
        <Link href="/admin/content/create" className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create New Post
        </Link>
      </div>

      {/* Section Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
              activeSection === section.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {section.label}
            <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full">
              {section.count}
            </span>
          </button>
        ))}
      </div>

      {activeSection === 'blog' && (
        <>
          {/* Filters */}
          <div className="card">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="input-field pl-10"
                />
              </div>
              <select className="input-field">
                <option>All Categories</option>
                <option>Visa Guides</option>
                <option>Travel Tips</option>
                <option>Destinations</option>
                <option>News</option>
              </select>
              <select className="input-field">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Scheduled</option>
              </select>
            </div>
          </div>

          {/* Blog Posts Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Published
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Views
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">{post.title}</p>
                            <p className="text-xs text-gray-500">/blog/{post.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{post.author}</td>
                      <td className="px-4 py-4">
                        <span className="badge bg-gray-100 text-gray-800 text-xs">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`badge text-xs ${
                            post.status === 'Published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {post.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/content/edit/${post.id}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeSection === 'pages' && (
        <div className="card">
          <p className="text-center text-gray-600 py-12">
            Page management interface coming soon...
          </p>
        </div>
      )}

      {activeSection === 'banners' && (
        <div className="card">
          <p className="text-center text-gray-600 py-12">
            Banner management interface coming soon...
          </p>
        </div>
      )}

      {activeSection === 'faqs' && (
        <div className="card">
          <p className="text-center text-gray-600 py-12">
            FAQ management interface coming soon...
          </p>
        </div>
      )}
    </div>
  );
}

