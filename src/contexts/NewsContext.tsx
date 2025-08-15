import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, NewsArticle } from '../lib/supabase';

// Helper for mock data if needed
const getMockArticles = (): NewsArticle[] => [];

export interface Filters {
  dateRange: string;
  category: string;
}

interface NewsContextType {
  articles: NewsArticle[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchNews: (filters?: Filters) => Promise<void>;
  searchNews: (query: string) => Promise<NewsArticle[]>;
  analyzeNews: (content: string) => Promise<number>;
  voteOnArticle: (articleId: string, vote: 'up' | 'down') => Promise<void>;
  savedArticles: string[];
  toggleSaveArticle: (articleId: string) => void;
  followedTopics: string[];
  toggleFollowTopic: (topic: string) => void;
  getArticleById: (id: string) => NewsArticle | undefined;
  saveCredibilityScore: (articleId: string, score: number) => Promise<boolean>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  // Added state for searchTerm to match the new interface
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchNews = async (filters: Filters = { dateRange: 'all', category: 'all' }) => {
    setLoading(true);
    try {
      // --- FIXED DYNAMIC FILTERING LOGIC ---
      // Start building the query
      let query = supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      // 1. Category Filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // 2. Date Range Filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        let fromDate: Date | undefined;

        if (filters.dateRange === 'today') {
          fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (filters.dateRange === 'last7days') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          fromDate = sevenDaysAgo;
        }

        if (fromDate) {
          // Assuming your column is 'published_at' based on the transform logic
          query = query.gte('published_at', fromDate.toISOString());
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database error:', error);
        // Fallback to mock data if database query fails
        setArticles(getMockArticles());
        return;
      }

      // Transform data to match our interface
      const transformedArticles: NewsArticle[] = data.map(article => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        author: article.author,
        source: article.source,
        publishedAt: article.published_at,
        imageUrl: article.image_url,
        category: article.category,
        credibilityScore: article.credibility_score,
        votes: {
          upvotes: article.upvotes,
          downvotes: article.downvotes
        },
        tags: article.tags || [],
        location: article.location,
        verified: article.verified
      }));

      setArticles(transformedArticles);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to mock data if there's any error
      setArticles(getMockArticles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // --- ADDED MISSING FUNCTIONS TO MATCH INTERFACE ---
  const searchNews = async (query: string): Promise<NewsArticle[]> => {
    console.log(`Searching for: ${query}`);
    // Placeholder: Implement actual search logic against Supabase
    return [];
  };

  const analyzeNews = async (content: string): Promise<number> => {
    console.log(`Analyzing content: ${content.substring(0, 50)}...`);
    // Placeholder: Implement actual analysis logic (e.g., API call)
    return Math.floor(Math.random() * 100); // Return a random score
  };


  const voteOnArticle = async (articleId: string, vote: 'up' | 'down') => {
    try {
      const article = articles.find((a) => a.id === articleId);
      if (!article) return;

      const updatedVotes = {
        upvotes: (article.votes?.upvotes ?? 0) + (vote === 'up' ? 1 : 0),
        downvotes: (article.votes?.downvotes ?? 0) + (vote === 'down' ? 1 : 0),
      };

      const { error } = await supabase
        .from('news_articles')
        .update({ votes: updatedVotes })
        .eq('id', articleId);

      if (error) throw error;

      setArticles((prev) =>
        prev.map((p) => (p.id === articleId ? { ...p, votes: updatedVotes } : p))
      );
    } catch (err) {
      console.error('Failed to vote on article:', err);
    }
  };

  const toggleSaveArticle = (articleId: string) => {
    setSavedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const toggleFollowTopic = (topic: string) => {
    setFollowedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const getArticleById = (id: string) => articles.find((a) => a.id === id);

  const saveCredibilityScore = async (articleId: string, score: number) => {
    try {
      const updates: any = { credibility_score: score, updated_at: new Date().toISOString() };
      
      const { error } = await supabase
        .from('news_articles')
        .update(updates)
        .eq('id', articleId);

      if (error) throw error;

      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? { ...a, credibilityScore: score } : a))
      );

      return true;
    } catch (err) {
      console.error('Failed to save credibility score:', err);
      return false;
    }
  };

  return (
    <NewsContext.Provider
      value={{
        articles,
        loading,
        searchTerm,
        setSearchTerm,
        fetchNews,
        searchNews,
        analyzeNews,
        voteOnArticle,
        savedArticles,
        toggleSaveArticle,
        followedTopics,
        toggleFollowTopic,
        getArticleById,
        saveCredibilityScore,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};