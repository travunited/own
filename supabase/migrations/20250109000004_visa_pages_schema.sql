-- ============================================
-- VISA DETAILS PAGE CONTENT MANAGEMENT
-- Admin-modifiable visa detail pages
-- ============================================

-- ============================================
-- VISA PAGE CONTENT (Main content table)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
  
  -- Hero Section
  hero_image_url TEXT,
  hero_title VARCHAR(255),
  hero_subtitle TEXT,
  guarantee_badge_text VARCHAR(100),
  guarantee_badge_days INTEGER,
  primary_cta_text VARCHAR(100) DEFAULT 'Check Required Documents',
  hero_overlay_color VARCHAR(50) DEFAULT 'rgba(0,0,0,0.3)',
  
  -- Authorization Banner
  auth_banner_text TEXT,
  auth_banner_icon VARCHAR(50) DEFAULT 'shield',
  auth_banner_color VARCHAR(50) DEFAULT '#6366f1',
  auth_banner_show BOOLEAN DEFAULT true,
  
  -- Trust Indicators
  trust_rating DECIMAL(2,1) DEFAULT 4.8,
  trust_customers_count VARCHAR(50),
  trust_testimonial_text TEXT,
  trust_categories JSONB, -- [{ name, icon, label }]
  
  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  og_image_url TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(visa_type_id)
);

CREATE INDEX idx_visa_page_content_visa_type ON visa_page_content(visa_type_id);
CREATE INDEX idx_visa_page_content_active ON visa_page_content(is_active);

-- ============================================
-- VISA INFO FIELDS (Information grid)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_info_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_page_id UUID REFERENCES visa_page_content(id) ON DELETE CASCADE,
  
  field_name VARCHAR(100) NOT NULL,
  field_value TEXT NOT NULL,
  field_icon VARCHAR(50),
  field_color VARCHAR(50) DEFAULT '#6366f1',
  field_description TEXT,
  display_order INTEGER DEFAULT 0,
  
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_info_fields_page ON visa_info_fields(visa_page_id);
CREATE INDEX idx_visa_info_fields_order ON visa_info_fields(display_order);

-- ============================================
-- VISA PROCESSING OPTIONS (Timeline options)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_processing_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
  
  option_name VARCHAR(100) NOT NULL,
  processing_days INTEGER NOT NULL,
  additional_fee DECIMAL(10,2) DEFAULT 0,
  
  delivery_guarantee_text TEXT,
  timeline_visible BOOLEAN DEFAULT true,
  
  is_default BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_processing_options_type ON visa_processing_options(visa_type_id);

-- ============================================
-- VISA PARTNERS (Partner logos & info)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_page_id UUID REFERENCES visa_page_content(id) ON DELETE CASCADE,
  
  partner_name VARCHAR(255) NOT NULL,
  partner_logo_url TEXT,
  partner_description TEXT,
  partner_website_url TEXT,
  display_order INTEGER DEFAULT 0,
  
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_partners_page ON visa_partners(visa_page_id);

-- ============================================
-- VISA PROCESS STEPS (How it works)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_page_id UUID REFERENCES visa_page_content(id) ON DELETE CASCADE,
  
  step_number INTEGER NOT NULL,
  step_title VARCHAR(255) NOT NULL,
  step_description TEXT,
  step_icon VARCHAR(50),
  step_color VARCHAR(50) DEFAULT '#6366f1',
  
  -- Timeline events (sub-steps)
  timeline_events JSONB, -- [{ title, description, timestamp, status }]
  
  -- Conditional outcomes
  outcomes JSONB, -- [{ condition, action, buttonText, buttonColor }]
  
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_process_steps_page ON visa_process_steps(visa_page_id);
CREATE INDEX idx_visa_process_steps_order ON visa_process_steps(display_order);

-- ============================================
-- VISA FAQs (Frequently Asked Questions)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
  
  category VARCHAR(100) NOT NULL,
  category_icon VARCHAR(50),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  -- Analytics
  views_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_faqs_type ON visa_faqs(visa_type_id);
CREATE INDEX idx_visa_faqs_category ON visa_faqs(category);

-- ============================================
-- VISA REVIEWS (User reviews)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  application_id UUID REFERENCES visa_applications(id) ON DELETE SET NULL,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT NOT NULL,
  
  -- Traveler Info
  traveler_name VARCHAR(255),
  traveler_initial VARCHAR(10),
  traveler_location VARCHAR(255),
  travel_type VARCHAR(50), -- solo, couple, family, group
  traveler_tag VARCHAR(50), -- first-time, occasional, frequent
  
  -- Admin Moderation
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  admin_response TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMP,
  
  -- Analytics
  helpful_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_reviews_type ON visa_reviews(visa_type_id);
CREATE INDEX idx_visa_reviews_approved ON visa_reviews(is_approved);
CREATE INDEX idx_visa_reviews_featured ON visa_reviews(is_featured);
CREATE INDEX idx_visa_reviews_rating ON visa_reviews(rating);

-- ============================================
-- VISA REVIEW KEYWORDS (Common keywords)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_review_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
  
  keyword VARCHAR(100) NOT NULL,
  keyword_icon VARCHAR(50),
  mention_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  
  is_visible BOOLEAN DEFAULT true,
  
  UNIQUE(visa_type_id, keyword)
);

-- ============================================
-- VISA REJECTION REASONS (Why visa might be rejected)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_rejection_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_page_id UUID REFERENCES visa_page_content(id) ON DELETE CASCADE,
  
  reason_title VARCHAR(255) NOT NULL,
  reason_description TEXT,
  reason_icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  
  is_visible BOOLEAN DEFAULT true
);

-- ============================================
-- VISA PROTECTION PLANS (Insurance/guarantee)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_protection_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
  
  plan_name VARCHAR(100) NOT NULL,
  plan_description TEXT,
  plan_price DECIMAL(10,2) DEFAULT 0,
  
  -- Benefits
  delayed_benefit TEXT,
  rejected_benefit TEXT,
  other_benefits JSONB, -- [{ title, description }]
  
  -- Display
  plan_icon VARCHAR(50) DEFAULT 'shield',
  plan_color VARCHAR(50) DEFAULT '#6366f1',
  
  is_free BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_protection_plans_type ON visa_protection_plans(visa_type_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE TRIGGER update_visa_page_content_updated_at BEFORE UPDATE ON visa_page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_faqs_updated_at BEFORE UPDATE ON visa_faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_reviews_updated_at BEFORE UPDATE ON visa_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Public can read published content
ALTER TABLE visa_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_info_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_processing_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_protection_plans ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view active visa pages"
  ON visa_page_content FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view visible fields"
  ON visa_info_fields FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Public can view approved reviews"
  ON visa_reviews FOR SELECT
  USING (is_approved = true);

-- Admin full access (users with admin role)
CREATE POLICY "Admins can manage visa pages"
  ON visa_page_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND preferences->>'role' = 'admin'
    )
  );

-- ============================================
-- COMPLETED
-- ============================================

SELECT 'Visa pages schema created successfully!' as status;

