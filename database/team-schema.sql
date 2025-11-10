-- =====================================================
-- TEAM MEMBERS SCHEMA
-- For managing team member profiles with admin editing
-- =====================================================

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL, -- 'leadership' or 'team'
  
  -- Profile Details
  bio TEXT,
  profile_image_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  
  -- Social Links
  linkedin_url TEXT,
  twitter_url TEXT,
  
  -- Display Settings
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_members_department ON team_members(department);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(display_order);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_members_updated_at_trigger
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_members_updated_at();

-- Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Public read access for active members
CREATE POLICY "Public can view active team members"
  ON team_members
  FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage team members"
  ON team_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('super_admin', 'admin')
    )
  );

-- =====================================================
-- INSERT INITIAL TEAM DATA
-- =====================================================

-- Leadership Team
INSERT INTO team_members (full_name, position, department, bio, display_order, is_active, is_featured) VALUES
(
  'Dr. Ridwan',
  'Managing Director, CEO',
  'leadership',
  'Founder, innovator, and strategic builder — leading Travunited with a bold vision to reshape the global travel landscape. With hands-on leadership, deep domain expertise, and a passion for delivering transformative customer journeys, he has powered the company''s rapid growth across borders. Focused on scalable systems, brand trust, and impactful partnerships, he is driving Travunited into a new era of global mobility.',
  1,
  true,
  true
),
(
  'Elvis Lewis',
  'Chief Operating Officer',
  'leadership',
  'A results-driven operations leader with deep expertise in travel operations, focused on building efficient systems and streamlining workflows. Skilled in managing end-to-end processes—from client onboarding to service delivery—with precision and speed. Known for implementing scalable, data-driven solutions that boost performance and service quality. With a forward-thinking approach, committed to transforming TravUnited into a tech-enabled, process-smart travel company known for operational excellence.',
  2,
  true,
  true
);

-- Team Members
INSERT INTO team_members (full_name, position, department, bio, display_order, is_active) VALUES
(
  'Chaitra',
  'Sales Executive',
  'team',
  'Serves as a reliable travel advisor, providing knowledgeable advice on visa services as well as holiday packages. Guarantees that every element is handled with expertise and efficiency, from comprehending customer preferences to creating customized itineraries and managing intricate visa procedures—providing a seamless, dependable, and enhanced vacation planning experience.',
  3,
  true
),
(
  'Pranith',
  'Sales Executive',
  'team',
  'Interacting with potential clients, giving them precise information about goods or services, and supporting them during the purchasing process. Building trust, successfully answering questions, and preserving a high degree of client happiness while continuously hitting sales goals are all part of the job.',
  4,
  true
),
(
  'Shriprada',
  'Marketing Automation Engineer',
  'team',
  'Design and manage automated marketing campaigns across many platforms to Integrate marketing tools with systems to ensure smooth data flow. and Create lead scoring models and segmentation for targeted messaging by Monitoring campaign performance and generate reports. Ensure data accuracy and compliance with privacy regulations and Collaborate with sales and marketing teams to improve lead generation and customer engagement.',
  5,
  true
);

-- Grant permissions
GRANT SELECT ON team_members TO anon;
GRANT ALL ON team_members TO authenticated;

