import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const INTEREST_OPTIONS = [
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'cameras', label: 'Cameras', icon: '📷' },
  { id: 'apple', label: 'Apple Products', icon: '' },
  { id: 'tools', label: 'Tools', icon: '🔧' },
  { id: 'car-parts', label: 'Car Parts', icon: '🚗' },
  { id: 'furniture', label: 'Furniture', icon: '🪑' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'watches', label: 'Watches', icon: '⌚' },
];

const BUDGET_OPTIONS = [
  { id: 'under-100', label: 'Under $100', range: [0, 100] },
  { id: '100-500', label: '$100 - $500', range: [100, 500] },
  { id: '500-2000', label: '$500 - $2,000', range: [500, 2000] },
  { id: 'over-2000', label: 'Over $2,000', range: [2000, 10000] },
];

const MARKETPLACE_OPTIONS = [
  { id: 'ebay', label: 'eBay', status: 'active' },
  { id: 'facebook', label: 'Facebook Marketplace', status: 'coming-soon' },
  { id: 'offerup', label: 'OfferUp', status: 'coming-soon' },
  { id: 'craigslist', label: 'Craigslist', status: 'coming-soon' },
];

const SUGGESTED_SEARCHES = [
  'iPhone 14 Pro Max under $900',
  'Sony a7iv camera body',
  'MacBook Air M2 under $1000',
  'Nintendo Switch OLED',
  'Sony WH-1000XM5 headphones',
];

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interests: [],
    customInterest: '',
    budgetRange: '',
    marketplaces: ['ebay'],
    savedSearch: '',
  });

  const totalSteps = 4;

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleNext = () => {
      if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.interests.length > 0 || formData.customInterest.trim();
      case 2:
        return formData.budgetRange !== '';
      case 3:
        return formData.marketplaces.length > 0;
      case 4:
        return formData.savedSearch.trim();
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm text-foreground/70">
              Step {step} of {totalSteps}
            </span>
            <button
              onClick={handleSkip}
              className="font-mono text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              Skip for now
            </button>
          </div>
          <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-background/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl">
          {/* Step 1: Interests */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-sentient font-bold mb-3">
                What are you looking for <i className="font-light">deals</i> on?
              </h2>
              <p className="font-mono text-sm text-foreground/70 mb-6">
                Select all that apply. We'll customize your feed.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {INTEREST_OPTIONS.map(interest => (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.interests.includes(interest.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{interest.icon}</div>
                    <p className="font-mono text-sm font-semibold">{interest.label}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                  Or enter something specific
                </label>
                <input
                  type="text"
                  value={formData.customInterest}
                  onChange={(e) => setFormData(prev => ({ ...prev, customInterest: e.target.value }))}
                  placeholder="e.g., Vintage vinyl records, Mountain bikes..."
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-sentient font-bold mb-3">
                What's your <i className="font-light">budget</i> range?
              </h2>
              <p className="font-mono text-sm text-foreground/70 mb-6">
                This helps us prioritize the most relevant deals for you.
              </p>

              <div className="grid gap-3">
                {BUDGET_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setFormData(prev => ({ ...prev, budgetRange: option.id }))}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      formData.budgetRange === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-sentient text-xl font-bold">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Marketplaces */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-sentient font-bold mb-3">
                Select your <i className="font-light">marketplaces</i>
              </h2>
              <p className="font-mono text-sm text-foreground/70 mb-6">
                We'll scan these platforms for deals. More coming soon!
              </p>

              <div className="grid gap-3">
                {MARKETPLACE_OPTIONS.map(marketplace => (
                  <button
                    key={marketplace.id}
                    onClick={() => {
                      if (marketplace.status === 'active') {
                        setFormData(prev => ({
                          ...prev,
                          marketplaces: prev.marketplaces.includes(marketplace.id)
                            ? prev.marketplaces.filter(id => id !== marketplace.id)
                            : [...prev.marketplaces, marketplace.id]
                        }));
                      }
                    }}
                    disabled={marketplace.status === 'coming-soon'}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      formData.marketplaces.includes(marketplace.id)
                        ? 'border-primary bg-primary/10'
                        : marketplace.status === 'coming-soon'
                        ? 'border-border/50 opacity-50 cursor-not-allowed'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-sentient text-xl font-bold">{marketplace.label}</p>
                      {marketplace.status === 'coming-soon' && (
                        <span className="font-mono text-xs bg-foreground/10 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      )}
                      {marketplace.status === 'active' && formData.marketplaces.includes(marketplace.id) && (
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: First Search */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-sentient font-bold mb-3">
                Create your first <i className="font-light">saved search</i>
              </h2>
              <p className="font-mono text-sm text-foreground/70 mb-6">
                We'll monitor this 24/7 and alert you when we find great deals.
              </p>

              <div>
                <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                  What do you want to find?
                </label>
                <input
                  type="text"
                  value={formData.savedSearch}
                  onChange={(e) => setFormData(prev => ({ ...prev, savedSearch: e.target.value }))}
                  placeholder="e.g., iPhone 14 Pro Max under $900"
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm mb-4"
                />

                <p className="font-mono text-xs text-foreground/60 mb-3">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SEARCHES.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFormData(prev => ({ ...prev, savedSearch: suggestion }))}
                      className="px-3 py-1.5 bg-foreground/5 hover:bg-primary/10 border border-border hover:border-primary rounded-lg font-mono text-xs transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`font-mono text-sm transition-colors ${
                step === 1
                  ? 'text-foreground/30 cursor-not-allowed'
                  : 'text-foreground/70 hover:text-primary'
              }`}
            >
              ← Back
            </button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === totalSteps ? 'Start Finding Deals' : 'Continue'}
            </Button>
          </div>
        </div>

        {/* Benefits Preview */}
        {step === totalSteps && (
          <div className="mt-6 text-center">
            <p className="font-mono text-sm text-foreground/60 mb-3">
              🎉 You're starting with the <span className="text-primary font-semibold">Free plan</span>
            </p>
            <div className="flex justify-center gap-6 text-xs font-mono text-foreground/50">
              <span>✓ 5 deals per day</span>
              <span>✓ 2 saved searches</span>
              <span>✓ eBay support</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

