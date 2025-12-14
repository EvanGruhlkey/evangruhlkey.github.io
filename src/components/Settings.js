import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { authAPI, userAPI } from '../services/api';

export function Settings() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuth = await authAPI.isAuthenticated();
        if (!isAuth) {
          navigate('/signin');
          return;
        }

        const user = await authAPI.getCurrentUser();
        setProfileData({
          name: user.name,
          email: user.email,
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        await authAPI.signout();
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailDeals: true,
    emailWeekly: true,
    emailMarketing: false,
    pushDeals: true,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await userAPI.updateProfile(profileData.name, profileData.email);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setIsSaving(true);
    try {
      await userAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    // TODO: Add notifications API endpoint
    setTimeout(() => {
      setIsSaving(false);
      alert('Notification preferences saved!');
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('Final confirmation: Delete all your data and account?')) {
        try {
          await userAPI.deleteAccount();
          navigate('/');
        } catch (error) {
          console.error('Failed to delete account:', error);
          alert(error.message || 'Failed to delete account. Please try again.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
            >
              <svg className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-mono text-sm text-foreground/80 group-hover:text-foreground transition-colors">Back to Dashboard</span>
            </button>
            
            <h1 className="font-sentient text-xl font-bold absolute left-1/2 transform -translate-x-1/2">Settings</h1>
            
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-sentient font-bold mb-2">
              Account <i className="font-light">Settings</i>
            </h1>
            <p className="font-mono text-sm text-foreground/60">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Section */}
          <div className="bg-background/60 border border-border rounded-xl p-8">
            <h2 className="text-2xl font-sentient font-bold mb-6">Profile Information</h2>
              
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                  />
                  <p className="text-xs font-mono text-foreground/50 mt-1">
                    Changing your email will require verification
                  </p>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
          </div>

          {/* Password Section */}
          <div className="bg-background/60 border border-border rounded-xl p-8">
            <h2 className="text-2xl font-sentient font-bold mb-6">Change Password</h2>
              
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                  />
                  <p className="text-xs font-mono text-foreground/50 mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={handleChangePassword} disabled={isSaving}>
                    {isSaving ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-background/60 border border-border rounded-xl p-8">
            <h2 className="text-2xl font-sentient font-bold mb-6">Notification Preferences</h2>
              
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-border/30">
                  <div>
                    <p className="font-mono text-sm font-semibold">New Deal Alerts</p>
                    <p className="text-xs font-mono text-foreground/60 mt-1">
                      Get notified when we find deals matching your searches
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailDeals}
                    onChange={(e) => setNotifications({ ...notifications, emailDeals: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-border/30">
                  <div>
                    <p className="font-mono text-sm font-semibold">Weekly Digest</p>
                    <p className="text-xs font-mono text-foreground/60 mt-1">
                      Summary of top deals every week
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailWeekly}
                    onChange={(e) => setNotifications({ ...notifications, emailWeekly: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-border/30">
                  <div>
                    <p className="font-mono text-sm font-semibold">Marketing Emails</p>
                    <p className="text-xs font-mono text-foreground/60 mt-1">
                      Product updates and tips
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailMarketing}
                    onChange={(e) => setNotifications({ ...notifications, emailMarketing: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-border/30">
                  <div>
                    <p className="font-mono text-sm font-semibold">Push Notifications</p>
                    <p className="text-xs font-mono text-foreground/60 mt-1">
                      Browser notifications for urgent deals
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.pushDeals}
                    onChange={(e) => setNotifications({ ...notifications, pushDeals: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveNotifications} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            </div>

          {/* Billing Section */}
          <div className="bg-background/60 border border-border rounded-xl p-8">
            <h2 className="text-2xl font-sentient font-bold mb-6">Billing & Subscription</h2>
              
              {/* Current Plan */}
              <div className="bg-background/40 border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs text-foreground/60 uppercase mb-2">Current Plan</p>
                    <p className="text-3xl font-sentient font-bold mb-1">Free</p>
                    <p className="text-sm font-mono text-foreground/60">$0 / month</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-sm font-mono text-foreground/60 mb-1">Daily Deals</p>
                    <p className="font-sentient font-bold">5</p>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-foreground/60 mb-1">Saved Searches</p>
                    <p className="font-sentient font-bold">2</p>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-foreground/60 mb-1">Marketplaces</p>
                    <p className="font-sentient font-bold">eBay</p>
                  </div>
                </div>
              </div>

              {/* Upgrade Section */}
              <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20 rounded-lg p-6 mb-6">
                <h3 className="font-sentient text-lg font-semibold mb-2">Upgrade to Pro</h3>
                <p className="text-sm font-mono text-foreground/70 mb-4">
                  Get unlimited deals, advanced AI scoring, and all marketplace support for $19/month.
                </p>
                <Button onClick={() => window.location.href = '/#pricing'}>
                  View Plans
                </Button>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-sentient text-lg font-semibold mb-3">Payment Method</h3>
                <div className="bg-background/40 border border-border rounded-lg p-6">
                  <p className="text-sm font-mono text-foreground/60">
                    No payment method on file. Upgrade to a paid plan to add payment details.
                  </p>
                </div>
              </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-8">
            <h3 className="text-xl font-sentient font-bold text-red-600 mb-3">Delete Account</h3>
            <p className="text-sm font-mono text-foreground/70 mb-6 max-w-xl">
              Permanently delete your Quoril account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-mono text-sm font-semibold rounded-lg transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

