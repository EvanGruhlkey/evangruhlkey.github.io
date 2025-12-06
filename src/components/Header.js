import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Features", href: "#features" },
  ];

  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleMenuClick = (href) => {
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
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed z-50 top-0 left-0 w-full">
  <header className="relative pt-8 md:pt-14 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    
   
  <button 
  onClick={handleLogoClick}
  className="h-16 md:h-20 w-auto flex items-center cursor-pointer hover:opacity-80 transition-opacity"
>
       <img 
         src="/QuorilLogo.svg"
         alt="Quoril"
         className="w-[200px] sm:w-[220px] md:w-[250px] -ml-9"
         style={{ imageRendering: 'crisp-edges', WebkitFontSmoothing: 'antialiased' }}
       />
    </button>

    {/* Desktop Navigation */}
    <nav className="hidden lg:flex items-center mr-12">
      {menuItems.map((item) => (
        <button
          key={item.name}
          className="inline-block font-sentient font-light italic text-xl text-foreground hover:text-foreground/80 duration-150 transition-colors ease-out"
          onClick={() => handleMenuClick(item.href)}
        >
          {item.name}
        </button>
      ))}
    </nav>
        
        
      </header>
    </div>
  );
};
