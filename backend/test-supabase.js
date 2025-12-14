// Quick test script to verify Supabase connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
    console.log('\n📝 Please create a .env file with your Supabase credentials');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log(`  URL: ${supabaseUrl}`);
  console.log(`  Key: ${supabaseKey.substring(0, 20)}...\n`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Check users table
    console.log('📋 Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (usersError) {
      console.error('❌ Users table error:', usersError.message);
      console.log('\n💡 Did you run the schema.sql file in Supabase SQL Editor?');
      process.exit(1);
    }
    console.log('✓ Users table accessible\n');

    // Test 2: Check searches table
    console.log('📋 Testing searches table...');
    const { data: searches, error: searchesError } = await supabase
      .from('searches')
      .select('count')
      .limit(1);

    if (searchesError) {
      console.error('❌ Searches table error:', searchesError.message);
      process.exit(1);
    }
    console.log('✓ Searches table accessible\n');

    // Test 3: Check deals table
    console.log('📋 Testing deals table...');
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('count')
      .limit(1);

    if (dealsError) {
      console.error('❌ Deals table error:', dealsError.message);
      process.exit(1);
    }
    console.log('✓ Deals table accessible\n');

    console.log('✅ All tests passed! Supabase is ready to use.\n');
    console.log('🚀 You can now start the server with: npm start');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();



