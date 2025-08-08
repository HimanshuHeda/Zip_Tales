import React from 'react';
import { Heart, HeartOff, TrendingUp } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';

const Following: React.FC = () => {
  const { followedTopics, getArticlesByFollowedTopics, toggleFollowTopic } = useNews();
  const { isAuthenticated } = useAuth();

  const followedArticles = getArticlesByFollowedTopics();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <Heart className="h-16 w-16 text-pink-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Follow Your Interests</h2>
            <p className="text-gray-600 mb-6">
              Sign in to follow topics and get personalized news recommendations based on your interests.
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
            Following
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized news from topics you follow. Stay updated on what matters to you.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-pink-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {followedTopics.length} Topics • {followedArticles.length} Articles
                </h3>
                <p className="text-sm text-gray-600">
                  Get personalized recommendations based on your interests
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Followed Topics */}
        {followedTopics.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Topics</h3>
            <div className="flex flex-wrap gap-3">
              {followedTopics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-blue-100 text-pink-700 rounded-full text-sm font-medium"
                >
                  <span>#{topic}</span>
                  <button
                    onClick={() => toggleFollowTopic(topic)}
                    className="text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    <HeartOff className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles */}
        {followedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {followedArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {followedTopics.length > 0 ? 'No Articles Yet' : 'Start Following Topics'}
              </h3>
              <p className="text-gray-600 mb-6">
                {followedTopics.length > 0 
                  ? 'Articles from your followed topics will appear here. Check back soon for updates!'
                  : 'Follow topics you care about by clicking the heart icon on article tags or categories.'
                }
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
        {followedTopics.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Pro Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong>Diversify Your Feed:</strong> Follow a mix of topics to get balanced perspectives on current events.
              </div>
              <div>
                <strong>Stay Updated:</strong> Check this page regularly for the latest news from your followed topics.
              </div>
              <div>
                <strong>Discover New Topics:</strong> Explore trending tags and categories to expand your interests.
              </div>
              <div>
                <strong>Quality Over Quantity:</strong> Focus on topics that truly matter to you for a more meaningful experience.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Following; 