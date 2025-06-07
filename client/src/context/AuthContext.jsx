import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost/chorchamp-server/api/users/login.php', {
                email,
                password
            });

            if (response.data.status === 'success') {
                setUser(response.data.user);
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Login failed. Please check your credentials.'
                };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, message: 'Login failed. Please try again.' };
        }
    };

    const register = async (username, email, password, role = 'tasker') => {
        try {
            const response = await axios.post('http://localhost/chorchamp-server/api/users/register.php', {
                username,
                email,
                password,
                role
            });

            if (response.data.status === 'success') {
                // Automatically log in the user after successful registration
                const loginResponse = await axios.post('http://localhost/chorchamp-server/api/users/login.php', {
                    email,
                    password
                });

                if (loginResponse.data.status === 'success') {
                    setUser(loginResponse.data.user);
                    return { success: true };
                }

                return { success: true, message: 'Registration successful. Please log in.' };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Registration failed. Please try again.'
                };
            }
            return { success: false, message: 'Registration failed. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const isTasker = () => {
        return user?.role === 'tasker';
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            register,
            isAdmin,
            isTasker,
            isAuthenticated: !!user
        }}>
            {children}
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