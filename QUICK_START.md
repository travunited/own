# 🚀 Travunited - Quick Start Guide

## ✅ Current Status: READY TO RUN

Everything is set up and ready! Follow these simple steps to get your platform running.

---

## 📋 What's Already Done

- ✅ Complete platform built (38 pages)
- ✅ Pushed to GitHub (https://github.com/travunited/own.git)
- ✅ Supabase credentials configured
- ✅ Environment setup script created
- ✅ Database schema ready
- ✅ Sample data SQL prepared
- ✅ Documentation complete

**You're 90% there! Just need to run the database setup.**

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Database Setup (2 minutes)

1. **Go to Supabase SQL Editor**
   - URL: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql
   - Click "New Query"

2. **Run Main Schema**
   - Open file: `/database/schema.sql` in your project
   - Copy ALL contents
   - Paste in Supabase SQL Editor
   - Click "Run" (or Ctrl/Cmd + Enter)
   - Wait for "Success" message

3. **Run Sample Data**
   - Open file: `/database/sample-data.sql`
   - Copy ALL contents
   - Paste in new query
   - Click "Run"
   - See "Sample data inserted successfully!"

### Step 2: Create Storage Buckets (1 minute)

1. **Go to Storage**
   - URL: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/storage/buckets

2. **Create `documents` bucket**
   - Click "New Bucket"
   - Name: `documents`
   - Public: **Uncheck** (Private)
   - Click "Create"

3. **Create `tour-images` bucket**
   - Click "New Bucket"
   - Name: `tour-images`
   - Public: **Check** (Public)
   - Click "Create"

### Step 3: Run the Application (30 seconds)

```bash
# In your terminal
cd /Users/jnaneshshetty/Desktop/Travunited
npm run dev
```

### Step 4: Open Browser

Visit: **http://localhost:3000**

---

## 🎉 That's It!

Your Travunited platform is now running with:
- ✅ Database connected
- ✅ Sample data loaded
- ✅ Storage configured
- ✅ All features working

---

## 🧪 Test the Platform

### Test User Flow
1. **Visit Homepage**: http://localhost:3000
2. **Browse Visas**: Click "Visas" → See Dubai, Singapore, UK, etc.
3. **View Details**: Click any country → See visa types
4. **Apply for Visa**: Click "Apply Now" → Complete 6-step flow
5. **Check Dashboard**: http://localhost:3000/dashboard

### Test Admin Flow
1. **Visit Admin**: http://localhost:3000/admin
2. **View Applications**: Click "Visa Management"
3. **Check Tours**: Click "Tour Management"
4. **Try CMS**: Click "Content" → See blog posts

### Test Blog
1. **Visit Blog**: http://localhost:3000/blog
2. **Read Article**: Click any post
3. **Browse Categories**: Filter by category

---

## 🎨 What You'll See

### Homepage
- Search cards for Visa & Tours
- Top destinations
- Featured tour packages
- Trust indicators
- How it works
- Testimonials

### Visa Page
- 9 countries listed
- Filter and search
- Visa types with pricing
- Processing times
- E-visa badges

### Tours Page
- 5 tour packages
- Dubai, Maldives, Switzerland, Kashmir, Goa
- Prices, ratings, availability
- Filter by destination/theme

### Dashboard
- Your visa applications
- Tour bookings
- Travellers vault
- Payment history

### Admin Dashboard
- KPI overview
- Application queue
- Document review
- Payment monitoring
- Blog CMS

---

## 🔐 Your Supabase Connection

### Details
- **Project**: esbzzprfghkcigvyuiw
- **URL**: https://esbzzprfghkcigvyuiw.supabase.co
- **Status**: ✅ Connected
- **Environment**: ✅ Configured

### What's Connected
```
Travunited App
    ↓
Next.js API Routes
    ↓
Supabase Client
    ↓
PostgreSQL Database
    ├─ 20+ tables
    ├─ Sample data
    └─ Ready for use
```

---

## 📊 Sample Data Included

### Visa Countries (9)
- Dubai (UAE) - 2 visa types
- Singapore - 1 visa type
- UK - 1 visa type
- Schengen, Thailand, Malaysia, USA, Australia, Canada

### Tours (5)
- Magical Dubai (₹24,999)
- Romantic Maldives (₹45,999)
- Swiss Splendor (₹89,999)
- Incredible Kashmir (₹18,999)
- Goa Beach Paradise (₹12,999)

### Blog Posts (2)
- Dubai Visa Guide
- Top Schengen Countries

**All ready to test immediately!**

---

## ⚡ Troubleshooting

### Issue: Tables not showing
**Solution**: Re-run schema.sql in Supabase SQL Editor

### Issue: Storage upload fails
**Solution**: Check storage buckets exist (documents, tour-images)

### Issue: Auth not working
**Solution**: Enable Email provider in Supabase Auth settings

### Issue: Build error
**Solution**: Run `npm install` again

---

## 🎯 Next Steps After Quick Start

### Immediate
1. ✅ Test all pages
2. ✅ Try visa application flow
3. ✅ Check admin dashboard
4. ✅ Verify payment flow (test mode)

### This Week
1. 📋 Add Razorpay keys
2. 📋 Add more visa countries
3. 📋 Create more tour packages
4. 📋 Customize content

### Production Deployment
1. 📋 Deploy to Vercel
2. 📋 Configure custom domain
3. 📋 Enable Razorpay live mode
4. 📋 Set up email/SMS
5. 📋 Launch! 🚀

---

## 📞 Quick Links

### Your Supabase Project
- **Dashboard**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw
- **SQL Editor**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql
- **Table Editor**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/editor
- **Storage**: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/storage/buckets

### Your Application
- **Local**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/dashboard
- **Blog**: http://localhost:3000/blog

### GitHub Repository
- **Code**: https://github.com/travunited/own
- **Commits**: https://github.com/travunited/own/commits/main

---

## 🎊 You're All Set!

Your Travunited platform is:
- ✅ **Built** - All 38 pages
- ✅ **Configured** - Supabase connected
- ✅ **Documented** - Complete guides
- ✅ **Pushed** - On GitHub
- ✅ **Ready** - To run locally

**Just run the database setup and start the server!**

---

## 💡 Remember

- **Database Schema**: Run `/database/schema.sql` in Supabase
- **Sample Data**: Run `/database/sample-data.sql` in Supabase
- **Storage Buckets**: Create `documents` and `tour-images`
- **Start Server**: `npm run dev`

**Time to see your platform in action!** 🚀

---

*Quick Start Version: 1.0*  
*Last Updated: November 8, 2024*  
*Status: Ready to Run*


