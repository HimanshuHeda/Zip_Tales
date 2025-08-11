import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, MapPin, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';

interface RelatedArticlesProps {
  currentArticleId: string;
  limit?: number;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ currentArticleId, limit = 3 }) => {
  const { getRelatedArticles } = useNews();
  const relatedArticles = getRelatedArticles(currentArticleId, limit);

  if (relatedArticles.length === 0) {
    return null;
  }

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
    if (score >= 40) return 'Pending Verification';
    return 'Disputed';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden hover:scale-105 transform"
          >
            {/* Article Image */}
            {article.imageUrl && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Credibility Badge */}
                <div className="absolute top-3 left-3">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(article.credibilityScore)}`}>
                    {getCredibilityIcon(article.credibilityScore)}
                    <span>{getCredibilityLabel(article.credibilityScore)}</span>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/90 text-gray-700 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4">
              {/* Article Meta */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{article.author}</span>
                </div>
                {article.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{article.location}</span>
                  </div>
                )}
              </div>

              {/* Article Title */}
              <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                {article.title}
              </h4>

              {/* Article Summary */}
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {article.summary}
              </p>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{article.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Credibility Score */}
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(article.credibilityScore)}`}>
                  <span className="font-bold">{article.credibilityScore}%</span>
                </div>
                
                {/* Votes */}
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <span className="text-green-600">↑</span>
                    <span>{article.votes?.upvotes || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="text-red-600">↓</span>
                    <span>{article.votes?.downvotes || 0}</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles; 