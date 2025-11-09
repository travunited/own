#!/bin/bash

# Travunited Environment Setup Script
echo "🚀 Setting up Travunited environment..."

# Create .env.local file
cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://esbzzprfghkcigvyuiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnp6cHJmZ2hrY2NpZ3Z5dWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzM0NDksImV4cCI6MjA3ODEwOTQ0OX0.Ez-_jh_LdrKN0wbhhUNw0Eabxy4eNYCektlNgCwNQAo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnp6cHJmZ2hrY2NpZ3Z5dWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzMzQ0OSwiZXhwIjoyMDc4MTA5NDQ5fQ.HRy8WBCGBfbdwoF8d-0f6fXT6SO8GK59ReTaarqXSjY

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo "✅ .env.local file created!"
echo ""
echo "📋 Next steps:"
echo "1. Update Razorpay keys in .env.local"
echo "2. Run database schema in Supabase SQL Editor"
echo "3. Create storage buckets (documents, tour-images)"
echo "4. Run: npm run dev"
echo ""
echo "📚 See SUPABASE_SETUP.md for detailed instructions"

