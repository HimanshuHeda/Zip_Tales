import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, NewsArticle } from '../lib/supabase';

interface NewsContextType {
  articles: NewsArticle[];
  loading: boolean;
  fetchNews: () => Promise<void>;
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

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles((data as NewsArticle[]) || []);
    } catch (err) {
      console.error('Database error:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

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

  // New: getArticleById helper
  const getArticleById = (id: string) => articles.find((a) => a.id === id);

  // New: persist credibility score to Supabase
  const saveCredibilityScore = async (articleId: string, score: number) => {
    try {
      // Update both camelCase and snake_case fields (in case your DB uses either)
      const updates: any = { updated_at: new Date().toISOString() };
      updates['credibilityScore'] = score;
      updates['credibility_score'] = score;

      const { error } = await supabase
        .from('news_articles')
        .update(updates)
        .eq('id', articleId);

      if (error) throw error;

      // Update local state if present
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
        fetchNews,
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
