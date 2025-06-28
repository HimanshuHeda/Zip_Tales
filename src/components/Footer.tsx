import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      setSubscribed(true);
      setIsSubscribing(false);
      setEmail('');
    }, 1500);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/Zip Tales.jpg" alt="ZipTales" className="h-10 w-10 rounded-full" />
              <div>
                <h3 className="text-xl font-bold">ZipTales</h3>
                <p className="text-sm text-gray-300">Breaking News, Not Trust</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              AI-powered news verification platform that filters misinformation and provides 
              community-verified credibility scores for authentic journalism.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/TalesZip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/ziptales3/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/voting" className="text-gray-300 hover:text-white transition-colors">
                  Community Voting
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-300 hover:text-white transition-colors">
                  Submit News
                </Link>
              </li>
              <li>
                <Link to="/saved" className="text-gray-300 hover:text-white transition-colors">
                  Saved Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/politics" className="text-gray-300 hover:text-white transition-colors">
                  Politics
                </Link>
              </li>
              <li>
                <Link to="/categories/technology" className="text-gray-300 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/categories/sports" className="text-gray-300 hover:text-white transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/categories/entertainment" className="text-gray-300 hover:text-white transition-colors">
                  Entertainment
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400">Stay Updated</h4>
            <p className="text-gray-300 text-sm">
              Subscribe to our newsletter for verified news updates and platform announcements.
            </p>
            
            {subscribed ? (
              <div className="bg-green-600 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-white" />
                <span className="text-white text-sm font-medium">Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubscribing ? 'Subscribing...' : 'Subscribe'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Connect Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-pink-400">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-400">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@ziptales.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Global Remote Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-center mb-6 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            Built by Team Code Breakers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <h5 className="font-medium text-pink-400">Himanshu Heda</h5>
              <p className="text-sm text-gray-300">Team Leader / Manager</p>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://www.linkedin.com/in/himanshu-heda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  LinkedIn
                </a>
                <span className="text-gray-500">•</span>
                <a
                  href="https://github.com/HimanshuHeda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 text-xs"
                >
                  GitHub
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-blue-400">Avni Sharma</h5>
              <p className="text-sm text-gray-300">Frontend Developer</p>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://www.linkedin.com/in/avnisharma1705/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  LinkedIn
                </a>
                <span className="text-gray-500">•</span>
                <a
                  href="https://github.com/AVNI-THEEXPLORER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 text-xs"
                >
                  GitHub
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-pink-400">Lakshita Pagaria</h5>
              <p className="text-sm text-gray-300">Python Developer</p>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://www.linkedin.com/in/lakshita-pagaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  LinkedIn
                </a>
                <span className="text-gray-500">•</span>
                <a
                  href="https://github.com/LakshitaPagaria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 text-xs"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} ZipTales. All rights reserved. | Breaking News, Not Trust.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;