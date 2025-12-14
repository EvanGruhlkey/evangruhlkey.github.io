import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show header on auth/dashboard/settings pages
  const hideHeaderRoutes = ['/dashboard', '/signup', '/signin', '/onboarding', '/forgot-password', '/settings', '/waitlist'];
  const hideOnDealDetails = location.pathname.startsWith('/deals/');
  
  if (hideHeaderRoutes.includes(location.pathname) || hideOnDealDetails) {
    return null;
  }

  const menuItems = [
    { name: "Features", href: "#features", type: "anchor" },
    { name: "Pricing", href: "#pricing", type: "anchor" },
  ];

  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleMenuClick = (href, type) => {
    if (type === "route") {
      navigate(href);
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full pt-3 sm:pt-4 md:pt-6 lg:pt-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Liquid Glass Navbar */}
        <header className="liquid-glass-nav relative flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl">
          {/* Decorative gradient border effect */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-black/10 via-black/5 to-black/10 pointer-events-none" style={{ padding: '1px' }}>
            <div className="w-full h-full rounded-xl sm:rounded-2xl bg-transparent"></div>
          </div>
          
          <button 
            onClick={handleLogoClick}
            className="relative z-10 h-10 sm:h-12 md:h-14 lg:h-16 w-auto flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            {/* Use PNG on mobile for sharp rendering, SVG on desktop */}
            <picture>
              <source media="(max-width: 767px)" srcSet="/QuorilLogo.png" />
              <img 
                src="/QuorilLogo.svg"
                alt="Quoril"
                className="w-[140px] xs:w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] -ml-3 sm:-ml-4 md:-ml-6"
              />
            </picture>
          </button>

          {/* Desktop Navigation */}
          <nav className="relative z-10 hidden lg:flex items-center gap-6 xl:gap-8 mr-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className="inline-block font-sentient font-light italic text-lg xl:text-xl text-black/90 hover:text-black transition-all duration-200 ease-out hover:scale-105"
                onClick={() => handleMenuClick(item.href, item.type)}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => navigate('/signin')}
              className="font-sentient font-light italic text-lg xl:text-xl text-black/90 hover:text-black transition-all duration-200 ease-out hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 bg-black text-white font-mono text-sm font-medium rounded-lg hover:bg-black/90 transition-all duration-200 hover:scale-105 shadow-md"
            >
              Get Started
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative z-10 lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-black/5 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="w-5 sm:w-6 h-4 sm:h-5 flex flex-col justify-between">
              <span 
                className={`w-full h-0.5 bg-black/90 rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5 sm:translate-y-2' : ''
                }`}
              />
              <span 
                className={`w-full h-0.5 bg-black/90 rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span 
                className={`w-full h-0.5 bg-black/90 rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5 sm:-translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </header>
      </div>

      {/* Mobile Menu - Liquid Glass Dropdown */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <nav className="fixed top-[4.5rem] sm:top-[5rem] md:top-[5.5rem] left-3 right-3 sm:left-4 sm:right-4 md:left-6 md:right-6 z-40 lg:hidden liquid-glass-nav rounded-xl sm:rounded-2xl p-4 sm:p-5 animate-slideDown">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  className="w-full text-left font-sentient font-light italic text-base sm:text-lg text-black/90 hover:text-black hover:bg-black/5 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200"
                  onClick={() => handleMenuClick(item.href, item.type)}
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-black/10 my-2"></div>
              <button
                onClick={() => {
                  navigate('/signin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left font-sentient font-light italic text-base sm:text-lg text-black/90 hover:text-black hover:bg-black/5 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-black text-white font-mono text-sm font-medium rounded-lg hover:bg-black/90 transition-all duration-200 shadow-md"
              >
                Get Started Free
              </button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
};
