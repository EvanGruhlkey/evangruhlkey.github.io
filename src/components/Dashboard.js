import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { CreateSearchModal } from './CreateSearchModal';
import { ManageSearchesModal } from './ManageSearchesModal';
import { authAPI, searchesAPI } from '../services/api';

// Mock data for demonstration
const MOCK_DEALS = [
  {
    id: 1,
    title: "Canon EOS R6 Mark II Mirrorless Camera Body",
    marketplace: "eBay",
    price: 1899,
    originalPrice: 2499,
    score: 65,
    image: "https://images.unsplash.com/photo-1606980707986-dddb1b1be277?w=400&h=300&fit=crop",
    seller: "trusted_camera_shop",
    sellerRating: 4.9,
    condition: "Like New",
    daysListed: 2,
    watching: 47,
    insights: ["35% below market average", "Excellent seller history", "Price dropped recently"],
    url: "#"
  },
  {
    id: 2,
    title: "iPhone 14 Pro Max 256GB Deep Purple - Unlocked",
    marketplace: "Facebook Marketplace",
    price: 849,
    originalPrice: 1099,
    score: 88,
    image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=400&h=300&fit=crop",
    seller: "John Smith",
    sellerRating: 4.7,
    condition: "Excellent",
    daysListed: 1,
    watching: 23,
    insights: ["23% below market average", "Local pickup available", "Battery health 96%"],
    url: "#"
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    marketplace: "eBay",
    price: 279,
    originalPrice: 399,
    score: 92,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop",
    seller: "audio_experts_inc",
    sellerRating: 4.8,
    condition: "New",
    daysListed: 3,
    watching: 89,
    insights: ["30% discount", "Free shipping", "Authorized dealer"],
    url: "#"
  },
  {
    id: 4,
    title: "MacBook Air M2 13-inch 16GB RAM 512GB SSD",
    marketplace: "OfferUp",
    price: 999,
    originalPrice: 1399,
    score: 85,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    seller: "TechResale",
    sellerRating: 4.6,
    condition: "Very Good",
    daysListed: 5,
    watching: 34,
    insights: ["29% below retail", "Includes original box", "AppleCare+ eligible"],
    url: "#"
  },
  {
    id: 5,
    title: "DJI Mini 3 Pro Drone with RC Controller",
    marketplace: "eBay",
    price: 649,
    originalPrice: 759,
    score: 78,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
    seller: "drone_depot",
    sellerRating: 4.5,
    condition: "Used",
    daysListed: 7,
    watching: 56,
    insights: ["15% below average", "Low flight hours", "All accessories included"],
    url: "#"
  },
  {
    id: 6,
    title: "Nintendo Switch OLED Model - White",
    marketplace: "Facebook Marketplace",
    price: 269,
    originalPrice: 349,
    score: 81,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop",
    seller: "GamingHub",
    sellerRating: 4.4,
    condition: "Good",
    daysListed: 4,
    watching: 12,
    insights: ["23% off retail", "Includes 3 games", "Screen protector applied"],
    url: "#"
  }
];

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [minScore, setMinScore] = useState(70);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Get user plan from stored user data
  const userPlan = user?.plan || 'free';
  const isFree = userPlan === 'free';

  // Fetch user and searches on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if authenticated
        const isAuth = await authAPI.isAuthenticated();
        if (!isAuth) {
          console.log('Not authenticated, redirecting to signin...');
          navigate('/signin');
          return;
        }

        // Get current user
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        console.log('User loaded:', userData);

        // Get saved searches
        const searches = await searchesAPI.getAll();
        setSavedSearches(searches);
        console.log('Searches loaded:', searches);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert(`Error: ${error.message}\n\nMake sure the backend is running on http://localhost:5000`);
        
        // For demo purposes, allow viewing with mock data
        setIsLoading(false);
        
        // If unauthorized, redirect to signin
        if (error.message.includes('token') || error.message.includes('authenticate')) {
          await authAPI.signout();
          navigate('/signin');
        }
        return;
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSaveSearch = async (searchData) => {
    try {
      // Check if free user has reached limit
      if (isFree && savedSearches.length >= 2) {
        if (window.confirm('You can have up to 2 saved searches on the free plan. Upgrade to Pro for unlimited searches. Upgrade now?')) {
          navigate('/#pricing');
        }
        return;
      }
      
      // Save to backend
      const newSearch = await searchesAPI.create(searchData);
      setSavedSearches([...savedSearches, newSearch]);
      setIsSearchModalOpen(false);
      alert('Search created successfully!');
    } catch (error) {
      console.error('Failed to create search:', error);
      alert(error.message || 'Failed to create search. Please try again.');
    }
  };

  const handleEditSearch = async (search) => {
    console.log('Editing search:', search);
    // TODO: Implement edit modal with pre-filled data
    setIsManageModalOpen(false);
    setIsSearchModalOpen(true);
    alert(`Edit functionality for "${search.name}" - coming soon!`);
  };

  const handleDeleteSearch = async (searchId) => {
    try {
      await searchesAPI.delete(searchId);
      setSavedSearches(savedSearches.filter(s => s.id !== searchId));
      alert('Search deleted successfully!');
    } catch (error) {
      console.error('Failed to delete search:', error);
      alert(error.message || 'Failed to delete search. Please try again.');
    }
  };

  // Filter and sort deals
  let filteredDeals = MOCK_DEALS
    .filter(deal => selectedMarketplace === 'all' || deal.marketplace === selectedMarketplace)
    .filter(deal => deal.score >= minScore)
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return a.daysListed - b.daysListed;
      return 0;
    });

  // Limit deals for free tier
  const FREE_DEAL_LIMIT = 5;
  const isFreeLimited = isFree && filteredDeals.length > FREE_DEAL_LIMIT;
  if (isFree) {
    filteredDeals = filteredDeals.slice(0, FREE_DEAL_LIMIT);
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-foreground/60';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-500/10 border-green-500/30';
    if (score >= 80) return 'bg-blue-500/10 border-blue-500/30';
    if (score >= 70) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-foreground/5 border-foreground/20';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 hover:border-border hover:bg-foreground/5 transition-all duration-200"
            >
              <img 
                src="/QuorilLogoQ.svg"
                alt="Quoril"
                className="h-6 w-6"
              />
            </button>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsSearchModalOpen(true)}
                className="hidden sm:flex h-10 text-sm px-5 shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Search
              </Button>

              {/* Settings Button */}
              <button 
                onClick={() => navigate('/settings')}
                className="w-10 h-10 rounded-lg hover:bg-foreground/5 active:bg-foreground/10 transition-all duration-200 flex items-center justify-center group"
                title="Settings"
              >
                <svg className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* User Menu Button */}
              <button 
                className="w-10 h-10 rounded-lg hover:bg-foreground/5 active:bg-foreground/10 transition-all duration-200 flex items-center justify-center group"
                title="Account"
                onClick={() => {
                  if (window.confirm('Sign out?')) {
                    authAPI.signout();
                    navigate('/');
                  }
                }}
              >
                <svg className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-sentient font-bold mb-2">
                  Your <i className="font-light">Deals</i>
                </h1>
                <p className="font-mono text-foreground/60 text-sm">
                  {filteredDeals.length} opportunities found • Updated 2 min ago
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background/60 border border-border rounded-lg p-4">
                <p className="font-mono text-xs text-foreground/60 mb-1 uppercase">Total Deals</p>
                <p className="text-2xl font-sentient font-bold">{MOCK_DEALS.length}</p>
              </div>
              <div className="bg-background/60 border border-border rounded-lg p-4">
                <p className="font-mono text-xs text-foreground/60 mb-1 uppercase">Avg Score</p>
                <p className="text-2xl font-sentient font-bold">86.5</p>
              </div>
              <div className="bg-background/60 border border-border rounded-lg p-4">
                <p className="font-mono text-xs text-foreground/60 mb-1 uppercase">Active Searches</p>
                <p className="text-2xl font-sentient font-bold">
                  {isFree ? '2' : '3'}
                </p>
              </div>
              <div className="bg-background/60 border border-border rounded-lg p-4">
                <p className="font-mono text-xs text-foreground/60 mb-1 uppercase">New Today</p>
                <p className="text-2xl font-sentient font-bold text-primary">12</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Saved Searches */}
            <div className="bg-background/60 border border-border rounded-lg p-6">
              <h3 className="font-sentient text-lg font-semibold mb-4">Saved Searches</h3>
              <div className="space-y-3">
              {savedSearches.slice(0, isFree ? 2 : savedSearches.length).map(search => (
                  <div 
                    key={search.id}
                    className="flex items-start justify-between p-3 bg-background/40 rounded-lg hover:bg-background/60 transition-colors cursor-pointer border border-border/30"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium truncate">{search.name || search.query}</p>
                      <p className="font-mono text-xs text-foreground/60 mt-1">
                        {search.marketplaces ? `${search.marketplaces.join(', ')}` : 'Active'}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full mt-2 ml-2 flex-shrink-0 ${search.active !== false ? 'bg-primary' : 'bg-foreground/20'}`} />
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setIsManageModalOpen(true)}
                className="w-full mt-4 text-sm"
              >
                Manage Searches
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-background/60 border border-border rounded-lg p-6">
              <h3 className="font-sentient text-lg font-semibold mb-4">Filters</h3>
              
              <div className="space-y-4">
                {/* Marketplace Filter */}
                <div>
                  <label className="font-mono text-xs text-foreground/60 uppercase mb-2 block">
                    Marketplace
                  </label>
                  <select 
                    value={selectedMarketplace}
                    onChange={(e) => setSelectedMarketplace(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                  >
                    <option value="all">All Marketplaces</option>
                    <option value="eBay">eBay</option>
                    <option value="Facebook Marketplace">Facebook Marketplace</option>
                    <option value="OfferUp">OfferUp</option>
                  </select>
                </div>

                {/* Score Filter */}
                <div>
                  <label className="font-mono text-xs text-foreground/60 uppercase mb-2 block">
                    Min Score: {minScore}
                  </label>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="font-mono text-xs text-foreground/60 uppercase mb-2 block">
                    Sort By
                  </label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                  >
                    <option value="score">Highest Score</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono text-sm text-foreground/60">
                Showing {filteredDeals.length} of {MOCK_DEALS.length} deals
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg border transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-background border-border text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg border transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-background border-border text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Deals Grid/List */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredDeals.map(deal => (
                <div 
                  key={deal.id}
                  className="bg-background/60 border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className={viewMode === 'grid' ? '' : 'flex'}>
                    {/* Image */}
                    <div className={`relative overflow-hidden bg-foreground/5 ${viewMode === 'grid' ? 'h-48' : 'w-48 h-48 flex-shrink-0'}`}>
                      <img 
                        src={deal.image} 
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Score Badge */}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full border backdrop-blur-sm ${getScoreBgColor(deal.score)}`}>
                        <span className={`font-mono text-sm font-bold ${getScoreColor(deal.score)}`}>
                          {deal.score}
                        </span>
                      </div>
                      {/* Marketplace Badge */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-background/90 backdrop-blur-sm rounded border border-border">
                        <span className="font-mono text-xs font-semibold">{deal.marketplace}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      <h3 className="font-sentient text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {deal.title}
                      </h3>
                      
                      {/* Price */}
                       <div className="flex items-baseline gap-2 mb-3">
                         <span className="text-2xl font-sentient font-bold text-primary">${deal.price}</span>
                         <span className="text-sm font-mono text-foreground/40 line-through">${deal.originalPrice}</span>
                         <span className="text-xs font-mono font-semibold text-green-500">
                           {Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                         </span>
                       </div>

                       {/* Metadata */}
                      <div className="flex flex-wrap gap-3 mb-3 text-xs font-mono text-foreground/60">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {deal.sellerRating}
                        </span>
                        <span>•</span>
                        <span>{deal.condition}</span>
                        <span>•</span>
                        <span>{deal.daysListed}d ago</span>
                        <span>•</span>
                        <span>{deal.watching} watching</span>
                      </div>

                      {/* Insights */}
                      <div className="space-y-1 mb-4">
                        {deal.insights.slice(0, 2).map((insight, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-mono text-foreground/70">{insight}</span>
                          </div>
                        ))}
                      </div>

                       {/* Actions */}
                       <div className="flex gap-2">
                         <Button 
                           className="flex-1 text-sm"
                           onClick={() => navigate(`/deals/${deal.id}`)}
                         >
                           View Deal
                         </Button>
                         <button 
                           className="px-3 py-2 bg-background border border-border rounded-lg hover:border-primary transition-colors"
                           onClick={() => {
                             if (isFree) {
                               if (window.confirm('Saved deals feature is available in Pro. Upgrade now?')) {
                                 navigate('/#pricing');
                               }
                             }
                           }}
                           title={isFree ? 'Upgrade to save deals' : 'Save deal'}
                         >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                           </svg>
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredDeals.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-sentient font-semibold mb-2">No deals found</h3>
                <p className="font-mono text-sm text-foreground/60 mb-6">
                  Try adjusting your filters or create a new search
                </p>
                <Button>Create New Search</Button>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Create Search Modal */}
      <CreateSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSave={handleSaveSearch}
      />

      {/* Manage Searches Modal */}
      <ManageSearchesModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        searches={savedSearches}
        onEdit={handleEditSearch}
        onDelete={handleDeleteSearch}
        onCreateNew={() => {
          setIsManageModalOpen(false);
          setIsSearchModalOpen(true);
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-mono text-sm text-foreground/60">Loading dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}
