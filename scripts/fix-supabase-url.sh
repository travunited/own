#!/bin/bash

# Fix Supabase URL typo in .env.local
# Wrong: esbzzprfghkcigvyuiw (extra h)
# Correct: esbzzprfgkhccigvyuiw (no h between g and k)

echo "🔧 Fixing Supabase URL..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local not found"
  exit 1
fi

echo "Current URL:"
grep "NEXT_PUBLIC_SUPABASE_URL" .env.local
echo ""

# Fix the URL
sed -i '' 's/esbzzprfghkcigvyuiw/esbzzprfgkhccigvyuiw/g' .env.local

echo "Fixed URL:"
grep "NEXT_PUBLIC_SUPABASE_URL" .env.local
echo ""

echo "✅ Supabase URL fixed!"
echo ""
echo "📋 Next steps:"
echo "1. Restart dev server: npm run dev"
echo "2. Hard refresh browser: Cmd+Shift+R"
echo "3. Try login again!"

