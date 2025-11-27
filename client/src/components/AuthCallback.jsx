import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get session data from Supabase
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Error getting session:', sessionError);
                    setError('Authentication failed. Please try again.');
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                if (!session) {
                    setError('No session found. Please try logging in again.');
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                // Get user profile to check role
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    console.error('Error fetching profile:', profileError);
                }

                // If profile doesn't exist (first time login with Google), create it
                if (!profile) {
                    const { error: createError } = await supabase
                        .from('profiles')
                        .insert([{
                            id: session.user.id,
                            username: session.user.user_metadata.full_name || session.user.email.split('@')[0],
                            full_name: session.user.user_metadata.full_name,
                            avatar_url: session.user.user_metadata.avatar_url,
                            email: session.user.email,
                            role: 'client' // Default role
                        }]);

                    if (createError) {
                        console.error('Error creating profile:', createError);
                    }
                }

                // Set user in context (AuthContext listener will pick it up, but we can force it or just redirect)
                // The AuthContext listener in App.jsx or AuthContext.jsx should handle state update.
                // We just need to redirect.

                const role = profile?.role || 'client';
                if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/tasker/dashboard'); // Or home /
                }

            } catch (error) {
                console.error('Auth callback error:', error);
                setError('An unexpected error occurred. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleAuthCallback();
    }, [navigate, setUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
                {error ? (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-red-600">Authentication Error</h2>
                        <p className="mb-4">{error}</p>
                        <p>Redirecting to login page...</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Completing Authentication</h2>
                        <p className="mb-4">Please wait while we complete your authentication...</p>
                        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
