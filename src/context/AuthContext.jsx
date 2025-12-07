// src/context/AuthContext.jsx (FINAL Working FIX - Persistence added)

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// FIX 1: Mock Data-এর সাথে সামঞ্জস্য রেখে USER_ROLES কনস্ট্যান্ট ডিফাইন করা হলো
export const USER_ROLES = {
    ADMIN: 'admin',
    PROJECT_MANAGER: 'project_manager',
    MEMBER: 'member',
    DEVELOPER: 'member' // ধরে নিচ্ছি Developer রোল Member এর সমতুল্য
};

// --- INITIAL MOCK USER DATA ---
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

// ✅ FIX: localStorage থেকে ইউজারদের ডেটা লোড করা হলো
const getInitialMockUsers = () => {
    const storedUsers = localStorage.getItem('mockUsers');
    if (storedUsers) {
        try {
            // যদি localStorage এ থাকে, তবে সেটি ব্যবহার করা হবে
            return JSON.parse(storedUsers);
        } catch (e) {
            console.error('Failed to parse mockUsers from localStorage', e);
            // ত্রুটি হলে ডিফল্ট ডেটা ব্যবহার করা হবে
            return INITIAL_MOCK_USERS;
        }
    }
    // যদি localStorage এ না থাকে, তবে ডিফল্ট ডেটা ব্যবহার করা হবে
    return INITIAL_MOCK_USERS;
};
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
    // 1. STATE
    const [state, setState] = useState(getInitialState);
    // ✅ FIX: mockUsers স্টেট getInitialMockUsers থেকে ডেটা নেবে
    const [mockUsers, setMockUsers] = useState(getInitialMockUsers);

    // ✅ FIX: mockUsers পরিবর্তিত হলেই localStorage এ সেভ করা হবে (Persistence)
    useEffect(() => {
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }, [mockUsers]);

    // ... Stable Setters (অপরিবর্তিত) ...
    const setLoading = useCallback((val) => setState((s) => ({ ...s, loading: val })), []);
    const setAuthError = useCallback((err) => setState((s) => ({ ...s, authError: err })), []);
    const updateState = useCallback((updates) => setState((s) => ({ ...s, ...updates })), []);

    const updateProfile = useCallback(
        (newUserData) => {
            updateState((s) => {
                const updatedUser = { ...s.user, ...newUserData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return { user: updatedUser };
            });
        },
        [updateState]
    );

    // 3. CORE AUTHENTICATION FUNCTIONS
    const login = useCallback(
        async (email, password) => {
            setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => setTimeout(resolve, 800));

            // ✅ FIX: Persistence যোগ হওয়ায় mockUsers এ নতুন ইউজারদের ডেটা থাকবে
            const foundUser = mockUsers.find(
                (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );

            if (foundUser) {
                localStorage.setItem('access_token', foundUser.token);
                localStorage.setItem('user', JSON.stringify(foundUser));

                updateState({
                    user: foundUser,
                    isAuthenticated: true,
                    loading: false
                });
                return { success: true };
            }
            const error = 'Invalid email or password.';
            setAuthError(error);
            setLoading(false);
            return { success: false, error };
        },
        [setLoading, setAuthError, mockUsers, updateState]
    );

    // FIX 2: register ফাংশন (সাধারণ ইউজারদের জন্য) - সফল হলে ইউজার লগইন হয়ে যায়
    const register = useCallback(
        async (name, email, password, role = USER_ROLES.MEMBER) => {
            setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => setTimeout(resolve, 800));

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
                role: role.toLowerCase(),
                token: `mock-token-${mockUsers.length + 1}`,
                password
            };

            setMockUsers((prev) => [...prev, newUser]);

            // সফল রেজিস্ট্রেশনের পর ইউজারকে লগইন করানো
            localStorage.setItem('access_token', newUser.token);
            localStorage.setItem('user', JSON.stringify(newUser));

            updateState({
                user: newUser,
                isAuthenticated: true,
                loading: false
            });
            return { success: true };
        },
        [setLoading, setAuthError, mockUsers, setMockUsers, updateState]
    );

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

    // ------------------------------------------
    // FIX 4: Admin-এর জন্য নতুন ইউজার তৈরির ফাংশন (Admin সেশন পরিবর্তন করবে না)
    const adminCreateUser = useCallback(
        async (name, email, password, role) => {
            setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => setTimeout(resolve, 800));

            const isEmailTaken = mockUsers.some(
                (u) => u.email.toLowerCase() === email.toLowerCase()
            );

            if (isEmailTaken) {
                setLoading(false);
                return { success: false, error: 'User with this email already exists.' };
            }

            // মক ইউজার লিস্টে নতুন ইউজারকে যোগ করা হলো
            const newUser = {
                id: mockUsers.length + 1,
                name,
                email,
                role: role.toLowerCase(),
                token: `mock-token-${mockUsers.length + 1}`,
                password
            };

            setMockUsers((prev) => [...prev, newUser]);

            // Admin সেশন বজায় রাখার জন্য এখানে কোনো লগইন লজিক ব্যবহার করা হয়নি।

            setLoading(false);
            return { success: true, user: newUser };
        },
        [setLoading, setAuthError, mockUsers, setMockUsers]
    );
    // ------------------------------------------

    // ... (User Management Functions) ...

    const fetchUsers = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockUsers.map(({ password, ...user }) => ({ ...user, id: String(user.id) }));
    }, [mockUsers]);

    const updateUser = useCallback(
        async (userId, newDetails) => {
            setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => setTimeout(resolve, 800));

            let updatedUser = null;

            setMockUsers((prevUsers) => {
                const index = prevUsers.findIndex((u) => String(u.id) === String(userId));
                if (index === -1) return prevUsers;

                updatedUser = {
                    ...prevUsers[index],
                    ...newDetails,
                    role: (newDetails.role || prevUsers[index].role).toLowerCase()
                };

                const newUsers = [...prevUsers];
                newUsers[index] = updatedUser;
                return newUsers;
            });

            setLoading(false);

            if (updatedUser) {
                if (String(state.user?.id) === String(userId)) {
                    updateProfile(updatedUser);
                }
                return { success: true, user: updatedUser };
            }

            return { success: false, error: 'User not found' };
        },
        [setLoading, setAuthError, setMockUsers, state.user?.id, updateProfile]
    );

    const deleteUser = useCallback(
        async (userId) => {
            setAuthError(null);
            await new Promise((resolve) => setTimeout(resolve, 800));

            setMockUsers((prevUsers) => prevUsers.filter((u) => String(u.id) !== String(userId)));

            setLoading(false);
            return { success: true };
        },
        [setLoading, setAuthError, setMockUsers]
    );

    // 5. CONTEXT VALUE
    const authContextValue = useMemo(
        () => ({
            ...state,
            login,
            register,
            logout,

            // User Management Functions
            fetchUsers,
            updateUser,
            deleteUser,
            adminCreateUser,

            // Role Checkers-এ কনস্ট্যান্ট ব্যবহার
            isAdmin: state.user?.role === USER_ROLES.ADMIN,
            isManager: state.user?.role === USER_ROLES.PROJECT_MANAGER,
            hasRole: (roles) => {
                if (!state.user) return false;
                const roleArray = Array.isArray(roles) ? roles : [roles];
                return roleArray.includes(state.user.role);
            }
        }),
        [state, login, register, logout, fetchUsers, updateUser, deleteUser, adminCreateUser]
    );

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
