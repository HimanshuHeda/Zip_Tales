import React, { useState } from 'react';
import { Vote, ThumbsUp, ThumbsDown, Filter, Search } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';

const Voting: React.FC = () => {
  const { articles, loading } = useNews();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'disputed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filter) {
      case 'pending':
        return article.credibilityScore >= 40 && article.credibilityScore < 70;
      case 'disputed':
        return article.credibilityScore < 40;
      default:
        return true;
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <Vote className="h-16 w-16 text-pink-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Community</h2>
            <p className="text-gray-600 mb-6">
              Sign in to vote on news articles and help build a more trustworthy information ecosystem.
            </p>
            <div className="space-y-3">
              <a
                href="/login"
                className="block w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
              >
                Sign In to Vote
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
            Community Voting
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help verify news credibility by voting on articles. Your votes contribute to our 
            community-driven truth verification system.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {articles.filter(a => a.credibilityScore >= 70).length}
            </div>
            <div className="text-sm text-gray-600">Trusted Articles</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {articles.filter(a => a.credibilityScore >= 40 && a.credibilityScore < 70).length}
            </div>
            <div className="text-sm text-gray-600">Pending Verification</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {articles.filter(a => a.credibilityScore < 40).length}
            </div>
            <div className="text-sm text-gray-600">Disputed Articles</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {articles.reduce((sum, a) => sum + a.votes.upvotes + a.votes.downvotes, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Votes Cast</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Articles
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'pending'
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('disputed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'disputed'
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Disputed
                </button>
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Voting Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Vote Effectively</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <ThumbsUp className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Vote Up (Credible)</h4>
                <p className="text-sm text-gray-600">
                  The article appears factual, well-sourced, and from a reliable publication.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ThumbsDown className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Vote Down (Questionable)</h4>
                <p className="text-sm text-gray-600">
                  The article contains misinformation, lacks sources, or seems biased.
                </p>
              </div>
            </div>
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
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms or filters.'
                : 'No articles match the selected filter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;