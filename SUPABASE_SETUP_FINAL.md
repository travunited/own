# 🎯 Supabase Setup - Final Guide

## The Easiest Way to Set Up Your Database

---

## ✅ **SUPABASE CLI INSTALLED SUCCESSFULLY!**

Version: 2.54.11  
Location: node_modules (local to project)  
Usage: `npx supabase` or `npm run supabase`

---

## 🚀 TWO WAYS TO SETUP DATABASE

### **METHOD 1: Manual (RECOMMENDED - 5 minutes)**

This is the most reliable method:

#### Step 1: Go to Supabase SQL Editor
```
https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql
```

#### Step 2: Run Each SQL File in Order

**File 1: Main Schema**
```bash
# Open: database/schema.sql
# Copy ALL contents
# Paste in SQL Editor
# Click "Run" (or Cmd/Ctrl + Enter)
# Wait for success message
```

**File 2: Auth Schema**
```bash
# Open: database/auth-schema.sql
# Copy ALL contents
# Paste in new query
# Click "Run"
# Wait for success
```

**File 3: Visa Applications Schema**
```bash
# Open: database/visa-applications-schema.sql
# Copy ALL contents
# Paste in new query
# Click "Run"
# Wait for success
```

**File 4: Visa Pages CMS Schema**
```bash
# Open: database/visa-pages-schema.sql
# Copy ALL contents
# Paste in new query
# Click "Run"
# Wait for success
```

**File 5: Sample Data (Optional)**
```bash
# Open: database/sample-data.sql
# Copy ALL contents
# Paste in new query
# Click "Run"
# See "Sample data inserted successfully!"
```

#### Step 3: Create Storage Buckets
```
Go to: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/storage/buckets

Bucket 1:
- Name: documents
- Public: NO (Private)
- Click "Create"

Bucket 2:
- Name: tour-images
- Public: YES (Public)
- Click "Create"
```

#### Step 4: Verify Setup
```
Go to: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/editor

Check tables exist:
✓ visa_countries
✓ visa_types
✓ user_profiles
✓ user_mfa
✓ visa_applications
✓ visa_page_content
✓ ... (29 total tables)
```

---

### **METHOD 2: Using CLI (Alternative)**

If you prefer command line:

#### Step 1: Login to Supabase
```bash
npx supabase login
```

#### Step 2: Try Migration Script
```bash
npm run migrate
```

**Note:** This might require additional setup. Manual method (Method 1) is more reliable.

---

## 🎯 AFTER DATABASE SETUP

### Test Your Platform

**1. Start Dev Server:**
```bash
npm run dev
```

**2. Visit Homepage:**
```
http://localhost:3000
```

**3. Test Features:**
- ✅ Sign up with new account
- ✅ Enable 2FA
- ✅ Browse visa countries
- ✅ Start visa application
- ✅ Upload documents
- ✅ View dashboard

---

## 📊 WHAT YOU'LL HAVE

### Database (29 Tables)
```
Core Platform:
✓ 6 tables (countries, types, tours, blog)

Authentication:
✓ 6 tables (profiles, MFA, devices, sessions)

Visa Applications:
✓ 7 tables (applications, travelers, documents)

Visa CMS:
✓ 10 tables (page content, FAQs, reviews, partners)
```

### Storage (2 Buckets)
```
documents: For visa documents (private)
tour-images: For tour photos (public)
```

### Sample Data (Optional)
```
✓ 9 visa countries
✓ 3 visa types (Dubai, Singapore, UK)
✓ 5 tour packages
✓ 2 blog posts
✓ Document requirements
✓ Tour departures
```

---

## 🔧 HELPFUL COMMANDS

### Database
```bash
# Generate TypeScript types from database
npm run supabase:types

# Check Supabase status
npx supabase status

# View Supabase help
npx supabase help
```

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🎯 YOUR SUPABASE PROJECT

```
Project ID: esbzzprfghkcigvyuiw
URL: https://esbzzprfghkcigvyuiw.supabase.co

Dashboard: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw
SQL Editor: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql
Table Editor: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/editor
Storage: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/storage

Status: ✅ Connected
Credentials: ✅ Configured in .env.local
```

---

## 🎉 YOU'RE READY!

**Supabase CLI:** ✅ Installed (v2.54.11)  
**Project:** ✅ Initialized  
**Scripts:** ✅ Added to package.json  
**Guide:** ✅ Complete  

**Next Step:**  
👉 **Run the database schemas** using Method 1 (Manual - 5 minutes)  
👉 **Then start your server:** `npm run dev`  
👉 **Visit:** http://localhost:3000  

**Your platform will be fully operational!** 🚀

---

*Last Updated: November 9, 2024*


