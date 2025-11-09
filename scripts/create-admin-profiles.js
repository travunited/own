#!/usr/bin/env node

/**
 * Create Admin User Profiles using Supabase CLI
 * Executes the SQL script via PostgreSQL connection
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log('\n' + '═'.repeat(60));
console.log(`${colors.cyan}  🔐 Creating Admin User Profiles${colors.reset}`);
console.log('═'.repeat(60) + '\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Use direct connection (not pooler) for DDL operations
const connectionString = process.env.DATABASE_URL || 
  `postgresql://postgres.esbzzprfgkhccigvyuiw:${process.env.SUPABASE_DB_PASSWORD || 'Marigudi@9'}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`;

console.log(`${colors.blue}🔗 Connection: Direct (port 5432)${colors.reset}`);

// Read SQL file
const sqlFilePath = path.join(__dirname, '..', 'database', 'create-admin-users-all-roles.sql');

if (!fs.existsSync(sqlFilePath)) {
  console.error(`${colors.red}❌ Error: SQL file not found: ${sqlFilePath}${colors.reset}`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

console.log(`${colors.blue}📄 SQL File: ${sqlFilePath}${colors.reset}`);
console.log(`${colors.blue}📊 File Size: ${(sqlContent.length / 1024).toFixed(2)} KB${colors.reset}\n`);

// Create PostgreSQL client
const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function executeSQL() {
  try {
    console.log(`${colors.yellow}🔌 Connecting to Supabase...${colors.reset}`);
    await client.connect();
    console.log(`${colors.green}✅ Connected successfully!${colors.reset}\n`);

    console.log(`${colors.yellow}⚙️  Executing SQL script...${colors.reset}`);
    const result = await client.query(sqlContent);
    
    console.log(`${colors.green}✅ SQL executed successfully!${colors.reset}\n`);

    // Show notices (success messages from SQL)
    if (result.rows && result.rows.length > 0) {
      console.log(`${colors.cyan}📊 Results:${colors.reset}`);
      console.table(result.rows);
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.green}🎉 Admin profiles created successfully!${colors.reset}`);
    console.log('═'.repeat(60) + '\n');

    console.log(`${colors.cyan}🔐 Admin Login Credentials:${colors.reset}\n`);
    console.log(`${colors.yellow}1. Super Admin:${colors.reset}`);
    console.log(`   Email:    travunited3@gmail.com`);
    console.log(`   Password: Marigudi@9`);
    console.log(`   Dashboard: /super-admin\n`);

    console.log(`${colors.yellow}2. Admin:${colors.reset}`);
    console.log(`   Email:    admin@travunited.com`);
    console.log(`   Password: Admin@123`);
    console.log(`   Dashboard: /admin\n`);

    console.log(`${colors.yellow}3. Sub Admin:${colors.reset}`);
    console.log(`   Email:    subadmin@travunited.com`);
    console.log(`   Password: SubAdmin@123`);
    console.log(`   Dashboard: /admin\n`);

    console.log(`${colors.yellow}4. Regional Admin:${colors.reset}`);
    console.log(`   Email:    regionaladmin@travunited.com`);
    console.log(`   Password: RegionalAdmin@123`);
    console.log(`   Dashboard: /regional-admin\n`);

    console.log(`${colors.yellow}5. Maintenance Admin:${colors.reset}`);
    console.log(`   Email:    maintenance@travunited.com`);
    console.log(`   Password: Maintenance@123`);
    console.log(`   Dashboard: /maintenance\n`);

    console.log(`${colors.green}✅ Ready to test! Login at: http://localhost:3000/login${colors.reset}\n`);

  } catch (error) {
    console.error(`\n${colors.red}❌ Error executing SQL:${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}\n`);
    
    if (error.message.includes('does not exist')) {
      console.log(`${colors.yellow}💡 Tip: Make sure you've run the core schemas first:${colors.reset}`);
      console.log(`   1. database/schema.sql`);
      console.log(`   2. database/auth-schema.sql\n`);
    }
    
    if (error.message.includes('User') && error.message.includes('not found')) {
      console.log(`${colors.yellow}💡 Tip: Create users in Supabase Dashboard first:${colors.reset}`);
      console.log(`   https://supabase.com/dashboard/project/esbzzprfgkhccigvyuiw/auth/users\n`);
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log(`${colors.blue}🔌 Database connection closed${colors.reset}\n`);
  }
}

// Run the script
executeSQL().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});

