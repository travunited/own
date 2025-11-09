-- Travunited Database Schema
-- PostgreSQL / Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM (
  'CUSTOMER',
  'SUPER_ADMIN',
  'OPS_HEAD',
  'VISA_OPS',
  'TOUR_OPS',
  'FINANCE',
  'SUPPORT',
  'CONTENT_MANAGER'
);

CREATE TYPE visa_application_status AS ENUM (
  'DRAFT',
  'PAYMENT_PENDING',
  'DOCS_PENDING',
  'UNDER_REVIEW',
  'SUBMITTED_TO_EMBASSY',
  'IN_PROGRESS',
  'APPROVED',
  'REJECTED',
  'DISPATCHED'
);

CREATE TYPE tour_booking_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'VOUCHERS_UPLOADED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED'
);

CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'SUCCESS',
  'FAILED',
  'REFUNDED',
  'PARTIAL_REFUND'
);

CREATE TYPE order_type AS ENUM ('VISA', 'TOUR');

CREATE TYPE document_status AS ENUM (
  'PENDING',
  'UPLOADED',
  'UNDER_REVIEW',
  'APPROVED',
  'REUPLOAD_REQUIRED'
);

CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- ============================================
-- USERS
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'CUSTOMER',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TRAVELLER PROFILES
-- ============================================

CREATE TABLE traveller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  passport_number VARCHAR(50) NOT NULL,
  passport_expiry DATE NOT NULL,
  passport_issue_date DATE,
  nationality VARCHAR(100) DEFAULT 'Indian',
  gender gender_type NOT NULL,
  is_minor BOOLEAN DEFAULT FALSE,
  is_senior BOOLEAN DEFAULT FALSE,
  is_first_time BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- VISA COUNTRY & TYPES
-- ============================================

CREATE TABLE visa_countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  flag_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visa_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID REFERENCES visa_countries(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  government_fee DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) NOT NULL,
  processing_days INTEGER NOT NULL,
  validity_days INTEGER NOT NULL,
  stay_duration_days INTEGER NOT NULL,
  is_e_visa BOOLEAN DEFAULT FALSE,
  is_express_available BOOLEAN DEFAULT FALSE,
  requires_interview BOOLEAN DEFAULT FALSE,
  description TEXT,
  overview TEXT,
  eligibility_rules TEXT,
  important_notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visa_required_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  description TEXT,
  sample_url TEXT,
  "order" INTEGER DEFAULT 0
);

-- ============================================
-- VISA APPLICATIONS
-- ============================================

CREATE TABLE visa_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  visa_type_id UUID REFERENCES visa_types(id),
  application_number VARCHAR(50) UNIQUE NOT NULL,
  status visa_application_status DEFAULT 'DRAFT',
  total_amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  grand_total DECIMAL(10, 2) NOT NULL,
  processing_type VARCHAR(20) DEFAULT 'STANDARD',
  estimated_completion_date DATE,
  actual_completion_date DATE,
  admin_notes TEXT,
  rejection_reason TEXT,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visa_applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  traveller_profile_id UUID REFERENCES traveller_profiles(id),
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  passport_number VARCHAR(50) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  status visa_application_status DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visa_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_applicant_id UUID REFERENCES visa_applicants(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  status document_status DEFAULT 'UPLOADED',
  rejection_reason TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id)
);

-- ============================================
-- TOURS
-- ============================================

CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  destination VARCHAR(255) NOT NULL,
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  starting_price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  theme VARCHAR(50),
  itinerary JSONB,
  inclusions TEXT[],
  exclusions TEXT[],
  hotel_details JSONB,
  images TEXT[],
  is_visa_included BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tour_departures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  available_seats INTEGER NOT NULL,
  total_seats INTEGER NOT NULL,
  price_per_person DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE tour_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tour_id UUID REFERENCES tours(id),
  tour_departure_id UUID REFERENCES tour_departures(id),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  status tour_booking_status DEFAULT 'PENDING',
  total_guests INTEGER NOT NULL,
  room_configuration JSONB,
  total_amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  grand_total DECIMAL(10, 2) NOT NULL,
  payment_type VARCHAR(20) DEFAULT 'FULL',
  include_visa BOOLEAN DEFAULT FALSE,
  include_insurance BOOLEAN DEFAULT FALSE,
  include_airport_transfer BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  cancellation_reason TEXT,
  voucher_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tour_guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_booking_id UUID REFERENCES tour_bookings(id) ON DELETE CASCADE,
  traveller_profile_id UUID REFERENCES traveller_profiles(id),
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender gender_type NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ORDERS & PAYMENTS
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_type order_type NOT NULL,
  reference_id UUID NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  razorpay_order_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status payment_status DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(512),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status payment_status DEFAULT 'PENDING',
  payment_method VARCHAR(50),
  payment_date TIMESTAMP,
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  razorpay_refund_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  processed_by UUID REFERENCES users(id),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SUPPORT & NOTIFICATIONS
-- ============================================

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reference_type VARCHAR(20),
  reference_id UUID,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'OPEN',
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  sender_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'INFO',
  reference_type VARCHAR(50),
  reference_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CONTENT MANAGEMENT
-- ============================================

CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content JSONB,
  type VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  featured_image TEXT,
  category VARCHAR(100),
  tags TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- APPLICATION TIMELINE
-- ============================================

CREATE TABLE application_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL,
  application_type VARCHAR(20) NOT NULL,
  status VARCHAR(100) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_visa_applications_user ON visa_applications(user_id);
CREATE INDEX idx_visa_applications_status ON visa_applications(status);
CREATE INDEX idx_tour_bookings_user ON tour_bookings(user_id);
CREATE INDEX idx_tour_bookings_status ON tour_bookings(status);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_applications_updated_at BEFORE UPDATE ON visa_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tour_bookings_updated_at BEFORE UPDATE ON tour_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

