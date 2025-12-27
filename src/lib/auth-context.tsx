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
      
      // Try to get user from database, with quick retry for new signups
      let currentUser = null;
      
      // First attempt - immediate
      try {
        currentUser = await getCurrentUserFromDB();
      } catch (dbError: any) {
        console.log('   First attempt failed:', dbError.message);
      }
      
      // If not found, try once more after 1 second (for new signups)
      if (!currentUser) {
        console.log('   User not found, waiting 1 second for database trigger...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          currentUser = await getCurrentUserFromDB();
        } catch (dbError: any) {
          console.log('   Second attempt failed:', dbError.message);
        }
      }
      
      if (currentUser) {
        setUser(currentUser);
        console.log('   User data loaded successfully');
      } else {
        console.warn('   User record not found in database yet. This is normal for new signups.');
        console.warn('   Auth session is valid - user can use the app. Database record will be created by trigger.');
        // Set user to null - Portal will handle this case
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
    console.log('🔐 Auth context: Starting login for:', email);
    setIsLoading(true);
    try {
      console.log('🔐 Auth context: Calling apiLogin...');
      const user = await apiLogin(email, password);
      console.log('🔐 Auth context: apiLogin returned, user:', user?.email);
      console.log('🔐 Auth context: Setting user in context...');
      setUser(user);
      console.log('🔐 Auth context: User set successfully');
    } catch (error: any) {
      console.error('🔐 Auth context: Login error:', error);
      console.error('🔐 Auth context: Error message:', error?.message);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('🔐 Auth context: Login completed, isLoading set to false');
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
