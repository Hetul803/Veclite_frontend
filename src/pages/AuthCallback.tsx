import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        // Get the hash from URL (Supabase PKCE flow uses hash fragments)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || error);
        }

        if (accessToken) {
          // Set the session
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });

          if (sessionError) {
            throw sessionError;
          }

          if (session) {
            setStatus('success');
            setMessage('✅ Email confirmed! Redirecting...');
            
            // Wait a moment then redirect
            setTimeout(() => {
              navigate('/app');
            }, 1500);
          } else {
            throw new Error('Failed to create session');
          }
        } else {
          // Try to get session from URL (fallback)
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }

          if (session) {
            setStatus('success');
            setMessage('✅ Email confirmed! Redirecting...');
            setTimeout(() => {
              navigate('/app');
            }, 1500);
          } else {
            // No session found - might already be confirmed or link expired
            setStatus('error');
            setMessage('⚠️ Unable to verify. The link may have expired. Please try signing in.');
            setTimeout(() => {
              navigate('/');
            }, 3000);
          }
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage(err.message || 'Verification failed. Please try again.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          {status === 'loading' && (
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          {status === 'loading' && 'Verifying Email'}
          {status === 'success' && 'Email Confirmed!'}
          {status === 'error' && 'Verification Failed'}
        </h2>
        <p className="text-slate-400">{message}</p>
      </div>
    </div>
  );
}

