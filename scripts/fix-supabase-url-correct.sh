#!/bin/bash

# Fix Supabase URL to the CORRECT one from JWT token
# JWT "ref" field shows: esbzzprfghkccigvyuiw

echo "🔧 Fixing Supabase URL to correct one..."
echo ""

# The correct project reference from JWT token
CORRECT_REF="esbzzprfghkccigvyuiw"
CORRECT_URL="https://${CORRECT_REF}.supabase.co"

echo "Correct project ref (from JWT): $CORRECT_REF"
echo "Correct URL: $CORRECT_URL"
echo ""

# Backup current file
cp .env.local .env.local.backup

# Replace with correct URL
sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$CORRECT_URL|g" .env.local

echo "✅ Fixed!"
echo ""
echo "New .env.local:"
grep "NEXT_PUBLIC_SUPABASE_URL" .env.local
echo ""

# Test connection
echo "Testing connection..."
if curl -s "$CORRECT_URL" >/dev/null 2>&1; then
  echo "✅ Supabase is reachable!"
else
  echo "⚠️  Cannot reach Supabase (might need VPN or network check)"
fi

echo ""
echo "📋 Next steps:"
echo "1. Restart: npm run dev"
echo "2. Hard refresh browser: Cmd+Shift+R"
echo "3. Try login!"

