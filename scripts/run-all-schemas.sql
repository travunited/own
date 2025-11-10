-- =====================================================
-- RUN ALL SCHEMAS IN SUPABASE SQL EDITOR
-- =====================================================
-- Copy and paste this ENTIRE file into Supabase SQL Editor
-- Then click "RUN" button once
-- This will create all tables needed for new features
-- =====================================================

-- =====================================================
-- 1. REFUND REQUESTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  
  requested_by UUID REFERENCES auth.users(id),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  rejected_by UUID REFERENCES auth.users(id),
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  razorpay_refund_id VARCHAR(255),
  razorpay_refund_status VARCHAR(50),
  error_message TEXT,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refund_requests_payment ON refund_requests(payment_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_user ON refund_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);

ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own refund requests" ON refund_requests;
CREATE POLICY "Users can view their own refund requests"
  ON refund_requests FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admins can view all refund requests" ON refund_requests;
CREATE POLICY "Super admins can view all refund requests"
  ON refund_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Super admins can insert refund requests" ON refund_requests;
CREATE POLICY "Super admins can insert refund requests"
  ON refund_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('super_admin', 'admin')
    )
  );

DROP POLICY IF EXISTS "Super admins can update refund requests" ON refund_requests;
CREATE POLICY "Super admins can update refund requests"
  ON refund_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

-- =====================================================
-- 2. AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can view all audit logs" ON audit_logs;
CREATE POLICY "Super admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. EMAIL TEMPLATES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can view all email templates" ON email_templates;
CREATE POLICY "Super admins can view all email templates"
  ON email_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Super admins can insert email templates" ON email_templates;
CREATE POLICY "Super admins can insert email templates"
  ON email_templates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Super admins can update email templates" ON email_templates;
CREATE POLICY "Super admins can update email templates"
  ON email_templates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

-- Insert default email templates
INSERT INTO email_templates (name, subject, body, variables) VALUES
('welcome', 'Welcome to Travunited!', 
'Hello {{name}},

Welcome to Travunited! We''re excited to have you on board.

Your account has been successfully created. You can now:
- Apply for visas to 50+ countries
- Book amazing tour packages
- Track your applications in real-time
- Get expert support 24/7

Get started: {{dashboard_url}}

Best regards,
The Travunited Team',
ARRAY['{{name}}', '{{email}}', '{{dashboard_url}}']),

('application_received', 'Application Received - {{application_number}}',
'Hello {{name}},

We have received your visa application for {{country}}.

Application Details:
- Application Number: {{application_number}}
- Visa Type: {{visa_type}}
- Processing Time: {{processing_time}}
- Status: Under Review

You can track your application status here: {{tracking_url}}

Best regards,
Travunited Support Team',
ARRAY['{{name}}', '{{application_number}}', '{{country}}', '{{visa_type}}', '{{processing_time}}', '{{tracking_url}}']),

('application_approved', 'Visa Approved! - {{application_number}}',
'Congratulations {{name}}! 🎉

Your visa application for {{country}} has been approved!

Application Number: {{application_number}}
Visa Type: {{visa_type}}
Valid Until: {{valid_until}}

You can download your visa here: {{download_url}}

Have a great trip!

Best regards,
Travunited Team',
ARRAY['{{name}}', '{{application_number}}', '{{country}}', '{{visa_type}}', '{{valid_until}}', '{{download_url}}']),

('application_rejected', 'Application Status Update - {{application_number}}',
'Hello {{name}},

We regret to inform you that your visa application for {{country}} could not be approved at this time.

Application Number: {{application_number}}
Reason: {{rejection_reason}}

You can reapply or contact our support team: {{support_url}}

Best regards,
Travunited Support Team',
ARRAY['{{name}}', '{{application_number}}', '{{country}}', '{{rejection_reason}}', '{{support_url}}']),

('documents_requested', 'Additional Documents Required - {{application_number}}',
'Hello {{name}},

We need additional documents for your visa application.

Application Number: {{application_number}}
Required Documents:
{{document_list}}

Please upload these documents: {{upload_url}}

Best regards,
Travunited Team',
ARRAY['{{name}}', '{{application_number}}', '{{document_list}}', '{{upload_url}}']),

('payment_confirmation', 'Payment Confirmed - {{payment_id}}',
'Hello {{name}},

Your payment has been successfully processed.

Payment Details:
- Payment ID: {{payment_id}}
- Amount: {{amount}}
- Application: {{application_number}}

Receipt: {{receipt_url}}

Best regards,
Travunited Team',
ARRAY['{{name}}', '{{payment_id}}', '{{amount}}', '{{application_number}}', '{{receipt_url}}']),

('refund_processed', 'Refund Processed - {{refund_id}}',
'Hello {{name}},

Your refund has been processed successfully.

Refund Details:
- Refund ID: {{refund_id}}
- Amount: {{amount}}
- Application: {{application_number}}

The amount will be credited within 5-7 business days.

Best regards,
Travunited Team',
ARRAY['{{name}}', '{{refund_id}}', '{{amount}}', '{{application_number}}'])
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 4. VISA ADD-ONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS visa_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visa_addons_category ON visa_addons(category);
CREATE INDEX IF NOT EXISTS idx_visa_addons_active ON visa_addons(is_active);
CREATE INDEX IF NOT EXISTS idx_visa_addons_order ON visa_addons(display_order);

ALTER TABLE visa_addons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active addons" ON visa_addons;
CREATE POLICY "Anyone can view active addons"
  ON visa_addons FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Super admins can manage addons" ON visa_addons;
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

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these to verify everything was created:

-- Check refund_requests
SELECT 'refund_requests' as table_name, COUNT(*) as row_count FROM refund_requests
UNION ALL
-- Check audit_logs
SELECT 'audit_logs', COUNT(*) FROM audit_logs
UNION ALL
-- Check email_templates (should be 7)
SELECT 'email_templates', COUNT(*) FROM email_templates
UNION ALL
-- Check visa_addons (should be 6)
SELECT 'visa_addons', COUNT(*) FROM visa_addons;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- If you see this output with no errors, all tables are created!
-- 
-- Expected results:
-- refund_requests: 0 rows (empty, ready for data)
-- audit_logs: 0+ rows (may have some from existing operations)
-- email_templates: 7 rows ✅
-- visa_addons: 6 rows ✅
-- =====================================================

