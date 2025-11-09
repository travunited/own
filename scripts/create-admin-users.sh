#!/bin/bash

# ============================================
# Create Admin Users for All 5 Roles
# Automated script using Supabase API
# ============================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  🔐 Travunited - Create Admin Users (All 5 Roles)"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${RED}❌ Error: .env.local file not found${NC}"
  echo "Please create .env.local with your Supabase credentials"
  exit 1
fi

# Source environment variables
source .env.local

# Check required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Error: Missing Supabase credentials${NC}"
  echo "Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  exit 1
fi

PROJECT_URL="$NEXT_PUBLIC_SUPABASE_URL"
SERVICE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo -e "${BLUE}📡 Supabase URL: $PROJECT_URL${NC}"
echo ""
echo "Creating 5 admin users..."
echo ""

# Function to create user
create_user() {
  local email=$1
  local password=$2
  local full_name=$3
  local role=$4
  
  echo -e "${YELLOW}Creating: $full_name ($role)${NC}"
  echo "  Email: $email"
  
  response=$(curl -s -X POST "$PROJECT_URL/auth/v1/admin/users" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$email\",
      \"password\": \"$password\",
      \"email_confirm\": true,
      \"user_metadata\": {
        \"full_name\": \"$full_name\",
        \"role\": \"$role\"
      }
    }")
  
  # Check if successful
  if echo "$response" | grep -q "\"id\""; then
    echo -e "${GREEN}  ✅ User created successfully${NC}"
  else
    echo -e "${RED}  ❌ Failed to create user${NC}"
    echo "  Response: $response"
  fi
  
  echo ""
}

# Create all 5 admin users
create_user "superadmin@travunited.com" "SuperAdmin@123" "Super Admin User" "super_admin"
create_user "admin@travunited.com" "Admin@123" "Admin User" "admin"
create_user "subadmin@travunited.com" "SubAdmin@123" "Sub Admin User" "sub_admin"
create_user "regionaladmin@travunited.com" "RegionalAdmin@123" "Regional Admin User" "regional_admin"
create_user "maintenance@travunited.com" "Maintenance@123" "Maintenance Admin User" "maintenance_admin"

echo "═══════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}🎉 User creation complete!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Next Steps${NC}"
echo ""
echo "1. Go to Supabase SQL Editor:"
echo "   https://supabase.com/dashboard/project/YOUR_PROJECT/sql"
echo ""
echo "2. Run this SQL file to create profiles:"
echo "   database/create-admin-users-all-roles.sql"
echo ""
echo "3. Verify users created:"
echo "   SELECT email, full_name, role FROM user_profiles"
echo "   WHERE email LIKE '%@travunited.com';"
echo ""
echo -e "${BLUE}📋 Login Credentials:${NC}"
echo ""
echo "1. Super Admin:"
echo "   Email: superadmin@travunited.com"
echo "   Password: SuperAdmin@123"
echo ""
echo "2. Admin:"
echo "   Email: admin@travunited.com"
echo "   Password: Admin@123"
echo ""
echo "3. Sub Admin:"
echo "   Email: subadmin@travunited.com"
echo "   Password: SubAdmin@123"
echo ""
echo "4. Regional Admin:"
echo "   Email: regionaladmin@travunited.com"
echo "   Password: RegionalAdmin@123"
echo ""
echo "5. Maintenance Admin:"
echo "   Email: maintenance@travunited.com"
echo "   Password: Maintenance@123"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ All done! Test by logging in at /login${NC}"
echo ""

