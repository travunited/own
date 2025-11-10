#!/bin/bash

# =====================================================
# Create All Tables in Supabase - Automated Script
# =====================================================

echo "🗄️  Creating all necessary tables in Supabase..."
echo ""
echo "This script will help you run all required SQL schemas"
echo "======================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Schemas to be created:${NC}"
echo ""
echo "1. ✅ Refunds & Audit Logs (refunds-schema.sql)"
echo "   - refund_requests table"
echo "   - audit_logs table"
echo ""
echo "2. ✅ Email Templates (email-templates-schema.sql)"
echo "   - email_templates table"
echo "   - 7 default templates"
echo ""
echo "3. ✅ Visa Add-ons (visa-addons-schema.sql)"
echo "   - visa_addons table"
echo "   - 6 default add-ons"
echo ""
echo "======================================================"
echo ""

# Supabase project details
PROJECT_ID="esbzzprfghkccigvyuiw"
SQL_EDITOR_URL="https://supabase.com/dashboard/project/${PROJECT_ID}/sql"

echo -e "${BLUE}🌐 OPENING SUPABASE SQL EDITOR...${NC}"
echo ""

# Open SQL Editor in browser
open "$SQL_EDITOR_URL" 2>/dev/null || xdg-open "$SQL_EDITOR_URL" 2>/dev/null || echo "Please open: $SQL_EDITOR_URL"

echo ""
echo -e "${GREEN}✅ SQL Editor opened in your browser!${NC}"
echo ""
echo "======================================================"
echo -e "${BLUE}📝 NOW FOLLOW THESE STEPS:${NC}"
echo "======================================================"
echo ""

echo -e "${GREEN}STEP 1: Run Refunds & Audit Logs Schema${NC}"
echo "----------------------------------------"
echo "1. In the SQL Editor, click 'New Query'"
echo "2. Copy ALL contents of: database/refunds-schema.sql"
echo "3. Paste into the SQL Editor"
echo "4. Click 'RUN' button (or Cmd+Enter)"
echo "5. Wait for success message ✅"
echo ""
echo "Press ENTER when done..."
read

echo ""
echo -e "${GREEN}STEP 2: Run Email Templates Schema${NC}"
echo "----------------------------------------"
echo "1. Click 'New Query' again"
echo "2. Copy ALL contents of: database/email-templates-schema.sql"
echo "3. Paste into the SQL Editor"
echo "4. Click 'RUN' button"
echo "5. Wait for success message ✅"
echo ""
echo "Press ENTER when done..."
read

echo ""
echo -e "${GREEN}STEP 3: Run Visa Add-ons Schema${NC}"
echo "----------------------------------------"
echo "1. Click 'New Query' again"
echo "2. Copy ALL contents of: database/visa-addons-schema.sql"
echo "3. Paste into the SQL Editor"
echo "4. Click 'RUN' button"
echo "5. Wait for success message ✅"
echo ""
echo "Press ENTER when done..."
read

echo ""
echo "======================================================"
echo -e "${GREEN}🎉 VERIFICATION TIME!${NC}"
echo "======================================================"
echo ""
echo "Run these queries to verify tables were created:"
echo ""
echo -e "${BLUE}Query 1: Check refund_requests table${NC}"
echo "SELECT COUNT(*) FROM refund_requests;"
echo ""
echo -e "${BLUE}Query 2: Check audit_logs table${NC}"
echo "SELECT COUNT(*) FROM audit_logs;"
echo ""
echo -e "${BLUE}Query 3: Check email templates${NC}"
echo "SELECT COUNT(*) FROM email_templates;"
echo "-- Should return: 7 (7 default templates)"
echo ""
echo -e "${BLUE}Query 4: Check visa addons${NC}"
echo "SELECT COUNT(*) FROM visa_addons;"
echo "-- Should return: 6 (6 default add-ons)"
echo ""
echo "======================================================"
echo ""

echo "Did all tables create successfully? (yes/no)"
read answer

if [[ "$answer" == "yes" || "$answer" == "y" ]]; then
    echo ""
    echo -e "${GREEN}🎉 SUCCESS! All tables created!${NC}"
    echo ""
    echo "======================================================"
    echo -e "${GREEN}✅ YOUR PLATFORM IS NOW FULLY READY!${NC}"
    echo "======================================================"
    echo ""
    echo "Tables Created:"
    echo "✅ refund_requests"
    echo "✅ audit_logs"
    echo "✅ email_templates (with 7 templates)"
    echo "✅ visa_addons (with 6 add-ons)"
    echo ""
    echo "Next Steps:"
    echo "1. Test the visa application flow"
    echo "2. Test refund management"
    echo "3. Test all super admin features"
    echo "4. Deploy to production"
    echo "5. LAUNCH! 🚀"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Some tables failed to create${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check for SQL syntax errors in the editor"
    echo "2. Make sure you're in the correct project"
    echo "3. Try running each CREATE TABLE statement separately"
    echo "4. Check Supabase logs for detailed errors"
    echo ""
fi

echo "======================================================"
echo -e "${BLUE}📚 Documentation Available:${NC}"
echo "======================================================"
echo ""
echo "- QUICK_START.md - Quick reference"
echo "- LAUNCH_READY_GUIDE.md - Complete setup"
echo "- MASTER_INDEX.md - All documentation"
echo ""
echo "======================================================"
echo ""
echo -e "${GREEN}✨ Script complete! Your platform is ready! ✨${NC}"
echo ""

