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
  fetchNewsFromAPI: () => Promise<void>;
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

      if (error) throw error;

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
      // Fallback to mock data if database is not set up
      setArticles(getMockArticles());
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsFromAPI = async () => {
    setLoading(true);
    try {
      // Fetch news from News API
      const newsResponse = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
      );
      
      if (!newsResponse.ok) {
        throw new Error('Failed to fetch news from API');
      }
      
      const newsData = await newsResponse.json();
      
      // Process and analyze each article
      const processedArticles = await Promise.all(
        newsData.articles.slice(0, 10).map(async (article: any) => {
          const credibilityScore = await analyzeNews(article.content || article.description || '');
          
          return {
            title: article.title,
            summary: article.description || '',
            content: article.content || article.description || '',
            author: article.author || 'Unknown',
            source: article.source?.name || 'Unknown',
            published_at: article.publishedAt,
            image_url: article.urlToImage,
            category: 'General',
            credibility_score: credibilityScore,
            upvotes: 0,
            downvotes: 0,
            tags: [],
            location: null,
            verified: credibilityScore >= 70
          };
        })
      );

      // Insert into database
      const { error } = await supabase
        .from('articles')
        .insert(processedArticles);

      if (error) {
        console.error('Error inserting articles:', error);
      } else {
        // Refresh articles
        await fetchNews();
      }
    } catch (error) {
      console.error('Error fetching news from API:', error);
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

      if (error) throw error;

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

      if (error) throw error;
      setSavedArticles(data.map(item => item.article_id));
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    }
  };

  const analyzeNews = async (content: string): Promise<number> => {
    try {
      // Use Google Gemini API for content analysis
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this news content for credibility and return only a number between 0-100 representing the credibility score. Consider factors like source reliability, factual accuracy, bias, and sensationalism. Content: "${content}"`
              }]
            }]
          })
        }
      );

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

    // Positive indicators
    if (keywords.includes('study') || keywords.includes('research') || keywords.includes('university')) {
      credibilityScore += 20;
    }
    if (keywords.includes('confirmed') || keywords.includes('verified') || keywords.includes('official')) {
      credibilityScore += 15;
    }
    if (keywords.includes('expert') || keywords.includes('professor') || keywords.includes('scientist')) {
      credibilityScore += 10;
    }

    // Negative indicators
    if (keywords.includes('breaking') || keywords.includes('urgent') || keywords.includes('shocking')) {
      credibilityScore -= 10;
    }
    if (keywords.includes('anonymous') || keywords.includes('unnamed source')) {
      credibilityScore -= 15;
    }
    if (keywords.includes('rumor') || keywords.includes('allegedly') || keywords.includes('unconfirmed')) {
      credibilityScore -= 20;
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

      if (voteError) throw voteError;

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

        if (updateError) throw updateError;

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

        if (error) throw error;
        setSavedArticles(prev => prev.filter(id => id !== articleId));
      } else {
        const { error } = await supabase
          .from('saved_articles')
          .insert([{
            user_id: user.id,
            article_id: articleId
          }]);

        if (error) throw error;
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
    getArticleById,
    fetchNewsFromAPI
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};