import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GL } from "./gl";
import { Button } from "./ui/button";

export function Hero() {
  const [hovering, setHovering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.min(scrollY / documentHeight, 1);
          setScrollProgress(progress);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <GL hovering={hovering} scrollProgress={scrollProgress} />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-3 sm:px-4 pt-20 sm:pt-24">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-[#E8E4DC] rounded-xl sm:rounded-2xl border border-black/10 shadow-xl p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="text-left space-y-4 sm:space-y-6 animate-fade-in-up">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sentient font-bold leading-tight">
                  Deal Discovery on <i className="font-light text-primary">Autopilot</i>
                </h1>
                
                <p className="font-mono text-base sm:text-lg md:text-xl text-black/70 leading-relaxed max-w-xl">
                Quoril scans, ranks, and alerts you to the best deals across marketplaces.
                Never miss an opportunity again.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Button 
                    onClick={() => navigate('/signup')}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                  >
                    Get Started Free
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 sm:pt-6 md:pt-8">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <div className="text-2xl sm:text-3xl font-sentient font-bold">50K+</div>
                      <div className="text-xs sm:text-sm font-mono text-black/60">Deals Tracked</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-sentient font-bold">24/7</div>
                      <div className="text-xs sm:text-sm font-mono text-black/60">Live Scanning</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-sentient font-bold">&lt;1m</div>
                      <div className="text-xs sm:text-sm font-mono text-black/60">Alert Time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Dashboard Preview */}
              <div className="relative animate-fade-in-right">
                {/* Actual Dashboard Screenshot */}
                <div className="relative bg-[#E8E4DC] rounded-2xl sm:rounded-3xl border border-black/10 p-2 sm:p-3 shadow-2xl">
                  {/* Real Dashboard Layout */}
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-black/5">
                    {/* Dashboard Nav */}
                    <div className="bg-white border-b border-black/5 px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#E8E4DC]/50 flex items-center justify-center p-1 sm:p-1.5 border border-black/5">
                          <img 
                            src="/QuorilLogoQ.svg"
                            alt="Quoril"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs font-mono rounded-lg shadow-sm">
                          + New
                        </button>
                      </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="p-3 sm:p-4 bg-white">
                      {/* Header */}
                      <div className="mb-3 sm:mb-4">
                        <h2 className="text-lg sm:text-xl font-sentient font-bold mb-1">
                          Your <span className="font-light italic">Deals</span>
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-mono text-black/40">
                          <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                          <span>Live</span>
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <div className="bg-[#E8E4DC]/30 border border-black/5 rounded-lg sm:rounded-xl p-2 sm:p-3">
                          <p className="text-xs font-mono text-black/40 mb-0.5 sm:mb-1">Total</p>
                          <p className="text-lg sm:text-xl font-sentient font-bold text-black/90">142</p>
                        </div>
                        <div className="bg-[#E8E4DC]/30 border border-black/5 rounded-lg sm:rounded-xl p-2 sm:p-3">
                          <p className="text-xs font-mono text-black/40 mb-0.5 sm:mb-1">Score</p>
                          <p className="text-lg sm:text-xl font-sentient font-bold text-black/90">86</p>
                        </div>
                        <div className="bg-[#E8E4DC]/30 border border-black/5 rounded-lg sm:rounded-xl p-2 sm:p-3">
                          <p className="text-xs font-mono text-black/40 mb-0.5 sm:mb-1">Active</p>
                          <p className="text-lg sm:text-xl font-sentient font-bold text-black/90">3</p>
                        </div>
                        <div className="bg-[#E8E4DC]/30 border border-black/5 rounded-lg sm:rounded-xl p-2 sm:p-3">
                          <p className="text-xs font-mono text-black/40 mb-0.5 sm:mb-1">New</p>
                          <p className="text-lg sm:text-xl font-sentient font-bold text-black/90">12</p>
                        </div>
                      </div>

                      {/* Deal Cards Grid */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {[
                          { 
                            title: 'Sony WH-1000XM5', 
                            price: 179, 
                            original: 399, 
                            score: 92, 
                            image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop'
                          },
                          { 
                            title: 'iPhone 14 Pro Max', 
                            price: 649, 
                            original: 1099, 
                            score: 88,
                            image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&h=300&fit=crop'
                          }
                        ].map((deal, i) => (
                          <div key={i} className="bg-white border border-black/5 rounded-lg sm:rounded-xl overflow-hidden hover:border-black/10 transition-all group">
                            {/* Image */}
                            <div className="relative h-20 sm:h-28 bg-[#E8E4DC]/20 overflow-hidden">
                              <img 
                                src={deal.image} 
                                alt={deal.title}
                                className="w-full h-full object-cover"
                              />
                              {/* Score Badge */}
                              <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-mono font-bold bg-black/80 text-white shadow-sm">
                                {deal.score}
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-2 sm:p-3">
                              <h4 className="text-xs sm:text-sm font-sentient font-semibold mb-1.5 sm:mb-2 text-black/90 line-clamp-1">{deal.title}</h4>
                              <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2">
                                <span className="text-lg sm:text-2xl font-sentient font-bold text-black/90">${deal.price}</span>
                                <span className="text-xs font-mono text-black/30 line-through">${deal.original}</span>
                              </div>
                              <button className="w-full py-1.5 sm:py-2 bg-black text-white text-xs font-mono rounded-lg hover:bg-black/90 transition-colors">
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

      {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto bg-[#E8E4DC] rounded-2xl border border-black/10 shadow-xl p-6 sm:p-8 md:p-12">
            <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-4 sm:mb-6 leading-tight">
                Everything You Need to <br className="hidden sm:block" />
                <i className="font-light text-primary">Find the Best Deals</i>
              </h2>
              <p className="font-mono text-black/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
                Quoril combines AI intelligence with real-time data to give you an unfair advantage in the marketplace.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: "AI-Powered Scoring",
                  description: "AI algorithms evaluate every deal based on price, seller reputation, condition, and market trends to give you an instant quality score."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  ),
                  title: "Real-Time Alerts",
                  description: "Get instant notifications when high-scoring deals matching your saved searches appear. Never miss a great opportunity again."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  ),
                  title: "Price History Tracking",
                  description: "See price trends over time and know exactly when to buy. Our algorithms detect price drops and notify you immediately."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: "Smart Search Filters",
                  description: "Create custom searches with advanced filters for price ranges, conditions, locations, and more. Save unlimited searches on Pro+."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Multi-Marketplace",
                  description: "Currently supporting eBay with expansion to Facebook Marketplace, OfferUp, Craigslist, and more coming soon."
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Seller Verification",
                  description: "AI analyzes seller history, ratings, and behavior patterns to help you avoid scams and find trustworthy sellers."
                }
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-black/10 rounded-xl p-4 sm:p-5 md:p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-sentient font-semibold mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-xs sm:text-sm text-black/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works / Services Section */}
        <section className="py-12 sm:py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto bg-[#E8E4DC] rounded-2xl border border-black/10 shadow-xl p-6 sm:p-8 md:p-12">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-4 sm:mb-6 leading-tight">
                Three Steps to <br className="hidden sm:block" />
                <i className="font-light text-primary">Better Deals</i>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: "01",
                  title: "Create Your Searches",
                  description: "Tell Quoril what you're looking for. Set your budget, preferred marketplaces, and quality requirements. Our AI learns your preferences over time.",
                  image: (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500/10 to-primary/10 rounded-lg flex items-center justify-center border border-black/10">
                      <svg className="w-16 h-16 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  )
                },
                {
                  step: "02",
                  title: "AI Scans & Scores",
                  description: "Quoril continuously monitors marketplaces, analyzing millions of listings. Each deal gets an AI-powered quality score based on your criteria.",
                  image: (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg flex items-center justify-center border border-black/10">
                      <svg className="w-16 h-16 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )
                },
                {
                  step: "03",
                  title: "Get Instant Alerts",
                  description: "Receive real-time notifications when high-scoring deals appear. Jump on opportunities before anyone else with direct links to listings.",
                  image: (
                    <div className="w-full h-48 bg-gradient-to-br from-green-500/10 to-primary/10 rounded-lg flex items-center justify-center border border-black/10">
                      <svg className="w-16 h-16 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  )
                }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="text-center">
                      <div className="mb-4 sm:mb-6">
                        {item.image}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-sentient font-bold mb-2 sm:mb-3">
                        {item.title}
                      </h3>
                      <p className="font-mono text-xs sm:text-sm text-black/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-12 sm:py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto bg-[#E8E4DC] rounded-2xl border border-black/10 shadow-xl p-6 sm:p-8 md:p-12">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-4 sm:mb-6 leading-tight">
                <i className="font-light">Pricing</i>
              </h2>
              <p className="font-mono text-black/80 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-semibold px-4">
                Start free, upgrade when you're ready. No hidden fees.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Free Tier */}
              <div className="bg-white border border-black/10 rounded-xl p-5 sm:p-6 md:p-8 hover:border-primary/50 transition-all duration-300">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-sentient font-bold mb-2">Free</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-4xl sm:text-5xl font-sentient font-bold">$0</span>
                    <span className="font-mono text-sm sm:text-base text-black/60">/month</span>
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-black/70">Perfect for casual buyers</p>
                </div>
                
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "1 saved search",
                    "Track up to 10 deals",
                    "Basic AI scoring",
                    "Deal history: 24 hours"
    
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-mono text-xs sm:text-sm text-black/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigate('/signup')}
                  className="w-full text-sm sm:text-base"
                  variant="outline"
                >
                  Get Started Free
                </Button>
              </div>

              {/* Pro Tier */}
              <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-2 border-primary rounded-xl p-5 sm:p-6 md:p-8 relative shadow-xl mt-6 sm:mt-8 md:mt-0 md:scale-105">
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-primary text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs font-mono font-bold uppercase whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-sentient font-bold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-4xl sm:text-5xl font-sentient font-bold">$25</span>
                    <span className="font-mono text-sm sm:text-base text-black/60">/month</span>
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-black/70">For serious deal hunters</p>
                </div>
                
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "5 saved searches",
                    "Track up to 100 deals",
                    "Advanced AI scoring",
                    "Email notifications",
                    "Deal history: 30 days",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-mono text-xs sm:text-sm text-black/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigate('/signup')}
                  className="w-full text-sm sm:text-base"
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                >
                  Get Started
                </Button>
              </div>

              {/* Pro+ Tier */}
              <div className="bg-white border border-black/10 rounded-xl p-5 sm:p-6 md:p-8 hover:border-primary/50 transition-all duration-300 sm:col-span-2 md:col-span-1">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-sentient font-bold mb-2">Pro+</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                  <span className="text-4xl sm:text-5xl font-sentient font-bold">$60</span>
                  <span className="font-mono text-sm sm:text-base text-black/60">/month</span>
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-black/70">For businesses & resellers</p>
                </div>
                
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Unlimited saved searches",
                    "Track up to 3000 deals",
                    "Advanced AI scoring",
                    "Real-time alerts",
                    "Full deal history"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-mono text-xs sm:text-sm text-black/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigate('/contact')}
                  className="w-full text-sm sm:text-base"
                  variant="outline"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#E8E4DC] rounded-2xl border border-black/10 shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-12">
              {/* Logo and Social Media */}
              <div className="md:col-span-1 flex flex-col items-start">
                {/* Use PNG on mobile for sharp rendering, SVG on desktop */}
                <picture>
                  <source media="(max-width: 767px)" srcSet="/QuorilLogo.png" />
                  <img 
                    src="/QuorilLogo.svg"
                    alt="Quoril"
                    className="w-[160px] sm:w-[180px] h-auto mb-6 -ml-2"
                  />
                </picture>
                {/* Social Media Icons */}
                <div className="flex items-center gap-6 ml-2 sm:ml-3 md:ml-4 lg:ml-6">
                  {/* Instagram */}
                  <a 
                    href="https://instagram.com/getquoril" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black/60 hover:text-black transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a 
                    href="https://linkedin.com/company/quoril" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black/60 hover:text-black transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

                  {/* Email */}
                  <a 
                    href="mailto:evangruhlkey@tamu.edu"
                    className="text-black/60 hover:text-black transition-colors"
                    aria-label="Email"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-mono text-sm font-semibold uppercase mb-5 text-black">Product</h4>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => {
                        const element = document.querySelector('#features');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="font-mono text-sm text-black/60 hover:text-black transition-colors"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        const element = document.querySelector('#pricing');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="font-mono text-sm text-black/60 hover:text-black transition-colors"
                    >
                      Pricing
                    </button>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-mono text-sm font-semibold uppercase mb-5 text-black">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/terms" className="font-mono text-sm text-black/60 hover:text-black transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="font-mono text-sm text-black/60 hover:text-black transition-colors">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-mono text-sm font-semibold uppercase mb-5 text-black">Contact</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/contact" className="font-mono text-sm text-black/60 hover:text-black transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

              {/* Copyright */}
              <div className="pt-10 border-t border-black/10">
                <p className="font-mono text-black/40 text-sm text-center">
                  © 2025 Quoril. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
