# 🛂 Visa Details Page - Admin-Modifiable System

## Inspired by Atlys - Built Better for Travunited

---

## 🎯 Vision

Create a comprehensive, admin-modifiable visa details page that combines:
- Atlys-level clarity and trust
- Complete admin control over all content
- Dynamic pricing and guarantees
- Real-time availability
- SEO optimization

---

## 📋 Page Sections (All Admin-Modifiable)

### 1. Hero Section
**Admin Can Modify:**
- Background image/banner
- Destination name
- Visa type title
- Guarantee badge ("Visa guaranteed in X days")
- Primary CTA button text
- Hero overlay color/gradient

**Example:**
```
Background: Dubai skyline image
Title: "Dubai (UAE) Visa for Indians"
Badge: "Visa guaranteed in 2 days"
Button: "Check Required Documents"
```

---

### 2. Authorization Banner
**Admin Can Modify:**
- Banner text
- Government entity name
- Badge icon
- Background color
- Show/hide toggle

**Example:**
```
"Atlys is authorized by the Government of Dubai"
Icon: Shield with checkmark
Color: Purple/Blue gradient
```

---

### 3. Trust Indicators
**Admin Can Modify:**
- Rating score (4.7, 4.9, etc.)
- Number of customers ("1.25L Indians")
- Testimonial categories (moms, newlyweds, planners)
- Icons for each category
- Show/hide individual indicators

**Example:**
```
Rating: 4.7
Loved by: "1.25L Indians"
Categories:
- Moms (heart icon)
- Newlyweds (rings icon)
- Last-minute planners (clock icon)
```

---

### 4. Visa Information Grid
**Admin Can Modify:**
- Each field (Visa Type, Stay Duration, Validity, Entry, Method)
- Icons for each field
- Values for each field
- Order of fields
- Add/remove fields
- Color scheme

**Example:**
```
Visa Type: E-Visa (smartphone icon)
Length of Stay: 30 days (calendar icon)
Validity: 60 days (clock icon)
Entry: Single (square icon)
Method: Paperless (document icon)
```

---

### 5. Processing Timeline Options
**Admin Can Modify:**
- Number of options (Standard, Express, Super Express)
- Processing days for each
- Delivery dates (auto-calculated or manual)
- Pricing for each option
- Guarantee text
- Timeline view (show/hide)
- Selection logic

**Example:**
```
Option 1: Get visa in 2 days
  - Delivery: 11 Nov 2025 at 06:31 PM
  - View Timeline (expandable)
  - Selected by default

Option 2: Get visa in 4 days
  - Delivery: 13 Nov 2025 at 11:31 AM
  - View Timeline (expandable)
  - Select button
```

---

### 6. Partners Section
**Admin Can Modify:**
- Partner logos
- Partner names
- Partner descriptions
- Order of partners
- Add/remove partners
- Section visibility

**Example:**
```
Partners:
- UAE Ministry of Foreign Affairs (logo + text)
- Government of Dubai (logo + text)
- IATA (logo)
```

---

### 7. Process Steps (How It Works)
**Admin Can Modify:**
- Number of steps
- Step titles
- Step descriptions
- Icons for each step
- Sub-steps/timeline events
- Order of steps
- Conditional outcomes (approved, delayed, rejected)

**Example:**
```
Step 1: Apply on Atlys
  Description: "Submit your documents - only pay government fee"

Step 2: Documents Verified
  Description: "Atlys verifies and submits to Immigration"
  Timeline Events:
  - Application sent to supervisor (8 Jan, 5:45 AM) [ON TIME]
  - Sent to internal intelligence (8 Jan, 5:45 AM) [ON TIME]

Step 3: Visa Gets Processed
  Description: "We work with Immigration for on-time delivery"

Step 4: Get Your Visa
  Scenarios:
  - Approved on time → Pay Atlys Fee
  - Approved late → Atlys Fee Waived
  - Rejected → Government Fee Refunded
```

---

### 8. FAQs Section
**Admin Can Modify:**
- FAQ categories
- Questions and answers
- Search functionality (enable/disable)
- Smart AI assistant text
- Category icons
- Order of categories
- Expandable sections
- Add/remove FAQs

**Example:**
```
Categories:
- General Information
- Eligibility & Requirements
- Application Process
- Entry & Exit Regulations
- Status Tracking
- Refunds & Rejections
- Visa Extension
- Child Application

Each category has multiple Q&A pairs
```

---

### 9. Reviews Section
**Admin Can Modify:**
- Overall rating
- Total review count
- Common keywords
- Individual reviews (approve/reject)
- Sort options
- Filter options
- Featured reviews
- Review display format

**Example:**
```
Rating: 4.86/5 (Outstanding)
Total: 821 Reviews
Keywords: Quick Decision, Easy Application, Customer Support
Filters: Most Recent, Type, Group Size
```

---

### 10. Requirements Section
**Admin Can Modify:**
- Required documents list
- Document icons
- Document descriptions
- Sample document links
- Order of documents
- Mandatory vs optional tags

**Example:**
```
Documents:
- Passport (mandatory)
- Photograph (mandatory)
- Flight booking (optional)
- Hotel booking (optional)
```

---

### 11. Sticky Sidebar (Pricing & CTA)
**Admin Can Modify:**
- Date selectors (availability)
- Processing time guarantee
- Government fee
- Service fee (Atlys fee)
- Promotional pricing
- Payment terms text
- CTA button text & color
- Protection plan details
- Protection plan pricing

**Example:**
```
Processing: 2 days
Government Fee: ₹6,750
Service Fee: ₹1,000 → ₹0 (promotion)
Payment: "No advance payment"
Protection: AtlysProtect (Free)
  - Delayed: No fee
  - Rejected: 100% refund
Button: "Start Application"
```

---

## 🗄️ Database Schema for Admin Control

### `visa_page_content` (Main content table)
```sql
CREATE TABLE visa_page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id),
  
  -- Hero Section
  hero_image_url TEXT,
  hero_title VARCHAR(255),
  hero_subtitle TEXT,
  guarantee_badge_text VARCHAR(100),
  guarantee_badge_days INTEGER,
  primary_cta_text VARCHAR(100),
  
  -- Authorization Banner
  auth_banner_text TEXT,
  auth_banner_show BOOLEAN DEFAULT true,
  
  -- Trust Indicators
  trust_rating DECIMAL(2,1),
  trust_customers_count VARCHAR(50),
  trust_testimonial_text TEXT,
  
  -- Meta
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `visa_info_fields` (Grid information)
```sql
CREATE TABLE visa_info_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_page_id UUID REFERENCES visa_page_content(id),
  
  field_name VARCHAR(100) NOT NULL,
  field_value TEXT NOT NULL,
  field_icon VARCHAR(50),
  field_color VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  
  is_visible BOOLEAN DEFAULT true
);
```

### `visa_processing_options` (Timeline options)
```sql
CREATE TABLE visa_processing_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id),
  
  option_name VARCHAR(100) NOT NULL,
  processing_days INTEGER NOT NULL,
  additional_fee DECIMAL(10,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true
);
```

### `visa_partners` (Partner logos)
```sql
CREATE TABLE visa_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_page_id UUID REFERENCES visa_page_content(id),
  
  partner_name VARCHAR(255) NOT NULL,
  partner_logo_url TEXT,
  partner_description TEXT,
  display_order INTEGER DEFAULT 0,
  
  is_visible BOOLEAN DEFAULT true
);
```

### `visa_process_steps` (How it works)
```sql
CREATE TABLE visa_process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_page_id UUID REFERENCES visa_page_content(id),
  
  step_number INTEGER NOT NULL,
  step_title VARCHAR(255) NOT NULL,
  step_description TEXT,
  step_icon VARCHAR(50),
  
  -- Timeline events (sub-steps)
  timeline_events JSONB,
  
  display_order INTEGER DEFAULT 0
);
```

### `visa_faqs` (FAQ content)
```sql
CREATE TABLE visa_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id),
  
  category VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `visa_reviews` (User reviews)
```sql
CREATE TABLE visa_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id),
  user_id UUID REFERENCES auth.users(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT NOT NULL,
  
  traveler_name VARCHAR(255),
  traveler_location VARCHAR(255),
  travel_type VARCHAR(50), -- solo, couple, family, group
  traveler_tag VARCHAR(50), -- first-time, occasional, frequent
  
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  admin_response TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `visa_protection_plans` (AtlysProtect equivalent)
```sql
CREATE TABLE visa_protection_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id UUID REFERENCES visa_types(id),
  
  plan_name VARCHAR(100) NOT NULL,
  plan_description TEXT,
  plan_price DECIMAL(10,2) DEFAULT 0,
  
  -- Benefits
  delayed_benefit TEXT,
  rejected_benefit TEXT,
  other_benefits JSONB,
  
  is_free BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);
```

---

## 🎨 Admin Interface Sections

### Visa Page Editor (`/admin/visas/pages/[id]`)

**Tabs:**
1. **Hero & Basic Info**
   - Upload hero image
   - Edit title & subtitle
   - Set guarantee badge
   - Configure authorization banner

2. **Visa Information**
   - Edit visa type, duration, validity
   - Add/remove info fields
   - Reorder fields
   - Set icons & colors

3. **Processing Options**
   - Add processing speeds
   - Set pricing for each
   - Define delivery times
   - Set default option

4. **Partners**
   - Upload partner logos
   - Add partner names
   - Add descriptions
   - Reorder partners

5. **Process Steps**
   - Add/edit/remove steps
   - Define timeline events
   - Set icons
   - Configure outcomes

6. **FAQs**
   - Organize by categories
   - Add/edit/remove questions
   - Rich text answers
   - Reorder FAQs

7. **Reviews**
   - Approve/reject reviews
   - Feature reviews
   - Respond to reviews
   - Set common keywords
   - Configure filters

8. **Protection Plan**
   - Enable/disable
   - Set pricing
   - Define benefits
   - Configure conditions

9. **Sidebar Configuration**
   - Set availability dates
   - Configure pricing display
   - Edit payment terms
   - Customize CTA button

10. **SEO & Meta**
    - Page title
    - Meta description
    - Keywords
    - Open Graph tags

---

## 🎯 Key Features to Build

### User-Facing
✅ Dynamic visa detail pages  
✅ Real-time pricing calculation  
✅ Multiple processing options  
✅ Interactive FAQ accordion  
✅ Review display with filters  
✅ Sticky sidebar with pricing  
✅ Responsive design  
✅ SEO-optimized  

### Admin-Facing
✅ Visual page editor  
✅ Drag-and-drop reordering  
✅ Image upload  
✅ Rich text editor for descriptions  
✅ Live preview  
✅ Version history  
✅ Bulk editing  
✅ Template system  

---

**Ready to build the complete admin-modifiable visa details system!** 🚀


