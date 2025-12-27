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
        setIsLoading(false);
        return;
      }
      
      // Check if user is authenticated first
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.log('   Auth error (user not authenticated):', authError.message);
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      if (!authUser) {
        console.log('   No authenticated user, skipping database lookup');
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      console.log('   Loading user data from database for:', authUser.email);
      
      // Try to get user from database, with retry logic for new signups
      let currentUser = null;
      let retries = 3;
      
      while (retries > 0 && !currentUser) {
        try {
          currentUser = await getCurrentUserFromDB();
          if (currentUser) {
            break;
          }
          
          if (retries > 1) {
            console.log(`   User not found, retrying... (${retries - 1} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
          retries--;
        } catch (dbError: any) {
          console.warn('   Database lookup error:', dbError.message);
          if (dbError?.message?.includes('not found') || dbError?.message?.includes('No rows')) {
            // User doesn't exist yet - this is OK for new signups
            if (retries > 1) {
              console.log(`   User record not created yet, retrying... (${retries - 1} attempts left)`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            retries--;
          } else {
            // Other error - don't retry
            throw dbError;
          }
        }
      }
      
      if (currentUser) {
        setUser(currentUser);
        console.log('   User data loaded successfully');
      } else {
        console.warn('   User record not found in database after retries. Auth session exists but no DB record.');
        console.warn('   This might mean the database trigger failed. User can still use the app.');
        // Set user to null but don't throw - auth session is valid
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error loading user:', error);
      // Don't show error to user on initial load (they might not be logged in)
      if (error?.message?.includes('Supabase not configured')) {
        console.error('❌ Supabase configuration error. Check Vercel environment variables.');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('   loadUser completed, isLoading set to false');
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
