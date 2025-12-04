// src/context/AuthContext.jsx (FINAL, WARNING-FREE VERSION)

import { createContext, useContext, useMemo, useState } from 'react';

// NOTE: getErrorMessage এবং axiosClient আপনার প্রোজেক্টে বিদ্যমান থাকতে হবে।
import axiosClient from '../api/axiosClient';

// AuthContext কে অবশ্যই Named Export করতে হবে
export const AuthContext = createContext();

// ইনিশিয়াল স্টেট লোড করা: localStorage থেকে টোকেন এবং ইউজার ডেটা লোড করা।
const getInitialState = () => {
    const token = localStorage.getItem('access_token');
    const userString = localStorage.getItem('user');

    let user = null;
    if (userString) {
        try {
            user = JSON.parse(userString);
        } catch (e) {
            console.error('Failed to parse user from localStorage', e);
            localStorage.removeItem('user');
        }
    }

    return {
        isAuthenticated: !!token,
        user,
        loading: false,
        authError: null
    };
};

export function AuthProvider({ children }) {
    const [state, setState] = useState(getInitialState);

    // --- State Setters (useAuth hook-এ ব্যবহারের জন্য) ---
    const setLoading = (val) => setState((s) => ({ ...s, loading: val }));
    const setAuthError = (err) => setState((s) => ({ ...s, authError: err }));
    const setIsAuthenticated = (val) => setState((s) => ({ ...s, isAuthenticated: val }));
    const setUser = (userData) => setState((s) => ({ ...s, user: userData }));

    // --- Auth Actions ---

    // ১. লগইন ফাংশন (Login Function)
    // WARING FIX: credentials আর্গুমেন্ট সরানো হলো, কারণ এটি Context-এ ব্যবহৃত হয় না।
    const login = async () => {
        // এই ফাংশনটি Hook-এ মক করা আছে, তাই এখানে শুধু একটি প্লেসহোল্ডার থাকল।
        console.error('Context login called. This should be handled by useAuth hook in mock mode.');
        return false;
    };

    // ২. লগআউট ফাংশন (Logout Function)
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        // Axios client থেকে Auth header মুছে ফেলা
        delete axiosClient.defaults.headers.Authorization;

        setState({
            isAuthenticated: false,
            user: null,
            loading: false,
            authError: null
        });
    };

    // ৩. প্রোফাইল আপডেট ফাংশন (Optional)
    const updateProfile = (newUserData) => {
        localStorage.setItem('user', JSON.stringify(newUserData));
        setState((s) => ({ ...s, user: newUserData }));
    };

    // --- Context Value Optimization (useMemo ব্যবহার) ---
    const authContextValue = useMemo(
        () => ({
            ...state,
            // Setter Functions
            setLoading,
            setAuthError,
            setIsAuthenticated,
            setUser,
            login,
            logout,
            updateProfile
        }),
        [state]
    );

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

// Custom Hook to use the Auth context (useAuth hook)
export const useAuth = () => useContext(AuthContext);
