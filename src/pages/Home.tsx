import React, { useEffect, useState } from 'react';
import { TrendingUp, Shield, Users, Zap, Quote } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import NewsCard from '../components/NewsCard';

const Home: React.FC = () => {
  const { articles, loading, fetchNews } = useNews();
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    "Breaking News, Not Trust.",
    "Only the credible survive.",
    "Truth verified. Lies denied.",
    "Vote for facts, not fakes.",
    "News should inform, not infect.",
    "Fact-check is the new like button.",
    "If it's not verified, it's just noise."
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Shield, label: 'Articles Verified', value: '10,247', color: 'text-green-600' },
    { icon: Users, label: 'Active Verifiers', value: '2,834', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'Accuracy Rate', value: '94.2%', color: 'text-pink-600' },
    { icon: Zap, label: 'Real-time Updates', value: '24/7', color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-blue-500/5"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <img src="/ZipTails.jpg" alt="ZipTales" className="h-20 w-20 mx-auto rounded-full shadow-lg" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              ZipTales
            </span>
          </h1>
          
          <div className="h-16 flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 text-xl md:text-2xl text-gray-600">
              <Quote className="h-6 w-6 text-pink-500" />
              <span className="font-medium transition-all duration-500">
                {quotes[currentQuote]}
              </span>
              <Quote className="h-6 w-6 text-blue-500 rotate-180" />
            </div>
          </div>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered news verification platform that filters misinformation, 
            provides community-verified credibility scores, and delivers only authentic journalism.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Start Verifying News
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-pink-500 hover:text-pink-600 transition-all duration-200">
              Learn How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Verified News
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Community-verified articles with AI-powered credibility scores
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(0, 6).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ZipTales Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered system combines machine learning with community verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes news content for credibility indicators, 
                source reliability, and factual accuracy using multiple data points.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Voting</h3>
              <p className="text-gray-600">
                Verified users vote on article credibility. Votes are weighted by 
                user reputation to ensure quality community-driven verification.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Scoring</h3>
              <p className="text-gray-600">
                Dynamic credibility scores update in real-time based on AI analysis, 
                community votes, and verification from trusted sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the Fight Against Misinformation
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Be part of a community that values truth, transparency, and verified journalism.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-pink-600 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Sign Up Free
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-all duration-200">
              Submit Your First Article
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;