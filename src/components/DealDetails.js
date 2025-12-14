import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';

// Mock data - in real app, would fetch based on ID
const DEAL_DATA = {
  1: {
    id: 1,
    title: "Canon EOS R6 Mark II Mirrorless Camera Body",
    marketplace: "eBay",
    price: 1899,
    originalPrice: 2499,
    score: 65,
    image: "https://images.unsplash.com/photo-1606980707986-dddb1b1be277?w=800&h=600&fit=crop",
    seller: "trusted_camera_shop",
    sellerRating: 4.9,
    sellerSales: 1250,
    condition: "Like New",
    daysListed: 2,
    watching: 47,
    description: "Professional-grade mirrorless camera in excellent condition. Includes original packaging, battery, charger, and strap. Body shows minimal signs of use. Sensor is clean and functioning perfectly.",
    shipping: "Free shipping",
    location: "New York, NY",
    returns: "30-day returns accepted",
    insights: [
      "35% below market average",
      "Excellent seller history",
      "Price dropped recently",
      "High demand item",
      "Trusted seller badge"
    ],
    priceHistory: [
      { date: "7 days ago", price: 2100 },
      { date: "5 days ago", price: 1999 },
      { date: "3 days ago", price: 1950 },
      { date: "Today", price: 1899 },
    ],
    similarDeals: [
      { id: 2, title: "Canon EOS R6 (Original)", price: 1499, marketplace: "eBay" },
      { id: 3, title: "Sony A7 IV Body", price: 2299, marketplace: "Facebook" },
    ]
  }
};

export function DealDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const deal = DEAL_DATA[id] || DEAL_DATA[1]; // Fallback to first deal

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
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-mono text-sm">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                className="w-9 h-9 rounded-lg hover:bg-foreground/5 transition-colors flex items-center justify-center"
                title="Save deal"
              >
                <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              
              <button 
                className="w-9 h-9 rounded-lg hover:bg-foreground/5 transition-colors flex items-center justify-center"
                title="Share"
              >
                <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column - Image & Gallery */}
            <div>
              <div className="bg-foreground/5 rounded-xl overflow-hidden mb-4">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full aspect-square object-cover"
                />
              </div>
              
              {/* Score Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getScoreBgColor(deal.score)}`}>
                <span className={`text-3xl font-sentient font-bold ${getScoreColor(deal.score)}`}>
                  {deal.score}
                </span>
                <div>
                  <p className={`text-xs font-mono font-semibold uppercase ${getScoreColor(deal.score)}`}>
                    Excellent Deal
                  </p>
                  <p className="text-xs font-mono text-foreground/60">AI Confidence Score</p>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-foreground/10 rounded text-xs font-mono font-semibold">
                    {deal.marketplace}
                  </span>
                  <span className="text-xs font-mono text-foreground/60">
                    Listed {deal.daysListed} days ago
                  </span>
                </div>
                
                <h1 className="text-3xl font-sentient font-bold mb-4">{deal.title}</h1>
                
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-sentient font-bold text-primary">${deal.price}</span>
                  <span className="text-xl font-mono text-foreground/40 line-through">${deal.originalPrice}</span>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-300 text-sm font-mono font-bold">
                    {Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                  </span>
                </div>
                
                <p className="text-sm font-mono text-green-600 font-semibold">
                  Save ${deal.originalPrice - deal.price}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <Button className="flex-1" onClick={() => window.open('#', '_blank')}>
                  View on {deal.marketplace}
                </Button>
                <button className="px-6 py-3 bg-background border-2 border-border rounded-lg hover:border-primary transition-colors font-mono text-sm font-semibold">
                  Save Deal
                </button>
              </div>

              {/* Seller Info */}
              <div className="bg-background/60 border border-border rounded-xl p-4 mb-6">
                <h3 className="font-sentient font-semibold mb-3">Seller Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-foreground/70">Seller</span>
                    <span className="font-mono font-semibold">{deal.seller}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-foreground/70">Rating</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-mono font-semibold">{deal.sellerRating}</span>
                      <span className="font-mono text-foreground/60">({deal.sellerSales.toLocaleString()} sales)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-foreground/70">Condition</span>
                    <span className="font-mono font-semibold">{deal.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-foreground/70">Shipping</span>
                    <span className="font-mono font-semibold text-green-600">{deal.shipping}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-foreground/70">Location</span>
                    <span className="font-mono font-semibold">{deal.location}</span>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30 rounded-xl p-4 mb-6">
                <h3 className="font-sentient font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  AI Insights
                </h3>
                <div className="space-y-2">
                  {deal.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-mono text-foreground/80">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-sentient font-semibold mb-3">Description</h3>
                <p className="text-sm font-mono text-foreground/80 leading-relaxed">
                  {deal.description}
                </p>
              </div>

              {/* Price History */}
              <div className="bg-background/60 border border-border rounded-xl p-4">
                <h3 className="font-sentient font-semibold mb-3">Price History</h3>
                <div className="space-y-2">
                  {deal.priceHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-foreground/70">{item.date}</span>
                      <span className="font-mono font-semibold">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Deals */}
          <div className="mt-12">
            <h2 className="text-2xl font-sentient font-bold mb-6">Similar Deals</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {deal.similarDeals.map(similar => (
                <div 
                  key={similar.id}
                  onClick={() => navigate(`/deals/${similar.id}`)}
                  className="bg-background/60 border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-all"
                >
                  <p className="font-mono text-sm font-semibold mb-2">{similar.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-sentient font-bold text-primary">${similar.price}</span>
                    <span className="text-xs font-mono text-foreground/60">{similar.marketplace}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






