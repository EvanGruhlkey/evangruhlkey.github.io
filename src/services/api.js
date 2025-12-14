import { supabase, getAccessToken } from '../lib/supabase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make authenticated requests
async function fetchAPI(endpoint, options = {}) {
  // Get Supabase access token
  const token = await getAccessToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  signup: async (name, email, password) => {
    // Create user via backend (backend handles both auth user and profile)
    const data = await fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    return data;
  },

  signin: async (email, password) => {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Get user profile from backend
    const data = await fetchAPI('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store user profile (session is handled by Supabase)
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  signout: async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return await fetchAPI('/auth/me');
  },

  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Password reset functions
  forgotPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Password reset email sent' };
  },

  resetPassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Password updated successfully' };
  },
};

// ============================================
// SEARCHES API
// ============================================

export const searchesAPI = {
  getAll: async () => {
    return await fetchAPI('/searches');
  },

  create: async (searchData) => {
    return await fetchAPI('/searches', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  },

  update: async (id, searchData) => {
    return await fetchAPI(`/searches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(searchData),
    });
  },

  delete: async (id) => {
    return await fetchAPI(`/searches/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  updateProfile: async (name, email) => {
    const data = await fetchAPI('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, email }),
    });
    
    // Update stored user
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
  },

  changePassword: async (newPassword) => {
    // Update password via Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }

    // Also update via backend
    return await fetchAPI('/user/password', {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
  },

  deleteAccount: async () => {
    const data = await fetchAPI('/user/account', {
      method: 'DELETE',
    });
    
    // Sign out and clear local storage
    await authAPI.signout();
    
    return data;
  },
};




