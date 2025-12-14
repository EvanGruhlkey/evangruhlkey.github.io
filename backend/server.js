require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Using service key for admin operations
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔌 Connecting to Supabase...');
console.log('URL:', supabaseUrl ? '✓ Set' : '✗ Missing');

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to verify Supabase JWT token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(403).json({ error: 'Authentication failed' });
  }
}

// ============================================
// AUTH ROUTES
// ============================================

// Sign up - Now handled by Supabase Auth
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for development
      user_metadata: { name }
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Create user profile in users table
    const { data: user, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id, // Use Supabase auth user ID
          name,
          email,
          password: '', // No longer storing password - handled by Supabase Auth
          plan: 'free'
        }
      ])
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Failed to create user profile' });
    }

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan
      },
      message: 'User created successfully. Please sign in.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sign in - Now handled by Supabase Auth
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Get user profile
    const { data: user, error: profileError } = await supabase
      .from('users')
      .select('id, name, email, plan')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    res.json({
      session: authData.session,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, plan')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// SAVED SEARCHES ROUTES
// ============================================

// Get all searches for user
app.get('/api/searches', authenticateToken, async (req, res) => {
  try {
    const { data: searches, error } = await supabase
      .from('searches')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ error: 'Failed to fetch searches' });
    }

    res.json(searches);
  } catch (error) {
    console.error('Get searches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new search
app.post('/api/searches', authenticateToken, async (req, res) => {
  try {
    const { name, keywords, category, priceMin, priceMax, condition, marketplaces } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Search name is required' });
    }

    // Get user to check plan
    const { data: user } = await supabase
      .from('users')
      .select('plan')
      .eq('id', req.user.id)
      .single();

    // Get user's existing searches
    const { data: userSearches } = await supabase
      .from('searches')
      .select('id')
      .eq('user_id', req.user.id);

    // Check limits for free users
    if (user.plan === 'free' && userSearches.length >= 2) {
      return res.status(403).json({ error: 'Free plan limited to 2 saved searches' });
    }

    // Insert new search
    const { data: newSearch, error } = await supabase
      .from('searches')
      .insert([
        {
          user_id: req.user.id,
          name,
          keywords: keywords || [],
          category,
          price_min: priceMin,
          price_max: priceMax,
          condition,
          marketplaces: marketplaces || [],
          active: true,
          results_count: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to create search' });
    }

    res.status(201).json(newSearch);
  } catch (error) {
    console.error('Create search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update search
app.put('/api/searches/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Map camelCase to snake_case for database
    const dbUpdates = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.keywords) dbUpdates.keywords = updates.keywords;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.priceMin !== undefined) dbUpdates.price_min = updates.priceMin;
    if (updates.priceMax !== undefined) dbUpdates.price_max = updates.priceMax;
    if (updates.condition) dbUpdates.condition = updates.condition;
    if (updates.marketplaces) dbUpdates.marketplaces = updates.marketplaces;
    if (updates.active !== undefined) dbUpdates.active = updates.active;

    const { data: updatedSearch, error } = await supabase
      .from('searches')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !updatedSearch) {
      return res.status(404).json({ error: 'Search not found' });
    }

    res.json(updatedSearch);
  } catch (error) {
    console.error('Update search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete search
app.delete('/api/searches/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('searches')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(404).json({ error: 'Search not found' });
    }

    res.json({ message: 'Search deleted successfully' });
  } catch (error) {
    console.error('Delete search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// PASSWORD RESET ROUTES
// ============================================

// Request password reset
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Send password reset email via Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      // Don't reveal if email exists or not for security
    }

    res.json({ message: 'If an account exists with that email, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify reset token and update password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Verify the token and update password
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    });

    if (error) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sign out (optional - mainly handled on client side)
app.post('/api/auth/signout', authenticateToken, async (req, res) => {
  try {
    // Supabase handles token invalidation on client side
    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// USER PROFILE ROUTES
// ============================================

// Update profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if new email already exists
    if (email) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email)
        .neq('id', req.user.id)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update user
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, name, email, plan')
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password - Now uses Supabase Auth
app.put('/api/user/password', authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    // Update password via Supabase Auth (requires admin access)
    const { error } = await supabase.auth.admin.updateUserById(
      req.user.id,
      { password: newPassword }
    );

    if (error) {
      console.error('Password update error:', error);
      return res.status(500).json({ error: 'Failed to update password' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete account - Delete from both Auth and Database
app.delete('/api/user/account', authenticateToken, async (req, res) => {
  try {
    // Delete from users table (will cascade delete searches)
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', req.user.id);

    if (dbError) {
      console.error('Database delete error:', dbError);
      return res.status(500).json({ error: 'Failed to delete account data' });
    }

    // Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(req.user.id);

    if (authError) {
      console.error('Auth delete error:', authError);
      // Profile is already deleted, so still return success
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// DEALS ROUTES
// ============================================

const dealsRouter = require('./routes/deals');
app.use('/api/deals', dealsRouter);

// ============================================
// ROOT ROUTE (Health Check)
// ============================================

app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Quoril API is running',
    version: '1.0.0'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'Quoril API v1.0.0',
    endpoints: ['/api/auth', '/api/searches', '/api/deals', '/api/user']
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: Supabase`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🛒 eBay Integration:`, process.env.EBAY_APP_ID ? '✓ Configured' : '✗ Not configured');
});

// Export for Vercel serverless
module.exports = app;




