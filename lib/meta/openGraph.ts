/**
 * Open Graph Meta Tags Generator
 * For social media sharing optimization
 */

export interface OGData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  section?: string;
  tags?: string[];
}

/**
 * Generate Open Graph meta tags for social sharing
 */
export function generateOGTags(data: OGData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travunited.com';
  const fullUrl = data.url.startsWith('http') ? data.url : `${baseUrl}${data.url}`;
  const fullImageUrl = data.image.startsWith('http')
    ? data.image
    : `${baseUrl}${data.image}`;

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: fullUrl,
      siteName: 'Travunited',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      locale: 'en_US',
      type: data.type || 'website',
      ...(data.type === 'article' && {
        article: {
          publishedTime: data.publishedTime,
          author: data.author,
          section: data.section,
          tags: data.tags,
        },
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Travunited',
      creator: '@Travunited',
      title: data.title,
      description: data.description,
      images: [fullImageUrl],
    },
  };
}

/**
 * Generate meta tags for visa pages
 */
export function generateVisaOGTags(visa: {
  country: string;
  type: string;
  price: number;
  processingTime: string;
}) {
  return generateOGTags({
    title: `${visa.country} ${visa.type} - Apply Online | Travunited`,
    description: `Get your ${visa.country} ${visa.type} in ${visa.processingTime}. Starting at ₹${visa.price}. Fast, easy, and hassle-free visa processing.`,
    image: `/og/visa-${visa.country.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    url: `/visas/${visa.country.toLowerCase().replace(/\s+/g, '-')}`,
    type: 'product',
  });
}

/**
 * Generate meta tags for tour pages
 */
export function generateTourOGTags(tour: {
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  description: string;
}) {
  return generateOGTags({
    title: `${tour.title} | Travunited Tours`,
    description: `${tour.duration} tour to ${tour.destination}. ${tour.description.substring(0, 120)}... Starting at ₹${tour.price}`,
    image: tour.image || '/og/tour-default.jpg',
    url: `/tours/${tour.title.toLowerCase().replace(/\s+/g, '-')}`,
    type: 'product',
  });
}

/**
 * Generate meta tags for blog posts
 */
export function generateBlogOGTags(post: {
  title: string;
  excerpt: string;
  featuredImage?: string;
  author?: string;
  publishedAt?: string;
  category?: string;
  tags?: string[];
  slug: string;
}) {
  return generateOGTags({
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage || '/og/blog-default.jpg',
    url: `/blog/${post.slug}`,
    type: 'article',
    author: post.author,
    publishedTime: post.publishedAt,
    section: post.category,
    tags: post.tags,
  });
}

/**
 * Generate meta tags for success pages
 */
export function generateSuccessOGTags(content: {
  title: string;
  description: string;
  contentType: 'visa' | 'tour' | 'general';
}) {
  return generateOGTags({
    title: content.title,
    description: content.description,
    image: `/og/${content.contentType}-success.jpg`,
    url: '/success',
    type: 'website',
  });
}

/**
 * Default meta tags for homepage
 */
export function getDefaultOGTags() {
  return generateOGTags({
    title: 'Travunited - Visa & Tour Booking Made Easy',
    description:
      'Get your visa approved in days, not weeks. Book amazing tour packages with visa assistance. 5M+ visas processed. 4.9★ rated. Your trusted travel partner.',
    image: '/og/homepage.jpg',
    url: '/',
    type: 'website',
  });
}

