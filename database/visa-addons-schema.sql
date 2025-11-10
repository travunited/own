-- =====================================================
-- VISA ADD-ONS SCHEMA
-- =====================================================

CREATE TABLE IF NOT EXISTS visa_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50), -- insurance, priority_processing, document_assistance, support
  icon VARCHAR(50), -- lucide icon name
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_visa_addons_category ON visa_addons(category);
CREATE INDEX IF NOT EXISTS idx_visa_addons_active ON visa_addons(is_active);
CREATE INDEX IF NOT EXISTS idx_visa_addons_order ON visa_addons(display_order);

-- Enable RLS
ALTER TABLE visa_addons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active addons"
  ON visa_addons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Super admins can manage addons"
  ON visa_addons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

-- Insert default addons
INSERT INTO visa_addons (name, description, price, category, icon, display_order) VALUES
('Travel Insurance', 'Comprehensive travel insurance coverage up to $50,000', 999, 'insurance', 'Shield', 1),
('Priority Processing', 'Get your visa 50% faster with priority processing', 1999, 'processing', 'Zap', 2),
('Document Assistance', 'Expert help with document preparation and review', 499, 'assistance', 'FileCheck', 3),
('VIP Support', '24/7 dedicated support line with priority assistance', 2999, 'support', 'Headphones', 4),
('Visa Photo Service', 'Professional visa photo service at your doorstep', 299, 'assistance', 'Camera', 5),
('Document Courier', 'Free pickup and delivery of your documents', 599, 'assistance', 'Truck', 6)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE visa_addons IS 'Available add-on services for visa applications';

