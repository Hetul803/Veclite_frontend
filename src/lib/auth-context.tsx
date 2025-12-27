import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, login as apiLogin, logout as apiLogout, getCurrentUserFromDB } from './api';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
    
    // Listen for auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        if (event === 'SIGNED_IN' && session) {
          console.log('   User signed in, loading user data...');
          await loadUser();
          console.log('   User data loaded');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          // Token refreshed, reload user data
          await loadUser();
        }
      });
      
      return () => subscription.unsubscribe();
    }
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      if (!supabase) {
        console.error('❌ Supabase not initialized. Check environment variables.');
        setUser(null);
        return;
      }
      const currentUser = await getCurrentUserFromDB();
      setUser(currentUser);
    } catch (error: any) {
      console.error('Error loading user:', error);
      // Don't show error to user on initial load (they might not be logged in)
      if (error?.message?.includes('Supabase not configured')) {
        console.error('❌ Supabase configuration error. Check Vercel environment variables.');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await apiLogin(email, password);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
