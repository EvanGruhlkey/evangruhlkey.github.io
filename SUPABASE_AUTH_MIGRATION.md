# Supabase Auth Migration Guide

## ✅ What's Been Done

Quoril has been migrated from custom JWT authentication to **Supabase Auth**!

### Backend Changes
- ✅ Updated auth middleware to verify Supabase tokens
- ✅ Sign up creates both Supabase Auth user + profile in database
- ✅ Sign in uses Supabase Auth for credential verification
- ✅ Password reset functionality added
- ✅ Account deletion removes both auth user and profile
- ✅ No more bcrypt password hashing (handled by Supabase)

### Frontend Changes
- ✅ Installed `@supabase/supabase-js` client
- ✅ Created Supabase client configuration (`src/lib/supabase.js`)
- ✅ Updated `authAPI` to use Supabase Auth
- ✅ Sessions are automatically managed by Supabase
- ✅ Added password reset flow (Forgot Password + Reset Password pages)
- ✅ Updated all auth-related API calls

### New Features
- 🔐 **Email-based password reset** - Users can reset their password
- 🔄 **Auto token refresh** - Sessions refresh automatically
- 🛡️ **Better security** - Industry-standard auth practices
- 📧 **Email verification** - Can be enabled in Supabase settings

---

## 🚀 Setup Instructions

### 1. Configure Supabase Authentication

Go to your Supabase project dashboard:

**A. Authentication Settings**
- Navigate to **Authentication** → **URL Configuration**
- Set **Site URL**: `http://localhost:3000` (development) or your production URL
- Add **Redirect URLs**:
  - `http://localhost:3000/**`
  - `http://localhost:3000/reset-password`
  - Add production URLs when deploying

**B. Email Templates** (Optional but recommended)
- Go to **Authentication** → **Email Templates**
- Customize the email templates to match Quoril branding
- Templates available:
  - Confirm signup
  - Magic Link
  - Change Email Address
  - Reset Password ← This one is used!

**C. Email Settings**
- By default uses Supabase's email service (rate limited)
- For production, integrate your own SMTP (SendGrid, AWS SES, etc.)
- Go to **Settings** → **Auth** → **SMTP Settings**

### 2. Update Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT (still used for compatibility)
JWT_SECRET=your-jwt-secret

# Frontend URL (for password reset emails)
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env` in root):
```env
# Supabase
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Backend API
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Update Database Schema

The `users` table schema has been updated. Run this SQL in Supabase:

```sql
-- Make password field optional (Supabase Auth handles passwords now)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password SET DEFAULT '';

-- Optionally: Remove password column entirely if you want
-- ALTER TABLE users DROP COLUMN password;
```

### 4. Test the Migration

**A. Test Sign Up:**
```bash
# Start backend
cd backend && npm start

# Start frontend (in new terminal)
npm start
```

1. Go to `http://localhost:3000/signup`
2. Create a new account
3. Check Supabase Dashboard → **Authentication** → **Users** (should see new user)
4. Check **Table Editor** → **users** table (should see profile)

**B. Test Sign In:**
1. Go to `http://localhost:3000/signin`
2. Sign in with the account you just created
3. Should redirect to dashboard

**C. Test Password Reset:**
1. Go to `http://localhost:3000/forgot-password`
2. Enter your email
3. Check your email inbox
4. Click the reset link
5. Enter new password
6. Sign in with new password

### 5. Migrate Existing Users (If Any)

If you have existing users in the JSON files:

```javascript
// Run this script to migrate users
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const users = JSON.parse(fs.readFileSync('./backend/data/users.json', 'utf8'));

async function migrateUsers() {
  for (const user of users) {
    // Create auth user
    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email: user.email,
      email_confirm: true,
      user_metadata: { name: user.name }
    });
    
    if (error) {
      console.error(`Failed to create auth user for ${user.email}:`, error);
      continue;
    }
    
    // Update profile with auth user ID
    await supabase
      .from('users')
      .update({ id: authUser.user.id })
      .eq('email', user.email);
    
    console.log(`✓ Migrated ${user.email}`);
  }
}

migrateUsers();
```

---

## 🎯 New Authentication Flow

### Sign Up Flow
```
User enters email/password
    ↓
Frontend: supabase.auth.signUp()
    ↓
Backend: Creates user profile in database
    ↓
User is created (auto-confirmed in dev)
    ↓
User can sign in
```

### Sign In Flow
```
User enters email/password
    ↓
Frontend: supabase.auth.signInWithPassword()
    ↓
Supabase verifies credentials
    ↓
Returns session (access_token, refresh_token)
    ↓
Backend API calls use access_token
    ↓
Frontend stores session (auto-managed)
```

### Password Reset Flow
```
User clicks "Forgot Password"
    ↓
Enters email
    ↓
Frontend: supabase.auth.resetPasswordForEmail()
    ↓
Supabase sends reset email
    ↓
User clicks link in email
    ↓
Redirected to /reset-password
    ↓
Enters new password
    ↓
Frontend: supabase.auth.updateUser({ password })
    ↓
Password updated!
```

---

## 🔧 Troubleshooting

### "Invalid API key" error
- Check that `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set
- Make sure you're using the **anon/public** key, not the service key
- Restart the dev server after adding env vars

### Password reset email not arriving
- Check spam folder
- Verify email settings in Supabase dashboard
- For development, use a real email address (not temp mail)
- Check Supabase logs: **Authentication** → **Logs**

### "User already exists" on signup
- The email is already registered in Supabase Auth
- User should use "Forgot Password" to reset and sign in

### Session not persisting
- Supabase automatically stores session in localStorage
- Check browser console for errors
- Ensure `persistSession: true` in Supabase client config

### Backend still getting "Invalid token"
- Make sure backend is using `SUPABASE_SERVICE_KEY` for admin operations
- Verify the auth middleware is using `supabase.auth.getUser(token)`
- Check that frontend is sending `Bearer <access_token>` in headers

---

## 🎨 Optional Enhancements

### Enable Email Verification
```javascript
// In backend signup
const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: false  // Require email verification
});
```

### Add Social Login (Google, GitHub, etc.)
1. Enable providers in Supabase Dashboard
2. Configure OAuth credentials
3. Update frontend:
```javascript
await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

### Add Magic Links (Passwordless)
```javascript
await supabase.auth.signInWithOtp({
  email: 'user@email.com'
});
```

---

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Auth UI](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui) - Pre-built components
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Migration Checklist

- [ ] Run schema.sql in Supabase
- [ ] Configure Authentication settings in Supabase dashboard
- [ ] Set up environment variables (backend + frontend)
- [ ] Update password column in users table
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test password reset flow
- [ ] Test dashboard access
- [ ] Migrate existing users (if any)
- [ ] Customize email templates (optional)
- [ ] Set up custom SMTP for production (optional)

---

**Migration Complete! 🎉**

Your app now uses Supabase Auth for better security, automatic session management, and built-in features like password reset!



