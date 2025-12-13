import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, MapPin, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, ExternalLink, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';

interface NewsCardProps {
  article: any;
  showFullContent?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, showFullContent = false }) => {
  const [showContent, setShowContent] = useState(showFullContent);
  const { voteOnArticle, savedArticles, toggleSaveArticle } = useNews();
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
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Image */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(article.credibilityScore)}`}>
              {getCredibilityIcon(article.credibilityScore)}
              <span>{getCredibilityLabel(article.credibilityScore)} ({article.credibilityScore}%)</span>
            </span>
          </div>
          {article.verified && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
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
              <span className="px-2 py-1 bg-gradient-to-r from-pink-100 to-blue-100 text-pink-700 rounded-full text-xs font-medium">
                {article.category}
              </span>
              <Clock className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <Link to={`/article/${article.id}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-pink-600 transition-colors cursor-pointer">
                {article.title}
              </h2>
            </Link>
          </div>
          
          {isAuthenticated && (
            <button
              onClick={() => toggleSaveArticle(article.id)}
              className="ml-4 p-2 text-gray-400 hover:text-pink-500 transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-pink-500" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.summary}
        </p>

        {/* Full Content */}
        {showContent && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-line">
              {article.content}
            </p>
          </div>
        )}

        {/* Read More Button */}
        {!showFullContent && (
          <Link
            to={`/article/${article.id}`}
            className="text-pink-600 hover:text-pink-700 font-medium text-sm mb-4 flex items-center space-x-1"
          >
            <span>Read Full Article</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>•</span>
              <span>{article.source}</span>
            </div>
            {article.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
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
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  hasVoted
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{article.votes?.upvotes || 0}</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={hasVoted}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  hasVoted
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
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