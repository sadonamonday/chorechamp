import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const getSession = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                if (session?.user) {
                    // Fetch profile
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profileError) {
                        console.error('Error fetching profile:', profileError);
                        // If profile fetch fails, we still want to set the user from session, 
                        // potentially without profile data, or handle it otherwise.
                        // For now, let's just set the user from session to avoid blocking.
                        setUser(session.user);
                    } else {
                        setUser({ ...session.user, ...profile });
                    }
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
                if (session?.user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profileError) {
                        console.error('Error fetching profile on auth change:', profileError);
                        setUser(session.user);
                    } else {
                        setUser({ ...session.user, ...profile });
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error handling auth change:', error);
            } finally {
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true, user: data.user };
    };

    const register = async (username, email, password, role = 'tasker', additionalData = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    role,
                    ...additionalData
                }
            }
        });

        if (error) {
            return { success: false, message: error.message };
        }

        // Profile will be created automatically by database trigger
        // No need to manually create it here
        return { success: true, data };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const loginWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/auth/callback'
                }
            });

            if (error) {
                console.error('Google login error:', error);
                return { success: false, message: 'Google login failed. Please try again.' };
            }

            return { success: true };
        } catch (error) {
            console.error('Google login error:', error);
            return { success: false, message: 'Google login failed. Please try again.' };
        }
    };

    const updateUserProfile = async (updates) => {
        try {
            if (!user) return { success: false, message: 'No user logged in' };

            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;

            setUser(prev => ({ ...prev, ...data }));
            return { success: true, data };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, message: error.message };
        }
    };

    const isAdmin = () => user?.role === 'admin';
    const isTasker = () => user?.role === 'tasker';

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            login,
            logout,
            register,
            loginWithGoogle,
            updateUserProfile,
            isAdmin,
            isTasker,
            isAuthenticated: !!user
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
