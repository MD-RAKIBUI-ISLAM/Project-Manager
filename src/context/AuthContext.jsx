// src/context/AuthContext.jsx (FINAL Error-Free Working Mocking Logic)

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// --- INITIAL MOCK USER DATA (পাসওয়ার্ডসহ প্রাথমিক ডেটা) ---
const INITIAL_MOCK_USERS = [
    {
        id: 1,
        name: 'Alice Smith',
        email: 'admin@project.com',
        role: 'admin',
        token: 'mock-admin-token',
        password: 'password'
    },
    {
        id: 2,
        name: 'Bob Johnson',
        email: 'manager@project.com',
        role: 'project_manager',
        token: 'mock-manager-token',
        password: 'password'
    },
    {
        id: 3,
        name: 'Charlie Brown',
        email: 'member@project.com',
        role: 'member',
        token: 'mock-member-token',
        password: 'password'
    }
];
// --- END INITIAL MOCK USER DATA ---

export const AuthContext = createContext();

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
        isAuthenticated: !!token && !!user,
        user,
        loading: false,
        authError: null
    };
};

export function AuthProvider({ children }) {
    const [state, setState] = useState(getInitialState);
    const [mockUsers, setMockUsers] = useState(INITIAL_MOCK_USERS);

    // --- Stable State Setters ---
    const setLoading = useCallback((val) => setState((s) => ({ ...s, loading: val })), [setState]);
    const setAuthError = useCallback(
        (err) => setState((s) => ({ ...s, authError: err })),
        [setState]
    );
    const setIsAuthenticated = useCallback(
        (val) => setState((s) => ({ ...s, isAuthenticated: val })),
        [setState]
    );
    const setUser = useCallback(
        (userData) => setState((s) => ({ ...s, user: userData })),
        [setState]
    );

    // ১. লগইন ফাংশন (Mocked FR-1)
    const login = useCallback(
        async (email, password) => {
            setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => {
                setTimeout(resolve, 800);
            });

            // ইউজার প্রদত্ত পাসওয়ার্ড চেক করা হচ্ছে
            const foundUser = mockUsers.find(
                (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );

            if (foundUser) {
                localStorage.setItem('access_token', foundUser.token);
                localStorage.setItem('user', JSON.stringify(foundUser));

                setState((s) => ({
                    ...s,
                    user: foundUser,
                    isAuthenticated: true,
                    loading: false
                }));
                return { success: true };
            }
            const error = 'Invalid email or password.';
            setAuthError(error);
            setLoading(false);
            return { success: false, error };
        },
        [setLoading, setAuthError, mockUsers, setState]
    );

    // ২. রেজিস্ট্রেশন ফাংশন (Mocked FR-2)
    const register = useCallback(
        async (name, email, password) => {
            setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => {
                setTimeout(resolve, 800);
            });

            const isEmailTaken = mockUsers.some(
                (u) => u.email.toLowerCase() === email.toLowerCase()
            );

            if (isEmailTaken) {
                const error = 'User with this email already exists.';
                setAuthError(error);
                setLoading(false);
                return { success: false, error };
            }

            const newUser = {
                id: mockUsers.length + 1,
                name,
                email,
                role: 'member', // রেজিস্ট্রেশনের পর ডিফল্ট রোল
                token: `mock-token-${mockUsers.length + 1}`,
                password // পাসওয়ার্ড সেভ করা হলো
            };

            // নতুন ইউজারকে mutable mockUsers লিস্টে যোগ করা হলো
            setMockUsers((prev) => [...prev, newUser]);

            localStorage.setItem('access_token', newUser.token);
            localStorage.setItem('user', JSON.stringify(newUser));

            setState((s) => ({
                ...s,
                user: newUser,
                isAuthenticated: true,
                loading: false
            }));
            return { success: true };
        },
        [setLoading, setAuthError, mockUsers, setMockUsers, setState]
    );

    // ৩. লগআউট ফাংশন
    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        setState({
            isAuthenticated: false,
            user: null,
            loading: false,
            authError: null
        });
    }, [setState]);

    // ৪. প্রোফাইল আপডেট ফাংশন
    const updateProfile = useCallback(
        (newUserData) => {
            const updatedUser = { ...state.user, ...newUserData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setState((s) => ({ ...s, user: updatedUser }));
        },
        [state.user, setState]
    );

    // --- Context Value Optimization ---
    const authContextValue = useMemo(
        () => ({
            ...state,
            setLoading,
            setAuthError,
            setIsAuthenticated,
            setUser,
            login,
            register,
            logout,
            updateProfile,
            // Role Checkers
            isAdmin: state.user?.role === 'admin',
            isManager: state.user?.role === 'project_manager',
            hasRole: (roles) => {
                if (!state.user) return false;
                if (Array.isArray(roles)) {
                    return roles.includes(state.user.role);
                }
                return state.user.role === roles;
            }
        }),
        [
            state,
            login,
            register,
            logout,
            updateProfile,
            setLoading,
            setAuthError,
            setIsAuthenticated,
            setUser
        ]
    );

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
