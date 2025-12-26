import { createClient } from '@supabase/supabase-js';

// Supabase configuration - these should be in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = '❌ Supabase credentials not configured!\n' +
    `   VITE_SUPABASE_URL: ${supabaseUrl || 'MISSING'}\n` +
    `   VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'SET' : 'MISSING'}\n` +
    '   Please check your .env file and restart the dev server.';
  console.error(errorMsg);
  
  // In production, show user-friendly error
  if (typeof window !== 'undefined') {
    console.error('Supabase connection will fail. Check browser console for details.');
  }
}

// Create Supabase client with proper error handling
let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey
        }
      },
      db: {
        schema: 'public'
      }
    });
    console.log('✅ Supabase client initialized');
    console.log('   URL:', supabaseUrl);
    console.log('   Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
    
    // Test connection (with better error handling)
    if (typeof window !== 'undefined') {
      supabase.auth.getSession()
        .then(({ data, error }) => {
          if (error) {
            console.warn('⚠️  Supabase session check error:', error.message);
            // Check if it's a network/DNS error
            if (error.message?.includes('fetch') || error.message?.includes('network')) {
              console.error('❌ Network error connecting to Supabase. Check:');
              console.error('   1. Supabase project is active (not paused)');
              console.error('   2. URL is correct:', supabaseUrl);
              console.error('   3. Internet connection is working');
            }
          } else {
            console.log('✅ Supabase connection test passed');
          }
        })
        .catch((err) => {
          console.error('❌ Supabase connection test failed:', err);
          if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
            console.error('   This is likely a network/DNS issue. Check:');
            console.error('   1. Supabase project URL is correct');
            console.error('   2. Project is not paused');
            console.error('   3. CORS is configured in Supabase dashboard');
          }
        });
    }
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    supabase = null;
  }
} else {
  console.error('❌ Supabase client NOT initialized');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl || 'MISSING');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
  console.error('   Check your .env file and restart the dev server');
}

export { supabase };

// Database types
export interface User {
  id: string;
  email: string;
  plan: 'free' | 'starter' | 'pro' | 'scale' | 'enterprise';
  api_key: string;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
}

export interface Index {
  id: string;
  user_id: string;
  name: string;
  embedding_dim: number;
  description: string | null;
  status: 'draft' | 'building' | 'ready' | 'error';
  vector_count: number;
  compression_ratio: number | null;
  last_finalized: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  index_id: string | null;
  action: 'query' | 'ingest' | 'finalize';
  metadata: Record<string, any>;
  created_at: string;
}

// Helper functions
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();
  
  if (error || !data) return null;
  return data as User;
}

export async function getUserByApiKey(apiKey: string): Promise<User | null> {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('api_key', apiKey)
    .single();
  
  if (error || !data) return null;
  return data as User;
}

