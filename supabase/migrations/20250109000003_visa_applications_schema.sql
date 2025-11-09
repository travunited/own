-- ============================================
-- VISA APPLICATION SYSTEM SCHEMA
-- Complete visa application management
-- ============================================

-- ============================================
-- VISA APPLICATIONS (Main application table)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_type_id UUID REFERENCES visa_types(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft',
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Pricing
  government_fee DECIMAL(10,2),
  service_fee DECIMAL(10,2),
  addon_fees DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  
  -- Traveler Info
  primary_traveler_id UUID,
  total_travelers INTEGER DEFAULT 1,
  
  -- Processing
  processing_speed VARCHAR(20) DEFAULT 'standard',
  estimated_completion_date DATE,
  actual_completion_date DATE,
  
  -- Payment
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  paid_at TIMESTAMP,
  
  -- Metadata
  is_draft BOOLEAN DEFAULT true,
  last_saved_at TIMESTAMP,
  submitted_at TIMESTAMP,
  current_step INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_applications_user ON visa_applications(user_id);
CREATE INDEX idx_visa_applications_status ON visa_applications(status);
CREATE INDEX idx_visa_applications_number ON visa_applications(application_number);

-- ============================================
-- VISA TRAVELERS (Applicant information)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_travelers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  
  -- Personal Info
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  place_of_birth VARCHAR(100),
  marital_status VARCHAR(50),
  
  -- Contact
  email VARCHAR(255),
  phone VARCHAR(20),
  alternative_phone VARCHAR(20),
  
  -- Address
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  
  -- Passport
  passport_number VARCHAR(50),
  passport_issue_date DATE,
  passport_expiry_date DATE,
  passport_place_of_issue VARCHAR(100),
  passport_type VARCHAR(50),
  passport_photo_url TEXT,
  
  -- Travel Details
  intended_travel_date DATE,
  expected_return_date DATE,
  purpose_of_visit TEXT,
  accommodation_details TEXT,
  previous_visits INTEGER DEFAULT 0,
  port_of_entry VARCHAR(100),
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  
  -- Relationship (for additional travelers)
  is_primary BOOLEAN DEFAULT false,
  relationship_to_primary VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_travelers_application ON visa_travelers(application_id);
CREATE INDEX idx_visa_travelers_primary ON visa_travelers(is_primary);

-- ============================================
-- VISA APPLICATION DOCUMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS visa_application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  traveler_id UUID REFERENCES visa_travelers(id) ON DELETE CASCADE,
  document_requirement_id UUID REFERENCES visa_required_documents(id),
  
  -- Document Info
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_mime_type VARCHAR(100),
  
  -- Status
  upload_status VARCHAR(50) DEFAULT 'uploaded',
  verification_status VARCHAR(50) DEFAULT 'pending',
  rejection_reason TEXT,
  admin_notes TEXT,
  
  -- Metadata
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_visa_documents_application ON visa_application_documents(application_id);
CREATE INDEX idx_visa_documents_traveler ON visa_application_documents(traveler_id);
CREATE INDEX idx_visa_documents_status ON visa_application_documents(verification_status);

-- ============================================
-- VISA APPLICATION ADD-ONS
-- ============================================

CREATE TABLE IF NOT EXISTS visa_application_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  
  addon_type VARCHAR(100) NOT NULL,
  addon_name VARCHAR(255) NOT NULL,
  addon_description TEXT,
  addon_price DECIMAL(10,2) NOT NULL,
  addon_details JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_addons_application ON visa_application_addons(application_id);

-- ============================================
-- VISA APPLICATION TIMELINE
-- ============================================

CREATE TABLE IF NOT EXISTS visa_application_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  
  status VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  
  -- User/System action
  created_by UUID REFERENCES auth.users(id),
  is_system_generated BOOLEAN DEFAULT false,
  
  -- Visibility
  visible_to_user BOOLEAN DEFAULT true,
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_timeline_application ON visa_application_timeline(application_id);
CREATE INDEX idx_visa_timeline_status ON visa_application_timeline(status);

-- ============================================
-- VISA APPLICATION AUTO-SAVES
-- ============================================

CREATE TABLE IF NOT EXISTS visa_application_auto_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  
  step_number INTEGER NOT NULL,
  step_name VARCHAR(100),
  form_data JSONB NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(application_id, step_number)
);

CREATE INDEX idx_visa_autosaves_application ON visa_application_auto_saves(application_id);
CREATE INDEX idx_visa_autosaves_user ON visa_application_auto_saves(user_id);

-- ============================================
-- APPLICATION NOTES (Admin & User)
-- ============================================

CREATE TABLE IF NOT EXISTS visa_application_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  
  note_type VARCHAR(50) NOT NULL, -- admin_note, user_query, system_note
  note_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visa_notes_application ON visa_application_notes(application_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate application number
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Format: TVU-YYYYMMDD-XXXX
    new_number := 'TVU-' || 
                  TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                  LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    SELECT COUNT(*) INTO exists_check 
    FROM visa_applications 
    WHERE application_number = new_number;
    
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate completion percentage
CREATE OR REPLACE FUNCTION calculate_completion_percentage(app_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_steps INTEGER := 9;
  completed_steps INTEGER := 0;
BEGIN
  -- Step 1: Visa selected (always complete if application exists)
  completed_steps := completed_steps + 1;
  
  -- Step 2: Primary traveler info
  IF EXISTS (SELECT 1 FROM visa_travelers WHERE application_id = app_id AND is_primary = true) THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Step 3: Passport info
  IF EXISTS (
    SELECT 1 FROM visa_travelers 
    WHERE application_id = app_id 
      AND passport_number IS NOT NULL 
      AND passport_expiry_date IS NOT NULL
  ) THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Step 4: Travel details
  IF EXISTS (
    SELECT 1 FROM visa_travelers 
    WHERE application_id = app_id 
      AND intended_travel_date IS NOT NULL
  ) THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Step 5: Additional travelers (optional, count as complete)
  completed_steps := completed_steps + 1;
  
  -- Step 6: Documents
  IF (SELECT COUNT(*) FROM visa_application_documents WHERE application_id = app_id) >= 
     (SELECT COUNT(*) FROM visa_required_documents WHERE visa_type_id = 
       (SELECT visa_type_id FROM visa_applications WHERE id = app_id) AND is_mandatory = true) THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Step 7: Add-ons (optional, count as complete)
  completed_steps := completed_steps + 1;
  
  -- Step 8: Review
  completed_steps := completed_steps + 1;
  
  -- Step 9: Payment
  IF EXISTS (SELECT 1 FROM visa_applications WHERE id = app_id AND payment_status = 'paid') THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  RETURN (completed_steps * 100 / total_steps);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_visa_applications_updated_at BEFORE UPDATE ON visa_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_travelers_updated_at BEFORE UPDATE ON visa_travelers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_autosaves_updated_at BEFORE UPDATE ON visa_application_auto_saves
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_application_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_application_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_application_auto_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_application_notes ENABLE ROW LEVEL SECURITY;

-- Users can view/manage own applications
CREATE POLICY "Users can view own applications"
  ON visa_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
  ON visa_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON visa_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Similar policies for related tables
CREATE POLICY "Users can view own travelers"
  ON visa_travelers FOR SELECT
  USING (application_id IN (SELECT id FROM visa_applications WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own travelers"
  ON visa_travelers FOR ALL
  USING (application_id IN (SELECT id FROM visa_applications WHERE user_id = auth.uid()));

-- Documents
CREATE POLICY "Users can view own documents"
  ON visa_application_documents FOR SELECT
  USING (application_id IN (SELECT id FROM visa_applications WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own documents"
  ON visa_application_documents FOR ALL
  USING (application_id IN (SELECT id FROM visa_applications WHERE user_id = auth.uid()));

-- Timeline
CREATE POLICY "Users can view own timeline"
  ON visa_application_timeline FOR SELECT
  USING (
    visible_to_user = true 
    AND application_id IN (SELECT id FROM visa_applications WHERE user_id = auth.uid())
  );

-- Auto-saves
CREATE POLICY "Users can manage own auto-saves"
  ON visa_application_auto_saves FOR ALL
  USING (user_id = auth.uid());

-- ============================================
-- COMPLETED
-- ============================================

SELECT 'Visa application schema created successfully!' as status;

