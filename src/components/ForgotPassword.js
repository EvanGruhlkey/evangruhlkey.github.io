import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { authAPI } from '../services/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await authAPI.forgotPassword(email);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <picture>
                <source media="(max-width: 767px)" srcSet="/QuorilLogo.png" />
                <img 
                  src="/QuorilLogo.svg"
                  alt="Quoril"
                  className="h-12 w-auto mx-auto"
                />
              </picture>
            </Link>
          </div>

          {/* Success Card */}
          <div className="bg-background/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-sentient font-bold mb-3">
              Check your <i className="font-light">email</i>
            </h2>
            <p className="font-mono text-sm text-foreground/70 mb-6">
              We've sent a password reset link to<br />
              <span className="font-semibold text-foreground">{email}</span>
            </p>

            <div className="bg-foreground/5 rounded-lg p-4 mb-6">
              <p className="font-mono text-xs text-foreground/60 text-left leading-relaxed">
                <strong>Didn't receive it?</strong><br />
                • Check your spam folder<br />
                • Make sure you entered the correct email<br />
                • Wait a few minutes and try again
              </p>
            </div>

            <Link to="/signin">
              <Button className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <picture>
              <source media="(max-width: 767px)" srcSet="/QuorilLogo.png" />
              <img 
                src="/QuorilLogo.svg"
                alt="Quoril"
                className="h-12 w-auto mx-auto"
              />
            </picture>
          </Link>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-background/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl">
          <div className="mb-6">
            <h1 className="text-3xl font-sentient font-bold mb-2">
              Reset your <i className="font-light">password</i>
            </h1>
            <p className="font-mono text-sm text-foreground/70">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 bg-background border-2 rounded-lg focus:outline-none focus:border-primary transition-colors font-mono text-sm ${
                  error ? 'border-red-500' : 'border-border'
                }`}
                placeholder="you@example.com"
              />
              {error && (
                <p className="mt-1 text-xs font-mono text-red-500">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-base py-3"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Back to Sign In Link */}
          <div className="mt-6 text-center">
            <Link to="/signin" className="font-mono text-sm text-foreground/70 hover:text-primary transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




