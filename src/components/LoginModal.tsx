import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../lib/auth-context';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        if (!supabase) {
          throw new Error('Supabase not configured. Please check your environment variables and restart the server.');
        }
        
        console.log('Attempting signup with:', { 
          email, 
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY 
        });
        
        let authData, signUpError;
        try {
          console.log('Calling supabase.auth.signUp...');
          // Use environment variable for production, fallback to current origin for local dev
          let frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
          
          // Ensure URL has protocol (https:// or http://)
          if (frontendUrl && !frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
            frontendUrl = `https://${frontendUrl}`;
          }
          
          // Use /auth/callback route for email confirmation
          const redirectUrl = `${frontendUrl}/auth/callback`;
          
          console.log('Signup redirect URL:', redirectUrl);
          
          const result = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: redirectUrl,
            }
          });
          console.log('SignUp result:', { 
            hasUser: !!result.data?.user, 
            hasError: !!result.error,
            error: result.error?.message 
          });
          authData = result.data;
          signUpError = result.error;
        } catch (networkErr: any) {
          console.error('Signup network error (catch):', networkErr);
          console.error('Error details:', {
            message: networkErr.message,
            stack: networkErr.stack,
            name: networkErr.name,
            cause: networkErr.cause
          });
          
          // Check for DNS resolution error
          const errorMsg = networkErr.message || '';
          const errorName = networkErr.name || '';
          
          if (errorMsg.includes('ERR_NAME_NOT_RESOLVED') || errorMsg.includes('Failed to fetch') || errorName === 'AuthRetryableFetchError') {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'NOT SET';
            console.error('❌ DNS Resolution Failed for Supabase URL:', supabaseUrl);
            console.error('   This usually means:');
            console.error('   1. ⚠️  Supabase project is PAUSED - Go to https://supabase.com/dashboard');
            console.error('      → Select your project → Settings → General → Restore project');
            console.error('   2. ⚠️  Incorrect URL in Vercel environment variables');
            console.error('      → Check VITE_SUPABASE_URL in Vercel settings');
            console.error('   3. ⚠️  DNS/Network issue');
            console.error('      → Check internet connection');
            
            throw new Error('Cannot connect to Supabase. The project might be paused. Go to Supabase Dashboard → Settings → General → Restore project. Then try again.');
          }
          
          if (errorMsg.includes('CORS') || errorMsg.includes('cors')) {
            throw new Error('CORS error: Please check Supabase Authentication > URL Configuration and add your Vercel domain to allowed URLs.');
          }
          if (errorMsg.includes('timeout') || errorMsg.includes('Timeout')) {
            throw new Error('Connection timeout. Supabase project might be paused. Check dashboard and restore if needed.');
          }
          
          throw new Error(`Network error: ${errorMsg || 'Failed to connect to Supabase. Check browser console (F12) for details.'}`);
        }

        if (signUpError) {
            console.error('Signup error:', signUpError);
            // Handle specific Supabase errors
            if (signUpError.message?.includes('already registered') || signUpError.message?.includes('already been registered')) {
              throw new Error('This email is already registered. Please sign in instead.');
            }
            if (signUpError.message?.includes('Password') || signUpError.message?.includes('password')) {
              throw new Error('Password is too weak. Please use at least 6 characters.');
            }
            if (signUpError.message?.includes('fetch') || signUpError.message?.includes('network')) {
              throw new Error('Network error. Please check your internet connection and try again.');
            }
            throw new Error(signUpError.message || 'Failed to sign up. Please try again.');
          }

          // Check if user was created (might be null if email confirmation is required)
          if (!authData.user) {
            // This can happen if email confirmation is required
            setError('✅ Sign up successful! Please check your email to verify your account. Click the confirmation link within 1 hour.');
            setTimeout(() => {
              setIsSignUp(false);
              setEmail('');
              setPassword('');
            }, 5000);
            return;
          }

          // User created successfully - will be created in database via trigger
          console.log('✅ User created, attempting auto-login...');
          setError('✅ Sign up successful! Logging you in...');
          
          // Wait a moment for database trigger to create user record
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Try to sign in automatically
          try {
            await login(email, password);
            setIsSignUp(false);
            onClose();
            navigate('/app');
          } catch (loginErr: any) {
            console.error('Auto-login failed:', loginErr);
            // If auto-login fails, user needs to sign in manually
            setIsSignUp(false);
            setError('✅ Account created! Please sign in with your email and password.');
            setTimeout(() => {
              setEmail('');
              setPassword('');
            }, 3000);
          }
      } else {
        // Sign in - only works if user exists
        if (!supabase) {
          throw new Error('Supabase not configured. Please check your environment variables and restart the server.');
        }
        
        await login(email, password);
        onClose();
        navigate('/app');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMessage = err.message || 'An error occurred';
      
      // Handle network errors
      if (err.message?.includes('fetch') || err.message?.includes('network') || err.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      // Handle Supabase specific errors
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          {isSignUp ? 'Create Account' : 'Welcome to Memryx'}
        </h2>
        <p className="text-slate-400">
          {isSignUp ? 'Sign up to get started' : 'Sign in to access your portal'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && (
          <div className={`text-sm text-center ${
            error.includes('successful') ? 'text-green-400' : 'text-red-400'
          }`}>
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Sign up
            </button>
          </>
        )}
      </div>

      {!isSignUp && (
        <div className="mt-4 text-center text-xs text-slate-500">
          Try <span className="text-cyan-400 font-mono">admin@mcn.local</span> for admin access
        </div>
      )}
    </Modal>
  );
}
