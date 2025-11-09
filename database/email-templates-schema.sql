-- =====================================================
-- EMAIL TEMPLATES SCHEMA
-- =====================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- Array of available variables like {{name}}, {{app_number}}
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_email_templates_name ON email_templates(name);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Super admins can view all email templates"
  ON email_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can insert email templates"
  ON email_templates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

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

We will notify you once your documents are verified.

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

You can reapply or contact our support team for assistance: {{support_url}}

Best regards,
Travunited Support Team',
ARRAY['{{name}}', '{{application_number}}', '{{country}}', '{{rejection_reason}}', '{{support_url}}']),

('documents_requested', 'Additional Documents Required - {{application_number}}',
'Hello {{name}},

We need additional documents for your visa application.

Application Number: {{application_number}}
Required Documents:
{{document_list}}

Please upload these documents as soon as possible: {{upload_url}}

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
- Payment Method: {{payment_method}}

Receipt: {{receipt_url}}

Best regards,
Travunited Team',
ARRAY['{{name}}', '{{payment_id}}', '{{amount}}', '{{application_number}}', '{{payment_method}}', '{{receipt_url}}']),

('refund_processed', 'Refund Processed - {{refund_id}}',
'Hello {{name}},

Your refund has been processed successfully.

Refund Details:
- Refund ID: {{refund_id}}
- Amount: {{amount}}
- Application: {{application_number}}
- Processing Time: 5-7 business days

The amount will be credited to your original payment method.

Best regards,
Travunited Team',
ARRAY['{{name}}', '{{refund_id}}', '{{amount}}', '{{application_number}}'])
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE email_templates IS 'Email templates for automated notifications';

