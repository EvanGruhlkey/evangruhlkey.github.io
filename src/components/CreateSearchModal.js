import { useState } from 'react';
import { Button } from './ui/button';

export function CreateSearchModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    keywords: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: 'any',
    marketplaces: ['ebay'],
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Electronics',
    'Cameras',
    'Apple Products',
    'Tools',
    'Car Parts',
    'Furniture',
    'Gaming',
    'Watches',
    'Other',
  ];

  const conditions = [
    { value: 'any', label: 'Any Condition' },
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'used', label: 'Used' },
  ];

  const marketplaceOptions = [
    { id: 'ebay', label: 'eBay', available: true },
    { id: 'facebook', label: 'Facebook Marketplace', available: false },
    { id: 'offerup', label: 'OfferUp', available: false },
  ];

  const handleMarketplaceToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      marketplaces: prev.marketplaces.includes(id)
        ? prev.marketplaces.filter(m => m !== id)
        : [...prev.marketplaces, id]
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Search name is required';
    }
    
    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
    }
    
    if (formData.minPrice && formData.maxPrice) {
      if (Number(formData.minPrice) > Number(formData.maxPrice)) {
        newErrors.maxPrice = 'Max price must be greater than min price';
      }
    }
    
    if (formData.marketplaces.length === 0) {
      newErrors.marketplaces = 'Select at least one marketplace';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        keywords: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: 'any',
        marketplaces: ['ebay'],
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-sentient font-bold">Create New Search</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-foreground/5 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Search Name */}
          <div>
            <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
              Search Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., iPhone 14 Pro Deals"
              className={`w-full px-4 py-3 bg-background border-2 rounded-lg focus:outline-none focus:border-primary font-mono text-sm ${
                errors.name ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs font-mono text-red-500">{errors.name}</p>}
          </div>

          {/* Keywords */}
          <div>
            <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
              Keywords *
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="e.g., iPhone 14 Pro Max unlocked"
              className={`w-full px-4 py-3 bg-background border-2 rounded-lg focus:outline-none focus:border-primary font-mono text-sm ${
                errors.keywords ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.keywords && <p className="mt-1 text-xs font-mono text-red-500">{errors.keywords}</p>}
            <p className="mt-1 text-xs font-mono text-foreground/50">
              Separate multiple keywords with spaces
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                Min Price ($)
              </label>
              <input
                type="number"
                value={formData.minPrice}
                onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
                Max Price ($)
              </label>
              <input
                type="number"
                value={formData.maxPrice}
                onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                placeholder="Unlimited"
                min="0"
                className={`w-full px-4 py-3 bg-background border-2 rounded-lg focus:outline-none focus:border-primary font-mono text-sm ${
                  errors.maxPrice ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.maxPrice && <p className="mt-1 text-xs font-mono text-red-500">{errors.maxPrice}</p>}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
              Condition
            </label>
            <div className="grid grid-cols-2 gap-2">
              {conditions.map(condition => (
                <button
                  key={condition.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: condition.value })}
                  className={`px-4 py-2 rounded-lg border-2 font-mono text-sm transition-all ${
                    formData.condition === condition.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {condition.label}
                </button>
              ))}
            </div>
          </div>

          {/* Marketplaces */}
          <div>
            <label className="block font-mono text-xs text-foreground/70 uppercase mb-2">
              Marketplaces *
            </label>
            <div className="space-y-2">
              {marketplaceOptions.map(marketplace => (
                <button
                  key={marketplace.id}
                  type="button"
                  onClick={() => marketplace.available && handleMarketplaceToggle(marketplace.id)}
                  disabled={!marketplace.available}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    formData.marketplaces.includes(marketplace.id)
                      ? 'border-primary bg-primary/10'
                      : marketplace.available
                      ? 'border-border hover:border-primary/50'
                      : 'border-border/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="font-mono text-sm font-semibold">{marketplace.label}</span>
                  {!marketplace.available && (
                    <span className="text-xs font-mono bg-foreground/10 px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                  {marketplace.available && formData.marketplaces.includes(marketplace.id) && (
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {errors.marketplaces && <p className="mt-1 text-xs font-mono text-red-500">{errors.marketplaces}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Search
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-background border-2 border-border rounded-lg hover:border-primary transition-colors font-mono text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






