import React, { useState } from 'react';
import { Vote, ThumbsUp, ThumbsDown, Filter, Search, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';

const Voting: React.FC = () => {
  const { articles, loading } = useNews();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'disputed' | 'trusted'>('pending');
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
      case 'trusted':
        return article.credibilityScore >= 70;
      default:
        return true;
    }
  });

  // Prioritize pending articles for voting
  const sortedArticles = filteredArticles.sort((a, b) => {
    if (filter === 'pending') {
      // Sort by least votes first (need more community input)
      const aVotes = a.votes.upvotes + a.votes.downvotes;
      const bVotes = b.votes.upvotes + b.votes.downvotes;
      return aVotes - bVotes;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
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

        {/* Priority Notice */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Verification Priority</h3>
          </div>
          <p className="text-yellow-700 text-sm">
            Articles with fewer votes are shown first to ensure all news gets proper community verification. 
            Focus on "Pending Verification" articles that need your input most.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {articles.filter(a => a.credibilityScore >= 70).length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Trusted Articles</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {articles.filter(a => a.credibilityScore >= 40 && a.credibilityScore < 70).length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span>Pending Verification</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {articles.filter(a => a.credibilityScore < 40).length}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Disputed Articles</span>
            </div>
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
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    filter === 'pending'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>Pending ({articles.filter(a => a.credibilityScore >= 40 && a.credibilityScore < 70).length})</span>
                </button>
                <button
                  onClick={() => setFilter('disputed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    filter === 'disputed'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Disputed ({articles.filter(a => a.credibilityScore < 40).length})</span>
                </button>
                <button
                  onClick={() => setFilter('trusted')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    filter === 'trusted'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Trusted ({articles.filter(a => a.credibilityScore >= 70).length})</span>
                </button>
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
        ) : sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArticles.map((article) => (
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