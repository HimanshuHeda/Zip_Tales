import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Users, Zap, Quote, Lock, UserPlus } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';
import { NewsFilters, Filters } from '../components/NewsFilters';

const Home: React.FC = () => {
  // The context now provides 'news' instead of 'articles'
  const { news, loading, fetchNews } = useNews();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    category: 'all',
  });

  const quotes = [
    "Breaking News, Not Trust.",
    "Only the credible survive.",
    "Truth verified. Lies denied.",
    "Vote for facts, not fakes.",
    "News should inform, not infect.",
    "Fact-check is the new like button.",
    "If it's not verified, it's just noise."
  ];

  // This effect now passes filters to the backend, which handles the filtering logic
  useEffect(() => {
    fetchNews(filters);
  }, [filters]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Client-side filtering (useMemo) is no longer needed and has been removed.

  const handleStartVerifying = () => {
    if (isAuthenticated) {
      navigate('/voting');
    } else {
      navigate('/signup');
    }
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  const handleCategoryClick = (category: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/categories/${category.toLowerCase()}`);
  };

  const stats = [
    { icon: Shield, label: 'Articles Verified', value: '10,247', color: 'text-green-600' },
    { icon: Users, label: 'Active Verifiers', value: '2,834', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'Accuracy Rate', value: '94.2%', color: 'text-pink-600' },
    { icon: Zap, label: 'Real-time Updates', value: '24/7', color: 'text-purple-600' }
  ];

  const categories = [
    { name: 'Technology', color: 'from-blue-500 to-purple-500', icon: '💻' },
    { name: 'Politics', color: 'from-red-500 to-pink-500', icon: '🏛️' },
    { name: 'Sports', color: 'from-green-500 to-blue-500', icon: '⚽' },
    { name: 'Entertainment', color: 'from-pink-500 to-purple-500', icon: '🎬' },
    { name: 'Health', color: 'from-green-500 to-teal-500', icon: '🏥' },
    { name: 'Science', color: 'from-indigo-500 to-blue-500', icon: '🔬' }
  ];

  return (
    <div className="min-h-screen">
      {/* Demo Mode Notice */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-green-800">
              <span>🎉</span>
              <span>New features available! Try <button onClick={() => navigate('/login')} className="font-semibold underline hover:text-green-600">Demo Mode</button> to test bookmarks and topic following.</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {/* ... (your hero, stats, categories code stays unchanged) ... */}

      {/* Featured News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-300 hover:scale-105">
              Latest Verified News
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Community-verified articles with AI-powered credibility scores
            </p>
          </div>

          <NewsFilters filters={filters} onFilterChange={setFilters} />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse transition-all duration-300 hover:shadow-md">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
              
              {/* Message for when no articles match */}
              {!loading && news.length === 0 && (
                   <div className="text-center py-16 col-span-1 md:col-span-2 lg:col-span-3">
                     <p className="text-gray-600 text-lg">No articles match your current filters.</p>
                   </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      {/* ... (your remaining sections stay the same) ... */}
    </div>
  );
};

export default Home;