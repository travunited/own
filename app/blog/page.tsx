import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowRight, Search, FileText } from 'lucide-react';

export default function BlogPage() {
  const categories = ['All', 'Visa Guides', 'Travel Tips', 'Destinations', 'News'];

  const blogPosts = [
    {
      id: 1,
      slug: 'dubai-visa-guide-for-indians-2024',
      title: 'Complete Dubai Visa Guide for Indians 2024',
      excerpt: 'Everything you need to know about applying for a Dubai visa as an Indian citizen, including requirements, processing time, and tips for a successful application.',
      content: '',
      author: 'Priya Sharma',
      category: 'Visa Guides',
      tags: ['Dubai', 'Visa', 'UAE', 'Guide'],
      publishedAt: '2024-11-01',
      readTime: '8 min read',
      views: 2456,
      featured: true,
    },
    {
      id: 2,
      slug: 'top-10-schengen-countries-to-visit',
      title: 'Top 10 Schengen Countries to Visit in 2024',
      excerpt: 'Discover the most beautiful and tourist-friendly Schengen countries for your next European adventure. Complete with visa requirements and travel tips.',
      content: '',
      author: 'Rahul Verma',
      category: 'Destinations',
      tags: ['Schengen', 'Europe', 'Travel'],
      publishedAt: '2024-10-28',
      readTime: '10 min read',
      views: 1892,
      featured: true,
    },
    {
      id: 3,
      slug: 'visa-interview-tips-and-common-questions',
      title: 'Visa Interview Tips and Common Questions',
      excerpt: 'Prepare for your visa interview with confidence. Learn about common questions, best practices, and what visa officers look for.',
      content: '',
      author: 'Amit Singh',
      category: 'Visa Guides',
      tags: ['Interview', 'Visa', 'Tips'],
      publishedAt: '2024-10-25',
      readTime: '6 min read',
      views: 3421,
      featured: false,
    },
    {
      id: 4,
      slug: 'how-to-prepare-documents-for-uk-visa',
      title: 'How to Prepare Documents for UK Visa Application',
      excerpt: 'A comprehensive checklist of documents required for UK visa application with tips on how to organize and present them effectively.',
      content: '',
      author: 'Priya Sharma',
      category: 'Visa Guides',
      tags: ['UK', 'Visa', 'Documents'],
      publishedAt: '2024-10-20',
      readTime: '12 min read',
      views: 1654,
      featured: false,
    },
    {
      id: 5,
      slug: 'best-time-to-visit-maldives',
      title: 'Best Time to Visit Maldives: Weather & Travel Guide',
      excerpt: 'Plan your Maldives vacation perfectly with our guide on the best time to visit, weather patterns, and seasonal highlights.',
      content: '',
      author: 'Neha Kapoor',
      category: 'Travel Tips',
      tags: ['Maldives', 'Travel', 'Weather'],
      publishedAt: '2024-10-15',
      readTime: '7 min read',
      views: 2103,
      featured: true,
    },
    {
      id: 6,
      slug: 'singapore-visa-processing-time-and-fees',
      title: 'Singapore Visa: Processing Time and Fees Explained',
      excerpt: 'Understand Singapore visa processing times, fees structure, and how to get your visa faster with our comprehensive guide.',
      content: '',
      author: 'Rahul Verma',
      category: 'Visa Guides',
      tags: ['Singapore', 'Visa', 'Fees'],
      publishedAt: '2024-10-10',
      readTime: '5 min read',
      views: 1789,
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Blog</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Your complete guide to visas, travel tips, and destination insights
          </p>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    category === 'All'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter((post) => post.featured)
              .map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card hover:shadow-lg transition-shadow group"
                >
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-primary-600" />
                  </div>
                  <div className="space-y-3">
                    <span className="badge bg-primary-100 text-primary-800 text-xs">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <span>{post.readTime}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card hover:shadow-lg transition-shadow group flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-16 h-16 text-primary-600" />
                </div>
                <div className="flex-1 md:ml-6 mt-4 md:mt-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="badge bg-primary-100 text-primary-800 text-xs">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.views} views</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-500">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <span className="text-primary-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-12 space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Get the latest travel tips, visa guides, and exclusive offers delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <button className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-6 py-2 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

