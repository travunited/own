# 🚀 Supabase CLI Setup & Usage Guide

## Complete Guide to Using Supabase CLI with Travunited

---

## 📋 Installation Options

### Option 1: NPM (Local to Project) - RECOMMENDED
```bash
# Install as dev dependency (no permission issues)
cd /Users/jnaneshshetty/Desktop/Travunited
npm install -D supabase
```

### Option 2: Homebrew (Mac)
```bash
# Install via Homebrew
brew install supabase/tap/supabase
```

### Option 3: NPX (No Install)
```bash
# Use directly without installing
npx supabase <command>
```

### Option 4: Direct Download
```bash
# Download binary directly
curl -L https://github.com/supabase/cli/releases/latest/download/supabase_darwin_arm64.tar.gz -o supabase.tar.gz
tar -xzf supabase.tar.gz
sudo mv supabase /usr/local/bin/
```

---

## 🔧 Initial Setup

### 1. Login to Supabase
```bash
npx supabase login
```

This will open a browser for authentication.

### 2. Link Your Project
```bash
npx supabase link --project-ref esbzzprfghkcigvyuiw
```

When prompted for database password, use your Supabase project password.

### 3. Verify Connection
```bash
npx supabase status
```

---

## 📊 Common Commands

### Database Management

**Run Migrations:**
```bash
# Run a SQL file
npx supabase db push --db-url "postgresql://postgres:YOUR_PASSWORD@db.esbzzprfghkcigvyuiw.supabase.co:5432/postgres"

# Or execute SQL directly
npx supabase db execute --file database/schema.sql
```

**Generate Types:**
```bash
# Generate TypeScript types from your database
npx supabase gen types typescript --project-id esbzzprfghkcigvyuiw > types/supabase.ts
```

**Database Diff:**
```bash
# See what's different
npx supabase db diff
```

**Reset Database:**
```bash
# Reset to clean state (USE WITH CAUTION)
npx supabase db reset
```

### Storage Management

**List Buckets:**
```bash
npx supabase storage list
```

**Create Bucket:**
```bash
npx supabase storage create documents --public false
npx supabase storage create tour-images --public true
```

### Functions

**List Functions:**
```bash
npx supabase functions list
```

**Deploy Function:**
```bash
npx supabase functions deploy function-name
```

---

## 🎯 Setup for Travunited

### Step 1: Install CLI (Recommended Method)
```bash
cd /Users/jnaneshshetty/Desktop/Travunited
npm install -D supabase
```

### Step 2: Initialize Project
```bash
npx supabase init
```

### Step 3: Link to Remote Project
```bash
npx supabase link --project-ref esbzzprfghkcigvyuiw
```

### Step 4: Create All Database Tables
```bash
# Run all schemas in order
npx supabase db execute --file database/schema.sql
npx supabase db execute --file database/auth-schema.sql
npx supabase db execute --file database/visa-applications-schema.sql
npx supabase db execute --file database/visa-pages-schema.sql

# Optional: sample data
npx supabase db execute --file database/sample-data.sql
```

### Step 5: Create Storage Buckets
```bash
npx supabase storage create documents --public false
npx supabase storage create tour-images --public true
```

### Step 6: Generate Types
```bash
npx supabase gen types typescript --project-id esbzzprfghkcigvyuiw > types/database.ts
```

---

## 📝 Useful Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "supabase:login": "supabase login",
    "supabase:link": "supabase link --project-ref esbzzprfghkcigvyuiw",
    "supabase:status": "supabase status",
    "supabase:types": "supabase gen types typescript --project-id esbzzprfghkcigvyuiw > types/database.ts",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset",
    "db:schema": "supabase db execute --file database/schema.sql",
    "db:auth": "supabase db execute --file database/auth-schema.sql",
    "db:visa-apps": "supabase db execute --file database/visa-applications-schema.sql",
    "db:visa-pages": "supabase db execute --file database/visa-pages-schema.sql",
    "db:sample": "supabase db execute --file database/sample-data.sql",
    "db:all": "npm run db:schema && npm run db:auth && npm run db:visa-apps && npm run db:visa-pages && npm run db:sample"
  }
}
```

Then you can run:
```bash
npm run db:all
```

---

## 🔍 Troubleshooting

### Issue: Permission Denied
**Solution:** Use npx instead of global install, or use Homebrew

### Issue: Cannot connect to project
**Solution:**
1. Check your project ref: `esbzzprfghkcigvyuiw`
2. Ensure you're logged in: `npx supabase login`
3. Try manual link with password

### Issue: Database password required
**Solution:** 
- Find password in Supabase Dashboard → Settings → Database
- Or use service_role key

### Issue: Command not found
**Solution:** 
- Use `npx supabase` instead of just `supabase`
- Or install globally with `sudo npm install -g supabase`

---

## 📚 Quick Reference

### Your Project Details
```
Project ID: esbzzprfghkcigvyuiw
Project URL: https://esbzzprfghkcigvyuiw.supabase.co
Region: (your region)

Database:
Host: db.esbzzprfghkcigvyuiw.supabase.co
Port: 5432
Database: postgres
User: postgres
```

### Your API Keys (Already Configured)
```
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 What to Do Now

### Immediate Action:
```bash
# 1. Install CLI locally
npm install -D supabase

# 2. Run all database schemas
npm run db:all
# OR manually via Supabase Dashboard SQL Editor

# 3. Create storage buckets
npx supabase storage create documents --public false
npx supabase storage create tour-images --public true

# 4. Generate TypeScript types
npm run supabase:types

# 5. Start dev server
npm run dev
```

---

**Your Supabase CLI is now ready to use!** 🎉


