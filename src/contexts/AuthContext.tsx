import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, type User } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's profile from your database or fallback to basic session user
  const fetchUserProfile = async (userId: string, fallbackUser?: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If user doesn't exist in our users table, create one if fallbackUser is provided
        if (error.code === 'PGRST116' && fallbackUser) {
          const newUser = {
            id: fallbackUser.id,
            email: fallbackUser.email || '',
            name:
              fallbackUser.user_metadata?.full_name ||
              fallbackUser.user_metadata?.name ||
              'User',
            reputation: 50,
            interests: [],
            bio: '',
            location: '',
          };

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

          if (createError) {
            console.error('Error creating user profile:', createError);
            setUser(fallbackUser); // fallback to session user
          } else {
            setUser(createdUser);
          }
        } else {
          console.error('Error fetching user profile:', error);
          if (fallbackUser) setUser(fallbackUser); // fallback to session user
        }
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      if (fallbackUser) setUser(fallbackUser); // fallback to session user
    }
  };

  useEffect(() => {
    // On first mount, restore session if present
    const restoreSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log('Session on reload:', session);
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    restoreSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (
        (event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'INITIAL_SESSION') &&
        session?.user
      ) {
        fetchUserProfile(session.user.id, session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }
      // Session and auth state will be handled by the effect above
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return false;
      }

      if (data.user) {
        const newUser = {
          id: data.user.id,
          email,
          name,
          reputation: 50,
          interests: [],
          bio: '',
          location: '',
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert([newUser]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        // Session and auth state will be handled by the effect above
        return true;
      }

      // In some cases, user is not returned but no error (shouldn't happen)
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google login error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      // Clear any cached data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
      } else {
        setUser({ ...user, ...updates });
      }
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
