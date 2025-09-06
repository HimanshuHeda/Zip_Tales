import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, MapPin, Send, CheckCircle } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const navigate = useNavigate();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribing(true);
    setTimeout(() => {
      setSubscribed(true);
      setIsSubscribing(false);
      setEmail("");
    }, 1500);
  };

  const handleFooterLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-br from-white-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/Zip Tales.jpg" alt="ZipTales" className="h-12 w-12 rounded-full shadow-lg" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                ZipTales
              </h3>
            </div>
            <p className="text-white-400 text-lg leading-relaxed">
              AI-powered news verification platform filtering misinformation & delivering community-verified credibility scores.
            </p>
            <div className="flex space-x-3 mt-5">
              {[
                { icon: <Facebook />, color: "hover:bg-blue-600" },
                { icon: <Twitter />, color: "hover:bg-sky-500" },
                { icon: <Instagram />, color: "hover:bg-pink-500" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`p-2 rounded-full bg-gray-800 ${social.color} transition-all duration-300`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-400">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Community Voting", path: "/voting" },
                { label: "Submit News", path: "/submit" },
                { label: "Saved Articles", path: "/saved" },
              ].map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleFooterLinkClick(link.path)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Categories</h4>
            <ul className="space-y-2">
              {["Politics", "Technology", "Sports", "Entertainment"].map((cat, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleFooterLinkClick(`/categories/${cat.toLowerCase()}`)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink-400">Stay Updated</h4>
            {subscribed ? (
              <div className="flex items-center space-x-2 bg-green-600/90 rounded-lg p-3 shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
                <span className="text-sm font-medium">Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-pink-700 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full py-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg font-medium hover:from-pink-600 hover:to-blue-600 transition-all"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* Team Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              name: "Himanshu Heda",
              role: "Team Leader / Manager",
              linkedin: "https://www.linkedin.com/in/himanshu-heda/",
              github: "https://github.com/HimanshuHeda",
            },
            {
              name: "Avni Sharma",
              role: "Frontend Developer",
              linkedin: "https://www.linkedin.com/in/avnisharma1705/",
              github: "https://github.com/AVNI-THEEXPLORER",
            },
            {
              name: "Lakshita Pagaria",
              role: "Python Developer",
              linkedin: "https://www.linkedin.com/in/lakshita-pagaria/",
              github: "https://github.com/LakshitaPagaria",
            },
          ].map((member, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all shadow-md"
            >
              <h5 className="font-medium text-pink-400">{member.name}</h5>
              <p className="text-sm text-gray-400">{member.role}</p>
              <div className="flex justify-center space-x-3 mt-2">
                <a href={member.linkedin} target="_blank" className="text-blue-400 hover:underline">
                  LinkedIn
                </a>
                <span className="text-gray-500">•</span>
                <a href={member.github} target="_blank" className="text-gray-400 hover:underline">
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} ZipTales. All rights reserved. | Built with ❤️ by Team Code Breakers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
