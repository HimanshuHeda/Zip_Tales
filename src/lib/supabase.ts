import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://abcxyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsIn...';

// Only throw error in production
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  reputation: number;
  interests: string[];
  bio?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  credibilityScore: number;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  tags: string[];
  location?: string;
  verified: boolean;
}

export interface Vote {
  id: string;
  user_id: string;
  article_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface SavedArticle {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
}