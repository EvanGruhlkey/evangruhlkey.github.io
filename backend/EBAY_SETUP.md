# eBay API Setup Guide

## 🎯 Getting Your eBay API Credentials

Follow these steps to get your eBay API keys and integrate with Quoril.

---

## Step 1: Create an eBay Developer Account

1. Go to **[eBay Developers Program](https://developer.ebay.com)**
2. Click **"Register"** (top right)
3. Sign in with your eBay account or create one
4. Accept the API License Agreement

---

## Step 2: Create an Application

1. Once logged in, go to **[My Account](https://developer.ebay.com/my/keys)**
2. Click **"Create an Application"** or **"Get Application Keys"**

### Application Details:
- **Application Title**: `Quoril Deal Finder` (or any name you want)
- **Application Type**: Choose **"Individual"** 
- **Purpose**: Select **"General Use"** or **"Personal Project"**

3. Click **"Continue"**

---

## Step 3: Get Your API Keys

After creating your application, you'll see your keys:

### For Development (Sandbox):
- **App ID (Client ID)**: `YourApp-Quoril-SBX-xxxxxxxxx-xxxxxxxx`
- **Cert ID (Client Secret)**: `SBX-xxxxxxxxxxxxxxxxx`
- **Dev ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### For Production:
1. Click on the **"Production"** tab
2. You'll see similar keys but for live eBay data:
   - **App ID (Client ID)**: `YourApp-Quoril-PRD-xxxxxxxxx-xxxxxxxx`
   - **Cert ID (Client Secret)**: `PRD-xxxxxxxxxxxxxxxxx`
   - **Dev ID**: Same as sandbox

**⚠️ Important**: 
- Use **Sandbox** keys for testing
- Use **Production** keys for real deal searches
- Keep your keys secret - never commit them to Git!

---

## Step 4: Configure Your Backend

1. Open `backend/.env` file (create it if it doesn't exist)
2. Add your eBay keys:

```env
# eBay API Configuration - PRODUCTION KEYS
EBAY_APP_ID=YourApp-Quoril-PRD-xxxxxxxxx-xxxxxxxx
EBAY_CERT_ID=PRD-xxxxxxxxxxxxxxxxx
EBAY_DEV_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**For Testing** (use Sandbox keys):
```env
# eBay API Configuration - SANDBOX KEYS (for testing)
EBAY_APP_ID=YourApp-Quoril-SBX-xxxxxxxxx-xxxxxxxx
EBAY_CERT_ID=SBX-xxxxxxxxxxxxxxxxx
EBAY_DEV_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## Step 5: Test Your Integration

Run the test script to verify everything is working:

```bash
cd backend
node test-ebay.js
```

### Expected Output:
```
🧪 Testing eBay API Integration

✓ eBay API credentials found

Test 1: Searching for "sony headphones"...
✓ Found 5 items

📦 First result:
   Title: Sony WH-1000XM4 Wireless Headphones - Black
   Price: $248.99
   Condition: Used
   Seller: electronics_store (98.5% positive)
   URL: https://www.ebay.com/itm/...

Test 2: Fetching detailed information...
✓ Got detailed info for item 123456789

Test 3: Estimating market value...
✓ Estimated market value: $299.99
   📊 First listing is 17.0% below market value!

✅ eBay integration test completed successfully!
```

---

## Step 6: Test the API Endpoint

Start your backend server:

```bash
cd backend
npm start
```

Then test the API in your browser or with curl:

```bash
# Search for deals
http://localhost:5000/api/deals/search?keywords=sony%20headphones&priceMax=300

# Or using curl:
curl "http://localhost:5000/api/deals/search?keywords=sony%20headphones&priceMax=300"
```

### Example Response:
```json
{
  "success": true,
  "count": 50,
  "deals": [
    {
      "external_id": "123456789",
      "marketplace": "ebay",
      "title": "Sony WH-1000XM4 Wireless Headphones",
      "price": 248.99,
      "condition": "Used",
      "seller_name": "electronics_store",
      "seller_rating": 98.5,
      "listing_url": "https://www.ebay.com/itm/...",
      "image_url": "https://i.ebayimg.com/...",
      "location": "Los Angeles, CA"
    }
    // ... more deals
  ]
}
```

---

## API Endpoints Available

### 1. Search for Deals
```
GET /api/deals/search
```

**Query Parameters:**
- `keywords` (required): Search terms (comma-separated)
- `priceMin`: Minimum price
- `priceMax`: Maximum price
- `condition`: Item condition (new, used, like_new, etc.)
- `marketplace`: Which marketplace (default: ebay)
- `limit`: Max results (default: 50, max: 100)

**Example:**
```
/api/deals/search?keywords=iphone,14,pro&priceMin=500&priceMax=900&condition=like_new
```

### 2. Get Deal Details
```
GET /api/deals/:id
```

Get detailed information about a specific item.

**Example:**
```
/api/deals/123456789?marketplace=ebay
```

### 3. Estimate Market Value
```
GET /api/deals/market-value/:keywords
```

Get average market value based on sold listings.

**Example:**
```
/api/deals/market-value/sony%20headphones
```

---

## eBay API Limits

### Free Tier (Developer Account):
- **5,000 calls per day**
- **Access to Finding API** ✓
- **Access to Shopping API** ✓
- **No rate limits** (within daily limit)

### If You Need More:
- Apply for **Production API keys** (same process, just use Production tab)
- For commercial use with higher limits, you may need to apply for enhanced access

---

## Troubleshooting

### ❌ "Invalid API key" Error

**Possible causes:**
- Using Sandbox keys instead of Production keys
- Keys copied incorrectly (check for spaces)
- Application not activated

**Fix:**
1. Double-check your `.env` file
2. Make sure you're using **Production** keys, not Sandbox
3. Verify keys match exactly in eBay Developer portal

### ❌ "Daily limit exceeded"

You've hit the 5,000 calls/day limit.

**Fix:**
- Wait until tomorrow (resets at midnight PST)
- Cache results to reduce API calls
- Apply for higher limits in eBay Developer portal

### ❌ "No results found"

**Possible causes:**
- Search terms too specific
- Price filters too restrictive
- Using Sandbox (limited test data)

**Fix:**
- Use broader search terms
- Remove or adjust price filters
- Switch to Production keys for real data

### ⚠️ Test script fails

**Check:**
1. Is axios installed? `npm install axios`
2. Is `.env` in the correct location? (backend/.env)
3. Are environment variables loading? Add `console.log(process.env.EBAY_APP_ID)` to test

---

## Next Steps

✅ eBay API is configured
✅ Test script passed
✅ API endpoints working

**Now you can:**
1. ✨ Integrate eBay search into your frontend Dashboard
2. 🤖 Build the AI scoring system
3. 📧 Set up automated deal notifications
4. 🔄 Create background jobs to scan continuously

---

## Resources

- **eBay Developer Portal**: https://developer.ebay.com
- **eBay Finding API Docs**: https://developer.ebay.com/Devzone/finding/Concepts/FindingAPIGuide.html
- **eBay Shopping API Docs**: https://developer.ebay.com/Devzone/shopping/docs/Concepts/ShoppingAPI_FormatOverview.html
- **API Call Limits**: https://developer.ebay.com/support/kb-article?KBid=4640

---

## 🎉 You're All Set!

Your eBay integration is ready. Start searching for deals! 🚀


