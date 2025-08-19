/**
 * Home Page
 * ----------
 * This is the landing page of Zip Tales.
 * It serves as the entry point for users to explore the app.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNews } from '../contexts/NewsContext';
import { useAuth } from '../contexts/AuthContext';
import NewsCard from '../components/NewsCard';
import { NewsFilters, Filters } from '../components/NewsFilters';

// Keep this broad so it fits whatever your API returns
type NewsItem = {
  id?: string | number;
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  imageUrl?: string;
  // allow extra fields
  [key: string]: any;
};

const Home: React.FC = () => {
  // default news to [] so .map never crashes
  const { news = [], loading, fetchNews } = useNews();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // filters expected by your NewsFilters component
  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    category: 'all',
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch on mount and whenever filters change
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        // your context supports optional filters; safe to pass them
        await fetchNews(filters as any);
      } catch (e) {
        if (mounted) setError('Failed to load news. Please try again.');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [filters, fetchNews]);

  return (
    <div className="min-h-screen bg-white">
      {/* Featured News */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Verified News
            </h2>
            <p className="text-xl text-gray-600">
              Community-verified articles with AI-powered credibility scores
            </p>
          </div>

          {/* Filters */}
          <NewsFilters filters={filters} onFilterChange={setFilters} />

          {/* Error */}
          {error && (
            <p className="text-center text-red-600 font-semibold my-6">{error}</p>
          )}

          {/* Loading skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            // News grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {Array.isArray(news) && news.length > 0 ? (
                news.map((item: NewsItem, idx: number) => (
                  <NewsCard
                    key={String(item.id ?? item.title ?? idx)}
                    article={item}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-600">
                  No data available
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
