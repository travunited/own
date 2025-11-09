# 💳 Payment System - Complete Plan

## Enterprise-Grade Payment Infrastructure with Razorpay

---

## 🎯 Overview

A comprehensive payment system with Razorpay integration, automatic invoice generation, payment recovery, webhook handling, and complete transaction management.

---

## ✨ CORE FEATURES

### 1. Payment Processing (Phase 5)

#### Razorpay Integration
```
✅ Razorpay SDK initialized (lib/razorpay.ts)
✅ Order creation via API
✅ Checkout modal integration
✅ Multiple payment methods:
    - Cards (Visa, Mastercard, Amex, Rupay)
    - UPI (Google Pay, PhonePe, Paytm)
    - Net Banking (All major banks)
    - Wallets (Paytm, PhonePe, etc.)
    - EMI options
✅ Currency: INR
✅ Test & Production modes
```

#### Fresh Pricing Validation
```
✅ Recalculate total before payment
✅ Verify visa type pricing
✅ Calculate add-ons cost
✅ Apply discounts/coupons
✅ Add processing fees
✅ Validate traveler count
✅ Check for price changes
✅ Prevent stale pricing exploits
```

#### Secure Payment Flow
```
1. User reviews application
2. Clicks "Proceed to Payment"
3. System validates pricing
4. Creates Razorpay order
5. Opens Razorpay checkout modal
6. User selects payment method
7. User completes payment
8. Razorpay sends callback
9. System verifies signature
10. Updates payment status
11. Generates invoice
12. Sends confirmation email
```

---

### 2. Payment Recovery (Phase 5)

#### Failed Payment Detection
```
✅ Capture payment failures
✅ Log failure reasons
✅ Detect network issues
✅ Identify card declines
✅ Track insufficient balance
✅ Monitor timeout errors
✅ Record abandonment
```

#### Payment Status Verification
```
✅ Real-time status check
✅ Razorpay API verification
✅ Webhook confirmation
✅ Database sync
✅ Status reconciliation
✅ Duplicate payment detection
```

#### Retry Payment Option
```
✅ "Retry Payment" button
✅ Resume from last step
✅ Fresh order creation
✅ Same application context
✅ Updated pricing
✅ Attempt limit (3 retries)
✅ Cooldown period
```

#### Payment History Tracking
```
✅ All payment attempts logged
✅ Success/failure records
✅ Payment method used
✅ Transaction timestamps
✅ Amount paid
✅ Gateway response codes
✅ User IP & device info
```

---

### 3. Invoice Management (Phase 5)

#### Automatic Invoice Generation
```
✅ Generate on payment success
✅ Unique invoice number
✅ Invoice date & due date
✅ Itemized breakdown:
    - Visa type & cost
    - Number of travelers
    - Add-ons
    - Processing fees
    - Taxes (GST)
    - Discounts
    - Total amount
✅ Company details
✅ Customer details
✅ Payment details
✅ Terms & conditions
```

#### Downloadable PDF Invoices
```
✅ PDF generation library
✅ Professional invoice template
✅ Company logo & branding
✅ Download from dashboard
✅ Email attachment
✅ Print-friendly format
✅ QR code for verification
```

#### Payment Receipt Tracking
```
✅ Receipt for each payment
✅ Transaction ID
✅ Payment method
✅ Date & time
✅ Amount paid
✅ Status
✅ Download option
```

#### Transaction History
```
✅ All transactions listed
✅ Filter by:
    - Date range
    - Status
    - Application
    - Amount
✅ Sort options
✅ Export to CSV
✅ Search functionality
```

---

### 4. Webhook Verification (Phase 5)

#### Real-time Payment Status Updates
```
✅ Webhook endpoint: /api/webhooks/razorpay
✅ Signature verification
✅ Event types handled:
    - payment.authorized
    - payment.captured
    - payment.failed
    - order.paid
    - refund.created
✅ Idempotency checks
✅ Retry mechanism
```

#### Automatic Status Synchronization
```
✅ Update payment status in DB
✅ Update application status
✅ Generate invoice on success
✅ Send email notifications
✅ Update timeline
✅ Trigger workflows
```

#### Payment Capture Confirmation
```
✅ Auto-capture on authorization
✅ Manual capture option (admin)
✅ Capture amount verification
✅ Partial capture support
✅ Capture timeout handling
```

---

## 🗄️ DATABASE SCHEMA

### Enhanced Payment Tables

#### `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Application reference
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Payment identifiers
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  
  -- Payment details
  amount INTEGER NOT NULL, -- in paise
  currency TEXT DEFAULT 'INR' NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, authorized, captured, failed, refunded
  payment_method TEXT, -- card, upi, netbanking, wallet, emi
  payment_method_details JSONB,
  
  -- Pricing breakdown
  pricing_details JSONB NOT NULL, -- stores full breakdown
  
  -- Failure details
  failure_reason TEXT,
  failure_code TEXT,
  error_description TEXT,
  
  -- Retry tracking
  attempt_number INTEGER DEFAULT 1,
  max_attempts INTEGER DEFAULT 3,
  last_retry_at TIMESTAMP,
  
  -- Invoice details
  invoice_id UUID REFERENCES invoices(id),
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
  
  -- Indexes
  CONSTRAINT valid_status CHECK (status IN ('pending', 'authorized', 'captured', 'failed', 'refunded'))
);

CREATE INDEX idx_payments_application ON payments(application_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_razorpay_order ON payments(razorpay_order_id);
CREATE INDEX idx_payments_created ON payments(created_at DESC);
```

#### `invoices`
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  payment_id UUID REFERENCES payments(id) NOT NULL,
  application_id UUID REFERENCES visa_applications(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_date DATE DEFAULT CURRENT_DATE NOT NULL,
  due_date DATE,
  
  -- Amounts
  subtotal INTEGER NOT NULL,
  tax_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  
  -- Line items
  line_items JSONB NOT NULL, -- array of items
  
  -- Status
  status TEXT DEFAULT 'paid' NOT NULL, -- draft, pending, paid, cancelled
  
  -- Company & customer details
  company_details JSONB NOT NULL,
  customer_details JSONB NOT NULL,
  
  -- PDF
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_invoice_status CHECK (status IN ('draft', 'pending', 'paid', 'cancelled'))
);

CREATE INDEX idx_invoices_payment ON invoices(payment_id);
CREATE INDEX idx_invoices_application ON invoices(application_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_date ON invoices(invoice_date DESC);
```

#### `payment_webhooks`
```sql
CREATE TABLE payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Webhook data
  event_type TEXT NOT NULL,
  razorpay_event_id TEXT UNIQUE NOT NULL,
  payload JSONB NOT NULL,
  signature TEXT NOT NULL,
  
  -- Processing
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error TEXT,
  
  -- Related entities
  payment_id UUID REFERENCES payments(id),
  order_id TEXT,
  
  -- Timestamps
  received_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Indexes
  CREATE INDEX idx_webhooks_event_type ON payment_webhooks(event_type);
  CREATE INDEX idx_webhooks_processed ON payment_webhooks(processed);
  CREATE INDEX idx_webhooks_received ON payment_webhooks(received_at DESC);
);
```

#### `refunds`
```sql
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  payment_id UUID REFERENCES payments(id) NOT NULL,
  application_id UUID REFERENCES visa_applications(id) NOT NULL,
  
  -- Razorpay details
  razorpay_refund_id TEXT UNIQUE NOT NULL,
  
  -- Refund details
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, processed, failed
  
  -- Processing
  initiated_by UUID REFERENCES auth.users(id) NOT NULL,
  processed_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_refunds_payment ON refunds(payment_id);
CREATE INDEX idx_refunds_application ON refunds(application_id);
CREATE INDEX idx_refunds_status ON refunds(status);
```

---

## 🎨 COMPONENTS

### User-Facing Components

#### 1. **PaymentCheckout**
```typescript
Features:
- Application summary
- Pricing breakdown display
- Fresh pricing validation
- Razorpay checkout integration
- Payment method selection
- Loading states
- Success/failure handling

Props:
- applicationId: string
- onSuccess: (paymentId: string) => void
- onFailure: (error: Error) => void
```

#### 2. **PricingBreakdown**
```typescript
Features:
- Visa type & cost
- Traveler count & pricing
- Add-ons list with costs
- Processing fees
- Tax calculation (GST)
- Discount display
- Total amount (prominent)
- Currency formatting

Props:
- pricing: PricingDetails
- showDetails?: boolean
- className?: string
```

#### 3. **PaymentStatus**
```typescript
Features:
- Status indicator (success/pending/failed)
- Payment details display
- Transaction ID
- Amount paid
- Payment method
- Date & time
- Download invoice button
- Retry payment button (if failed)
- Back to dashboard link

Props:
- paymentId: string
- status: string
- onRetry?: () => void
```

#### 4. **InvoiceViewer**
```typescript
Features:
- Invoice preview
- Professional layout
- Company branding
- Itemized breakdown
- Download PDF button
- Print button
- Email invoice option
- QR code

Props:
- invoiceId: string
- showActions?: boolean
```

#### 5. **PaymentHistory**
```typescript
Features:
- Transaction list
- Date filters
- Status filters
- Amount display
- Payment method icons
- View details button
- Download invoice
- Retry failed payments
- Pagination

Props:
- userId: string
- limit?: number
```

#### 6. **RetryPaymentButton**
```typescript
Features:
- Disabled if max attempts reached
- Shows remaining attempts
- Cooldown timer display
- Confirmation dialog
- Pricing revalidation
- Creates new order
- Opens Razorpay checkout

Props:
- paymentId: string
- applicationId: string
- onSuccess: () => void
```

---

### Admin-Facing Components

#### 1. **PaymentDashboard**
```typescript
Features:
- Revenue statistics
- Payment count (today/week/month)
- Success rate percentage
- Failed payments count
- Pending payments
- Recent transactions
- Charts & graphs
- Export reports

Props:
- dateRange: { from: Date; to: Date }
```

#### 2. **PaymentManagement**
```typescript
Features:
- All payments list
- Advanced filters
- Search by transaction ID
- Status indicators
- Amount display
- User info
- Actions (view, refund, capture)
- Bulk operations

Props:
- None (admin only)
```

#### 3. **RefundPanel**
```typescript
Features:
- Refund amount input
- Reason selection
- Partial refund support
- Refund confirmation
- Processing status
- Refund history
- Notes field

Props:
- paymentId: string
- maxAmount: number
- onRefund: (amount: number, reason: string) => Promise<void>
```

---

## 📡 API ENDPOINTS

### Payment Processing

#### **Create Payment Order**
```typescript
POST /api/payments/create

Body:
{
  applicationId: string
}

Response:
{
  orderId: string,
  amount: number,
  currency: string,
  key: string,
  pricing: PricingDetails
}
```

#### **Verify Payment**
```typescript
POST /api/payments/verify

Body:
{
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}

Response:
{
  success: boolean,
  paymentId: string,
  invoiceId: string
}
```

#### **Retry Payment**
```typescript
POST /api/payments/[id]/retry

Response:
{
  orderId: string,
  amount: number,
  currency: string,
  key: string,
  attemptNumber: number
}
```

#### **Get Payment Status**
```typescript
GET /api/payments/[id]

Response:
{
  payment: Payment,
  invoice?: Invoice,
  canRetry: boolean,
  remainingAttempts: number
}
```

---

### Invoice Management

#### **Generate Invoice**
```typescript
POST /api/invoices/generate

Body:
{
  paymentId: string
}

Response:
{
  invoiceId: string,
  invoiceNumber: string,
  pdfUrl: string
}
```

#### **Download Invoice PDF**
```typescript
GET /api/invoices/[id]/download

Response:
PDF file download
```

#### **Get Invoice**
```typescript
GET /api/invoices/[id]

Response:
{
  invoice: Invoice,
  payment: Payment,
  application: Application
}
```

#### **List User Invoices**
```typescript
GET /api/invoices?userId=[id]

Response:
{
  invoices: Invoice[],
  total: number
}
```

---

### Webhook Handling

#### **Razorpay Webhook**
```typescript
POST /api/webhooks/razorpay

Headers:
{
  'x-razorpay-signature': string
}

Body:
{
  event: string,
  payload: any
}

Response:
{
  received: true
}
```

---

### Payment Recovery

#### **Failed Payments List**
```typescript
GET /api/payments/failed

Response:
{
  payments: Payment[],
  total: number
}
```

#### **Check Payment Status (External)**
```typescript
POST /api/payments/[id]/verify-status

Response:
{
  status: string,
  synced: boolean,
  updated: boolean
}
```

---

### Admin Operations

#### **Payment Statistics**
```typescript
GET /api/admin/payments/stats

Query:
?from=[date]&to=[date]

Response:
{
  totalRevenue: number,
  totalPayments: number,
  successRate: number,
  failedPayments: number,
  averageOrderValue: number
}
```

#### **Refund Payment**
```typescript
POST /api/admin/payments/[id]/refund

Body:
{
  amount: number,
  reason: string,
  notes?: string
}

Response:
{
  refundId: string,
  status: string
}
```

#### **Capture Payment**
```typescript
POST /api/admin/payments/[id]/capture

Body:
{
  amount: number
}

Response:
{
  captured: boolean,
  capturedAmount: number
}
```

---

## 🔄 PAYMENT FLOW (Detailed)

### 1. User Initiates Payment

```typescript
// User clicks "Proceed to Payment" on application review page

// Frontend:
const handlePayment = async () => {
  try {
    // 1. Create payment order
    const response = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    });
    
    const { orderId, amount, currency, key, pricing } = await response.json();
    
    // 2. Validate pricing with user
    const confirmed = await showPricingConfirmation(pricing);
    if (!confirmed) return;
    
    // 3. Open Razorpay checkout
    const options = {
      key,
      amount,
      currency,
      order_id: orderId,
      name: 'Travunited',
      description: `Visa Application - ${applicationNumber}`,
      handler: async (response) => {
        // Payment successful
        await verifyPayment(response);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: {
        color: '#667eea',
      },
    };
    
    const razorpay = new Razorpay(options);
    razorpay.open();
    
  } catch (error) {
    handlePaymentError(error);
  }
};
```

---

### 2. Backend Creates Order

```typescript
// API: POST /api/payments/create

export async function POST(request: NextRequest) {
  // 1. Get user
  const user = await getAuthenticatedUser();
  
  // 2. Get application
  const { applicationId } = await request.json();
  const application = await getApplication(applicationId);
  
  // 3. Verify ownership
  if (application.user_id !== user.id) {
    return unauthorized();
  }
  
  // 4. Calculate fresh pricing
  const pricing = await calculatePricing(application);
  
  // 5. Create Razorpay order
  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: pricing.total * 100, // paise
    currency: 'INR',
    receipt: `visa_${applicationId}`,
    notes: {
      applicationId,
      userId: user.id,
    },
  });
  
  // 6. Save payment record
  await createPayment({
    application_id: applicationId,
    user_id: user.id,
    razorpay_order_id: order.id,
    amount: pricing.total,
    pricing_details: pricing,
    status: 'pending',
  });
  
  // 7. Return order details
  return json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
    pricing,
  });
}
```

---

### 3. Razorpay Processes Payment

```
User selects payment method in Razorpay modal
→ Razorpay processes payment
→ Razorpay returns response to handler
```

---

### 4. Frontend Verifies Payment

```typescript
// Razorpay handler callback

handler: async (response) => {
  try {
    // Verify payment signature
    const verified = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });
    
    const { success, paymentId, invoiceId } = await verified.json();
    
    if (success) {
      // Redirect to success page
      router.push(`/payments/${paymentId}/success`);
    }
    
  } catch (error) {
    // Show error
    showErrorMessage(error.message);
  }
}
```

---

### 5. Backend Verifies Signature

```typescript
// API: POST /api/payments/verify

export async function POST(request: NextRequest) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = await request.json();
  
  // 1. Verify signature
  const crypto = require('crypto');
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');
  
  if (generated_signature !== razorpay_signature) {
    throw new Error('Invalid signature');
  }
  
  // 2. Update payment status
  const payment = await updatePayment(razorpay_order_id, {
    razorpay_payment_id,
    razorpay_signature,
    status: 'captured',
    captured_at: new Date(),
  });
  
  // 3. Update application status
  await updateApplication(payment.application_id, {
    payment_status: 'paid',
    status: 'submitted',
  });
  
  // 4. Generate invoice
  const invoice = await generateInvoice(payment.id);
  
  // 5. Add timeline event
  await addTimelineEvent(payment.application_id, {
    status: 'payment_successful',
    title: 'Payment Received',
    description: `Payment of ₹${payment.amount} received successfully`,
  });
  
  // 6. Send confirmation email
  await sendPaymentConfirmationEmail(payment, invoice);
  
  return json({
    success: true,
    paymentId: payment.id,
    invoiceId: invoice.id,
  });
}
```

---

### 6. Webhook Confirmation (Async)

```typescript
// API: POST /api/webhooks/razorpay

export async function POST(request: NextRequest) {
  // 1. Verify webhook signature
  const signature = request.headers.get('x-razorpay-signature');
  const body = await request.text();
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return unauthorized();
  }
  
  // 2. Parse event
  const event = JSON.parse(body);
  
  // 3. Log webhook
  await logWebhook(event);
  
  // 4. Handle event
  switch (event.event) {
    case 'payment.captured':
      await handlePaymentCaptured(event.payload.payment.entity);
      break;
    
    case 'payment.failed':
      await handlePaymentFailed(event.payload.payment.entity);
      break;
    
    case 'refund.created':
      await handleRefundCreated(event.payload.refund.entity);
      break;
  }
  
  return json({ received: true });
}
```

---

## 💰 PRICING CALCULATION

### Fresh Pricing Validation

```typescript
async function calculatePricing(application: Application) {
  // 1. Get visa type pricing
  const visaType = await getVisaType(application.visa_type_id);
  const basePrice = visaType.price;
  
  // 2. Calculate travelers
  const travelers = await getTravelers(application.id);
  const travelerCount = travelers.length || 1;
  const totalVisaPrice = basePrice * travelerCount;
  
  // 3. Get add-ons
  const addons = await getApplicationAddons(application.id);
  const addonsTotal = addons.reduce((sum, addon) => {
    return sum + (addon.price * (addon.per_traveler ? travelerCount : 1));
  }, 0);
  
  // 4. Calculate processing fee (3%)
  const processingFee = Math.round((totalVisaPrice + addonsTotal) * 0.03);
  
  // 5. Calculate tax (18% GST)
  const subtotal = totalVisaPrice + addonsTotal + processingFee;
  const taxRate = 0.18;
  const taxAmount = Math.round(subtotal * taxRate);
  
  // 6. Apply discounts
  const discount = await getApplicableDiscount(application);
  const discountAmount = discount ? Math.round(subtotal * discount.percentage / 100) : 0;
  
  // 7. Calculate total
  const total = subtotal + taxAmount - discountAmount;
  
  return {
    visaPrice: basePrice,
    travelerCount,
    totalVisaPrice,
    addons: addons.map(a => ({
      name: a.name,
      price: a.price,
      quantity: a.per_traveler ? travelerCount : 1,
      total: a.price * (a.per_traveler ? travelerCount : 1),
    })),
    addonsTotal,
    processingFee,
    subtotal,
    taxRate,
    taxAmount,
    discountAmount,
    total,
    currency: 'INR',
  };
}
```

---

## 🔄 PAYMENT RETRY LOGIC

### Retry Workflow

```typescript
// Check if payment can be retried
function canRetryPayment(payment: Payment): boolean {
  // 1. Check attempt count
  if (payment.attempt_number >= payment.max_attempts) {
    return false;
  }
  
  // 2. Check cooldown period (5 minutes)
  if (payment.last_retry_at) {
    const cooldownMs = 5 * 60 * 1000;
    const timeSinceLastRetry = Date.now() - payment.last_retry_at.getTime();
    if (timeSinceLastRetry < cooldownMs) {
      return false;
    }
  }
  
  // 3. Check payment status
  if (payment.status !== 'failed') {
    return false;
  }
  
  return true;
}

// Retry payment
async function retryPayment(paymentId: string): Promise<Order> {
  const payment = await getPayment(paymentId);
  
  if (!canRetryPayment(payment)) {
    throw new Error('Cannot retry payment');
  }
  
  // 1. Recalculate pricing
  const application = await getApplication(payment.application_id);
  const pricing = await calculatePricing(application);
  
  // 2. Create new Razorpay order
  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: pricing.total * 100,
    currency: 'INR',
    receipt: `visa_${application.id}_retry_${payment.attempt_number + 1}`,
  });
  
  // 3. Update payment record
  await updatePayment(paymentId, {
    razorpay_order_id: order.id,
    amount: pricing.total,
    pricing_details: pricing,
    attempt_number: payment.attempt_number + 1,
    last_retry_at: new Date(),
    status: 'pending',
  });
  
  return order;
}
```

---

## 📄 INVOICE GENERATION

### Invoice Template

```typescript
interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  
  company: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
    gstin: string;
  };
  
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  
  payment: {
    method: string;
    transactionId: string;
    date: Date;
    status: string;
  };
  
  notes?: string;
  terms?: string;
}

async function generateInvoicePDF(data: InvoiceData): Promise<string> {
  // Use library like pdfkit or jsPDF
  // Generate professional invoice
  // Upload to Supabase Storage
  // Return URL
}
```

---

## 🎯 SUCCESS METRICS

### Payment KPIs

```
- Payment success rate: Target > 95%
- Average transaction time: Target < 2 minutes
- Failed payment recovery: Target > 30%
- Invoice generation time: Target < 5 seconds
- Webhook processing time: Target < 1 second
```

---

## 🔐 SECURITY

### Payment Security

```
✅ HTTPS only
✅ Razorpay signature verification
✅ Webhook signature verification
✅ Fresh pricing validation
✅ User authentication required
✅ Ownership verification
✅ Idempotency keys
✅ Rate limiting on payment endpoints
✅ PCI-DSS compliant (via Razorpay)
✅ No card data stored
✅ Encrypted payment data
✅ Audit logging
```

---

## ✅ READY TO BUILD

All features planned and documented. Time to implement! 🚀


