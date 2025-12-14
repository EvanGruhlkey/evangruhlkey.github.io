import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { authAPI } from '../services/api';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword(password);
      setMessage('Password reset successfully! Redirecting to sign in...');
      
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/QuorilLogo.svg" 
            alt="Quoril" 
            className="h-8 mx-auto mb-6"
          />
          <h1 className="text-3xl font-sentient font-bold mb-2">
            Reset <i className="font-light">Password</i>
          </h1>
          <p className="font-mono text-sm text-foreground/60">
            Enter your new password below
          </p>
        </div>

        <div className="bg-background/60 border border-border rounded-lg p-8">
          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="font-mono text-sm text-green-500">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="font-mono text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-foreground/60 uppercase mb-2 block">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                placeholder="Enter new password"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="font-mono text-xs text-foreground/60 uppercase mb-2 block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                placeholder="Confirm new password"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full text-base py-6"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="font-mono text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



