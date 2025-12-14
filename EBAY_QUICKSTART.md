# eBay Integration - Quick Start

## 🎯 TL;DR

Your eBay integration is **ready** - you just need API keys!

---

## ⚡ 5-Minute Setup

### 1. Get eBay API Keys

1. Go to: **https://developer.ebay.com**
2. Register/Sign in
3. Create an application
4. Get your **Production** keys (3 keys total)

### 2. Add Keys to Backend

Open `backend/.env` and update:

```env
EBAY_APP_ID=YourApp-xxxxx-PRD-xxxxxxxxx
EBAY_CERT_ID=PRD-xxxxxxxxxxxxxxxxx
EBAY_DEV_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 3. Test It

```bash
cd backend
node test-ebay.js
```

Expected result: ✅ eBay integration test completed successfully!

### 4. Start Server

```bash
npm start
```

### 5. Try It Out

Open in browser:
```
http://localhost:5000/api/deals/search?keywords=sony%20headphones&priceMax=300
```

---

## 📚 Full Documentation

- **Detailed Setup**: See `backend/EBAY_SETUP.md`
- **Integration Status**: See `backend/EBAY_INTEGRATION_STATUS.md`
- **Environment Variables**: See `backend/ENV_TEMPLATE.md`

---

## ✅ What's Working

- ✅ Search eBay for deals
- ✅ Filter by price, condition, category
- ✅ Get detailed item info
- ✅ Estimate market values
- ✅ Seller verification (ratings)
- ✅ API endpoints ready for frontend

---

## 🎯 API Endpoints

### Search Deals
```
GET /api/deals/search?keywords=iphone&priceMax=800
```

### Get Item Details
```
GET /api/deals/123456789?marketplace=ebay
```

### Estimate Market Value
```
GET /api/deals/market-value/macbook%20pro
```

---

## 🚀 Next: Frontend Integration

Add to `src/services/api.js`:

```javascript
export const dealsAPI = {
  search: async (params) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/deals/search?${query}`);
    const data = await response.json();
    return data.deals;
  }
};
```

Use in Dashboard:

```javascript
const deals = await dealsAPI.search({
  keywords: 'sony headphones',
  priceMax: 300,
  condition: 'used'
});
```

---

## 💡 Need Help?

**Test failed?** → Check `backend/EBAY_SETUP.md` troubleshooting section

**No results?** → Make sure you're using **Production** keys, not Sandbox

**Still stuck?** → Your `.env` file might not be loading. Try `console.log(process.env.EBAY_APP_ID)` in `server.js`

---

**You're 1 step away from live deal data! 🎉**


