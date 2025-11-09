#!/usr/bin/env node

/**
 * Execute SQL Schemas via Supabase
 * This script executes each SQL file directly
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://esbzzprfghkcigvyuiw.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnp6cHJmZ2hrY2NpZ3Z5dWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzMzQ0OSwiZXhwIjoyMDc4MTA5NDQ5fQ.HRy8WBCGBfbdwoF8d-0f6fXT6SO8GK59ReTaarqXSjY';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🚀 Travunited Database Setup via CLI');
console.log('━'.repeat(70));
console.log(`📍 Project: ${supabaseUrl}`);
console.log('');

const schemas = [
  { file: 'database/schema.sql', name: 'Main Schema' },
  { file: 'database/auth-schema.sql', name: 'Authentication System' },
  { file: 'database/visa-applications-schema.sql', name: 'Visa Applications' },
  { file: 'database/visa-pages-schema.sql', name: 'Visa Pages CMS' },
  { file: 'database/sample-data.sql', name: 'Sample Data' },
];

async function executeSQLFile(filePath, name) {
  console.log(`\n📄 Executing: ${name}`);
  console.log(`   File: ${filePath}`);
  
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    
    // Remove comments and split into individual statements
    const statements = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`   📊 Found ${statements.length} SQL statements`);
    
    let success = 0;
    let failed = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Execute via Supabase client
        const { error } = await supabase.rpc('query', { query_text: statement });
        
        if (error && !error.message.includes('already exists')) {
          process.stdout.write('×');
          failed++;
        } else {
          process.stdout.write('✓');
          success++;
        }
        
        if ((i + 1) % 50 === 0) {
          process.stdout.write(`\n   `);
        }
      } catch (err) {
        process.stdout.write('×');
        failed++;
      }
    }
    
    console.log('');
    console.log(`   ✅ Success: ${success} | ⚠️  Skipped: ${failed}`);
    
    return { success, failed };
  } catch (error) {
    console.log(`   ❌ Error reading file: ${error.message}`);
    return { success: 0, failed: 1 };
  }
}

async function main() {
  console.log('⚠️  NOTE: Supabase REST API has limitations with:');
  console.log('   - CREATE FUNCTION');
  console.log('   - CREATE TRIGGER');  
  console.log('   - CREATE POLICY (RLS)');
  console.log('   - Complex DDL operations');
  console.log('');
  console.log('💡 RECOMMENDED: Use Supabase SQL Editor for 100% reliability');
  console.log('');
  console.log('🔗 SQL Editor: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql');
  console.log('');
  console.log('━'.repeat(70));
  console.log('');
  console.log('📋 Attempting automated execution anyway...');
  console.log('   (Some statements may fail and require manual execution)');
  console.log('');
  
  let totalSuccess = 0;
  let totalFailed = 0;
  
  for (const schema of schemas) {
    const { success, failed } = await executeSQLFile(schema.file, schema.name);
    totalSuccess += success;
    totalFailed += failed;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('');
  console.log('━'.repeat(70));
  console.log('');
  console.log('📊 FINAL SUMMARY:');
  console.log(`   ✅ Executed: ${totalSuccess} statements`);
  console.log(`   ⚠️  Skipped: ${totalFailed} statements`);
  console.log('');
  
  if (totalFailed > 0) {
    console.log('⚠️  MANUAL VERIFICATION NEEDED:');
    console.log('');
    console.log('   Some complex SQL statements may have failed.');
    console.log('   Please verify tables in Supabase Dashboard:');
    console.log('');
    console.log(`   🔗 https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/editor`);
    console.log('');
    console.log('   Expected: 29 tables');
    console.log('');
    console.log('   If tables are missing, run SQL files manually in SQL Editor.');
  } else {
    console.log('✅ ALL STATEMENTS EXECUTED!');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('   1. Verify tables in Dashboard');
    console.log('   2. Create storage buckets');
    console.log('   3. Run: npm run dev');
    console.log('   4. Visit: http://localhost:3000');
  }
  
  console.log('');
  console.log('━'.repeat(70));
  console.log('');
}

main().catch(err => {
  console.error('');
  console.error('❌ Fatal Error:', err.message);
  console.error('');
  console.error('📋 FALLBACK TO MANUAL METHOD:');
  console.error('');
  console.error('   Visit: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql');
  console.error('   Copy & paste each SQL file');
  console.error('   Takes 5 minutes total');
  console.error('');
  process.exit(1);
});

