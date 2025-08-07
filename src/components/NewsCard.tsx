import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, MapPin, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, ExternalLink, Shield, AlertTriangle, CheckCircle, Heart, HeartOff } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';

interface NewsCardProps {
  article: any;
  showFullContent?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, showFullContent = false }) => {
  const [showContent, setShowContent] = useState(showFullContent);
  const { voteOnArticle, savedArticles, toggleSaveArticle, followedTopics, toggleFollowTopic } = useNews();
  const { isAuthenticated } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="h-4 w-4" />;
    if (score >= 40) return <Shield className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getCredibilityLabel = (score: number) => {
    if (score >= 70) return 'Trusted';
    if (score >= 40) return 'Pending';
    return 'Disputed';
  };

  const handleVote = async (vote: 'up' | 'down') => {
    if (!isAuthenticated || hasVoted) return;
    await voteOnArticle(article.id, vote);
    setHasVoted(true);
  };

  const isSaved = savedArticles.includes(article.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-2">
      {/* Image */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(article.credibilityScore)} transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}>
              {getCredibilityIcon(article.credibilityScore)}
              <span>{getCredibilityLabel(article.credibilityScore)} ({article.credibilityScore}%)</span>
            </span>
          </div>
          {article.verified && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                <CheckCircle className="h-3 w-3" />
                <span>Verified</span>
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gradient-to-r from-pink-100 to-blue-100 text-pink-700 rounded-full text-xs font-medium transition-all duration-300 group-hover:from-pink-200 group-hover:to-blue-200 group-hover:scale-105">
                {article.category}
              </span>
              <Clock className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-gray-700">{formatDate(article.publishedAt)}</span>
            </div>
            <Link to={`/article/${article.id}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-pink-600 transition-all duration-300 cursor-pointer group-hover:scale-105 transform">
                {article.title}
              </h2>
            </Link>
          </div>
          
          {isAuthenticated && (
            <button
              onClick={() => toggleSaveArticle(article.id)}
              className="ml-4 p-2 text-gray-400 hover:text-pink-500 transition-all duration-300 hover:scale-110 hover:bg-pink-50 rounded-lg"
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-pink-500 transition-transform duration-300 hover:scale-110" />
              ) : (
                <Bookmark className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              )}
            </button>
          )}
        </div>

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-3 transition-colors duration-300 group-hover:text-gray-700">
          {article.summary}
        </p>

        {/* Full Content */}
        {showContent && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-pink-50 group-hover:to-blue-50">
            <p className="text-gray-700 whitespace-pre-line">
              {article.content}
            </p>
          </div>
        )}

        {/* Read More Button */}
        {!showFullContent && (
          <Link
            to={`/article/${article.id}`}
            className="text-pink-600 hover:text-pink-700 font-medium text-sm mb-4 flex items-center space-x-1 transition-all duration-300 hover:scale-105 transform"
          >
            <span>Read Full Article</span>
            <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag: string, index: number) => {
              const isFollowing = followedTopics.includes(tag);
              return (
                <div
                  key={index}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs transition-all duration-300 hover:bg-pink-100 hover:text-pink-700 hover:scale-105 cursor-pointer group"
                  onClick={() => isAuthenticated && toggleFollowTopic(tag)}
                >
                  <span>#{tag}</span>
                  {isAuthenticated && (
                    <button
                      className={`transition-all duration-300 hover:scale-110 ${
                        isFollowing ? 'text-pink-500' : 'text-gray-400 group-hover:text-pink-500'
                      }`}
                    >
                      {isFollowing ? (
                        <Heart className="h-3 w-3 fill-current" />
                      ) : (
                        <HeartOff className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1 transition-all duration-300 hover:text-gray-700 group-hover:scale-105">
              <User className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>•</span>
              <span className="transition-colors duration-300 group-hover:text-gray-700">{article.source}</span>
            </div>
            {article.location && (
              <div className="flex items-center space-x-1 transition-all duration-300 hover:text-gray-700 group-hover:scale-105">
                <MapPin className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>{article.location}</span>
              </div>
            )}
          </div>

          {/* Voting */}
          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote('up')}
                disabled={hasVoted}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:scale-105 ${
                  hasVoted
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-green-600 hover:bg-green-50 hover:shadow-md'
                }`}
              >
                <ThumbsUp className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                <span>{article.votes?.upvotes || 0}</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={hasVoted}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:scale-105 ${
                  hasVoted
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-600 hover:bg-red-50 hover:shadow-md'
                }`}
              >
                <ThumbsDown className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                <span>{article.votes?.downvotes || 0}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;