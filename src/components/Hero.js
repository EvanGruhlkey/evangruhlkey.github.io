import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GL } from "./gl";
import { Button } from "./ui/button";

export function Hero() {
  const [hovering, setHovering] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [clientError, setClientError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setClientError('');

    if (!email) {
      setClientError('Please enter your email address.');
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setClientError('Please enter a valid email address (e.g., example@domain.com).');
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const formData = new URLSearchParams();
    formData.append('email', email);

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw_4yHTKCE9OJdvZv7hYZPs95p8gUQ733c3oRQ5UVUwLSQ1jsytgmEHpP_1ZHYdjtUVfw/exec', { 
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for joining the waitlist!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Failed to join waitlist. Please try again later.');
        try {
          const errorData = await response.json();
          console.error('Waitlist submission failed:', response.status, errorData);
        } catch (jsonError) {
          console.error('Waitlist submission failed: Could not parse error response JSON', response.status, jsonError);
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
      console.error('Waitlist submission error:', error);
    }
  };

  return (
    <>
      <GL hovering={hovering} scrollProgress={scrollProgress} />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sentient font-bold leading-tight">
              Your AI-Powered <br />
              <i className="font-light">Buyer Agent</i>
            </h1>
            <p className="font-mono text-base sm:text-lg md:text-xl text-foreground/70 text-balance mt-6 max-w-[600px] mx-auto leading-relaxed font-semibold">
            Quoril uncovers the deals others overlook
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-8">
              <input
                type="text"
                placeholder="Enter your email"
                className="px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-foreground/40 font-mono transition-colors duration-300"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setClientError('');
                  setStatus('idle');
                }}
                disabled={status === 'submitting'}
              />
              <Button 
                type="submit"
                disabled={status === 'submitting'}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
              >
                {status === 'submitting' ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </form>
            
            {(message || clientError) && (
              <p className={`mt-4 text-sm font-mono ${status === 'success' ? 'text-primary' : 'text-red-500'}`}>
              {message || clientError}
            </p>
          )}
        </div>
      </section>

      {/* Features Section */}
        <section id="features" className="min-h-screen flex items-center justify-center px-4 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-6 leading-tight">
                Intelligence That <i className="font-light">Works For You</i>
              </h2>
              <p className="font-mono text-foreground/80 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-semibold">
                Quoril automatically scans, ranks, and tracks opportunities so you can make faster, smarter decisions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: "AI-Powered Insight Engine",
                  description: "Automatically scans the web, documents, and data sources, then summarizes the most important insights in seconds. Perfect for research, recruitment, and competitive analysis."
                },
                {
                  title: "Smart Ranking & Scoring",
                  description: "Evaluates options and gives you a ranked list based on your custom priorities with weighted criteria and fit scores."
                },
                {
                  title: "Unified Dashboard",
                  description: "Track changes, updates, and new opportunities with instant alerts. Live notifications and auto-updated profiles make Quoril proactive, not passive."
                }
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  className="bg-background/60 backdrop-blur-sm border border-border rounded-lg p-8 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-xl font-sentient font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-sm text-foreground/75 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketplaces Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-6 leading-tight">
                Supported <i className="font-light">Marketplaces</i>
              </h2>
              <p className="font-mono text-foreground/80 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-semibold">
                Track our development progress as we expand platform support.
              </p>
            </div>

            <div className="bg-background/40 backdrop-blur-md border border-border/30 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/20">
                    <th className="text-left px-8 md:px-12 py-6 md:py-8 font-sentient text-xl md:text-2xl text-foreground">
                      Marketplace
                    </th>
                    <th className="text-right px-8 md:px-12 py-6 md:py-8 font-sentient text-xl md:text-2xl text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/10">
                    <td className="px-8 md:px-12 py-8 md:py-10 font-sentient text-lg md:text-xl text-foreground">
                      eBay
                    </td>
                    <td className="px-8 md:px-12 py-8 md:py-10 text-right">
                      <span className="inline-block font-mono text-sm md:text-base font-semibold text-primary tracking-wide">
                        IN DEVELOPMENT
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/10">
                    <td className="px-8 md:px-12 py-8 md:py-10 font-sentient text-lg md:text-xl text-foreground">
                      Facebook Marketplace
                    </td>
                    <td className="px-8 md:px-12 py-8 md:py-10 text-right">
                      <span className="inline-block font-mono text-sm md:text-base font-medium text-foreground/50 tracking-wide">
                        PLANNED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-8 md:px-12 py-8 md:py-10 font-sentient text-lg md:text-xl text-foreground">
                      OfferUp
                    </td>
                    <td className="px-8 md:px-12 py-8 md:py-10 text-right">
                      <span className="inline-block font-mono text-sm md:text-base font-medium text-foreground/50 tracking-wide">
                        PLANNED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="min-h-[60vh] flex items-center justify-center px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-6 leading-tight">
              Have <i className="font-light">Questions?</i>
            </h2>
            <p className="font-mono text-foreground/80 text-lg md:text-xl mb-8 font-semibold leading-relaxed">
              Want to learn more or explore partnership opportunities?
            </p>
            <Button
              onClick={() => {
                window.location.href = '/contact';
              }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className="text-lg px-8 py-6"
            >
              Contact Us
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-12">
              {/* Logo and Social Media */}
              <div className="md:col-span-1 flex flex-col items-start">
                <img 
                  src="/QuorilLogo.svg"
                  alt="Quoril"
                  className="w-[180px] h-auto mb-6 -ml-2"
                />
                {/* Social Media Icons */}
                <div className="flex items-center gap-6 ml-6">
                  {/* Instagram */}
                  <a 
                    href="https://instagram.com/quoril" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-foreground transition-colors"
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
                    className="text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

                  {/* Email */}
                  <a 
                    href="mailto:evangruhlkey@tamu.edu"
                    className="text-foreground/60 hover:text-foreground transition-colors"
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
                <h4 className="font-mono text-sm font-semibold uppercase mb-5 text-foreground">Product</h4>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => {
                        const element = document.querySelector('#features');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="font-mono text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      Features
                    </button>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-mono text-sm font-semibold uppercase mb-5 text-foreground">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/terms" className="font-mono text-sm text-foreground/60 hover:text-foreground transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="font-mono text-sm text-foreground/60 hover:text-foreground transition-colors">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-mono text-sm font-semibold uppercase mb-5 text-foreground">Contact</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/contact" className="font-mono text-sm text-foreground/60 hover:text-foreground transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-10 border-t border-border/30">
              <p className="font-mono text-foreground/40 text-sm text-center">
                © 2025 Quoril. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
