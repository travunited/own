-- ============================================
-- COMPLETE TOUR BOOKING SYSTEM SCHEMA
-- ============================================

-- ============================================
-- TOUR BOOKINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tour_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User & Tour references
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  tour_id UUID REFERENCES tour_packages(id) NOT NULL,
  
  -- Booking details
  booking_number TEXT UNIQUE NOT NULL,
  booking_date DATE DEFAULT CURRENT_DATE NOT NULL,
  travel_date DATE NOT NULL,
  return_date DATE,
  
  -- Travelers
  number_of_travelers INTEGER NOT NULL DEFAULT 1,
  lead_traveler_name TEXT NOT NULL,
  lead_traveler_email TEXT NOT NULL,
  lead_traveler_phone TEXT NOT NULL,
  
  -- Pricing
  base_price INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  amount_paid INTEGER DEFAULT 0,
  
  -- Customizations
  customizations JSONB DEFAULT '{}',
  special_requests TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' NOT NULL,
  payment_status TEXT DEFAULT 'pending' NOT NULL,
  
  -- Payment reference
  payment_id UUID REFERENCES payments(id),
  
  -- Cancellation
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  refund_amount INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_booking_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded', 'partial'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tour_bookings_user ON tour_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_tour ON tour_bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_status ON tour_bookings(status);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_travel_date ON tour_bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_created ON tour_bookings(created_at DESC);

-- ============================================
-- TOUR BOOKING TRAVELERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tour_booking_travelers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Booking reference
  booking_id UUID REFERENCES tour_bookings(id) ON DELETE CASCADE NOT NULL,
  
  -- Traveler details
  title TEXT,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  passport_number TEXT,
  passport_expiry DATE,
  
  -- Contact (for lead traveler)
  email TEXT,
  phone TEXT,
  
  -- Type
  traveler_type TEXT DEFAULT 'adult' NOT NULL,
  is_lead BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_traveler_type CHECK (traveler_type IN ('adult', 'child', 'infant'))
);

CREATE INDEX IF NOT EXISTS idx_tour_travelers_booking ON tour_booking_travelers(booking_id);

-- ============================================
-- TOUR REVIEWS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tour_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  tour_id UUID REFERENCES tour_packages(id) NOT NULL,
  booking_id UUID REFERENCES tour_bookings(id),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Review content
  rating INTEGER NOT NULL,
  title TEXT,
  review_text TEXT NOT NULL,
  
  -- Photos
  photos JSONB DEFAULT '[]',
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_booking BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'pending' NOT NULL,
  
  -- Moderation
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMP,
  rejection_reason TEXT,
  
  -- Helpful count
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT valid_review_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_tour_reviews_tour ON tour_reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_reviews_user ON tour_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_reviews_status ON tour_reviews(status);
CREATE INDEX IF NOT EXISTS idx_tour_reviews_rating ON tour_reviews(rating DESC);

-- ============================================
-- SUPPORT TICKETS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User reference
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Ticket details
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'open' NOT NULL,
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP,
  
  -- Related entities
  application_id UUID REFERENCES visa_applications(id),
  booking_id UUID REFERENCES tour_bookings(id),
  
  -- Resolution
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  
  -- Metadata
  attachments JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_ticket_status CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT valid_category CHECK (category IN ('visa', 'tour', 'payment', 'technical', 'general'))
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON support_tickets(created_at DESC);

-- ============================================
-- SUPPORT TICKET MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ticket reference
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  
  -- Sender
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_type TEXT NOT NULL,
  
  -- Message
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  
  -- Status
  is_internal BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_sender_type CHECK (sender_type IN ('user', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON support_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_created ON support_ticket_messages(created_at);

-- ============================================
-- BLOG POSTS ENHANCED TABLE
-- ============================================

-- Add missing columns to blog_posts if they don't exist
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

-- Create index on category and tags
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year TEXT;
  month TEXT;
  sequence INT;
BEGIN
  year := TO_CHAR(CURRENT_DATE, 'YY');
  month := TO_CHAR(CURRENT_DATE, 'MM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(booking_number FROM 10) AS INTEGER)), 0) + 1
  INTO sequence
  FROM tour_bookings
  WHERE booking_number LIKE 'TRB-' || year || month || '%';
  
  new_number := 'TRB-' || year || month || LPAD(sequence::TEXT, 5, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year TEXT;
  month TEXT;
  sequence INT;
BEGIN
  year := TO_CHAR(CURRENT_DATE, 'YY');
  month := TO_CHAR(CURRENT_DATE, 'MM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 9) AS INTEGER)), 0) + 1
  INTO sequence
  FROM support_tickets
  WHERE ticket_number LIKE 'TKT-' || year || month || '%';
  
  new_number := 'TKT-' || year || month || LPAD(sequence::TEXT, 5, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Update timestamps
CREATE TRIGGER trg_tour_bookings_updated_at
BEFORE UPDATE ON tour_bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_tour_reviews_updated_at
BEFORE UPDATE ON tour_reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_booking_travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- Tour Bookings Policies
CREATE POLICY "Users can view own bookings"
  ON tour_bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON tour_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON tour_bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

-- Tour Reviews Policies
CREATE POLICY "Anyone can view approved reviews"
  ON tour_reviews FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view own reviews"
  ON tour_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews"
  ON tour_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can moderate reviews"
  ON tour_reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

-- Support Tickets Policies
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'sub_admin')
    )
  );

CREATE POLICY "Admins can update tickets"
  ON support_tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'sub_admin')
    )
  );

-- Support Messages Policies
CREATE POLICY "Users can view own ticket messages"
  ON support_ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE id = ticket_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages"
  ON support_ticket_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin', 'sub_admin')
    )
  );

CREATE POLICY "Users and admins can create messages"
  ON support_ticket_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Complete tour & support system schema created!';
  RAISE NOTICE '📊 Tables: tour_bookings, tour_booking_travelers, tour_reviews, support_tickets, support_ticket_messages';
  RAISE NOTICE '🔧 Functions: generate_booking_number, generate_ticket_number';
  RAISE NOTICE '🔒 RLS policies enabled for all tables';
END $$;

