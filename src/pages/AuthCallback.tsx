import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    // Log immediately to confirm this component is rendering
    console.log('✅ AuthCallback component mounted - callback route is accessible');
    
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          console.error('❌ Supabase not configured');
          throw new Error('Supabase not configured');
        }

        console.log('🔐 Auth callback handler started');
        console.log('   Full URL:', window.location.href);
        console.log('   Hash:', window.location.hash);
        console.log('   Search:', window.location.search);
        console.log('   Pathname:', window.location.pathname);
        console.log('   Origin:', window.location.origin);

        // Check for errors in query params or hash FIRST
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const error = searchParams.get('error') || hashParams.get('error');
        const errorCode = searchParams.get('error_code') || hashParams.get('error_code');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
        
        // Check for PKCE code in query params (Supabase PKCE flow)
        const code = searchParams.get('code');

        if (error) {
          console.error('❌ Error in callback:', error, errorCode, errorDescription);
          
          if (errorCode === 'otp_expired') {
            setStatus('error');
            setMessage('⚠️ Email confirmation link has expired. Supabase links expire after 1 hour. Please sign up again to get a fresh link.');
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 7000);
            return;
          } else if (errorCode === 'access_denied') {
            setStatus('error');
            setMessage('⚠️ Access denied. The link may be invalid or expired. Please sign up again.');
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 5000);
            return;
          } else {
            setStatus('error');
            setMessage(`⚠️ Verification failed: ${errorDescription || error}. Please try signing up again.`);
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 5000);
            return;
          }
        }

        // Handle PKCE code exchange (Supabase sends ?code=... instead of #access_token=...)
        if (code && !error) {
          console.log('📦 Found PKCE code, exchanging for session...');
          console.log('   Code:', code.substring(0, 20) + '...');
          
          try {
            console.log('   Calling exchangeCodeForSession...');
            
            // Set up a promise that resolves when SIGNED_IN event fires
            let sessionResolved = false;
            const sessionPromise = new Promise<void>((resolve) => {
              const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session) {
                  console.log('   SIGNED_IN event received in callback');
                  sessionResolved = true;
                  subscription.unsubscribe();
                  resolve();
                }
              });
              
              // Timeout after 5 seconds
              setTimeout(() => {
                if (!sessionResolved) {
                  console.warn('   Timeout waiting for SIGNED_IN event');
                  subscription.unsubscribe();
                  resolve();
                }
              }, 5000);
            });
            
            const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            
            console.log('   Exchange response:', {
              hasSession: !!session,
              hasUser: !!session?.user,
              userEmail: session?.user?.email,
              hasError: !!exchangeError,
              errorMessage: exchangeError?.message
            });
            
            if (exchangeError) {
              console.error('❌ Code exchange error:', exchangeError);
              console.error('   Error details:', {
                message: exchangeError.message,
                status: exchangeError.status,
                name: exchangeError.name
              });
              throw exchangeError;
            }
            
            // Wait for SIGNED_IN event to fire (in case it's async)
            await sessionPromise;
            
            // Get the session again to make sure we have it
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            
            if (currentSession && currentSession.user) {
              console.log('✅ Session confirmed:', currentSession.user.email);
              console.log('   User ID:', currentSession.user.id);
              console.log('   Email confirmed:', currentSession.user.email_confirmed_at);
              
              setStatus('success');
              setMessage('✅ Email confirmed! Redirecting...');
              
              // Clear the code from URL
              window.history.replaceState({}, document.title, window.location.pathname);
              
              setTimeout(() => {
                console.log('🚀 Redirecting to /app');
                navigate('/app', { replace: true });
              }, 1500);
              return;
            } else if (session && session.user) {
              // Fallback to original session if currentSession check fails
              console.log('✅ Using original session:', session.user.email);
              setStatus('success');
              setMessage('✅ Email confirmed! Redirecting...');
              window.history.replaceState({}, document.title, window.location.pathname);
              setTimeout(() => {
                console.log('🚀 Redirecting to /app');
                navigate('/app', { replace: true });
              }, 1500);
              return;
            } else {
              console.error('❌ Code exchange succeeded but no session found');
              console.error('   Original session:', session);
              console.error('   Current session:', currentSession);
              throw new Error('Code exchange succeeded but no session found');
            }
          } catch (exchangeErr: any) {
            console.error('❌ Code exchange failed:', exchangeErr);
            console.error('   Error type:', exchangeErr?.constructor?.name);
            console.error('   Error message:', exchangeErr?.message);
            console.error('   Error stack:', exchangeErr?.stack);
            
            setStatus('error');
            setMessage(`⚠️ Verification failed: ${exchangeErr.message || 'Code exchange error'}. Please try signing up again.`);
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 5000);
            return;
          }
        }

        // Wait a moment for Supabase client to process the URL (if it does automatically)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if there's a hash with tokens (fallback for non-PKCE flow)
        const hash = window.location.hash;
        console.log('🔍 Checking hash:', hash);
        console.log('   Hash length:', hash?.length);
        console.log('   Contains access_token:', hash?.includes('access_token'));
        console.log('   Contains type:', hash?.includes('type'));
        
        const hasHashTokens = hash && (hash.includes('access_token') || hash.includes('type=recovery') || hash.includes('type=email'));

        if (hasHashTokens) {
          console.log('📦 Found hash tokens, parsing...');
          
          // Parse hash fragments
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');
          const type = hashParams.get('type');

          console.log('   Token type:', type);
          console.log('   Has access_token:', !!accessToken);
          console.log('   Access token length:', accessToken?.length);
          console.log('   Has refresh_token:', !!refreshToken);
          console.log('   Refresh token length:', refreshToken?.length);
          console.log('   All hash params:', Array.from(hashParams.keys()));

          if (error) {
            console.error('❌ Error in hash:', error, errorDescription);
            throw new Error(errorDescription || error);
          }

          if (accessToken && refreshToken) {
            console.log('🔑 Setting session from hash tokens...');
            console.log('   Access token (first 20 chars):', accessToken.substring(0, 20) + '...');
            console.log('   Refresh token (first 20 chars):', refreshToken.substring(0, 20) + '...');
            
            // Set the session explicitly
            const { data: { session }, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            console.log('   Session response:', {
              hasSession: !!session,
              hasUser: !!session?.user,
              userEmail: session?.user?.email,
              error: sessionError?.message
            });

            if (sessionError) {
              console.error('❌ Session error:', sessionError);
              console.error('   Error code:', sessionError.status);
              console.error('   Error message:', sessionError.message);
              throw sessionError;
            }

            if (session && session.user) {
              console.log('✅ Session created successfully:', session.user.email);
              console.log('   User ID:', session.user.id);
              console.log('   Email confirmed:', session.user.email_confirmed_at);
              
              setStatus('success');
              setMessage('✅ Email confirmed! Redirecting...');
              
              // Clear the hash from URL
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Wait a moment then redirect
              setTimeout(() => {
                console.log('🚀 Redirecting to /app');
                navigate('/app', { replace: true });
              }, 1000);
              return;
            } else {
              console.error('❌ Session created but no user found');
              console.error('   Session object:', session);
              throw new Error('Session created but no user found');
            }
          } else {
            console.warn('⚠️ Hash found but missing tokens');
            console.warn('   Access token present:', !!accessToken);
            console.warn('   Refresh token present:', !!refreshToken);
            console.warn('   Full hash:', hash);
          }
        }

        // Fallback: Try to get existing session (Supabase client might have already processed it)
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('   Session check result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          error: sessionError?.message
        });
        
        if (sessionError) {
          console.error('❌ Get session error:', sessionError);
          throw sessionError;
        }

        if (session && session.user) {
          console.log('✅ Found existing session:', session.user.email);
          console.log('   User ID:', session.user.id);
          console.log('   Email confirmed:', session.user.email_confirmed_at);
          
          setStatus('success');
          setMessage('✅ Email confirmed! Redirecting...');
          
          // Clear the hash from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          setTimeout(() => {
            console.log('🚀 Redirecting to /app');
            navigate('/app', { replace: true });
          }, 1000);
        } else {
          // No session found - might already be confirmed or link expired
          console.warn('⚠️ No session found after callback');
          console.log('   Full URL:', window.location.href);
          console.log('   Hash:', hash);
          console.log('   Search params:', window.location.search);
          console.log('   This might mean:');
          console.log('   1. Link already used');
          console.log('   2. Link expired');
          console.log('   3. Email already confirmed');
          console.log('   4. Tokens not in URL (check Supabase redirect URL settings)');
          
          // Check if user might already be confirmed
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            console.log('   Found user but no session:', user.email);
            setStatus('error');
            setMessage('⚠️ Email may already be confirmed. Please try signing in.');
          } else {
            setStatus('error');
            setMessage('⚠️ Unable to verify. The link may have expired or already been used. Please try signing up again.');
          }
          
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 5000);
        }
      } catch (err: any) {
        console.error('❌ Auth callback error:', err);
        console.error('   Error message:', err.message);
        console.error('   Error stack:', err.stack);
        
        setStatus('error');
        setMessage(err.message || 'Verification failed. Please try again.');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      handleAuthCallback();
    }, 100);

    return () => clearTimeout(timer);
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

