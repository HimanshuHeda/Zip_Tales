import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tag, TrendingUp, Lock, UserPlus } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';

const Categories: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { articles, loading, fetchNews } = useNews();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (category && isAuthenticated) {
      fetchNews(category);
    }
  }, [category, isAuthenticated]);

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              Sign in to access news categories and get personalized content based on your interests. 
              Join our community to unlock all features!
            </p>
            
            {/* Benefits of signing in */}
            <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Access to all news categories</li>
                <li>✅ Personalized news recommendations</li>
                <li>✅ Vote on article credibility</li>
                <li>✅ Save articles for later reading</li>
                <li>✅ Submit news for verification</li>
                <li>✅ Build your reputation score</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
              >
                Sign In to Continue
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center space-x-2 w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-pink-300 hover:shadow-md hover:scale-105 transition-all duration-300 transform"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Free Account</span>
              </Link>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Already have an account? <Link to="/login" className="text-pink-600 hover:text-pink-500 hover:underline transition-colors duration-200">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const categoryArticles = articles.filter(
    article => article.category.toLowerCase() === category?.toLowerCase()
  );

  const getCategoryInfo = (cat: string) => {
    const categoryMap: Record<string, { title: string; description: string; color: string }> = {
      technology: {
        title: 'Technology',
        description: 'Latest developments in tech, AI, and digital innovation',
        color: 'from-blue-500 to-purple-500'
      },
      politics: {
        title: 'Politics',
        description: 'Political news, policy updates, and government affairs',
        color: 'from-red-500 to-pink-500'
      },
      sports: {
        title: 'Sports',
        description: 'Sports news, scores, and athletic achievements',
        color: 'from-green-500 to-blue-500'
      },
      entertainment: {
        title: 'Entertainment',
        description: 'Movies, music, celebrities, and pop culture',
        color: 'from-pink-500 to-purple-500'
      },
      health: {
        title: 'Health',
        description: 'Medical breakthroughs, wellness, and health policy',
        color: 'from-green-500 to-teal-500'
      },
      science: {
        title: 'Science',
        description: 'Scientific discoveries, research, and innovations',
        color: 'from-indigo-500 to-blue-500'
      },
      business: {
        title: 'Business',
        description: 'Market news, corporate updates, and economic trends',
        color: 'from-yellow-500 to-orange-500'
      },
      environment: {
        title: 'Environment',
        description: 'Climate change, sustainability, and environmental policy',
        color: 'from-green-500 to-emerald-500'
      }
    };

    return categoryMap[cat.toLowerCase()] || {
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
      description: `News and updates about ${cat}`,
      color: 'from-gray-500 to-gray-600'
    };
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  const categoryInfo = getCategoryInfo(category);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${categoryInfo.color} rounded-full mb-6`}>
            <Tag className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {categoryInfo.title} News
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {categoryInfo.description}
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{categoryArticles.length} Articles</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>
                {categoryArticles.filter(a => a.credibilityScore >= 70).length} Verified
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>Updated Daily</span>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:border-green-200 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {categoryArticles.filter(a => a.credibilityScore >= 70).length}
            </div>
            <div className="text-sm text-gray-600">Trusted Articles</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:border-yellow-200 hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {categoryArticles.filter(a => a.credibilityScore >= 40 && a.credibilityScore < 70).length}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {Math.round(categoryArticles.reduce((sum, a) => sum + a.credibilityScore, 0) / categoryArticles.length) || 0}%
            </div>
            <div className="text-sm text-gray-600">Avg. Credibility</div>
          </div>
        </div>

        {/* Articles */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
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
        ) : categoryArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                No {categoryInfo.title} Articles Yet
              </h3>
              <p className="text-gray-600 mb-6">
                We're working on bringing you the latest verified news in this category. 
                Check back soon for updates!
              </p>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
              >
                <span>Browse All News</span>
              </Link>
            </div>
          </div>
        )}

        {/* Related Categories */}
        {categoryArticles.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore Other Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Technology', 'Politics', 'Sports', 'Entertainment', 'Health', 'Science', 'Business', 'Environment']
                .filter(cat => cat.toLowerCase() !== category.toLowerCase())
                .slice(0, 4)
                .map((cat) => (
                  <Link
                    key={cat}
                    to={`/categories/${cat.toLowerCase()}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 hover:shadow-md hover:scale-105 transition-all duration-300 transform text-center group"
                  >
                    <div className="text-sm font-medium text-gray-900 group-hover:text-pink-700 transition-colors duration-200">{cat}</div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;