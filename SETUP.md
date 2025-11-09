# Travunited Setup Guide

This guide will help you set up the Travunited platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Git**
- A **Supabase** account (free tier works fine)
- A **Razorpay** account (for payment processing)

## Step 1: Clone and Install

```bash
# Navigate to the project directory
cd /Users/jnaneshshetty/Desktop/Travunited

# Install dependencies
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be set up (takes about 2 minutes)

### 2.2 Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

### 2.3 Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the contents of `/database/schema.sql` from this project
4. Paste and run the SQL script
5. This will create all necessary tables, indexes, and functions

### 2.4 Set Up Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create two buckets:
   - `documents` (for visa documents) - Set to **Private**
   - `tour-images` (for tour package images) - Set to **Public**

### 2.5 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable the following:
   - **Email** provider (for email OTP)
   - **Phone** provider (for SMS OTP) - requires Twilio configuration
3. Optional: Configure **Google** and **Facebook** OAuth

## Step 3: Set Up Razorpay

### 3.1 Create a Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up for an account
3. Complete KYC verification (required for live mode)

### 3.2 Get API Keys

1. Log in to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate keys for **Test Mode** (for development)
4. Copy:
   - **Key ID** (starts with `rzp_test_...`)
   - **Key Secret** (keep this secure!)

### 3.3 Configure Webhooks

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/razorpay/webhook`
3. Select events to listen to:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`

## Step 4: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Email Service (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Optional: SMS Service (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

## Step 5: Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Application

### Test Visa Application Flow

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Apply for Visa"
3. Select a country and visa type
4. Add traveller details
5. Upload documents (use test documents)
6. Complete payment using Razorpay test cards:
   - **Success**: 4111 1111 1111 1111
   - **Failure**: 4000 0000 0000 0002
   - Any future expiry date and CVV

### Test User Dashboard

1. Sign up for an account at `/signup`
2. Verify OTP (in test mode, any 6-digit code works)
3. Navigate to dashboard at `/dashboard`
4. Explore different sections

### Test Admin Dashboard

1. Navigate to `/admin`
2. View applications, bookings, and analytics
3. Test application status updates

## Step 7: Seed Sample Data (Optional)

To test with sample data:

1. Run the seed script (to be created):
   ```bash
   npm run seed
   ```

This will create:
- Sample visa countries and types
- Sample tour packages
- Test user accounts

## Common Issues and Solutions

### Issue: Supabase connection error

**Solution**: 
- Verify your Supabase URL and keys in `.env.local`
- Check if your Supabase project is active
- Ensure you're using the correct keys (anon key vs service role key)

### Issue: Razorpay not loading

**Solution**:
- Check if Razorpay key ID is correct in `.env.local`
- Verify you're using test mode keys for development
- Check browser console for script loading errors

### Issue: File upload failing

**Solution**:
- Ensure storage buckets are created in Supabase
- Check bucket permissions (documents should be private, images public)
- Verify file size is within limits (default: 50MB)

### Issue: OTP not working

**Solution**:
- In development, Supabase shows OTP in email templates tab
- For SMS, you need to configure Twilio
- Alternatively, use email-based OTP only

## Production Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-live-secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Post-Deployment Checklist

- [ ] Test visa application flow end-to-end
- [ ] Verify payment processing with real test transactions
- [ ] Check email notifications are working
- [ ] Test file uploads and downloads
- [ ] Verify admin dashboard access control
- [ ] Set up monitoring and error tracking (Sentry recommended)
- [ ] Configure custom domain
- [ ] Enable SSL certificate
- [ ] Set up backup strategy for database

## Security Best Practices

1. **Never commit `.env.local` to Git**
2. **Rotate API keys** regularly
3. **Use Row Level Security (RLS)** in Supabase for all tables
4. **Implement rate limiting** for API routes
5. **Validate all user inputs** on both client and server
6. **Keep dependencies updated** regularly
7. **Enable 2FA** for admin accounts
8. **Regular database backups**

## Support

If you encounter any issues:

1. Check the [README.md](README.md) for general information
2. Review error logs in browser console
3. Check Supabase logs for database errors
4. Verify Razorpay dashboard for payment issues
5. Contact the development team

## Next Steps

After setup, you can:

1. Customize the design and branding
2. Add more visa countries and types
3. Create tour packages
4. Configure email templates
5. Set up automated notifications
6. Integrate additional payment methods
7. Add analytics and reporting

---

**Happy Building! 🚀**

