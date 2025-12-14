# Supabase Setup Guide for Quoril

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon) → **API**
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 2: Create the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `schema.sql` file
4. Paste it into the SQL Editor
5. Click **Run** to create all tables

This will create:
- ✅ Users table
- ✅ Searches table  
- ✅ Deals table
- ✅ Purchases table
- ✅ Payment methods table
- ✅ Notifications table
- ✅ Price history table
- ✅ Row Level Security policies
- ✅ Auto-update triggers

## Step 3: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=5000
NODE_ENV=development

# Supabase - REPLACE WITH YOUR VALUES
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT Secret (optional - Supabase handles auth)
JWT_SECRET=your-secret-key-change-in-production

# eBay API (get from developer.ebay.com)
EBAY_APP_ID=your-app-id
EBAY_CERT_ID=your-cert-id
EBAY_DEV_ID=your-dev-id

# OpenAI API (for deal scoring)
OPENAI_API_KEY=your-openai-key
```

## Step 4: Update Backend Code

The backend has been updated to use Supabase instead of JSON files.

## Step 5: Test the Integration

```bash
cd backend
npm start
```

Then test:
- Sign up a new user
- Create a saved search
- Check Supabase dashboard to see data

## Authentication Options

### Option A: Use Supabase Auth (Recommended)
- Let Supabase handle all auth
- Better security, built-in features
- Requires updating frontend to use Supabase client

### Option B: Keep Current JWT Auth
- Current implementation
- Uses Supabase only for data storage
- Easier migration, no frontend changes

We're currently using **Option B** for easy migration.

## Next Steps

1. ✅ Database is ready
2. 🔄 Integrate eBay API for real deals
3. 🔄 Build auto-purchase engine
4. 🔄 Add AI deal scoring

## Troubleshooting

**Connection Error?**
- Check your SUPABASE_URL and keys
- Make sure `.env` file is in `backend/` folder
- Verify your Supabase project is active

**RLS Policies Blocking Queries?**
- If using service_role key, RLS is bypassed
- For anon key, make sure policies are set correctly

**Migration from JSON files?**
- Your old `data/users.json` and `data/searches.json` are still there
- You can write a script to migrate data if needed



