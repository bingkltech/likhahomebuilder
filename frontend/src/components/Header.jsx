import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Phone, Mail, Menu, X, Facebook, Instagram, Music, Youtube } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center p-1">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12 fill-none stroke-[#C4D600]"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 21V12h6v9" className="stroke-[#C4D600]/50" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-white hover:text-[#C4D600] transition-colors leading-none">LIKHA</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1">Home Builders</p>
              </div>
            </Link>

            {/* Social Icons - Hidden on small screens */}
            <div className="hidden lg:flex items-center gap-2">
              <a href="https://www.facebook.com/likhahomebuilder/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4D600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4D600] focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Visit our Facebook page">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="https://au.pinterest.com/likhahomebuilder/_profile/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4D600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4D600] focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Visit our Pinterest profile">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.619 0 12.016 0z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@likhahomes" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4D600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4D600] focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Visit our TikTok profile">
                <Music className="w-4 h-4 text-white" />
              </a>
              <a href="https://www.instagram.com/likhahomebuilder/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4D600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4D600] focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Visit our Instagram page">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="https://x.com/LikhaHomes" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4D600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4D600] focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Visit our X (Twitter) profile">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@likhahomes" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4D600] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4D600] focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Visit our YouTube channel">
                <Youtube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 ${isActive(link.path)
                  ? 'text-[#C4D600]'
                  : 'text-white hover:text-[#C4D600]'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Contact Info - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="https://wa.me/639193944262"
              className="flex items-center gap-2 text-sm text-white hover:text-[#C4D600] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>+63 919 394 4262</span>
            </a>
            <a
              href="mailto:info@likhahomebuilders.com"
              className="flex items-center gap-2 text-sm text-white hover:text-[#C4D600] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>info@likhahomebuilders.com</span>
            </a>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white" aria-label="Open mobile menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-zinc-800">
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-semibold transition-colors ${isActive(link.path)
                      ? 'text-[#C4D600]'
                      : 'text-white hover:text-[#C4D600]'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-zinc-800 pt-6 space-y-4">
                  <a
                    href="https://wa.me/639193944262"
                    className="flex items-center gap-2 text-sm text-white"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+63 919 394 4262</span>
                  </a>
                  <a
                    href="mailto:info@likhahomebuilders.com"
                    className="flex items-center gap-2 text-sm text-white"
                  >
                    <Mail className="w-4 h-4" />
                    <span>info@likhahomebuilders.com</span>
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

// ⚡ Bolt Performance Optimization:
// Wrap the Header component in React.memo() to prevent unnecessary re-renders.
// Since Header is a pure presentation component containing navigation links that
// do not rely on rapidly changing props from its parents, memoizing it saves
// rendering time during parent component updates.
export default React.memo(Header);