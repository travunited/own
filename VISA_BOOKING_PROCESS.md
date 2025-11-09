# Complete Visa Booking Process - Travunited Platform

## 📋 Table of Contents

1. [Process Overview](#process-overview)
2. [User Journey](#user-journey)
3. [Technical Flow](#technical-flow)
4. [Database Operations](#database-operations)
5. [Payment Processing](#payment-processing)
6. [Document Management](#document-management)
7. [Status Workflow](#status-workflow)
8. [Notifications](#notifications)
9. [Admin Operations](#admin-operations)
10. [Edge Cases](#edge-cases)

---

## 1. Process Overview

### High-Level Flow
```
User Discovery → Selection → Traveller Info → Documents → Add-ons → 
Review → Payment → Confirmation → Processing → Approval → Delivery
```

### Timeline
- **User Actions**: 15-30 minutes
- **Admin Review**: 24-48 hours
- **Embassy Processing**: 2-30 days (varies by country)
- **Total Time**: 3-35 days average

### Success Criteria
- ✅ 100% data capture accuracy
- ✅ All required documents uploaded
- ✅ Payment successfully processed
- ✅ Real-time status updates
- ✅ 99%+ visa approval rate

---

## 2. User Journey

### Phase 1: Discovery & Selection (5-10 minutes)

#### Step 1.1: Landing & Search
**User Actions:**
- Visits homepage or /visas page
- Searches for destination country
- Views available visa types
- Reads requirements and pricing

**System Actions:**
- Display countries from `visa_countries` table
- Show visa types filtered by country
- Calculate total cost (govt fee + service fee + tax)
- Display processing time and validity

**Data Required:**
- Country list (active only)
- Visa types with pricing
- Processing times
- Required documents list

**UI Components:**
- Search/filter bar
- Country cards with flags
- Visa type cards with badges
- Pricing breakdown
- "Apply Now" CTA

---

#### Step 1.2: Visa Selection
**User Actions:**
- Selects specific country
- Chooses visa type (Tourist/Business/Student/etc.)
- Selects processing type (Standard/Express)
- Reviews visa details (validity, stay duration)

**System Actions:**
- Fetch visa type details from database
- Load required documents list
- Calculate pricing based on selection
- Show estimated completion date

**Database Queries:**
```sql
-- Get visa type details
SELECT vt.*, vc.name as country_name
FROM visa_types vt
JOIN visa_countries vc ON vt.country_id = vc.id
WHERE vt.id = ?;

-- Get required documents
SELECT * FROM visa_required_documents
WHERE visa_type_id = ?
ORDER BY "order" ASC;
```

**Data Stored:**
```typescript
{
  selectedCountry: "ae", // Country code
  selectedVisaType: "tourist-30", // Visa type ID
  processingType: "STANDARD" | "EXPRESS",
  basePrice: 5499,
  governmentFee: 3500,
  serviceFee: 1500,
  taxRate: 0.18
}
```

---

### Phase 2: Traveller Information (10-15 minutes)

#### Step 2.1: Add Travellers
**User Actions:**
- Clicks "Add Traveller"
- Can add multiple travellers (1-20)
- Fills form for each traveller:
  - Full name (as per passport)
  - Date of birth
  - Passport number
  - Passport expiry date
  - Nationality
  - Gender
- Designates lead traveller (first one by default)
- Option to load from saved profiles

**System Actions:**
- Validate passport expiry (must be > 6 months)
- Check for duplicate passport numbers
- Auto-calculate age categories (minor/adult/senior)
- Validate name format (matches passport standards)
- Calculate total cost (base price × number of travellers)

**Validation Rules:**
```typescript
interface TravellerValidation {
  fullName: {
    required: true,
    pattern: /^[A-Za-z\s]+$/, // Only letters and spaces
    minLength: 2,
    maxLength: 100
  },
  dateOfBirth: {
    required: true,
    minAge: 0,
    maxAge: 150,
    format: "YYYY-MM-DD"
  },
  passportNumber: {
    required: true,
    pattern: /^[A-Z0-9]{6,9}$/,
    unique: true // Check across application
  },
  passportExpiry: {
    required: true,
    minMonthsValid: 6, // Must be valid for 6+ months
    futureDate: true
  },
  nationality: {
    required: true,
    validCountry: true
  },
  gender: {
    required: true,
    enum: ["MALE", "FEMALE", "OTHER"]
  }
}
```

**Database Operations:**
```sql
-- Check for existing traveller profile
SELECT * FROM traveller_profiles
WHERE user_id = ? AND passport_number = ?;

-- Save new traveller profile (for future use)
INSERT INTO traveller_profiles (
  user_id, full_name, date_of_birth, passport_number,
  passport_expiry, nationality, gender, is_minor, is_senior
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
```

**Data Structure:**
```typescript
interface Traveller {
  id: string; // Temp ID for UI
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  passportNumber: string;
  passportExpiry: string;
  passportIssueDate?: string;
  nationality: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  isLeadTraveller: boolean;
  isMinor: boolean; // Auto-calculated
  isSenior: boolean; // Auto-calculated
  travellerProfileId?: string; // If loaded from saved profile
}
```

---

### Phase 3: Document Upload (15-20 minutes)

#### Step 3.1: Document Requirements Display
**System Actions:**
- Load required documents for selected visa type
- Group by traveller
- Show sample documents
- Display file requirements (format, size)

**Required Documents (typical):**
1. **Passport Copy**
   - First & last page
   - Format: PDF, JPG, PNG
   - Max size: 5MB
   - Mandatory: Yes

2. **Passport Photo**
   - White background
   - Recent (< 6 months)
   - Format: JPG, PNG
   - Max size: 2MB
   - Mandatory: Yes

3. **Flight Tickets**
   - Confirmed or tentative
   - Format: PDF, JPG
   - Max size: 5MB
   - Mandatory: Yes

4. **Hotel Booking**
   - Confirmed reservation
   - Format: PDF, JPG
   - Max size: 5MB
   - Mandatory: Yes

5. **Bank Statement** (Optional)
   - Last 6 months
   - Format: PDF
   - Max size: 10MB
   - Mandatory: No

---

#### Step 3.2: Document Upload Process
**User Actions:**
- For each traveller:
  - Select document type
  - Choose file from device
  - Upload file
  - See upload progress
  - Confirm upload success
- Can preview uploaded documents
- Can delete and re-upload

**System Actions:**
- Validate file type and size
- Generate unique file name
- Upload to Supabase Storage
- Create database record
- Update document status
- Show confirmation

**Upload Flow:**
```typescript
async function uploadDocument(
  applicantId: string,
  documentType: string,
  file: File
): Promise<DocumentUploadResult> {
  
  // 1. Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // 2. Generate unique file path
  const fileName = `${applicantId}_${documentType}_${Date.now()}.${file.extension}`;
  const filePath = `visa-documents/${fileName}`;
  
  // 3. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file);
  
  if (error) throw error;
  
  // 4. Get public URL
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);
  
  // 5. Save to database
  const document = await createVisaDocument({
    visa_applicant_id: applicantId,
    document_type: documentType,
    document_name: file.name,
    file_url: urlData.publicUrl,
    file_size: file.size,
    status: 'UPLOADED',
    uploaded_at: new Date().toISOString()
  });
  
  return {
    success: true,
    documentId: document.id,
    fileUrl: urlData.publicUrl
  };
}
```

**File Validation:**
```typescript
function validateFile(file: File): ValidationResult {
  const maxSizes = {
    'passport': 5 * 1024 * 1024, // 5MB
    'photo': 2 * 1024 * 1024, // 2MB
    'document': 10 * 1024 * 1024 // 10MB
  };
  
  const allowedTypes = {
    'passport': ['application/pdf', 'image/jpeg', 'image/png'],
    'photo': ['image/jpeg', 'image/png'],
    'document': ['application/pdf', 'image/jpeg', 'image/png']
  };
  
  // Check file size
  if (file.size > maxSizes[documentType]) {
    return { valid: false, error: 'File too large' };
  }
  
  // Check file type
  if (!allowedTypes[documentType].includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  return { valid: true };
}
```

**Database Operations:**
```sql
-- Create document record
INSERT INTO visa_documents (
  visa_applicant_id, document_type, document_name,
  file_url, file_size, status, uploaded_at
) VALUES (?, ?, ?, ?, ?, 'UPLOADED', NOW())
RETURNING id;

-- Check upload completion for applicant
SELECT 
  COUNT(*) as total_required,
  SUM(CASE WHEN status IN ('UPLOADED', 'APPROVED') THEN 1 ELSE 0 END) as uploaded_count
FROM visa_required_documents vrd
LEFT JOIN visa_documents vd ON vd.document_type = vrd.document_type
WHERE vrd.visa_type_id = ? 
  AND vrd.is_mandatory = true
  AND vd.visa_applicant_id = ?;
```

---

### Phase 4: Add-ons & Extras (5 minutes)

#### Step 4.1: Optional Services
**Available Add-ons:**

1. **Express Processing**
   - Reduces processing time by 50%
   - Price: ₹2,000 per traveller
   - Applicable: Selected countries only

2. **Document Verification Service**
   - Expert review before submission
   - Price: ₹500 per application
   - Recommended for first-time applicants

3. **Travel Insurance**
   - Comprehensive coverage
   - Price: ₹800 per traveller
   - Covers medical, trip cancellation, lost baggage

4. **Premium WhatsApp Support**
   - Direct WhatsApp line to support
   - Price: ₹300 per application
   - 24/7 availability

**User Actions:**
- Review available add-ons
- Select desired services
- See updated total cost
- Continue to review

**System Actions:**
- Calculate add-on costs
- Apply per-traveller or per-application pricing
- Update grand total
- Store selections

**Pricing Calculation:**
```typescript
function calculateTotalCost(data: ApplicationData): CostBreakdown {
  const baseCost = data.basePrice * data.travellers.length;
  
  let addonsCost = 0;
  
  // Express processing (per traveller)
  if (data.processingType === 'EXPRESS') {
    addonsCost += 2000 * data.travellers.length;
  }
  
  // Document verification (per application)
  if (data.addons.includes('doc-verification')) {
    addonsCost += 500;
  }
  
  // Travel insurance (per traveller)
  if (data.addons.includes('insurance')) {
    addonsCost += 800 * data.travellers.length;
  }
  
  // Premium support (per application)
  if (data.addons.includes('premium-support')) {
    addonsCost += 300;
  }
  
  const subtotal = baseCost + addonsCost;
  const tax = subtotal * 0.18; // 18% GST
  const grandTotal = subtotal + tax;
  
  return {
    basePrice: baseCost,
    addons: addonsCost,
    subtotal,
    tax,
    grandTotal
  };
}
```

---

### Phase 5: Review & Confirmation (5 minutes)

#### Step 5.1: Application Review
**Display Summary:**
- ✅ Selected visa details
- ✅ Traveller information
- ✅ Document upload status
- ✅ Selected add-ons
- ✅ Cost breakdown

**User Actions:**
- Review all information
- Edit any section if needed
- Accept terms and conditions
- Proceed to payment

**System Actions:**
- Final validation of all data
- Check all mandatory documents uploaded
- Verify traveller data completeness
- Calculate final amount
- Generate application preview

**Final Validation Checklist:**
```typescript
interface ValidationChecklist {
  visaSelected: boolean;
  travellersComplete: boolean;
  allDocumentsUploaded: boolean;
  termsAccepted: boolean;
  passportsValid: boolean;
}

function performFinalValidation(data: ApplicationData): ValidationResult {
  const checks: ValidationChecklist = {
    visaSelected: !!data.visaType,
    travellersComplete: data.travellers.every(t => 
      t.fullName && t.passportNumber && t.dateOfBirth
    ),
    allDocumentsUploaded: checkAllMandatoryDocuments(data),
    termsAccepted: data.termsAccepted,
    passportsValid: data.travellers.every(t => 
      isPassportValid(t.passportExpiry, 6)
    )
  };
  
  const allValid = Object.values(checks).every(v => v);
  
  return {
    valid: allValid,
    checks,
    errors: getValidationErrors(checks)
  };
}
```

---

### Phase 6: Payment Processing (2-3 minutes)

#### Step 6.1: Create Order
**Backend Process:**

```typescript
// API Route: /api/visa/create-application
async function createVisaApplication(data: ApplicationData) {
  
  // 1. Start database transaction
  const transaction = await db.beginTransaction();
  
  try {
    // 2. Create visa application record
    const application = await db.visa_applications.create({
      user_id: data.userId,
      visa_type_id: data.visaTypeId,
      application_number: generateApplicationNumber(),
      status: 'DRAFT',
      total_amount: data.costs.subtotal,
      tax_amount: data.costs.tax,
      grand_total: data.costs.grandTotal,
      processing_type: data.processingType,
      estimated_completion_date: calculateCompletionDate(data)
    });
    
    // 3. Create applicant records
    for (const traveller of data.travellers) {
      const applicant = await db.visa_applicants.create({
        visa_application_id: application.id,
        traveller_profile_id: traveller.profileId,
        full_name: traveller.fullName,
        date_of_birth: traveller.dateOfBirth,
        passport_number: traveller.passportNumber,
        nationality: traveller.nationality,
        status: 'DRAFT'
      });
      
      // Link uploaded documents to applicant
      await linkDocumentsToApplicant(applicant.id, traveller.documents);
    }
    
    // 4. Create order for payment
    const order = await db.orders.create({
      user_id: data.userId,
      order_type: 'VISA',
      reference_id: application.id,
      order_number: generateOrderNumber(),
      amount: data.costs.grandTotal,
      currency: 'INR',
      status: 'PENDING'
    });
    
    // 5. Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: data.costs.grandTotal,
      currency: 'INR',
      receipt: order.order_number,
      notes: {
        application_id: application.id,
        application_number: application.application_number,
        visa_type: data.visaType,
        travellers: data.travellers.length.toString()
      }
    });
    
    // 6. Update order with Razorpay ID
    await db.orders.update(order.id, {
      razorpay_order_id: razorpayOrder.id
    });
    
    // 7. Commit transaction
    await transaction.commit();
    
    return {
      success: true,
      applicationId: application.id,
      applicationNumber: application.application_number,
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id
    };
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

---

#### Step 6.2: Razorpay Checkout
**Frontend Process:**

```typescript
// Display Razorpay checkout
async function initiatePayment(orderData: OrderData) {
  
  // 1. Load Razorpay script
  await loadRazorpayScript();
  
  // 2. Display checkout
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.amount * 100, // In paise
    currency: 'INR',
    name: 'Travunited',
    description: `Visa Application - ${orderData.applicationNumber}`,
    order_id: orderData.razorpayOrderId,
    
    // Customer details
    prefill: {
      name: orderData.customerName,
      email: orderData.customerEmail,
      contact: orderData.customerPhone
    },
    
    // Branding
    theme: {
      color: '#2563eb'
    },
    
    // Success handler
    handler: async function(response) {
      await handlePaymentSuccess(response, orderData);
    },
    
    // Modal close handler
    modal: {
      ondismiss: function() {
        handlePaymentCancelled(orderData);
      }
    }
  };
  
  const rzp = new Razorpay(options);
  
  // Payment failure handler
  rzp.on('payment.failed', function(response) {
    handlePaymentFailure(response, orderData);
  });
  
  rzp.open();
}
```

---

#### Step 6.3: Payment Verification
**Backend Process:**

```typescript
// API Route: /api/visa/verify-payment
async function verifyPayment(data: PaymentVerificationData) {
  
  // 1. Verify Razorpay signature
  const isValid = verifyPaymentSignature({
    razorpay_order_id: data.orderId,
    razorpay_payment_id: data.paymentId,
    razorpay_signature: data.signature
  });
  
  if (!isValid) {
    throw new Error('Invalid payment signature');
  }
  
  // 2. Update payment record
  const payment = await db.payments.create({
    order_id: data.orderId,
    razorpay_payment_id: data.paymentId,
    razorpay_signature: data.signature,
    amount: data.amount,
    currency: 'INR',
    status: 'SUCCESS',
    payment_date: new Date()
  });
  
  // 3. Update order status
  await db.orders.update(data.orderId, {
    status: 'SUCCESS'
  });
  
  // 4. Update application status
  const order = await db.orders.findOne(data.orderId);
  await db.visa_applications.update(order.reference_id, {
    status: 'PAYMENT_PENDING' // Will move to DOCS_PENDING after verification
  });
  
  // 5. Create application timeline entry
  await db.application_timeline.create({
    application_id: order.reference_id,
    application_type: 'VISA',
    status: 'PAYMENT_SUCCESSFUL',
    notes: `Payment received. Amount: ₹${data.amount}`,
    created_at: new Date()
  });
  
  // 6. Send confirmation email
  await sendPaymentConfirmationEmail({
    userId: order.user_id,
    applicationId: order.reference_id,
    amount: data.amount,
    paymentId: data.paymentId
  });
  
  // 7. Send SMS confirmation
  await sendPaymentConfirmationSMS({
    userId: order.user_id,
    applicationNumber: application.application_number
  });
  
  return {
    success: true,
    paymentId: payment.id,
    applicationId: order.reference_id
  };
}
```

---

### Phase 7: Post-Payment (Immediate)

#### Step 7.1: Success Page Display
**User Sees:**
- ✅ Success confirmation
- ✅ Application number
- ✅ Payment receipt
- ✅ Next steps
- ✅ Expected timeline
- ✅ Download receipt button
- ✅ View dashboard button

**System Actions:**
- Generate invoice PDF
- Send confirmation email with:
  - Application details
  - Payment receipt
  - Next steps
  - Document checklist
  - Contact information
- Send SMS confirmation
- Update application status to DOCS_PENDING
- Create notification for user

**Email Template:**
```
Subject: Visa Application Submitted - [APPLICATION_NUMBER]

Dear [CUSTOMER_NAME],

Thank you for choosing Travunited! Your visa application has been successfully submitted.

Application Details:
- Application Number: [APPLICATION_NUMBER]
- Destination: [COUNTRY]
- Visa Type: [VISA_TYPE]
- Number of Travellers: [COUNT]
- Amount Paid: ₹[AMOUNT]

Next Steps:
1. Our team will review your documents within 24 hours
2. We'll notify you if any additional documents are needed
3. Once verified, we'll submit to the embassy
4. You'll receive real-time updates via email and SMS

Expected Completion: [DATE]

Track your application: [TRACKING_URL]

Need help? Contact us:
- Email: support@travunited.com
- Phone: +91 123 456 7890
- WhatsApp: [LINK]

Thank you,
Team Travunited
```

---

## 3. Technical Flow

### System Architecture

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Next.js    │
│  Frontend   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  API Routes │
│  (Next.js)  │
└──────┬──────┘
       │
       ├──────→ ┌──────────────┐
       │        │  Supabase    │
       │        │  (Database)  │
       │        └──────────────┘
       │
       ├──────→ ┌──────────────┐
       │        │  Supabase    │
       │        │  (Storage)   │
       │        └──────────────┘
       │
       └──────→ ┌──────────────┐
                │  Razorpay    │
                │  (Payments)  │
                └──────────────┘
```

### API Endpoints

```typescript
// Visa application endpoints
POST   /api/visa/create-application
POST   /api/visa/verify-payment
GET    /api/visa/application/:id
PUT    /api/visa/application/:id
POST   /api/visa/upload-document
DELETE /api/visa/document/:id
GET    /api/visa/countries
GET    /api/visa/types/:countryId
GET    /api/visa/requirements/:visaTypeId

// Payment endpoints
POST   /api/razorpay/create-order
POST   /api/razorpay/verify-payment
POST   /api/razorpay/webhook

// User endpoints
GET    /api/user/applications
GET    /api/user/travellers
POST   /api/user/traveller
```

---

## 4. Database Operations

### Complete Database Flow

```sql
-- 1. Create Application
INSERT INTO visa_applications (...)
RETURNING id, application_number;

-- 2. Create Applicants
INSERT INTO visa_applicants (...)
RETURNING id;

-- 3. Link Documents
UPDATE visa_documents
SET visa_applicant_id = ?
WHERE id IN (?);

-- 4. Create Order
INSERT INTO orders (...)
RETURNING id, order_number;

-- 5. Create Payment
INSERT INTO payments (...)
RETURNING id;

-- 6. Update Application Status
UPDATE visa_applications
SET status = 'PAYMENT_SUCCESSFUL'
WHERE id = ?;

-- 7. Create Timeline Entry
INSERT INTO application_timeline (...)
RETURNING id;

-- 8. Create Notification
INSERT INTO notifications (...)
RETURNING id;
```

---

## 5. Payment Processing

### Payment States

```
PENDING → SUCCESS → CAPTURED
           ↓
        FAILED → RETRY
           ↓
        REFUNDED
```

### Razorpay Webhooks

```typescript
// Handle Razorpay webhooks
async function handleRazorpayWebhook(event: WebhookEvent) {
  
  switch(event.event) {
    
    case 'payment.authorized':
      await handlePaymentAuthorized(event.payload);
      break;
    
    case 'payment.captured':
      await handlePaymentCaptured(event.payload);
      break;
    
    case 'payment.failed':
      await handlePaymentFailed(event.payload);
      break;
    
    case 'refund.processed':
      await handleRefundProcessed(event.payload);
      break;
  }
}
```

---

## 6. Document Management

### Document Lifecycle

```
PENDING → UPLOADED → UNDER_REVIEW → APPROVED
                         ↓
                   REUPLOAD_REQUIRED → UPLOADED
```

### Storage Structure

```
documents/
├── visa-documents/
│   ├── {applicant_id}_passport_{timestamp}.pdf
│   ├── {applicant_id}_photo_{timestamp}.jpg
│   ├── {applicant_id}_flight_{timestamp}.pdf
│   └── {applicant_id}_hotel_{timestamp}.pdf
└── invoices/
    └── {application_number}_invoice_{timestamp}.pdf
```

---

## 7. Status Workflow

### Application Status Flow

```
DRAFT
  ↓
PAYMENT_PENDING
  ↓
DOCS_PENDING
  ↓
UNDER_REVIEW (Admin reviewing)
  ↓
SUBMITTED_TO_EMBASSY
  ↓
IN_PROGRESS (Embassy processing)
  ↓
APPROVED / REJECTED
  ↓
DISPATCHED (if approved)
```

### Status Update Triggers

1. **DRAFT → PAYMENT_PENDING**
   - Trigger: User clicks "Proceed to Payment"
   - Action: Create order, show Razorpay checkout

2. **PAYMENT_PENDING → DOCS_PENDING**
   - Trigger: Payment successful
   - Action: Send confirmation, notify admin

3. **DOCS_PENDING → UNDER_REVIEW**
   - Trigger: All documents uploaded
   - Action: Admin assigned, review begins

4. **UNDER_REVIEW → SUBMITTED_TO_EMBASSY**
   - Trigger: Admin approves, submits to embassy
   - Action: Update status, notify user

5. **SUBMITTED_TO_EMBASSY → IN_PROGRESS**
   - Trigger: Embassy acknowledges receipt
   - Action: Update tracking

6. **IN_PROGRESS → APPROVED/REJECTED**
   - Trigger: Embassy decision received
   - Action: Notify user, update status

7. **APPROVED → DISPATCHED**
   - Trigger: Visa dispatched to user
   - Action: Send tracking, mark complete

---

## 8. Notifications

### Notification Channels

1. **Email Notifications**
   - Application submitted
   - Payment successful
   - Documents received
   - Documents needed
   - Under review
   - Submitted to embassy
   - Approved/Rejected
   - Dispatched

2. **SMS Notifications**
   - Payment confirmation
   - Status changes
   - Action required
   - Visa approved

3. **In-App Notifications**
   - Real-time status updates
   - Messages from admin
   - Document status changes

4. **WhatsApp (Premium)**
   - All above notifications
   - Direct messaging with support

---

## 9. Admin Operations

### Admin Dashboard Actions

1. **Review Application**
   - View all applicant details
   - Check documents
   - Verify information
   - Add internal notes

2. **Document Verification**
   - Review each document
   - Approve or request re-upload
   - Add comments
   - Mark as verified

3. **Status Management**
   - Update application status
   - Add timeline entries
   - Notify user of changes
   - Assign to team members

4. **Embassy Submission**
   - Prepare submission package
   - Submit to embassy
   - Receive acknowledgment
   - Track progress

5. **Communication**
   - Send messages to user
   - Request additional documents
   - Answer queries
   - Provide updates

---

## 10. Edge Cases

### Handling Special Scenarios

#### 1. Payment Failure
**Scenario:** Payment fails during checkout
**Action:**
- Save application as DRAFT
- Allow user to retry payment
- Send reminder after 1 hour
- Auto-cancel after 24 hours if unpaid

#### 2. Incomplete Documents
**Scenario:** User doesn't upload all documents
**Action:**
- Move to DOCS_PENDING status
- Send reminder emails (1 day, 3 days, 7 days)
- Provide easy re-entry to upload
- Don't process until complete

#### 3. Document Rejection
**Scenario:** Admin finds document invalid
**Action:**
- Update document status to REUPLOAD_REQUIRED
- Notify user with reason
- Allow re-upload
- Admin re-reviews

#### 4. Visa Rejection
**Scenario:** Embassy rejects visa
**Action:**
- Update status to REJECTED
- Notify user immediately
- Provide rejection reasons
- Offer re-application assistance
- No refund of govt fees (as per policy)

#### 5. Application Cancellation
**Scenario:** User wants to cancel
**Action:**
- Check current status
- If before embassy submission: Full refund minus processing
- If after submission: No refund (as per policy)
- Update status to CANCELLED
- Process refund if applicable

---

## Summary Checklist

### Before Launch
- [ ] All database tables created
- [ ] Supabase configured
- [ ] Razorpay integrated and tested
- [ ] Email service configured
- [ ] SMS service configured
- [ ] Storage buckets created
- [ ] Admin panel functional
- [ ] Testing completed
- [ ] Documentation ready
- [ ] Support team trained

### Go-Live Checklist
- [ ] Production database migrated
- [ ] Payment gateway in live mode
- [ ] All environment variables set
- [ ] Monitoring enabled
- [ ] Backup systems active
- [ ] Support hotline ready
- [ ] Marketing materials prepared
- [ ] Soft launch to limited users
- [ ] Monitor for issues
- [ ] Full launch

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2024  
**Status**: Ready for Implementation  


