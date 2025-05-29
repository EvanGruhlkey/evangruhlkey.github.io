import React, { useState, useEffect, useRef } from 'react';
import { 
  BellAlertIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  BoltIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

function ParticleEffect() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const particleCount = 50;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      container.appendChild(particle);
      particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2
      });
    }

    const animate = () => {
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1;

        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      particles.forEach(particle => particle.element.remove());
    };
  }, []);

  return <div ref={containerRef} className="particles" />;
}

function ScoutRadar() {
  return (
    <div className="scout-radar">
      <div className="scout-line" />
      <div className="scout-dot" style={{ animationDelay: '0s' }} />
      <div className="scout-dot" style={{ animationDelay: '0.5s' }} />
      <div className="scout-dot" style={{ animationDelay: '1s' }} />
      <div className="scout-dot" style={{ animationDelay: '1.5s' }} />
      <div className="scout-dot" style={{ animationDelay: '2s' }} />
      <div className="scout-dot" style={{ animationDelay: '2.5s' }} />
    </div>
  );
}

function RadarAnimation() {
  return (
    <div className="radar-container">
      <div className="radar-circle" />
      <div className="radar-sweep" />
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="radar-dot"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}
    </div>
  );
}

function ListingsTicker() {
  const listings = [
    { title: "iPhone 13 Pro", price: "$699", discount: "30% off", condition: "Like New" },
    { title: "MacBook Air M1", price: "$799", discount: "25% off", condition: "Excellent" },
    { title: "Sony A7III", price: "$1499", discount: "40% off", condition: "Mint" },
    { title: "Nintendo Switch", price: "$199", discount: "20% off", condition: "Good" },
    { title: "iPad Pro 12.9", price: "$899", discount: "35% off", condition: "Like New" },
    { title: "Canon EOS R6", price: "$1800", discount: "15% off", condition: "Used" },
    { title: "DJI Mavic Air 2", price: "$650", discount: "22% off", condition: "Excellent" },
  ];

  return (
    <div className="listings-ticker">
      <div className="ticker-track">
        {[...listings, ...listings].map((listing, i) => (
          <div key={i} className="listing-card">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900 text-base">{listing.title}</h4>
              <span className="text-xs text-gray-500 ml-2">{listing.condition}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-blue-600 font-bold text-base">{listing.price}</p>
              <span className="deal-tag good text-sm">{listing.discount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypingMessage() {
  const messages = [
    "Hey, is this still available? I can pick up today.",
    "Would you consider $50? I can meet right now.",
    "Is the price negotiable? I'm very interested."
  ];

  return (
    <div className="typing-container min-h-[80px]">
      <div className="typing-text">
        {messages[0]}
      </div>
      <div className="mt-3 text-sm text-gray-500">
        AI-generated message
      </div>
    </div>
  );
}

function DealTag({ type, text, delay = 0 }) {
  return (
    <div 
      className={`deal-tag ${type}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {type === 'hot' ? '🔥 ' : '💰 '}{text}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full transition-all duration-300 z-50 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <SparklesIcon className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              Scoutly
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
          </div>
          <button
            className="md:hidden btn-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Menu
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NetworkAnimation() {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);
  // We will manage traveling dots directly in the animation loop

  const sampleListings = [
    { title: "Vintage Camera", price: "$50", condition: "Used" },
    { title: "Antique Chair", price: "$120", condition: "Good" },
    { title: "Rare Vinyl Record", price: "$30", condition: "Mint" },
    { title: "Collectibe Coin Set", price: "$80", condition: "Like New" },
    { title: "Designer Handbag", price: "$300", condition: "Excellent" },
    { title: "Gaming Console", price: "$250", condition: "Used" },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const numNodes = 40; // Number of network nodes
    const nodeElements = [];
    const lineElements = [];
    const travelingDotElements = new Set(); // Use a Set to manage active dots
    let animationFrameId;
    const popups = new Set(); // Manage active popups

    // Create nodes
    const createdNodes = [];
    for (let i = 0; i < numNodes; i++) {
      const node = document.createElement('div');
      node.className = 'network-node';
      // Random positions within the container, with some padding
      const x = Math.random() * (container.offsetWidth - 80) + 40; // Increased padding
      const y = Math.random() * (container.offsetHeight - 80) + 40; // Increased padding
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.animationDelay = `${Math.random() * 1.5}s`; // Slightly faster stagger
      container.appendChild(node);
      nodeElements.push(node);
      createdNodes.push({ x, y, element: node, id: i });
    }
    setNodes(createdNodes);

    // Create connections (lines) between nearby nodes
    const createdLines = [];
    for (let i = 0; i < createdNodes.length; i++) {
      for (let j = i + 1; j < createdNodes.length; j++) {
        const node1 = createdNodes[i];
        const node2 = createdNodes[j];
        const distance = Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2));

        if (distance < 200) { // Increased connection distance
          const line = document.createElement('div');
          line.className = 'network-line';
          line.style.width = `${distance}px`;
          line.style.left = `${node1.x}px`;
          line.style.top = `${node1.y}px`;
          const angle = Math.atan2(node2.y - node1.y, node2.x - node1.x) * 180 / Math.PI;
          line.style.transform = `rotate(${angle}deg)`;
          container.appendChild(line);
          lineElements.push(line);
          createdLines.push({ element: line, startNode: node1, endNode: node2, distance });
        }
      }
    }
    setLines(createdLines);

    // Function to show a listing popup near a node
    const showListingPopup = (node) => {
      const randomListing = sampleListings[Math.floor(Math.random() * sampleListings.length)];

      const popup = document.createElement('div');
      popup.className = 'listing-popup';
      popup.innerHTML = `
        <h5>${randomListing.title}</h5>
        <p>${randomListing.price}</p>
        <span>Condition: ${randomListing.condition}</span>
      `;

      container.appendChild(popup);
      popups.add(popup);

      // Position popup near the node, adjusting for boundaries and corners
      const nodeRect = node.element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      let initialLeft = nodeRect.left - containerRect.left - popup.offsetWidth / 2 + nodeRect.width / 2;
      let initialTop = nodeRect.top - containerRect.top - popup.offsetHeight - 10; // Default: position above the node

      const margin = 100; // Further increased minimum distance, especially for top-left
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;

      let finalLeft = initialLeft;
      let finalTop = initialTop;

       // Function to check if a position is near a specific edge or within a corner area
       const isNearTopEdge = (top) => top < margin;
       const isNearLeftEdge = (left) => left < margin;
       const isNearBottomEdge = (top) => top + popupHeight > containerHeight - margin;
       const isNearRightEdge = (left) => left + popupWidth > containerWidth - margin;

       const isInTopLeftCornerArea = (left, top) => isNearLeftEdge(left) && isNearTopEdge(top);
       const isInTopRightCornerArea = (left, top) => isNearRightEdge(left) && isNearTopEdge(top);
       const isInBottomLeftCornerArea = (left, top) => isNearLeftEdge(left) && isNearBottomEdge(top);
       const isInBottomRightCornerArea = (left, top) => isNearRightEdge(left) && isNearBottomEdge(top);


      // --- Positioning Logic focused on robust top-left corner avoidance ---

      // If the initial preferred position (above node) is in the top-left corner area,
      // calculate an alternative position below and to the right.
      if (isInTopLeftCornerArea(initialLeft, initialTop)) {
          let alternateLeft = nodeRect.left - containerRect.left - popup.offsetWidth / 2 + nodeRect.width / 2 + popupWidth * 0.5; // Shift right
          let alternateTop = nodeRect.top - containerRect.top + nodeRect.height + 10; // Position below

          // Check if the alternative position is valid and not in another corner
          if (alternateLeft >= margin && alternateLeft + popupWidth <= containerWidth - margin &&
              alternateTop >= margin && alternateTop + popupHeight <= containerHeight - margin &&
              !isInTopRightCornerArea(alternateLeft, alternateTop) &&
              !isInBottomLeftCornerArea(alternateLeft, alternateTop) &&
              !isInBottomRightCornerArea(alternateLeft, alternateTop))
           {
              finalLeft = alternateLeft;
              finalTop = alternateTop;
           } else {
               // If alternative also problematic, force to a safe position
               finalLeft = margin; 
               finalTop = margin; 
           }
      }
      // If not in the top-left corner, apply standard clamping to ensure it's within bounds with margin
       else {
            finalLeft = Math.max(margin, Math.min(initialLeft, containerWidth - popupWidth - margin));
            finalTop = Math.max(margin, Math.min(initialTop, containerHeight - popupHeight - margin));
       }


      // Final clamping just in case (redundant but safe)
      finalLeft = Math.max(margin, Math.min(finalLeft, containerWidth - popupWidth - margin));
      finalTop = Math.max(margin, Math.min(finalTop, containerHeight - popupHeight - margin));

      popup.style.left = `${finalLeft}px`;
      popup.style.top = `${finalTop}px`;

      // Remove popup after animation
      popup.addEventListener('animationend', () => {
        popup.remove();
        popups.delete(popup);
      });
    };

    // Create and manage traveling dots via animation loop
    const createTravelingDot = () => {
        if (createdLines.length === 0) return;
        const randomLine = createdLines[Math.floor(Math.random() * createdLines.length)];
        const dot = document.createElement('div');
        dot.className = 'traveling-dot';
        container.appendChild(dot);
        travelingDotElements.add(dot);

        const startNode = randomLine.startNode;
        const endNode = randomLine.endNode;
        const duration = randomLine.distance * 15; // Duration based on line length

        // Use Web Animations API for precise control
        const animation = dot.animate([
          { transform: `translate(${startNode.x - 2}px, ${startNode.y - 2}px)` }, // Adjust for dot size
          { transform: `translate(${endNode.x - 2}px, ${endNode.y - 2}px)` }
        ], {
          duration: duration,
          iterations: 1,
          easing: 'linear'
        });

        animation.onfinish = () => {
          dot.remove();
          travelingDotElements.delete(dot);
          // Trigger listing popup when dot reaches the end node
          showListingPopup(endNode);
          // Start a new dot from this node after a short delay
          setTimeout(createTravelingDot, 500); // Short delay before starting next dot
        };
    };

    // Start initial traveling dots
    if (createdLines.length > 0) {
        for (let i = 0; i < 3; i++) { // Start with 3 traveling dots
            setTimeout(createTravelingDot, i * 1000); // Stagger initial dots
        }
    }

    // Animation loop (optional, for potential future complex movements)
    // const animate = () => {
    //   // Update positions or properties if needed
    //   animationFrameId = requestAnimationFrame(animate);
    // };
    // animate();

    return () => {
      // Cleanup
      cancelAnimationFrame(animationFrameId);
      nodeElements.forEach(node => node.remove());
      lineElements.forEach(line => line.remove());
      travelingDotElements.forEach(dot => dot.remove());
      popups.forEach(popup => popup.remove()); // Clean up popups
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div ref={containerRef} className="network-container">
      {/* Nodes, lines, traveling dots, and popups are added by useEffect */}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <NetworkAnimation />
      </div>
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-1 gap-12 items-center">
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-600 font-medium mb-6">
              🚀 The Future of Deal Hunting
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI-Powered Deal Scout for{' '}
              <span className="text-primary-600">
                Facebook Marketplace
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Scoutly watches listings 24/7, finds hidden gems, and messages sellers before anyone else.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary group">
                Join the Waitlist
                <ArrowRightIcon className="w-5 h-5 ml-2 inline-block transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary group">
                Watch Demo
                <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <div className="mt-8 flex items-center space-x-4 justify-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">100+</span> early users already joined
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <BellAlertIcon className="w-8 h-8 text-blue-600" />,
      title: "Smart Deal Alerts",
      description: "Get instant notifications when underpriced items matching your criteria are listed.",
      highlight: "Real-time monitoring",
      stats: "24/7",
      component: <ListingsTicker />
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />,
      title: "AI Message Generator",
      description: "Automatically craft personalized messages to sellers that get responses.",
      highlight: "90% response rate",
      stats: "2x faster",
      component: <TypingMessage />
    },
    {
      icon: <ChartBarIcon className="w-8 h-8 text-blue-600" />,
      title: "Price-to-Market Scoring",
      description: "Our AI analyzes thousands of listings to determine if an item is truly a good deal.",
      highlight: "95% accuracy",
      stats: "10k+ items",
      component: (
        <div className="relative h-32 w-full">
          <DealTag type="hot" text="92% Match" delay={0} />
          <DealTag type="good" text="30% Below Market" delay={1} />
          <DealTag type="hot" text="Trending Item" delay={2} />
        </div>
      )
    }
  ];

  return (
    <section id="features" className="section-padding bg-gray-50 relative overflow-hidden">
      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-6">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Supercharge Your{' '}
            <span className="text-blue-600">
              Deal Hunting
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Our AI-powered features help you find and secure the best deals before anyone else.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 feature-card flex flex-col"
            >
              <div className="feature-icon mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center text-blue-600 font-medium">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                  {feature.highlight}
                </div>
                <div className="text-sm font-medium text-blue-500">
                  {feature.stats}
                </div>
              </div>
              <div className="mt-auto">
                {feature.component}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "Scoutly helped me find a vintage camera worth $500 for just $50! The AI message generator is a game-changer.",
      author: "Sarah K.",
      role: "Photography Enthusiast",
      avatar: "https://i.pravatar.cc/150?img=1",
      savings: "$450"
    },
    {
      quote: "I've saved over $2,000 on furniture for my new apartment. The price scoring feature is incredibly accurate.",
      author: "Michael T.",
      role: "Home Decor Collector",
      avatar: "https://i.pravatar.cc/150?img=2",
      savings: "$2,000+"
    }
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-6">
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Trusted by{' '}
            <span className="text-blue-600">
              Deal Hunters
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Join hundreds of smart shoppers who are already saving big with Scoutly.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4 ring-2 ring-blue-100 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
                <div className="ml-auto deal-badge good">
                  Saved {testimonial.savings}
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      features: ["Basic deal alerts", "Limited searches", "Community support"],
      popular: false,
      icon: <RocketLaunchIcon className="w-6 h-6 text-blue-600" />
    },
    {
      name: "Pro",
      price: "9.99",
      features: ["Unlimited deal alerts", "AI message generator", "Price scoring", "Priority support"],
      popular: true,
      icon: <BoltIcon className="w-6 h-6 text-blue-600" />
    },
    {
      name: "Team",
      price: "29.99",
      features: ["Everything in Pro", "Multiple users", "Team dashboard", "API access"],
      popular: false,
      icon: <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-gray-50 relative overflow-hidden">
      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-6">
            Choose Your Plan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Simple,{' '}
            <span className="text-blue-600">
              Transparent
            </span>{' '}
            Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that works best for your deal hunting needs.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col ${
                plan.popular ? 'ring-2 ring-blue-500 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="deal-badge good">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-6">
                <span className="text-blue-600 font-bold">${''}</span>{plan.price}
                <span className="text-gray-500 text-lg">/month</span>
              </p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full mt-auto ${
                plan.popular ? 'btn-primary' : 'btn-secondary'
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <SparklesIcon className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold text-blue-400">Scoutly</h3>
            </div>
            <p className="text-gray-400">
              Your AI-powered deal scout for Facebook Marketplace and Craigslist.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Scoutly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

export default App; 