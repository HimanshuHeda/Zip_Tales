import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, type NewsArticle } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface NewsContextType {
  articles: NewsArticle[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchNews: (category?: string) => Promise<void>;
  searchNews: (query: string) => Promise<NewsArticle[]>;
  analyzeNews: (content: string) => Promise<number>;
  voteOnArticle: (articleId: string, vote: 'up' | 'down') => Promise<void>;
  savedArticles: string[];
  toggleSaveArticle: (articleId: string) => Promise<void>;
  getArticleById: (id: string) => NewsArticle | undefined;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchNews();
    if (user) {
      fetchSavedArticles();
    }
  }, [user]);

  const fetchNews = async (category?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
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

  const searchNews = async (query: string): Promise<NewsArticle[]> => {
    if (!query.trim()) return articles;

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Search error:', error);
        // Fallback to local search
        return articles.filter(article =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.summary.toLowerCase().includes(query.toLowerCase())
        );
      }

      return data.map(article => ({
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
    } catch (error) {
      console.error('Error searching news:', error);
      // Fallback to local search
      return articles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase())
      );
    }
  };

  const fetchSavedArticles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_articles')
        .select('article_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching saved articles:', error);
        return;
      }
      
      setSavedArticles(data.map(item => item.article_id));
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    }
  };

  const analyzeNews = async (content: string): Promise<number> => {
    try {
      // Use Google AI API for content analysis
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        console.warn('Google API key not found, using fallback analysis');
        return simulateAnalysis(content);
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this news content for credibility and return only a number between 0-100 representing the credibility score. Consider factors like source reliability, factual accuracy, bias, and sensationalism: "${content}"`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const scoreText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const score = parseInt(scoreText?.match(/\d+/)?.[0] || '50');
        return Math.min(100, Math.max(0, score));
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    }

    // Fallback analysis
    return simulateAnalysis(content);
  };

  const simulateAnalysis = (content: string): number => {
    const keywords = content.toLowerCase();
    let credibilityScore = 50;

    if (keywords.includes('breaking') || keywords.includes('urgent')) {
      credibilityScore -= 10;
    }
    if (keywords.includes('study') || keywords.includes('research') || keywords.includes('university')) {
      credibilityScore += 20;
    }
    if (keywords.includes('anonymous') || keywords.includes('unnamed source')) {
      credibilityScore -= 15;
    }
    if (keywords.includes('confirmed') || keywords.includes('verified') || keywords.includes('official')) {
      credibilityScore += 15;
    }

    return Math.max(0, Math.min(100, credibilityScore));
  };

  const voteOnArticle = async (articleId: string, vote: 'up' | 'down') => {
    if (!user) return;

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .single();

      if (existingVote) {
        console.log('User already voted on this article');
        return;
      }

      // Insert vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert([{
          user_id: user.id,
          article_id: articleId,
          vote_type: vote
        }]);

      if (voteError) {
        console.error('Vote error:', voteError);
        return;
      }

      // Update article vote counts
      const article = articles.find(a => a.id === articleId);
      if (article) {
        const newUpvotes = vote === 'up' ? article.votes.upvotes + 1 : article.votes.upvotes;
        const newDownvotes = vote === 'down' ? article.votes.downvotes + 1 : article.votes.downvotes;

        const { error: updateError } = await supabase
          .from('articles')
          .update({
            upvotes: newUpvotes,
            downvotes: newDownvotes
          })
          .eq('id', articleId);

        if (updateError) {
          console.error('Update error:', updateError);
          return;
        }

        // Update local state
        setArticles(prev => prev.map(a => 
          a.id === articleId 
            ? { ...a, votes: { upvotes: newUpvotes, downvotes: newDownvotes } }
            : a
        ));
      }
    } catch (error) {
      console.error('Error voting on article:', error);
    }
  };

  const toggleSaveArticle = async (articleId: string) => {
    if (!user) return;

    try {
      const isSaved = savedArticles.includes(articleId);

      if (isSaved) {
        const { error } = await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', articleId);

        if (error) {
          console.error('Error removing saved article:', error);
          return;
        }
        setSavedArticles(prev => prev.filter(id => id !== articleId));
      } else {
        const { error } = await supabase
          .from('saved_articles')
          .insert([{
            user_id: user.id,
            article_id: articleId
          }]);

        if (error) {
          console.error('Error saving article:', error);
          return;
        }
        setSavedArticles(prev => [...prev, articleId]);
      }
    } catch (error) {
      console.error('Error toggling saved article:', error);
    }
  };

  const getArticleById = (id: string): NewsArticle | undefined => {
    return articles.find(article => article.id === id);
  };

  // Mock data fallback
  const getMockArticles = (): NewsArticle[] => [
    {
      id: '1',
      title: 'AI Technology Breakthrough in Medical Diagnosis',
      summary: 'Researchers develop new AI system that can detect diseases with 95% accuracy, potentially revolutionizing healthcare diagnostics.',
      content: 'A groundbreaking AI system developed by researchers at leading universities has achieved remarkable accuracy in medical diagnosis. The system, which uses advanced machine learning algorithms, can analyze medical images and patient data to detect various diseases with unprecedented precision.\n\nThe research team, led by Dr. Sarah Johnson from Stanford University, spent three years developing this revolutionary technology. The AI system was trained on millions of medical records and imaging data from hospitals worldwide.\n\n"This breakthrough could transform how we approach medical diagnosis," said Dr. Johnson. "The system can identify patterns that human doctors might miss, potentially saving countless lives through early detection."\n\nThe technology has been tested in clinical trials across multiple hospitals, showing consistent results that exceed current diagnostic methods. The system is particularly effective in detecting cancer, cardiovascular diseases, and neurological conditions.\n\nHowever, medical experts emphasize that this AI system is designed to assist doctors, not replace them. The technology will serve as a powerful tool to enhance medical decision-making and improve patient outcomes.\n\nThe research has been published in the prestigious Journal of Medical AI and has received funding from major healthcare organizations for further development and implementation.',
      author: 'Dr. Sarah Johnson',
      source: 'TechMed Today',
      publishedAt: '2025-01-15T10:30:00Z',
      imageUrl: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
      category: 'Technology',
      credibilityScore: 85,
      votes: { upvotes: 142, downvotes: 8 },
      tags: ['AI', 'Healthcare', 'Technology'],
      location: 'Stanford, CA',
      verified: true
    },
    {
      id: '2',
      title: 'Climate Change Summit Reaches Historic Agreement',
      summary: 'World leaders agree on ambitious carbon reduction targets, marking a significant step in global climate action.',
      content: 'In a historic moment for environmental policy, world leaders have reached a comprehensive agreement at the Global Climate Summit in Geneva. The agreement includes ambitious carbon reduction targets and substantial funding for renewable energy initiatives.\n\nThe summit, attended by representatives from 195 countries, concluded after intense negotiations that lasted three days. The final agreement commits participating nations to reduce carbon emissions by 50% by 2030 and achieve net-zero emissions by 2050.\n\n"This is a turning point in our fight against climate change," said UN Secretary-General António Guterres. "The commitments made today represent the most ambitious climate action plan in history."\n\nKey provisions of the agreement include:\n- $500 billion in funding for renewable energy projects\n- Mandatory carbon pricing mechanisms\n- Protection of 30% of global land and ocean areas\n- Technology transfer to developing nations\n- Annual progress reviews and accountability measures\n\nEnvironmental groups have praised the agreement while noting that implementation will be crucial. "The real test begins now," said Greenpeace International Director Jennifer Morgan. "We need to see these commitments translated into concrete action."\n\nThe agreement will be formally signed by all participating nations within the next six months, with implementation beginning immediately.',
      author: 'Michael Chen',
      source: 'Global News Network',
      publishedAt: '2025-01-15T08:15:00Z',
      imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
      category: 'Politics',
      credibilityScore: 78,
      votes: { upvotes: 89, downvotes: 12 },
      tags: ['Climate', 'Politics', 'Environment'],
      location: 'Geneva, Switzerland',
      verified: true
    }
  ];

  const value = {
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
    getArticleById
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};