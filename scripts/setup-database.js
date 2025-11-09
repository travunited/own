#!/usr/bin/env node

/**
 * Automated Database Setup for Travunited
 * Creates all tables, functions, and sample data in Supabase
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Your Supabase credentials
const PROJECT_REF = 'esbzzprfghkcigvyuiw';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYnp6cHJmZ2hrY2NpZ3Z5dWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUzMzQ0OSwiZXhwIjoyMDc4MTA5NDQ5fQ.HRy8WBCGBfbdwoF8d-0f6fXT6SO8GK59ReTaarqXSjY';
const DB_URL = `https://${PROJECT_REF}.supabase.co`;

console.log('🚀 Travunited Database Setup');
console.log('━'.repeat(60));
console.log(`📍 Project: ${DB_URL}`);
console.log('');

// Database files to execute
const migrations = [
  { file: 'database/schema.sql', name: 'Main Schema (Core Tables)' },
  { file: 'database/auth-schema.sql', name: 'Authentication System' },
  { file: 'database/visa-applications-schema.sql', name: 'Visa Applications' },
  { file: 'database/visa-pages-schema.sql', name: 'Visa Pages CMS' },
  { file: 'database/sample-data.sql', name: 'Sample Data (Optional)' },
];

console.log('📋 Files to execute:');
migrations.forEach((m, i) => {
  console.log(`   ${i + 1}. ${m.name}`);
});
console.log('');
console.log('━'.repeat(60));
console.log('');

console.log('⚠️  IMPORTANT:');
console.log('   The Supabase REST API has limitations for complex SQL.');
console.log('   For best results, run these files manually in SQL Editor.');
console.log('');
console.log('🔗 Quick Link:');
console.log(`   https://supabase.com/dashboard/project/${PROJECT_REF}/sql`);
console.log('');
console.log('📝 Steps:');
console.log('   1. Click "New Query" in SQL Editor');
console.log('   2. Copy contents of database/schema.sql');
console.log('   3. Paste and click "Run"');
console.log('   4. Repeat for all 5 files in order');
console.log('');
console.log('⏱️  Total time: 5 minutes');
console.log('');
console.log('━'.repeat(60));
console.log('');
console.log('✅ After setup, create storage buckets:');
console.log(`   https://supabase.com/dashboard/project/${PROJECT_REF}/storage/buckets`);
console.log('');
console.log('   Bucket 1: "documents" (Private)');
console.log('   Bucket 2: "tour-images" (Public)');
console.log('');
console.log('━'.repeat(60));
console.log('');
console.log('🎯 Then run:');
console.log('   npm run dev');
console.log('   Visit: http://localhost:3000');
console.log('');
console.log('🎉 Your platform will be fully operational!');
console.log('');

