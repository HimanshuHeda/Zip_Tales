import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Bookmark, Vote, Lock, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNews } from '../contexts/NewsContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { user, logout, isAuthenticated, isDemoMode, disableDemoMode } = useAuth();
  const { searchNews, followedTopics, toggleFollowTopic } = useNews();
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

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/categories/${category.toLowerCase()}`);
    setShowCategoryDropdown(false);
    setIsMenuOpen(false);
  };

  const categories = ['Technology', 'Politics', 'Sports', 'Entertainment', 'Health', 'Science'];

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false);
      setShowCategoryDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/Zip Tales.jpg" 
              alt="ZipTales" 
              className="h-10 w-10 rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-pink-700 group-hover:to-blue-700">
                ZipTales
              </span>
              <span className="text-xs text-gray-500 -mt-1 transition-colors duration-300 group-hover:text-gray-700">Breaking News, Not Trust</span>
            </div>
            {isDemoMode && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
                DEMO MODE
              </span>
            )}
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-all duration-300 group-hover:text-pink-500 group-focus-within:text-pink-500" />
                <input
                  type="text"
                  placeholder="Search verified news..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-300 hover:shadow-md focus:shadow-lg"
                />
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200">
                {searchResults.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="block p-4 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:shadow-sm"
                    onClick={() => setShowSearchResults(false)}
                  >
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1 transition-colors duration-200 hover:text-pink-600">{article.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{article.summary}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full transition-all duration-200 hover:bg-pink-200 hover:scale-105">
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
          <Link 
  to="/" 
  className="relative text-gray-700 hover:text-pink-600 transition-all duration-300 group px-2 py-1 rounded-lg"
>
  {/* Text with slide effect */}
  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
    Home
  </span>

  {/* Gradient background with fade + scale */}
  <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 scale-95 group-hover:scale-100 transition-all duration-300"></span>
</Link>

            
            {/* Categories Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCategoryDropdown(!showCategoryDropdown);
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 transition-all duration-300 group relative px-3 py-1 rounded-lg"

              >
                <span className="relative z-10">Categories</span>
                {!isAuthenticated && <Lock className="h-4 w-4 text-gray-400 transition-all duration-300 group-hover:text-pink-500" />}
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-100 visible transition-all duration-300 z-50 animate-in slide-in-from-top-2 duration-200">
                  {!isAuthenticated && (
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Sign in to access categories</p>
                      <Link
                        to="/login"
                        className="text-xs px-3 py-1 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full hover:from-pink-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
                        onClick={() => setShowCategoryDropdown(false)}
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                  {categories.map((category) => {
                    const isFollowing = followedTopics.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          if (isAuthenticated) {
                            toggleFollowTopic(category);
                          } else {
                            handleCategoryClick(category);
                          }
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-600 first:rounded-t-lg last:rounded-b-lg transition-all duration-300 hover:shadow-sm ${
                          !isAuthenticated ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                        }`}
                        disabled={!isAuthenticated}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category}</span>
                          <div className="flex items-center space-x-2">
                            {isAuthenticated && isFollowing && (
                              <Heart className="h-3 w-3 text-pink-500 fill-current transition-all duration-300" />
                            )}
                            {!isAuthenticated && <Lock className="h-3 w-3 transition-all duration-300" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {isAuthenticated && (
              <>
          <Link 
  to="/voting" 
  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-all duration-300 group relative px-2 py-1 rounded-lg"
>
  {/* Icon with bounce + rotate */}
  <Vote className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" />

  {/* Text slides slightly */}
  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
    Vote
  </span>

  {/* Gradient background animation */}
  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 scale-95 group-hover:scale-100 transition-all duration-300"></span>
</Link>

<Link 
  to="/saved" 
  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-all duration-300 group relative px-2 py-1 rounded-lg"
>
  {/* Icon with bounce + rotate */}
  <Bookmark className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" />

  {/* Text slides slightly */}
  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
    Saved
  </span>

  {/* Gradient background animation */}
  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 scale-95 group-hover:scale-100 transition-all duration-300"></span>
</Link>

              <Link 
  to="/following" 
  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-all duration-300 group relative px-2 py-1 rounded-lg"
>
  {/* Icon with bounce */}
  <Heart className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" />
  
  {/* Text with subtle lift */}
  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
    Following
  </span>

  {/* Gradient background grows smoothly */}
  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 scale-95 group-hover:scale-100 transition-all duration-300"></span>
</Link>

              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-all duration-300 group ml-5">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block transition-colors duration-300">{user?.name}</span>
                </button>
                <div className="absolute top-full right-5 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 animate-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-600 rounded-t-lg transition-all duration-300"
                  >
                    <User className="h-4 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/submit"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-600 transition-all duration-300"
                  >
                    Submit News
                  </Link>
                  {isDemoMode && (
                    <button
                      onClick={() => {
                        disableDemoMode();
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-600 transition-all duration-300"
                    >
                      Exit Demo Mode
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-600 rounded-b-lg transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span
                  className="px-4 py-2 text-gray-700 hover:text-pink-600 transition-all duration-300 cursor-pointer relative group"
                  onClick={() => {
                    navigate('/login');
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                  }}
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </span>
                <span
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full hover:from-pink-600 hover:to-blue-600 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
                  onClick={() => {
                    navigate('/signup');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Sign Up
                </span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50 rounded-lg"
            >
              {isMenuOpen ? <X className="h-6 w-6 transition-transform duration-300 rotate-90" /> : <Menu className="h-6 w-6 transition-transform duration-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="md:hidden">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-all duration-300 group-hover:text-pink-500 group-focus-within:text-pink-500" />
                  <input
                    type="text"
                    placeholder="Search verified news..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-300 hover:shadow-md"
                  />
                </div>
              </form>
              
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50 rounded-lg px-3 py-2"
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Categories</span>
                  {!isAuthenticated && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Lock className="h-3 w-3" />
                      <span>Login Required</span>
                    </div>
                  )}
                </div>
                {categories.map((category) => {
                    const isFollowing = followedTopics.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          if (isAuthenticated) {
                            toggleFollowTopic(category);
                          } else {
                            handleCategoryClick(category);
                          }
                        }}
                        className={`block w-full text-left pl-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 rounded-lg px-3 py-2 ${
                          !isAuthenticated 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:text-pink-600'
                        }`}
                        disabled={!isAuthenticated}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category}</span>
                          <div className="flex items-center space-x-2">
                            {isAuthenticated && isFollowing && (
                              <Heart className="h-3 w-3 text-pink-500 fill-current transition-all duration-300" />
                            )}
                            {!isAuthenticated && <Lock className="h-3 w-3 transition-all duration-300" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {isAuthenticated && (
                <>
                  <Link
                    to="/voting"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-lg px-3 py-2"
                  >
                    <Vote className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Vote</span>
                  </Link>
                  <Link
                    to="/saved"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-lg px-3 py-2"
                  >
                    <Bookmark className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Saved</span>
                  </Link>
                  <Link
                    to="/following"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-lg px-3 py-2"
                  >
                    <Heart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Following</span>
                  </Link>
                  <Link
                    to="/submit"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-pink-600 transition-all duration-300 hover:bg-pink-50 rounded-lg px-3 py-2"
                  >
                    Submit News
                  </Link>
                </>
              )}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">
                    Sign in to access all features including categories, voting, and saving articles.
                  </p>
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-medium text-center hover:from-pink-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium text-center hover:bg-gray-50 transition-all duration-300 hover:border-pink-300"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;