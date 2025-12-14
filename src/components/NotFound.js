import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation/Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-sentient font-bold text-primary/20 mb-4">
            404
          </div>
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-foreground/5 flex items-center justify-center">
            <svg className="w-16 h-16 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-sentient font-bold mb-4">
          Page Not <i className="font-light">Found</i>
        </h1>
        <p className="text-lg font-mono text-foreground/70 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-background border-2 border-border rounded-lg hover:border-primary transition-colors font-mono text-sm font-semibold"
          >
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm font-mono text-foreground/60 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate('/')} className="text-sm font-mono text-primary hover:underline">
              Home
            </button>
            <button onClick={() => navigate('/dashboard')} className="text-sm font-mono text-primary hover:underline">
              Dashboard
            </button>
            <button onClick={() => navigate('/settings')} className="text-sm font-mono text-primary hover:underline">
              Settings
            </button>
            <button onClick={() => navigate('/contact')} className="text-sm font-mono text-primary hover:underline">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}






