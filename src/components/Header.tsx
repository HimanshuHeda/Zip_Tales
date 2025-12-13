import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Bookmark, Vote, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNews } from '../contexts/NewsContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { searchNews, fetchNewsFromAPI } = useNews();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = await searchNews(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      const results = await searchNews(query);
      setSearchResults(results.slice(0, 5)); // Show top 5 results
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleRefreshNews = async () => {
    setIsRefreshing(true);
    try {
      await fetchNewsFromAPI();
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const categories = ['Technology', 'Politics', 'Sports', 'Entertainment', 'Health', 'Science'];

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/ZipTails.jpg" alt="ZipTales" className="h-10 w-10 rounded-full" />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                ZipTales
              </span>
              <span className="text-xs text-gray-500 -mt-1">Breaking News, Not Trust</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search verified news..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-50">
                {searchResults.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => setShowSearchResults(false)}
                  >
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{article.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{article.summary}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.source}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-pink-600 transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/categories/${category.toLowerCase()}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            {isAuthenticated && (
              <>
                <Link to="/voting" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Vote className="h-4 w-4" />
                  <span>Vote</span>
                </Link>
                <Link to="/saved" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Bookmark className="h-4 w-4" />
                  <span>Saved</span>
                </Link>
                <button
                  onClick={handleRefreshNews}
                  disabled={isRefreshing}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors disabled:opacity-50"
                  title="Refresh news from API"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block">{user?.name}</span>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-t-lg"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/submit"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  >
                    Submit News
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-b-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-pink-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search verified news..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </form>
              
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-500">Categories</span>
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/categories/${category.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block pl-4 text-gray-700 hover:text-pink-600 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>

              {isAuthenticated && (
                <>
                  <Link
                    to="/voting"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Vote className="h-4 w-4" />
                    <span>Vote</span>
                  </Link>
                  <Link
                    to="/saved"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Saved</span>
                  </Link>
                  <Link
                    to="/submit"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-pink-600 transition-colors"
                  >
                    Submit News
                  </Link>
                  <button
                    onClick={handleRefreshNews}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh News</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;