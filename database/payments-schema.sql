-- ============================================
-- PAYMENT SYSTEM DATABASE SCHEMA
-- Razorpay Integration, Invoices, Webhooks, Refunds
-- ============================================

-- ============================================
-- PAYMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Application reference
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Razorpay identifiers
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  
  -- Payment details
  amount INTEGER NOT NULL, -- in paise (INR)
  currency TEXT DEFAULT 'INR' NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  payment_method TEXT, -- card, upi, netbanking, wallet, emi
  payment_method_details JSONB,
  
  -- Pricing breakdown
  pricing_details JSONB NOT NULL, -- stores full pricing calculation
  
  -- Failure details
  failure_reason TEXT,
  failure_code TEXT,
  error_description TEXT,
  
  -- Retry tracking
  attempt_number INTEGER DEFAULT 1,
  max_attempts INTEGER DEFAULT 3,
  last_retry_at TIMESTAMP,
  
  -- Invoice reference
  invoice_id UUID,
  invoice_number TEXT,
  
  -- Metadata
  user_ip TEXT,
  user_agent TEXT,
  device_info JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  authorized_at TIMESTAMP,
  captured_at TIMESTAMP,
  failed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')),
  CONSTRAINT valid_currency CHECK (currency IN ('INR', 'USD', 'EUR', 'GBP'))
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_application ON payments(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_captured ON payments(captured_at DESC);

-- ============================================
-- INVOICES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  payment_id UUID REFERENCES payments(id) NOT NULL,
  application_id UUID REFERENCES visa_applications(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_date DATE DEFAULT CURRENT_DATE NOT NULL,
  due_date DATE,
  
  -- Amounts (in paise)
  subtotal INTEGER NOT NULL,
  tax_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  
  -- Line items
  line_items JSONB NOT NULL, -- array of {description, quantity, unitPrice, total}
  
  -- Status
  status TEXT DEFAULT 'paid' NOT NULL,
  
  -- Company & customer details
  company_details JSONB NOT NULL,
  customer_details JSONB NOT NULL,
  
  -- PDF
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP,
  
  -- Notes & terms
  notes TEXT,
  terms TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_invoice_status CHECK (status IN ('draft', 'pending', 'paid', 'cancelled', 'refunded'))
);

-- Indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_payment ON invoices(payment_id);
CREATE INDEX IF NOT EXISTS idx_invoices_application ON invoices(application_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- ============================================
-- PAYMENT WEBHOOKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Webhook data
  event_type TEXT NOT NULL,
  razorpay_event_id TEXT UNIQUE NOT NULL,
  payload JSONB NOT NULL,
  signature TEXT NOT NULL,
  
  -- Processing status
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Related entities
  payment_id UUID REFERENCES payments(id),
  order_id TEXT,
  
  -- Timestamps
  received_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for webhooks
CREATE INDEX IF NOT EXISTS idx_webhooks_event_type ON payment_webhooks(event_type);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON payment_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_webhooks_received ON payment_webhooks(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhooks_order ON payment_webhooks(order_id);

-- ============================================
-- REFUNDS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  payment_id UUID REFERENCES payments(id) NOT NULL,
  application_id UUID REFERENCES visa_applications(id) NOT NULL,
  
  -- Razorpay details
  razorpay_refund_id TEXT UNIQUE NOT NULL,
  
  -- Refund details
  amount INTEGER NOT NULL, -- in paise
  reason TEXT NOT NULL,
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' NOT NULL,
  
  -- Processing
  initiated_by UUID REFERENCES auth.users(id) NOT NULL,
  processed_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_refund_status CHECK (status IN ('pending', 'processing', 'processed', 'failed'))
);

-- Indexes for refunds
CREATE INDEX IF NOT EXISTS idx_refunds_payment ON refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_application ON refunds(application_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_refunds_created ON refunds(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Generate unique invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year TEXT;
  month TEXT;
  sequence INT;
BEGIN
  year := TO_CHAR(CURRENT_DATE, 'YY');
  month := TO_CHAR(CURRENT_DATE, 'MM');
  
  -- Get next sequence number for this month
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 10) AS INTEGER)), 0) + 1
  INTO sequence
  FROM invoices
  WHERE invoice_number LIKE 'TVU-' || year || month || '%';
  
  new_number := 'TVU-' || year || month || LPAD(sequence::TEXT, 5, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Update invoice foreign key after creation
CREATE OR REPLACE FUNCTION update_payment_invoice()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE payments
  SET invoice_id = NEW.id,
      invoice_number = NEW.invoice_number,
      updated_at = NOW()
  WHERE id = NEW.payment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_payment_invoice
AFTER INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_payment_invoice();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_refunds_updated_at
BEFORE UPDATE ON refunds
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments for own applications"
  ON payments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM visa_applications
      WHERE id = application_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND preferences->>'role' = 'admin'
    )
  );

CREATE POLICY "System can update payments"
  ON payments FOR UPDATE
  USING (true);

-- Invoices policies
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all invoices"
  ON invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND preferences->>'role' = 'admin'
    )
  );

CREATE POLICY "System can insert invoices"
  ON invoices FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update invoices"
  ON invoices FOR UPDATE
  USING (true);

-- Webhooks policies (admin and system only)
CREATE POLICY "Admins can view webhooks"
  ON payment_webhooks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND preferences->>'role' = 'admin'
    )
  );

CREATE POLICY "System can insert webhooks"
  ON payment_webhooks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update webhooks"
  ON payment_webhooks FOR UPDATE
  USING (true);

-- Refunds policies
CREATE POLICY "Users can view own refunds"
  ON refunds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payments
      WHERE payments.id = refunds.payment_id
      AND payments.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all refunds"
  ON refunds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND preferences->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can create refunds"
  ON refunds FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND preferences->>'role' = 'admin'
    )
  );

CREATE POLICY "System can update refunds"
  ON refunds FOR UPDATE
  USING (true);

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Note: Sample data will be added after visa applications exist

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Payment system schema created successfully!';
  RAISE NOTICE '📊 Tables: payments, invoices, payment_webhooks, refunds';
  RAISE NOTICE '🔧 Functions: generate_invoice_number, update_payment_invoice';
  RAISE NOTICE '🔒 RLS policies enabled for all tables';
END $$;

