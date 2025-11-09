# 🛂 Visa Application System - Complete Plan

## Enterprise-Grade Visa Application Platform

---

## 📋 Overview

A comprehensive visa application system with multi-step forms, real-time tracking, auto-save, and intelligent form features.

---

## 🎯 Core Features

### Phase 1: Country & Visa Selection
1. **Browse Visa Countries**
   - Grid/list view of available countries
   - Search & filter functionality
   - Popular countries section
   - Region-based filtering
   - Sort by price, processing time

2. **Country Detail Pages**
   - SEO-optimized URLs (e.g., /visas/dubai)
   - Country information
   - Available visa types
   - Pricing table
   - Processing times
   - Document requirements
   - FAQs
   - Apply button

3. **Visa Type Selection**
   - Compare visa types
   - Pricing breakdown
   - Processing time options
   - Validity & stay duration
   - Entry types (single/multiple)

---

### Phase 2: Application Creation

#### **Multi-Step Application Form**

**Step 1: Select Visa**
- Country selection
- Visa type selection
- Processing speed (standard/express)
- Pricing display

**Step 2: Primary Applicant**
- Personal information
  - Full name (as per passport)
  - Date of birth
  - Gender
  - Nationality
  - Place of birth
- Contact information
  - Email address
  - Phone number
  - Alternative phone
- Address information
  - Current address
  - City, state, country
  - Postal code

**Step 3: Passport Information**
- Passport number
- Issue date
- Expiry date
- Place of issue
- Passport type
- Passport photo upload

**Step 4: Travel Details**
- Intended travel date
- Expected return date
- Purpose of visit
- Accommodation details
- Previous visits (if any)
- Port of entry

**Step 5: Additional Travelers**
- Add family members/companions
- Same form for each traveler
- Copy details option
- Relationship to primary applicant

**Step 6: Document Upload**
- Required documents checklist
- Drag & drop upload
- Multiple files per requirement
- File type validation
- Size limits
- Preview uploaded files
- Progress indicators

**Step 7: Add-ons & Services**
- Travel insurance
- Priority processing
- SMS updates
- Document courier
- Visa appointment booking
- Translation services

**Step 8: Review & Payment**
- Application summary
- All details review
- Edit any section
- Pricing breakdown
- Terms & conditions
- Payment method selection
- Razorpay integration
- Submit button

**Step 9: Confirmation**
- Application number
- Payment confirmation
- What's next information
- Email confirmation
- Track application link
- Download receipt

---

### Phase 3: Smart Form Features

#### **Auto-Save System**
```
Features:
- Save every 5 seconds
- "Saving..." indicator
- "Last saved at HH:MM" timestamp
- Save on field blur
- Resume from last saved state
- Draft applications list
```

#### **Inline Validation**
```
Features:
- Real-time field validation
- Success/error indicators
- Helpful error messages
- Format suggestions
- Character counters
- Valid/invalid states
```

#### **Real-Time Summary Sidebar**
```
Shows:
- Selected visa type
- Number of travelers
- Government fees
- Service fees
- Add-on costs
- Total amount
- Completion percentage
- Progress indicator
- Estimated processing time
```

#### **Skeleton Loading States**
```
For:
- Country list loading
- Visa types loading
- Application data loading
- Document requirements loading
- Payment initialization
```

#### **Document Requirements Card**
```
Shows:
- Required documents list
- Upload status for each
- File format accepted
- Size limits
- Sample documents
- Upload progress
- Checklist completion
```

---

### Phase 4: Application Tracking

#### **Dashboard View**
```
Shows:
- All applications
- Status badges
- Quick actions
- Filter by status
- Search by application number
- Date range filter
```

#### **Application Detail View**
```
Shows:
- Application timeline
- Current status
- Next steps
- Document status
- Payment status
- Estimated completion
- Download options
- Communication history
```

#### **Status Updates**
```
Statuses:
- Draft (not submitted)
- Submitted
- Under Review
- Documents Requested
- Documents Verified
- In Processing
- Approved
- Rejected
- Visa Issued
- Delivered
- Completed
```

#### **Progress Indicators**
```
Visual:
- Timeline view
- Progress bar
- Step indicators
- Status icons
- Color coding
- Percentage complete
```

#### **Notifications**
```
Channels:
- In-app notifications
- Email notifications
- SMS updates (optional)
- Push notifications (future)

Events:
- Application submitted
- Documents received
- Status changes
- Action required
- Approval/rejection
- Visa ready
```

---

## 🗄️ Database Schema

### Extended Tables

#### `visa_applications`
```sql
CREATE TABLE visa_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  visa_type_id UUID REFERENCES visa_types(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft',
  completion_percentage INTEGER DEFAULT 0,
  
  -- Pricing
  government_fee DECIMAL(10,2),
  service_fee DECIMAL(10,2),
  addon_fees DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  
  -- Traveler Info
  primary_traveler_id UUID REFERENCES visa_travelers(id),
  total_travelers INTEGER DEFAULT 1,
  
  -- Processing
  processing_speed VARCHAR(20) DEFAULT 'standard',
  estimated_completion_date DATE,
  actual_completion_date DATE,
  
  -- Metadata
  is_draft BOOLEAN DEFAULT true,
  last_saved_at TIMESTAMP,
  submitted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `visa_travelers`
```sql
CREATE TABLE visa_travelers (
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
  
  -- Travel Details
  intended_travel_date DATE,
  expected_return_date DATE,
  purpose_of_visit TEXT,
  accommodation_details TEXT,
  previous_visits INTEGER DEFAULT 0,
  port_of_entry VARCHAR(100),
  
  -- Relationship (for additional travelers)
  is_primary BOOLEAN DEFAULT false,
  relationship_to_primary VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `visa_application_documents`
```sql
CREATE TABLE visa_application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  traveler_id UUID REFERENCES visa_travelers(id),
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
  
  -- Metadata
  uploaded_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES auth.users(id)
);
```

#### `visa_application_addons`
```sql
CREATE TABLE visa_application_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES visa_applications(id) ON DELETE CASCADE,
  
  addon_type VARCHAR(100) NOT NULL,
  addon_name VARCHAR(255) NOT NULL,
  addon_price DECIMAL(10,2) NOT NULL,
  addon_details JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `visa_application_timeline`
```sql
CREATE TABLE visa_application_timeline (
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
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `visa_application_auto_saves`
```sql
CREATE TABLE visa_application_auto_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  application_id UUID REFERENCES visa_applications(id),
  
  step_number INTEGER NOT NULL,
  form_data JSONB NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(application_id, step_number)
);
```

---

## 🎨 UI Components

### Pages
```
/visas                          - Browse all countries
/visas/[country-slug]           - Country detail page
/visa-apply                     - Multi-step application
/visa-apply/draft/[id]          - Resume draft
/visa-apply/success             - Application submitted
/dashboard/applications         - All applications
/dashboard/applications/[id]    - Application detail
/dashboard/applications/track   - Track by number
```

### Components
```
components/visa/
├── CountryCard.tsx              - Country display card
├── VisaTypeCard.tsx             - Visa type display
├── ApplicationStepper.tsx       - Progress stepper
├── AutoSaveIndicator.tsx        - "Saving..." indicator
├── SummarySidebar.tsx           - Real-time summary
├── DocumentUploader.tsx         - File upload component
├── DocumentChecklist.tsx        - Upload checklist
├── ApplicationTimeline.tsx      - Status timeline
├── StatusBadge.tsx              - Status indicator
├── SkeletonLoader.tsx           - Loading states
└── TravelerForm.tsx             - Traveler info form
```

---

## 🔄 User Flows

### **New Application Flow**
```
1. User browses /visas
2. Clicks on country card
3. Views country detail page
4. Selects visa type
5. Clicks "Apply Now"
6. Redirected to /visa-apply?visa_type_id=xxx
7. Completes 9-step form
   - Auto-save active throughout
   - Can save and resume later
   - Summary sidebar updates live
8. Reviews application
9. Proceeds to payment
10. Completes payment
11. Sees confirmation
12. Receives email
13. Can track application
```

### **Resume Draft Flow**
```
1. User logs in
2. Sees draft applications in dashboard
3. Clicks "Resume"
4. Redirected to /visa-apply/draft/[id]
5. Form loads with saved data
6. Continues from last step
7. Completes application
```

### **Track Application Flow**
```
1. User goes to /dashboard/applications
2. Sees list of applications
3. Clicks on application
4. Views detailed status
5. Sees timeline of events
6. Checks document status
7. Downloads visa (if issued)
```

---

## 📊 API Endpoints

### Visa Browsing
```
GET    /api/visas/countries          - List all countries
GET    /api/visas/countries/[slug]   - Country details
GET    /api/visas/types               - List visa types
GET    /api/visas/types/[id]          - Visa type details
```

### Application Management
```
POST   /api/visa-applications         - Create new application
GET    /api/visa-applications         - List user applications
GET    /api/visa-applications/[id]    - Get application details
PATCH  /api/visa-applications/[id]    - Update application
DELETE /api/visa-applications/[id]    - Delete draft

POST   /api/visa-applications/[id]/submit    - Submit application
POST   /api/visa-applications/[id]/travelers - Add traveler
PATCH  /api/visa-applications/[id]/travelers/[tid] - Update traveler
```

### Auto-Save
```
POST   /api/visa-applications/[id]/auto-save  - Save form data
GET    /api/visa-applications/[id]/auto-save/[step] - Get saved data
```

### Documents
```
POST   /api/visa-applications/[id]/documents  - Upload document
GET    /api/visa-applications/[id]/documents  - List documents
DELETE /api/visa-applications/[id]/documents/[docId] - Delete document
```

### Timeline
```
GET    /api/visa-applications/[id]/timeline   - Get application timeline
POST   /api/visa-applications/[id]/timeline   - Add timeline event (admin)
```

### Tracking
```
GET    /api/visa-applications/track/[number]  - Track by application number
```

---

## ✨ Smart Features Implementation

### Auto-Save
```typescript
// Auto-save every 5 seconds
useEffect(() => {
  const timer = setInterval(() => {
    if (hasUnsavedChanges) {
      saveFormData();
    }
  }, 5000);
  
  return () => clearInterval(timer);
}, [hasUnsavedChanges]);

// Also save on field blur
const handleBlur = () => {
  saveFormData();
};
```

### Real-Time Validation
```typescript
const validateField = (field: string, value: any) => {
  const errors: Record<string, string> = {};
  
  switch(field) {
    case 'email':
      if (!isValidEmail(value)) {
        errors.email = 'Please enter a valid email';
      }
      break;
    case 'passport_number':
      if (!/^[A-Z0-9]{6,9}$/.test(value)) {
        errors.passport_number = 'Invalid passport format';
      }
      break;
    // ... more validations
  }
  
  return errors;
};
```

### Summary Sidebar Logic
```typescript
const calculateSummary = () => {
  const governmentFee = visaType.government_fee * travelers.length;
  const serviceFee = visaType.service_fee * travelers.length;
  const addonFees = addons.reduce((sum, addon) => sum + addon.price, 0);
  
  return {
    governmentFee,
    serviceFee,
    addonFees,
    total: governmentFee + serviceFee + addonFees,
    completionPercentage: calculateCompletion()
  };
};
```

---

## 🎯 Success Metrics

### Performance
- ✅ Form auto-save < 500ms
- ✅ Page load < 2s
- ✅ Document upload progress indicator
- ✅ Skeleton states for all async operations

### User Experience
- ✅ Zero data loss (auto-save)
- ✅ Clear progress indication
- ✅ Inline validation feedback
- ✅ Mobile-responsive design
- ✅ Accessibility compliant

### Business
- ✅ Increased completion rate
- ✅ Reduced support queries
- ✅ Higher customer satisfaction
- ✅ Lower abandonment rate

---

**Ready to build the most advanced visa application system!** 🚀


