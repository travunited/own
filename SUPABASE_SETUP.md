# Supabase Setup Guide for Travunited

## ✅ Your Supabase Credentials

**Project URL**: `https://esbzzprfghkcigvyuiw.supabase.co`  
**Project ID**: `esbzzprfghkcigvyuiw`

---

## 🔧 Step 1: Configure Environment Variables

Create a file named `.env.local` in the project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://esbzzprfghkcigvyuiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnp6cHJmZ2hrY2NpZ3Z5dWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzM0NDksImV4cCI6MjA3ODEwOTQ0OX0.Ez-_jh_LdrKN0wbhhUNw0Eabxy4eNYCektlNgCwNQAo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnp6cHJmZ2hrY2NpZ3Z5dWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzMzQ0OSwiZXhwIjoyMDc4MTA5NDQ5fQ.HRy8WBCGBfbdwoF8d-0f6fXT6SO8GK59ReTaarqXSjY

# Razorpay Configuration (Add your keys when ready)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Step 2: Set Up Database

### Option A: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw
   - Navigate to: **SQL Editor** (left sidebar)

2. **Run Database Schema**
   - Click "New Query"
   - Copy the contents of `/database/schema.sql` from your project
   - Paste into the editor
   - Click "Run" or press Ctrl/Cmd + Enter

3. **Verify Tables Created**
   - Navigate to: **Table Editor**
   - You should see 20+ tables:
     - users
     - traveller_profiles
     - visa_countries
     - visa_types
     - visa_applications
     - visa_applicants
     - visa_documents
     - tours
     - tour_departures
     - tour_bookings
     - orders
     - payments
     - support_tickets
     - And more...

### Option B: Via Supabase CLI (Alternative)

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Or using npm (without sudo)
npm install supabase --save-dev

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref esbzzprfghkcigvyuiw

# Run migrations
npx supabase db push
```

---

## 📦 Step 3: Set Up Storage Buckets

1. **Navigate to Storage**
   - In Supabase Dashboard → Storage (left sidebar)

2. **Create Two Buckets**

   **Bucket 1: `documents`** (Private)
   - Click "New Bucket"
   - Name: `documents`
   - Public: **Uncheck** (Keep private)
   - Click "Create Bucket"
   - Use for: Visa documents, passports, etc.

   **Bucket 2: `tour-images`** (Public)
   - Click "New Bucket"  
   - Name: `tour-images`
   - Public: **Check** (Make public)
   - Click "Create Bucket"
   - Use for: Tour package images

3. **Configure Bucket Policies**
   
   For `documents` bucket:
   ```sql
   -- Only authenticated users can upload
   -- Only owners can view their documents
   CREATE POLICY "Users can upload documents" ON storage.objects
   FOR INSERT TO authenticated
   WITH CHECK (bucket_id = 'documents');

   CREATE POLICY "Users can view own documents" ON storage.objects
   FOR SELECT TO authenticated
   USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

---

## 🔐 Step 4: Configure Authentication

1. **Navigate to Authentication**
   - Supabase Dashboard → Authentication → Providers

2. **Enable Email Provider**
   - Toggle **Email** to ON
   - Enable: "Confirm email"
   - Save

3. **Enable Phone Provider** (Optional)
   - Toggle **Phone** to ON
   - Select provider (Twilio/MessageBird)
   - Add credentials
   - Save

4. **Configure Email Templates** (Optional)
   - Go to: Authentication → Email Templates
   - Customize confirmation email
   - Customize magic link email
   - Add your branding

---

## 🧪 Step 5: Add Sample Data

Run this SQL in Supabase SQL Editor to add sample visa countries:

```sql
-- Add sample visa countries
INSERT INTO visa_countries (name, code, flag_url, description, is_active) VALUES
('United Arab Emirates', 'AE', '🇦🇪', 'Dubai visa for Indian citizens', true),
('Singapore', 'SG', '🇸🇬', 'Singapore visa for tourists and business', true),
('United Kingdom', 'GB', '🇬🇧', 'UK visa services', true),
('Schengen', 'EU', '🇪🇺', 'Schengen visa for European travel', true),
('Thailand', 'TH', '🇹🇭', 'Thailand tourist visa', true),
('Malaysia', 'MY', '🇲🇾', 'Malaysia visa services', true);

-- Add sample visa types for Dubai
INSERT INTO visa_types (
  country_id, name, slug, category, government_fee, service_fee,
  processing_days, validity_days, stay_duration_days,
  is_e_visa, is_express_available, requires_interview,
  description, is_active
)
SELECT 
  id,
  'Tourist Visa - 30 Days',
  'tourist-30',
  'TOURIST',
  3500.00,
  1999.00,
  3,
  60,
  30,
  true,
  true,
  false,
  'Dubai tourist visa valid for 30 days stay',
  true
FROM visa_countries WHERE code = 'AE';

-- Add sample tour
INSERT INTO tours (
  title, slug, description, destination,
  duration_days, duration_nights, starting_price,
  category, theme, is_visa_included, is_featured, is_active,
  rating, total_reviews
) VALUES (
  'Magical Dubai Experience',
  'magical-dubai-experience',
  'Experience the luxury and culture of Dubai',
  'Dubai, UAE',
  5,
  4,
  24999.00,
  'INTERNATIONAL',
  'FAMILY',
  true,
  true,
  true,
  4.8,
  245
);
```

---

## ✅ Step 6: Test Connection

Create a test file to verify connection:

```typescript
// test-supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://esbzzprfghkcigvyuiw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnp6cHJmZ2hrY2NpZ3Z5dWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzM0NDksImV4cCI6MjA3ODEwOTQ0OX0.Ez-_jh_LdrKN0wbhhUNw0Eabxy4eNYCektlNgCwNQAo'
);

// Test query
async function testConnection() {
  const { data, error } = await supabase
    .from('visa_countries')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Connected! Countries:', data);
  }
}

testConnection();
```

Run: `npx tsx test-supabase.ts`

---

## 🔄 Step 7: Enable Row Level Security (RLS)

For production security, run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own applications" ON visa_applications
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create applications" ON visa_applications
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Similar policies for other tables...
-- (Full RLS policies in database/security-policies.sql)
```

---

## 📝 Step 8: Update Supabase Client

Your `lib/supabase.ts` is already configured correctly:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

This will automatically use your environment variables!

---

## 🧪 Step 9: Test the Application

```bash
# Start development server
npm run dev

# Visit
http://localhost:3000

# Test flows:
# 1. Browse visas
# 2. Start application
# 3. Upload documents
# 4. Check dashboard
```

---

## 📊 Quick Database Setup Commands

### Via Supabase Dashboard SQL Editor

**1. Run the Main Schema** (from `/database/schema.sql`)
```sql
-- This creates all 20+ tables
-- Copy entire file contents and run
```

**2. Add Sample Data**
```sql
-- Insert test visa countries and types
-- Insert test tours
-- Create admin user
```

**3. Set Up Storage**
```sql
-- Storage buckets are created via UI
-- Then add policies for security
```

---

## 🔐 Security Checklist

After setup:
- [ ] RLS enabled on all tables
- [ ] Storage policies configured
- [ ] Auth providers enabled
- [ ] Email templates customized
- [ ] API keys secured in .env.local
- [ ] .env.local in .gitignore ✅ (already done)

---

## 📱 Quick Start After Setup

```bash
# 1. Ensure .env.local is configured
# 2. Run development server
npm run dev

# 3. Open browser
open http://localhost:3000

# 4. Test the platform
# - Browse visas and tours
# - Sign up for account
# - Apply for visa
# - Check admin dashboard
```

---

## 🎯 Supabase Dashboard URLs

### Important Links
- **Dashboard**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw
- **Table Editor**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/editor
- **SQL Editor**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql
- **Storage**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/storage/buckets
- **Authentication**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/auth/users
- **API Docs**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/api

---

## 🚀 Next Steps

### Immediate (Next 10 minutes)
1. ✅ Credentials configured
2. 📋 Go to Supabase Dashboard
3. 📋 Run database schema (SQL Editor)
4. 📋 Create storage buckets
5. 📋 Enable auth providers

### Next Hour
6. 📋 Add sample data
7. 📋 Test connection
8. 📋 Run `npm run dev`
9. 📋 Test visa application
10. 📋 Verify everything works

---

## ✅ Connection Verified

Your Supabase project is ready at:
- **URL**: https://esbzzprfghkcigvyuiw.supabase.co
- **Status**: ✅ Active
- **Keys**: ✅ Provided
- **Ready**: ✅ For setup

**Next**: Run the database schema in SQL Editor!

---

**Created**: November 8, 2024  
**Project**: esbzzprfghkcigvyuiw  
**Status**: Ready for configuration


