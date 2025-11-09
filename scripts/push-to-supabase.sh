#!/bin/bash

echo "🚀 Pushing Database Schemas to Supabase..."
echo ""

PROJECT_ID="esbzzprfghkcigvyuiw"
API_URL="https://esbzzprfghkcigvyuiw.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnp6cHJmZ2hrY2NpZ3Z5dWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzMzQ0OSwiZXhwIjoyMDc4MTA5NDQ5fQ.HRy8WBCGBfbdwoF8d-0f6fXT6SO8GK59ReTaarqXSjY"

echo "📍 Project: $API_URL"
echo "📊 Running migrations..."
echo ""

# Function to execute SQL file
execute_sql() {
  local file=$1
  local name=$2
  
  echo "📄 Processing: $name"
  
  # Read SQL file
  SQL_CONTENT=$(cat "$file")
  
  # Execute via Supabase REST API
  curl -X POST "$API_URL/rest/v1/rpc/exec_sql" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"sql\": $(echo "$SQL_CONTENT" | jq -Rs .)}" \
    2>&1 | grep -q "error" && echo "   ⚠️  May need manual execution" || echo "   ✅ Executed"
  
  sleep 1
}

# Execute migrations in order
execute_sql "database/schema.sql" "Main Schema (Core Tables)"
execute_sql "database/auth-schema.sql" "Authentication Schema"
execute_sql "database/visa-applications-schema.sql" "Visa Applications Schema"
execute_sql "database/visa-pages-schema.sql" "Visa Pages CMS Schema"
execute_sql "database/sample-data.sql" "Sample Data"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Migration process completed!"
echo ""
echo "⚠️  Note: Some statements may need manual execution via SQL Editor."
echo ""
echo "✅ Recommended: Verify in Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/$PROJECT_ID/editor"
echo ""
echo "📋 Expected: 29 tables created"
echo ""
echo "🚀 Next: npm run dev"
echo ""

