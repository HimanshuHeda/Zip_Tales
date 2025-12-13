import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, MapPin, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, Share2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getArticleById, voteOnArticle, savedArticles, toggleSaveArticle } = useNews();
  const { isAuthenticated } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (id) {
      const foundArticle = getArticleById(id);
      setArticle(foundArticle);
    }
  }, [id, getArticleById]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="h-5 w-5" />;
    if (score >= 40) return <Shield className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const getCredibilityLabel = (score: number) => {
    if (score >= 70) return 'Trusted';
    if (score >= 40) return 'Pending Verification';
    return 'Disputed';
  };

  const handleVote = async (vote: 'up' | 'down') => {
    if (!isAuthenticated || hasVoted) return;
    await voteOnArticle(article.id, vote);
    setHasVoted(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Article URL copied to clipboard!');
    }
  };

  const isSaved = savedArticles.includes(article.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Articles</span>
        </Link>

        <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Hero Image */}
          {article.imageUrl && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Credibility Badge */}
              <div className="absolute top-6 left-6">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getCredibilityColor(article.credibilityScore)}`}>
                  {getCredibilityIcon(article.credibilityScore)}
                  <span>{getCredibilityLabel(article.credibilityScore)}</span>
                  <span className="font-bold">({article.credibilityScore}%)</span>
                </div>
              </div>

              {/* Verified Badge */}
              {article.verified && (
                <div className="absolute top-6 right-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            {/* Article Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-blue-100 text-pink-700 rounded-full font-medium">
                  {article.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {article.summary}
              </p>

              {/* Author and Source */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>•</span>
                    <span className="font-medium">{article.source}</span>
                  </div>
                  {article.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{article.location}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Share article"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  
                  {isAuthenticated && (
                    <button
                      onClick={() => toggleSaveArticle(article.id)}
                      className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                      title={isSaved ? "Remove from saved" : "Save article"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-5 w-5 text-pink-500" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Voting Section */}
            {isAuthenticated && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Verification</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleVote('up')}
                      disabled={hasVoted}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        hasVoted
                          ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                          : 'text-green-600 hover:bg-green-50 border border-green-200'
                      }`}
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>Credible ({article.votes?.upvotes || 0})</span>
                    </button>
                    
                    <button
                      onClick={() => handleVote('down')}
                      disabled={hasVoted}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        hasVoted
                          ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                          : 'text-red-600 hover:bg-red-50 border border-red-200'
                      }`}
                    >
                      <ThumbsDown className="h-5 w-5" />
                      <span>Questionable ({article.votes?.downvotes || 0})</span>
                    </button>
                  </div>

                  {hasVoted && (
                    <div className="text-sm text-gray-600">
                      Thank you for your vote! Your contribution helps verify news credibility.
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="border-t border-gray-200 pt-8">
                <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Join the Community</h3>
                  <p className="text-gray-600 mb-4">
                    Sign in to vote on article credibility and help build a more trustworthy news ecosystem.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/login"
                      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;