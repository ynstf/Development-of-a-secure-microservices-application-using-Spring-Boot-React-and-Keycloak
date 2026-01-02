import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    username: decoded.preferred_username,
                    roles: decoded.realm_access?.roles || [],
                    email: decoded.email,
                });
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login(username, password);
            const { access_token } = response;

            localStorage.setItem('token', access_token);

            const decoded = jwtDecode(access_token);
            const userData = {
                username: decoded.preferred_username,
                roles: decoded.realm_access?.roles || [],
                email: decoded.email,
            };

            setUser(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error_description || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAdmin = () => {
        return user?.roles?.includes('admin');
    };

    const isClient = () => {
        return user?.roles?.includes('client');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isClient }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};