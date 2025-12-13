import React from 'react';
import { Bookmark, BookmarkX } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';

const Saved: React.FC = () => {
  const { articles, savedArticles, toggleSaveArticle } = useNews();
  const { isAuthenticated } = useAuth();

  const savedArticlesList = articles.filter(article => savedArticles.includes(article.id));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <Bookmark className="h-16 w-16 text-pink-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Save Your Favorites</h2>
            <p className="text-gray-600 mb-6">
              Sign in to save articles and access them anytime from your personal collection.
            </p>
            <div className="space-y-3">
              <a
                href="/login"
                className="block w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Saved Articles
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal collection of bookmarked news articles for easy access and reference.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bookmark className="h-8 w-8 text-pink-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {savedArticlesList.length} Saved Articles
                </h3>
                <p className="text-sm text-gray-600">
                  Keep track of important news and verified information
                </p>
              </div>
            </div>
            
            {savedArticlesList.length > 0 && (
              <button
                onClick={() => {
                  savedArticles.forEach(id => toggleSaveArticle(id));
                }}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <BookmarkX className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Articles */}
        {savedArticlesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedArticlesList.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Saved Articles Yet</h3>
              <p className="text-gray-600 mb-6">
                Start saving articles by clicking the bookmark icon on any news story. 
                Your saved articles will appear here for easy access.
              </p>
              <a
                href="/"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
              >
                <span>Browse News</span>
              </a>
            </div>
          </div>
        )}

        {/* Tips */}
        {savedArticlesList.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Pro Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong>Organize by Categories:</strong> Save articles from different categories to build a diverse knowledge base.
              </div>
              <div>
                <strong>Regular Review:</strong> Revisit saved articles to stay updated on developing stories.
              </div>
              <div>
                <strong>Share Insights:</strong> Use saved articles as references when discussing current events.
              </div>
              <div>
                <strong>Fact Verification:</strong> Compare saved articles with new information to track story evolution.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;