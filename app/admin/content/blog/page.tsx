'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  BarChart,
} from 'lucide-react';

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // TODO: Create /api/admin/blog endpoint
      setLoading(false);
    } catch (error) {
      console.error('Error loading posts:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600 mt-2">
                Create and manage blog posts
              </p>
            </div>
            <Link
              href="/admin/content/blog/create"
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <BarChart className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Eye className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Edit className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <BarChart className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">All Posts</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 inline mr-1" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="p-12 text-center">
            <Edit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No blog posts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first blog post to get started
            </p>
            <Link href="/admin/content/blog/create" className="btn-primary">
              <Plus className="w-5 h-5 mr-2 inline" />
              Create First Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

