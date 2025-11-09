-- Sample Data for Travunited Platform
-- Run this after creating the main schema

-- ============================================
-- SAMPLE VISA COUNTRIES
-- ============================================

INSERT INTO visa_countries (name, code, flag_url, description, is_active) VALUES
('United Arab Emirates', 'AE', '🇦🇪', 'Dubai visa for Indian citizens - Fast processing', true),
('Singapore', 'SG', '🇸🇬', 'Singapore visa for tourists and business travelers', true),
('United Kingdom', 'GB', '🇬🇧', 'UK visa services with expert guidance', true),
('Schengen', 'EU', '🇪🇺', 'Schengen visa for 27 European countries', true),
('Thailand', 'TH', '🇹🇭', 'Thailand tourist visa - E-visa available', true),
('Malaysia', 'MY', '🇲🇾', 'Malaysia visa services - Quick approval', true),
('United States', 'US', '🇺🇸', 'USA visa services - Tourist and Business', true),
('Australia', 'AU', '🇦🇺', 'Australia visa - ETA available', true),
('Canada', 'CA', '🇨🇦', 'Canada visa - eTA and tourist visa', true);

-- ============================================
-- SAMPLE VISA TYPES
-- ============================================

-- Dubai Visa Types
INSERT INTO visa_types (
  country_id, name, slug, category, government_fee, service_fee,
  processing_days, validity_days, stay_duration_days,
  is_e_visa, is_express_available, requires_interview,
  description, overview, eligibility_rules, important_notes, is_active
)
SELECT 
  id,
  'Tourist Visa - 30 Days',
  'tourist-30',
  'TOURIST',
  3500.00,
  1999.00,
  3,
  60,
  30,
  true,
  true,
  false,
  'Dubai tourist visa valid for 30 days stay. E-visa delivered via email.',
  'Perfect for leisure travelers visiting Dubai for tourism, sightseeing, and shopping.',
  'Valid passport (6+ months), confirmed hotel booking, flight tickets, sufficient funds',
  'Visa approval subject to UAE immigration. Processing time may vary during peak season.',
  true
FROM visa_countries WHERE code = 'AE';

INSERT INTO visa_types (
  country_id, name, slug, category, government_fee, service_fee,
  processing_days, validity_days, stay_duration_days,
  is_e_visa, is_express_available, requires_interview,
  description, is_active
)
SELECT 
  id,
  'Tourist Visa - 90 Days',
  'tourist-90',
  'TOURIST',
  6000.00,
  2999.00,
  4,
  60,
  90,
  true,
  true,
  false,
  'Dubai long-stay tourist visa for 90 days',
  true
FROM visa_countries WHERE code = 'AE';

-- Singapore Visa
INSERT INTO visa_types (
  country_id, name, slug, category, government_fee, service_fee,
  processing_days, validity_days, stay_duration_days,
  is_e_visa, is_express_available, requires_interview,
  description, is_active
)
SELECT 
  id,
  'Tourist Visa',
  'tourist',
  'TOURIST',
  2500.00,
  1499.00,
  4,
  90,
  30,
  true,
  true,
  false,
  'Singapore tourist visa for Indian citizens',
  true
FROM visa_countries WHERE code = 'SG';

-- UK Visa
INSERT INTO visa_types (
  country_id, name, slug, category, government_fee, service_fee,
  processing_days, validity_days, stay_duration_days,
  is_e_visa, is_express_available, requires_interview,
  description, is_active
)
SELECT 
  id,
  'Standard Visitor Visa',
  'standard-visitor',
  'TOURIST',
  10000.00,
  2999.00,
  15,
  180,
  180,
  false,
  false,
  true,
  'UK standard visitor visa for tourism and business',
  true
FROM visa_countries WHERE code = 'GB';

-- ============================================
-- SAMPLE REQUIRED DOCUMENTS
-- ============================================

-- Dubai Tourist 30 Days Documents
INSERT INTO visa_required_documents (visa_type_id, document_name, document_type, is_mandatory, description, "order")
SELECT 
  vt.id,
  'Passport Copy',
  'passport',
  true,
  'First and last page of passport. Must be valid for at least 6 months.',
  1
FROM visa_types vt
JOIN visa_countries vc ON vt.country_id = vc.id
WHERE vc.code = 'AE' AND vt.slug = 'tourist-30';

INSERT INTO visa_required_documents (visa_type_id, document_name, document_type, is_mandatory, description, "order")
SELECT 
  vt.id,
  'Passport Size Photograph',
  'photo',
  true,
  'Recent photo with white background (35x45mm)',
  2
FROM visa_types vt
JOIN visa_countries vc ON vt.country_id = vc.id
WHERE vc.code = 'AE' AND vt.slug = 'tourist-30';

INSERT INTO visa_required_documents (visa_type_id, document_name, document_type, is_mandatory, description, "order")
SELECT 
  vt.id,
  'Flight Tickets',
  'flight',
  true,
  'Confirmed or tentative flight booking',
  3
FROM visa_types vt
JOIN visa_countries vc ON vt.country_id = vc.id
WHERE vc.code = 'AE' AND vt.slug = 'tourist-30';

INSERT INTO visa_required_documents (visa_type_id, document_name, document_type, is_mandatory, description, "order")
SELECT 
  vt.id,
  'Hotel Booking',
  'hotel',
  true,
  'Confirmed hotel reservation for stay duration',
  4
FROM visa_types vt
JOIN visa_countries vc ON vt.country_id = vc.id
WHERE vc.code = 'AE' AND vt.slug = 'tourist-30';

-- ============================================
-- SAMPLE TOURS
-- ============================================

INSERT INTO tours (
  title, slug, description, destination,
  duration_days, duration_nights, starting_price,
  category, theme, is_visa_included, is_featured, is_active,
  rating, total_reviews,
  inclusions, exclusions
) VALUES (
  'Magical Dubai Experience',
  'magical-dubai-experience',
  'Experience the luxury and culture of Dubai with our specially curated 5-day package',
  'Dubai, UAE',
  5, 4, 24999.00,
  'INTERNATIONAL', 'FAMILY',
  true, true, true,
  4.8, 245,
  ARRAY['4-star hotel accommodation', 'Daily breakfast', 'Airport transfers', 'Dubai city tour', 'Desert safari', 'Burj Khalifa tickets'],
  ARRAY['International flights', 'Lunch and dinner', 'Personal expenses', 'Travel insurance']
);

INSERT INTO tours (
  title, slug, description, destination,
  duration_days, duration_nights, starting_price,
  category, theme, is_visa_included, is_featured, is_active,
  rating, total_reviews,
  inclusions, exclusions
) VALUES (
  'Romantic Maldives Getaway',
  'romantic-maldives-getaway',
  'Escape to paradise with our exclusive Maldives honeymoon package',
  'Maldives',
  6, 5, 45999.00,
  'INTERNATIONAL', 'HONEYMOON',
  true, true, true,
  4.9, 189,
  ARRAY['Private beach villa', 'All meals included', 'Water sports', 'Spa treatment', 'Candlelight dinner'],
  ARRAY['International flights', 'Travel insurance', 'Personal expenses']
);

INSERT INTO tours (
  title, slug, description, destination,
  duration_days, duration_nights, starting_price,
  category, theme, is_visa_included, is_featured, is_active,
  rating, total_reviews,
  inclusions, exclusions
) VALUES (
  'Swiss Splendor',
  'swiss-splendor',
  'Discover the breathtaking beauty of Switzerland with our premium tour',
  'Switzerland',
  7, 6, 89999.00,
  'INTERNATIONAL', 'LUXURY',
  true, true, true,
  4.7, 321,
  ARRAY['4-star hotels', 'Daily breakfast', 'Jungfraujoch excursion', 'Interlaken visit', 'Lucerne tour'],
  ARRAY['International flights', 'Lunch and dinner', 'Travel insurance']
);

INSERT INTO tours (
  title, slug, description, destination,
  duration_days, duration_nights, starting_price,
  category, theme, is_visa_included, is_featured, is_active,
  rating, total_reviews,
  inclusions, exclusions
) VALUES (
  'Incredible Kashmir',
  'incredible-kashmir',
  'Experience the heaven on earth with our Kashmir valley tour',
  'Kashmir, India',
  6, 5, 18999.00,
  'DOMESTIC', 'FAMILY',
  false, true, true,
  4.8, 567,
  ARRAY['Hotel accommodation', 'Daily breakfast', 'Shikara ride', 'Gulmarg gondola', 'All transfers'],
  ARRAY['Lunch and dinner', 'Personal expenses', 'Adventure activities']
);

INSERT INTO tours (
  title, slug, description, destination,
  duration_days, duration_nights, starting_price,
  category, theme, is_visa_included, is_featured, is_active,
  rating, total_reviews,
  inclusions, exclusions
) VALUES (
  'Goa Beach Paradise',
  'goa-beach-paradise',
  'Relax and unwind at the beautiful beaches of Goa',
  'Goa, India',
  4, 3, 12999.00,
  'DOMESTIC', 'WEEKEND',
  false, false, true,
  4.5, 734,
  ARRAY['Beach resort stay', 'Daily breakfast', 'Water sports', 'North Goa tour'],
  ARRAY['Flights', 'Lunch and dinner', 'Personal expenses']
);

-- ============================================
-- SAMPLE TOUR DEPARTURES
-- ============================================

-- Magical Dubai departures
INSERT INTO tour_departures (tour_id, departure_date, return_date, available_seats, total_seats, price_per_person, is_available)
SELECT 
  id,
  '2024-11-15',
  '2024-11-19',
  8,
  20,
  24999.00,
  true
FROM tours WHERE slug = 'magical-dubai-experience';

INSERT INTO tour_departures (tour_id, departure_date, return_date, available_seats, total_seats, price_per_person, is_available)
SELECT 
  id,
  '2024-11-28',
  '2024-12-02',
  15,
  20,
  24999.00,
  true
FROM tours WHERE slug = 'magical-dubai-experience';

-- Maldives departures
INSERT INTO tour_departures (tour_id, departure_date, return_date, available_seats, total_seats, price_per_person, is_available)
SELECT 
  id,
  '2024-11-20',
  '2024-11-25',
  4,
  15,
  45999.00,
  true
FROM tours WHERE slug = 'romantic-maldives-getaway';

-- ============================================
-- SAMPLE CONTENT BLOCKS
-- ============================================

INSERT INTO content_blocks (key, title, content, type, is_active) VALUES
('homepage_hero', 'Homepage Hero', 
 '{"heading": "Your Journey Starts Here", "subheading": "Hassle-free visa applications and curated tour packages"}',
 'BANNER', true);

INSERT INTO content_blocks (key, title, content, type, is_active) VALUES
('trust_stats', 'Trust Statistics',
 '{"customers": "50,000+", "visas": "75,000+", "countries": "100+", "rating": "4.8/5"}',
 'SECTION', true);

-- ============================================
-- SAMPLE BLOG POSTS
-- ============================================

INSERT INTO blog_posts (
  title, slug, excerpt, content, category, tags,
  is_published, published_at
) VALUES (
  'Complete Dubai Visa Guide for Indians 2024',
  'dubai-visa-guide-for-indians-2024',
  'Everything you need to know about applying for a Dubai visa as an Indian citizen, including requirements, processing time, and tips.',
  '<h2>Why Visit Dubai?</h2><p>Dubai, the jewel of the UAE, offers world-class shopping, stunning architecture, and cultural experiences.</p>',
  'Visa Guides',
  ARRAY['Dubai', 'Visa', 'UAE', 'Guide'],
  true,
  NOW()
);

INSERT INTO blog_posts (
  title, slug, excerpt, content, category, tags,
  is_published, published_at
) VALUES (
  'Top 10 Schengen Countries to Visit in 2024',
  'top-10-schengen-countries-to-visit',
  'Discover the most beautiful and tourist-friendly Schengen countries for your next European adventure.',
  '<h2>Explore Europe</h2><p>The Schengen area covers 27 countries, offering diverse experiences from Alpine adventures to Mediterranean beaches.</p>',
  'Destinations',
  ARRAY['Schengen', 'Europe', 'Travel'],
  true,
  NOW()
);

-- ============================================
-- COMPLETED
-- ============================================

SELECT 'Sample data inserted successfully!' as status;

