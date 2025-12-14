# Quick Start - Supabase Auth Setup

## 🎯 5-Minute Setup

### Step 1: Add Environment Variables

**Backend** - Update `backend/.env`:
```env
# Add this line:
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `.env` in root directory:
```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_API_URL=http://localhost:5000/api
```

Get your Supabase credentials:
1. Go to your Supabase project
2. Click **Settings** → **API**
3. Copy **Project URL** and **anon public** key

### Step 2: Update Database

Run this in Supabase SQL Editor:

```sql
-- Make password field optional (Supabase Auth handles it now)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password SET DEFAULT '';
```

### Step 3: Configure Auth Settings

In Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**: `http://localhost:3000/**`

### Step 4: Start & Test

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm start
```

Test:
1. Go to http://localhost:3000/signup
2. Create an account
3. Check Supabase Dashboard → Authentication → Users (should see your new user!)
4. Sign in at http://localhost:3000/signin
5. You should be redirected to the dashboard

### Step 5: Test Password Reset

1. Go to http://localhost:3000/forgot-password
2. Enter your email
3. Check your inbox for reset link
4. Click link and set new password
5. Sign in with new password

## ✅ You're Done!

Your app now has:
- ✅ Secure Supabase authentication
- ✅ Password reset functionality
- ✅ Auto session management
- ✅ Better security practices

## 🐛 Troubleshooting

**Can't sign in?**
- Make sure both backend (port 5000) and frontend (port 3000) are running
- Check that your Supabase credentials are correct in `.env`
- Restart dev servers after adding environment variables

**Password reset email not arriving?**
- Check spam folder
- Verify you used a real email address
- Check Supabase **Authentication** → **Logs** for errors

**Need help?**
See `SUPABASE_AUTH_MIGRATION.md` for detailed documentation.



