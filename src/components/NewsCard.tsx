/**
 * NewsCard component
 * ------------------
 * Displays a single news article with:
 *  - Image
 *  - Title
 *  - Description
 *  - Date
 *  - Source/author
 *
 * Props:
 * - article: object containing all the details of a news item
 */

import React from 'react';
import { NewsArticle } from '../lib/supabase';
import { Link } from 'react-router-dom';
import SourceCredibilityBadge from './SourceCredibilityBadge';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  // Color coding for article score badge
  const getCredibilityColor = (score: number | null) => {
    if (score === null) return 'bg-gray-500 text-white';
    if (score >= 80) return 'bg-green-600 text-white';
    if (score >= 50) return 'bg-yellow-500 text-black';
    return 'bg-red-600 text-white';
  };


  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow bg-white">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        {/* Top row: source + source credibility badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500 truncate" title={article.source}>{article.source}</div>
          <SourceCredibilityBadge source={article.source} />
        </div>
        <h2 className="text-lg font-semibold mb-2">
          <Link to={`/article/${article.id}`} className="hover:underline">
            {article.title}
          </Link>
        </h2>
        <p className="text-sm text-gray-600 mb-3">{article.summary}</p>

        {/* Article credibility badge */}
        {article.credibilityScore !== null && article.credibilityScore !== undefined ? (
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getCredibilityColor(article.credibilityScore)}`}
          >
            Credibility: {article.credibilityScore}%
          </span>
        ) : (
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-400 text-white">
            Credibility: N/A
          </span>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
