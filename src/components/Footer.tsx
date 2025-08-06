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
            <div className="flex items-center space-x-2 group">
              <img 
                src="/Zip Tales.jpg" 
                alt="ZipTales" 
                className="h-10 w-10 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
              />
              <div>
                <h3 className="text-xl font-bold transition-all duration-300 group-hover:scale-105">ZipTales</h3>
                <p className="text-sm text-gray-300 transition-colors duration-300 group-hover:text-gray-200">Breaking News, Not Trust</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm transition-colors duration-300 hover:text-gray-200">
              AI-powered news verification platform that filters misinformation and provides 
              community-verified credibility scores for authentic journalism.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-all duration-300 hover:scale-110 hover:rotate-12 transform"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/TalesZip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:rotate-12 transform"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/ziptales3/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-all duration-300 hover:scale-110 hover:rotate-12 transform"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400 transition-all duration-300 hover:scale-105">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/voting" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                >
                  Community Voting
                </Link>
              </li>
              <li>
                <Link 
                  to="/submit" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                >
                  Submit News
                </Link>
              </li>
              <li>
                <Link 
                  to="/saved" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                >
                  Saved Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400 transition-all duration-300 hover:scale-105">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/categories/politics" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                >
                  Politics
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/technology" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/sports" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                >
                  Sports
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/entertainment" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                >
                  Entertainment
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400 transition-all duration-300 hover:scale-105">Stay Updated</h4>
            <p className="text-gray-300 text-sm transition-colors duration-300 hover:text-gray-200">
              Subscribe to our newsletter for verified news updates and platform announcements.
            </p>
            
            {subscribed ? (
              <div className="bg-green-600 rounded-lg p-4 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300">
                <CheckCircle className="h-5 w-5 text-white transition-transform duration-300 animate-pulse" />
                <span className="text-white text-sm font-medium">Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-all duration-300 group-hover:text-pink-400 group-focus-within:text-pink-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-400 hover:bg-gray-700"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 transform"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
              <h4 className="text-lg font-semibold text-pink-400 transition-all duration-300 hover:scale-105">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/about" 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 transform hover:translate-x-1 block"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-400 transition-all duration-300 hover:scale-105">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2 transition-all duration-300 hover:text-gray-200 hover:scale-105 transform">
                  <Mail className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span>support@ziptales.com</span>
                </div>
                <div className="flex items-center space-x-2 transition-all duration-300 hover:text-gray-200 hover:scale-105 transform">
                  <MapPin className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Global Remote Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-center mb-6 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
            Built by Team Code Breakers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2 group">
              <h5 className="font-medium text-pink-400 transition-all duration-300 group-hover:scale-105">Himanshu Heda</h5>
              <p className="text-sm text-gray-300 transition-colors duration-300 group-hover:text-gray-200">Team Leader / Manager</p>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://www.linkedin.com/in/himanshu-heda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs transition-all duration-300 hover:scale-105 hover:underline"
                >
                  LinkedIn
                </a>
                <span className="text-gray-500">•</span>
                <a
                  href="https://github.com/HimanshuHeda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 text-xs transition-all duration-300 hover:scale-105 hover:underline"
                >
                  GitHub
                </a>
              </div>
            </div>
            <div className="space-y-2 group">
              <h5 className="font-medium text-blue-400 transition-all duration-300 group-hover:scale-105">Avni Sharma</h5>
              <p className="text-sm text-gray-300 transition-colors duration-300 group-hover:text-gray-200">Frontend Developer</p>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://www.linkedin.com/in/avnisharma1705/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs transition-all duration-300 hover:scale-105 hover:underline"
                >
                  LinkedIn
                </a>
                <span className="text-gray-500">•</span>
                <a
                  href="https://github.com/AVNI-THEEXPLORER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 text-xs transition-all duration-300 hover:scale-105 hover:underline"
                >
                  GitHub
                </a>
              </div>
            </div>
            <div className="space-y-2 group">
              <h5 className="font-medium text-pink-400 transition-all duration-300 group-hover:scale-105">Lakshita Pagaria</h5>
              <p className="text-sm text-gray-300 transition-colors duration-300 group-hover:text-gray-200">Python Developer</p>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://www.linkedin.com/in/lakshita-pagaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs transition-all duration-300 hover:scale-105 hover:underline"
                >
                  LinkedIn
                </a>
                <span className="text-gray-500">•</span>
                <a
                  href="https://github.com/LakshitaPagaria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 text-xs transition-all duration-300 hover:scale-105 hover:underline"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm transition-colors duration-300 hover:text-gray-300">
            © {currentYear} ZipTales. All rights reserved. | Breaking News, Not Trust.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;