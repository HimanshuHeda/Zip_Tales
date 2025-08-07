import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  // Demo mode functions
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode in localStorage
    const demoMode = localStorage.getItem('demoMode') === 'true';
    if (demoMode) {
      enableDemoMode();
    } else {
      checkUser();
    }
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (supabaseUser) {
        // Fetch user profile from database
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (profile) {
          setUser(profile);
        } else {
          // Create profile if it doesn't exist
          const newProfile = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
            reputation: 50,
            interests: [],
            bio: '',
            location: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { data: createdProfile } = await supabase
            .from('users')
            .insert([newProfile])
            .select()
            .single();

          if (createdProfile) {
            setUser(createdProfile);
          }
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      await checkUser();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        throw error;
      }

      await checkUser();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    disableDemoMode();
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const enableDemoMode = () => {
    console.log('Enabling demo mode...');
    const demoUser: User = {
      id: 'demo-user-id',
      email: 'demo@ziptales.com',
      name: 'Demo User',
      reputation: 75,
      interests: ['Technology', 'Politics', 'Science'],
      bio: 'Demo user for testing features',
      location: 'Demo City',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setUser(demoUser);
    setIsDemoMode(true);
    localStorage.setItem('demoMode', 'true');
    console.log('Demo mode enabled successfully!', demoUser);
  };

  const disableDemoMode = () => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('demoMode');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    enableDemoMode,
    disableDemoMode,
    isDemoMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};