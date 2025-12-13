import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tag, TrendingUp } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import NewsCard from '../components/NewsCard';

const Categories: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { articles, loading, fetchNews } = useNews();

  useEffect(() => {
    if (category) {
      fetchNews(category);
    }
  }, [category]);

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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {categoryArticles.filter(a => a.credibilityScore >= 70).length}
            </div>
            <div className="text-sm text-gray-600">Trusted Articles</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {categoryArticles.filter(a => a.credibilityScore >= 40 && a.credibilityScore < 70).length}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
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
              <a
                href="/"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
              >
                <span>Browse All News</span>
              </a>
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
                  <a
                    key={cat}
                    href={`/categories/${cat.toLowerCase()}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all duration-200 text-center"
                  >
                    <div className="text-sm font-medium text-gray-900">{cat}</div>
                  </a>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;