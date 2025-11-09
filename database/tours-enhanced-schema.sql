-- ============================================
-- ENHANCED TOUR SYSTEM DATABASE SCHEMA
-- Complete tour discovery, filtering, and booking
-- ============================================

-- ============================================
-- TOUR CATEGORIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tour_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TOUR THEMES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tour_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TOUR REGIONS TABLE (for domestic tours)
-- ============================================

CREATE TABLE IF NOT EXISTS tour_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'India',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- TOUR COUNTRIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tour_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country_code TEXT UNIQUE,
  flag_emoji TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  tour_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- ENHANCED TOUR PACKAGES TABLE
-- ============================================

-- Add missing columns to tour_packages
ALTER TABLE tour_packages
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES tour_categories(id),
ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES tour_regions(id),
ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES tour_countries(id),
ADD COLUMN IF NOT EXISTS tour_type TEXT DEFAULT 'international',
ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'moderate',
ADD COLUMN IF NOT EXISTS min_group_size INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS max_group_size INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS available_seats INTEGER,
ADD COLUMN IF NOT EXISTS original_price INTEGER,
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS inclusions TEXT[],
ADD COLUMN IF NOT EXISTS exclusions TEXT[],
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];

-- Add constraints
ALTER TABLE tour_packages
DROP CONSTRAINT IF EXISTS valid_tour_type;

ALTER TABLE tour_packages
ADD CONSTRAINT valid_tour_type CHECK (tour_type IN ('domestic', 'international'));

ALTER TABLE tour_packages
DROP CONSTRAINT IF EXISTS valid_difficulty;

ALTER TABLE tour_packages
ADD CONSTRAINT valid_difficulty CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'difficult'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tour_packages_slug ON tour_packages(slug);
CREATE INDEX IF NOT EXISTS idx_tour_packages_type ON tour_packages(tour_type);
CREATE INDEX IF NOT EXISTS idx_tour_packages_category ON tour_packages(category_id);
CREATE INDEX IF NOT EXISTS idx_tour_packages_region ON tour_packages(region_id);
CREATE INDEX IF NOT EXISTS idx_tour_packages_country ON tour_packages(country_id);
CREATE INDEX IF NOT EXISTS idx_tour_packages_featured ON tour_packages(is_featured);
CREATE INDEX IF NOT EXISTS idx_tour_packages_price ON tour_packages(price);
CREATE INDEX IF NOT EXISTS idx_tour_packages_rating ON tour_packages(rating DESC);

-- ============================================
-- TOUR PACKAGE THEMES (Many-to-Many)
-- ============================================

CREATE TABLE IF NOT EXISTS tour_package_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_package_id UUID REFERENCES tour_packages(id) ON DELETE CASCADE NOT NULL,
  theme_id UUID REFERENCES tour_themes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(tour_package_id, theme_id)
);

CREATE INDEX IF NOT EXISTS idx_tour_themes_package ON tour_package_themes(tour_package_id);
CREATE INDEX IF NOT EXISTS idx_tour_themes_theme ON tour_package_themes(theme_id);

-- ============================================
-- TOUR PACKAGE CUSTOMIZATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tour_package_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_package_id UUID REFERENCES tour_packages(id) ON DELETE CASCADE NOT NULL,
  
  -- Customization details
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  price INTEGER NOT NULL,
  
  -- Options
  is_optional BOOLEAN DEFAULT TRUE,
  is_per_person BOOLEAN DEFAULT FALSE,
  max_quantity INTEGER,
  
  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_customization_type CHECK (type IN ('upgrade', 'addon', 'activity', 'meal', 'transport', 'accommodation'))
);

CREATE INDEX IF NOT EXISTS idx_customizations_package ON tour_package_customizations(tour_package_id);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert Tour Themes
INSERT INTO tour_themes (name, slug, icon, color_code) VALUES
('Adventure', 'adventure', '🏔️', '#f59e0b'),
('Cultural', 'cultural', '🏛️', '#8b5cf6'),
('Beach', 'beach', '🏖️', '#06b6d4'),
('Wildlife', 'wildlife', '🦁', '#10b981'),
('Luxury', 'luxury', '💎', '#ec4899'),
('Family', 'family', '👨‍👩‍👧‍👦', '#3b82f6'),
('Honeymoon', 'honeymoon', '💑', '#ef4444'),
('Weekend', 'weekend', '🎒', '#6366f1'),
('Pilgrimage', 'pilgrimage', '🕉️', '#f97316'),
('Food & Wine', 'food-wine', '🍷', '#a855f7')
ON CONFLICT (slug) DO NOTHING;

-- Insert Tour Categories
INSERT INTO tour_categories (name, slug, description, display_order) VALUES
('Domestic Tours', 'domestic', 'Explore incredible India', 1),
('International Tours', 'international', 'Discover the world', 2),
('Weekend Getaways', 'weekend', 'Short 2-3 day trips', 3),
('Group Tours', 'group', 'Travel with like-minded people', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert Tour Regions (Indian states)
INSERT INTO tour_regions (name, slug, state, country) VALUES
('Odisha', 'odisha', 'Odisha', 'India'),
('Kerala', 'kerala', 'Kerala', 'India'),
('Goa', 'goa', 'Goa', 'India'),
('Rajasthan', 'rajasthan', 'Rajasthan', 'India'),
('Kashmir', 'kashmir', 'Jammu & Kashmir', 'India'),
('Himachal Pradesh', 'himachal', 'Himachal Pradesh', 'India'),
('Uttarakhand', 'uttarakhand', 'Uttarakhand', 'India'),
('Tamil Nadu', 'tamil-nadu', 'Tamil Nadu', 'India'),
('Karnataka', 'karnataka', 'Karnataka', 'India'),
('Maharashtra', 'maharashtra', 'Maharashtra', 'India')
ON CONFLICT (slug) DO NOTHING;

-- Insert Tour Countries
INSERT INTO tour_countries (name, slug, country_code, flag_emoji, is_popular) VALUES
('Thailand', 'thailand', 'TH', '🇹🇭', TRUE),
('Singapore', 'singapore', 'SG', '🇸🇬', TRUE),
('Dubai (UAE)', 'dubai', 'AE', '🇦🇪', TRUE),
('Malaysia', 'malaysia', 'MY', '🇲🇾', TRUE),
('Maldives', 'maldives', 'MV', '🇲🇻', TRUE),
('Bali (Indonesia)', 'bali', 'ID', '🇮🇩', TRUE),
('Sri Lanka', 'sri-lanka', 'LK', '🇱🇰', TRUE),
('Vietnam', 'vietnam', 'VN', '🇻🇳', FALSE),
('Switzerland', 'switzerland', 'CH', '🇨🇭', FALSE),
('France', 'france', 'FR', '🇫🇷', FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update tour rating when review is added
CREATE OR REPLACE FUNCTION update_tour_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tour_packages
  SET 
    rating = (SELECT AVG(rating) FROM tour_reviews WHERE tour_id = NEW.tour_id AND status = 'approved'),
    review_count = (SELECT COUNT(*) FROM tour_reviews WHERE tour_id = NEW.tour_id AND status = 'approved')
  WHERE id = NEW.tour_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tour_rating
AFTER INSERT OR UPDATE ON tour_reviews
FOR EACH ROW
EXECUTE FUNCTION update_tour_rating();

-- Update booking count
CREATE OR REPLACE FUNCTION update_tour_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tour_packages
  SET booking_count = (SELECT COUNT(*) FROM tour_bookings WHERE tour_id = NEW.tour_id AND status != 'cancelled')
  WHERE id = NEW.tour_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tour_booking_count
AFTER INSERT OR UPDATE ON tour_bookings
FOR EACH ROW
EXECUTE FUNCTION update_tour_booking_count();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Enhanced tour system schema created!';
  RAISE NOTICE '📊 Tables: tour_categories, tour_themes, tour_regions, tour_countries';
  RAISE NOTICE '🔧 Tour packages enhanced with 30+ new columns';
  RAISE NOTICE '🔗 Relationships: themes, customizations ready';
  RAISE NOTICE '⚡ Triggers: rating update, booking count update';
END $$;

