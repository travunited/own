import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ShareButton from '@/components/social/ShareButton';
import { Calendar, User, Clock, Tag, Share2, Facebook, Twitter, Linkedin, ArrowLeft, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  // Mock data - will be fetched from database
  const post = {
    slug: slug,
    title: 'Complete Dubai Visa Guide for Indians 2024',
    excerpt: 'Everything you need to know about applying for a Dubai visa as an Indian citizen',
    author: {
      name: 'Priya Sharma',
      avatar: 'PS',
      bio: 'Travel expert and visa consultant with 8 years of experience',
    },
    category: 'Visa Guides',
    tags: ['Dubai', 'Visa', 'UAE', 'Guide', 'Indian Citizens'],
    publishedAt: '2024-11-01',
    updatedAt: '2024-11-01',
    readTime: '8 min read',
    views: 2456,
    content: `
      <h2>Why Visit Dubai?</h2>
      <p>Dubai, the jewel of the United Arab Emirates, has become one of the most popular tourist destinations for Indians. With its stunning architecture, world-class shopping, pristine beaches, and cultural experiences, Dubai offers something for everyone.</p>

      <h2>Types of Dubai Visas for Indians</h2>
      <h3>1. Tourist Visa (30 Days)</h3>
      <p>The most popular option for leisure travelers. This visa allows you to stay in Dubai for 30 days.</p>
      <ul>
        <li><strong>Validity:</strong> 60 days from date of issue</li>
        <li><strong>Stay Duration:</strong> 30 days</li>
        <li><strong>Processing Time:</strong> 2-3 working days</li>
        <li><strong>Cost:</strong> Starting from ₹5,499</li>
      </ul>

      <h3>2. Tourist Visa (90 Days)</h3>
      <p>For longer stays, the 90-day tourist visa is ideal.</p>
      <ul>
        <li><strong>Validity:</strong> 60 days from date of issue</li>
        <li><strong>Stay Duration:</strong> 90 days</li>
        <li><strong>Processing Time:</strong> 3-4 working days</li>
        <li><strong>Cost:</strong> Starting from ₹8,999</li>
      </ul>

      <h3>3. Transit Visa (96 Hours)</h3>
      <p>If you have a layover in Dubai and want to explore the city, you can apply for a transit visa.</p>
      
      <h2>Required Documents</h2>
      <p>To apply for a Dubai visa, you'll need the following documents:</p>
      <ol>
        <li><strong>Passport:</strong> Valid for at least 6 months from travel date</li>
        <li><strong>Passport-size photograph:</strong> White background, recent (taken within last 6 months)</li>
        <li><strong>Flight tickets:</strong> Confirmed or tentative booking</li>
        <li><strong>Hotel booking:</strong> Confirmed reservation for your stay</li>
        <li><strong>Bank statement:</strong> Last 6 months (optional but recommended)</li>
      </ol>

      <h2>Dubai Visa Application Process</h2>
      <p>Applying for a Dubai visa through Travunited is simple and hassle-free:</p>
      <ol>
        <li>Select your visa type on our website</li>
        <li>Fill in traveller details</li>
        <li>Upload required documents</li>
        <li>Make secure payment</li>
        <li>Track your application status</li>
        <li>Receive your visa via email</li>
      </ol>

      <h2>Important Things to Know</h2>
      <ul>
        <li>Dubai visas are e-visas and delivered via email</li>
        <li>No embassy visit required</li>
        <li>Express processing available for urgent travel</li>
        <li>Multiple entry visas available</li>
        <li>Visa extension possible from within UAE</li>
      </ul>

      <h2>Tips for a Successful Application</h2>
      <ul>
        <li>Ensure your passport has at least 6 months validity</li>
        <li>Use a clear, recent passport-size photo with white background</li>
        <li>Provide confirmed hotel bookings</li>
        <li>Have travel insurance for added security</li>
        <li>Apply at least 7 days before your travel date</li>
      </ul>

      <h2>Why Choose Travunited for Your Dubai Visa?</h2>
      <ul>
        <li><strong>Fast Processing:</strong> Get your visa in 2-3 working days</li>
        <li><strong>99% Success Rate:</strong> Our expert team ensures approval</li>
        <li><strong>24/7 Support:</strong> We're always here to help</li>
        <li><strong>Transparent Pricing:</strong> No hidden charges</li>
        <li><strong>Easy Tracking:</strong> Real-time status updates</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Getting a Dubai visa as an Indian citizen is now easier than ever with Travunited. Our streamlined process, expert support, and fast processing make your visa application stress-free. Start your Dubai journey today!</p>
    `,
  };

  const relatedPosts = [
    {
      slug: 'singapore-visa-guide',
      title: 'Singapore Visa Guide for Indians',
      category: 'Visa Guides',
    },
    {
      slug: 'best-places-to-visit-in-dubai',
      title: '10 Must-Visit Places in Dubai',
      category: 'Destinations',
    },
    {
      slug: 'travel-insurance-guide',
      title: 'Complete Travel Insurance Guide',
      category: 'Travel Tips',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Article Content */}
      <article className="py-12">
        <div className="container-custom max-w-4xl">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <span className="badge bg-primary-100 text-primary-800 mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold text-primary-600">{post.author.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author.name}</p>
                  <p className="text-xs">{post.author.bio}</p>
                </div>
              </div>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </span>
              <span>{post.views.toLocaleString()} views</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Share:</span>
              <ShareButton
                title={post.title}
                description={post.excerpt}
                url={`/blog/${post.slug}`}
                hashtags={post.tags}
                variant="icon"
                size="sm"
              />
            </div>
          </header>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share at Bottom */}
          <div className="mt-12 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Found this helpful?
                </h3>
                <p className="text-sm text-gray-600">
                  Share with friends who might need this information
                </p>
              </div>
              <ShareButton
                title={post.title}
                description={post.excerpt}
                url={`/blog/${post.slug}`}
                hashtags={post.tags}
                variant="primary"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 bg-primary-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Apply for Your Dubai Visa?
            </h3>
            <p className="text-gray-600 mb-6">
              Get your visa in just 2-3 working days with our hassle-free process
            </p>
            <Link href="/visas/dubai" className="btn-primary inline-flex items-center">
              Apply for Dubai Visa
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-32 rounded-lg mb-3"></div>
                <span className="badge bg-gray-100 text-gray-800 text-xs mb-2">
                  {relatedPost.category}
                </span>
                <h3 className="font-bold text-gray-900 hover:text-primary-600">
                  {relatedPost.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

