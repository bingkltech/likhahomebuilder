import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Music, Youtube, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/newsletter`, { email });

      toast({
        title: 'Success!',
        description: 'You have been subscribed to our newsletter',
      });

      setEmail('');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to subscribe. Please try again.';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
            Stay Updated with Our Latest Projects
          </h3>
          <p className="text-gray-400 mb-6">Subscribe to our newsletter for exclusive offers and updates</p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-zinc-700 text-white"
              disabled={loading}
              aria-label="Email address for newsletter"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#C4D600', color: '#000' }}
              className="font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 pt-12 border-t border-zinc-800">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 fill-none stroke-[#C4D600]"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 21V12h6v9" className="opacity-50" />
              </svg>
              <div>
                <h3 className="text-lg font-black text-white leading-none">LIKHA</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1">Home Builders</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Building your dream modular homes with quality, efficiency, and affordability.
            </p>
            <div className="flex gap-3">
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

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-[#C4D600] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-[#C4D600] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-[#C4D600] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-[#C4D600] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-[#C4D600] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C4D600] mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  123 Construction Ave, Building District, Manila 1234, Philippines
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C4D600] flex-shrink-0" />
                <a href="https://wa.me/639193944262" className="text-sm text-gray-400 hover:text-[#C4D600]">
                  +63 919 394 4262
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C4D600] flex-shrink-0" />
                <a href="mailto:info@likhahomebuilders.com" className="text-sm text-gray-400 hover:text-[#C4D600]">
                  info@likhahomebuilders.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Copyright 2024 – LIKHA HOME BUILDERS ®. All rights reserved.
            </p>
            <p className="text-sm text-red-500 font-semibold">
              PIRACY IS A CRIME - Authorized Dealer Only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ⚡ Bolt Performance Optimization:
// Wrap the Footer component in React.memo() to prevent unnecessary re-renders.
// The Footer primarily displays static links, social icons, and a newsletter form.
// By memoizing it, we ensure that state updates higher in the tree (like page scrolling
// or other form interactions) do not trigger expensive re-renders of this component.
export default React.memo(Footer);