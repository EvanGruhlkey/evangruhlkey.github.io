/**
 * Test script for eBay API integration
 * Run with: node test-ebay.js
 */

require('dotenv').config();
const ebayService = require('./services/ebayService');

async function testEbayIntegration() {
  console.log('🧪 Testing eBay API Integration\n');

  // Check if API keys are configured
  if (!process.env.EBAY_APP_ID) {
    console.error('❌ EBAY_APP_ID not found in .env file');
    console.log('\n📝 To fix this:');
    console.log('1. Go to https://developer.ebay.com');
    console.log('2. Sign in or create an account');
    console.log('3. Create an application to get your API keys');
    console.log('4. Add EBAY_APP_ID to your backend/.env file\n');
    process.exit(1);
  }

  console.log('✓ eBay API credentials found\n');

  try {
    // Test 1: Basic search
    console.log('Test 1: Searching for "sony headphones"...');
    const searchResults = await ebayService.searchItems({
      keywords: ['sony', 'headphones'],
      priceMax: 500,
      condition: 'used',
      maxResults: 5
    });

    console.log(`✓ Found ${searchResults.length} items`);
    
    if (searchResults.length > 0) {
      const firstItem = searchResults[0];
      console.log('\n📦 First result:');
      console.log(`   Title: ${firstItem.title}`);
      console.log(`   Price: $${firstItem.price}`);
      console.log(`   Condition: ${firstItem.condition}`);
      console.log(`   Seller: ${firstItem.seller_name} (${firstItem.seller_rating}% positive)`);
      console.log(`   URL: ${firstItem.listing_url}`);

      // Test 2: Get item details
      console.log('\n\nTest 2: Fetching detailed information...');
      try {
        const itemDetails = await ebayService.getItemDetails(firstItem.external_id);
        console.log(`✓ Got detailed info for item ${firstItem.external_id}`);
        console.log(`   Description length: ${itemDetails.description?.length || 0} chars`);
        console.log(`   Images: ${itemDetails.images?.length || 0}`);
      } catch (detailError) {
        console.log(`⚠️  Could not fetch details: ${detailError.message}`);
      }

      // Test 3: Market value estimation
      console.log('\n\nTest 3: Estimating market value...');
      try {
        const marketValue = await ebayService.estimateMarketValue('sony headphones');
        if (marketValue) {
          console.log(`✓ Estimated market value: $${marketValue}`);
          
          const percentBelow = ((marketValue - firstItem.price) / marketValue * 100).toFixed(1);
          if (percentBelow > 0) {
            console.log(`   📊 First listing is ${percentBelow}% below market value!`);
          }
        } else {
          console.log('⚠️  Could not estimate market value (no sold listings found)');
        }
      } catch (valueError) {
        console.log(`⚠️  Market value estimation error: ${valueError.message}`);
      }
    }

    console.log('\n\n✅ eBay integration test completed successfully!');
    console.log('\n🎯 Next steps:');
    console.log('   1. Start the backend server: npm start');
    console.log('   2. Test the API endpoint: http://localhost:5000/api/deals/search?keywords=sony%20headphones');
    console.log('   3. Integrate with frontend Dashboard');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Your API key might be invalid or expired.');
      console.log('   Check your EBAY_APP_ID in the .env file');
    }
    
    process.exit(1);
  }
}

// Run the test
testEbayIntegration();


