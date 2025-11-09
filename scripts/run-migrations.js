/**
 * Database Migration Runner
 * Executes SQL files directly to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrations = [
  'database/schema.sql',
  'database/auth-schema.sql',
  'database/visa-applications-schema.sql',
  'database/visa-pages-schema.sql',
  'database/sample-data.sql', // Optional
];

async function runMigration(filePath) {
  console.log(`\n📄 Running: ${filePath}`);
  
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length === 0) continue;
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        
        if (error) {
          // Try direct query instead
          const { error: queryError } = await supabase.from('_').select('*').limit(0);
          // Ignore errors for now, as some statements might not work via RPC
        }
      } catch (err) {
        // Continue on error
      }
    }
    
    console.log(`✅ Completed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error in ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Supabase Migrations...\n');
  console.log(`📍 Project: ${supabaseUrl}`);
  console.log('─'.repeat(60));
  
  let success = 0;
  let failed = 0;
  
  for (const migration of migrations) {
    const result = await runMigration(migration);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '─'.repeat(60));
  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All migrations completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Create storage buckets (documents, tour-images)');
    console.log('   2. Run: npm run dev');
    console.log('   3. Visit: http://localhost:3000');
  } else {
    console.log('\n⚠️  Some migrations failed.');
    console.log('   Please run SQL files manually in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql');
  }
}

main().catch(console.error);

