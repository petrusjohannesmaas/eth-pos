import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
    _id: string;
    name: string;
    role: 'cashier' | 'admin';
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('pos_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('pos_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pos_user');
    };

    // Auto-lock feature: logout after 10 minutes of inactivity
    useEffect(() => {
        if (!user) return;

        let timeout: NodeJS.Timeout;

        const resetTimeout = () => {
            clearTimeout(timeout);
            // 10 minutes * 60 seconds * 1000 ms
            timeout = setTimeout(() => {
                logout();
            }, 10 * 60 * 1000);
        };

        resetTimeout();

        // Listen for activity
        window.addEventListener('mousemove', resetTimeout);
        window.addEventListener('keydown', resetTimeout);
        window.addEventListener('click', resetTimeout);
        window.addEventListener('touchstart', resetTimeout);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('keydown', resetTimeout);
            window.removeEventListener('click', resetTimeout);
            window.removeEventListener('touchstart', resetTimeout);
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
