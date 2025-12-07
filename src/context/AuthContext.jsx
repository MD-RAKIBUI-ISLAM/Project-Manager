// src/context/AuthContext.jsx (FINAL Working FIX - Role Persistence & Consistency)

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// FIX 1: Mock Data-এর সাথে সামঞ্জস্য রেখে USER_ROLES কনস্ট্যান্ট ডিফাইন করা হলো
export const USER_ROLES = {
    ADMIN: 'admin',
    PROJECT_MANAGER: 'project_manager',
    MEMBER: 'member',
    DEVELOPER: 'member' // ধরে নিচ্ছি Developer রোল Member এর সমতুল্য
};

// --- INITIAL MOCK USER DATA ---
// ... (এখানে INITIAL_MOCK_USERS ডেটা অপরিবর্তিত আছে, যা ছোট হাতের রোল ব্যবহার করে)
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
    // 1. STATE
    const [state, setState] = useState(getInitialState);
    const [mockUsers, setMockUsers] = useState(INITIAL_MOCK_USERS);

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

    // 3. CORE AUTHENTICATION FUNCTIONS (login/logout অপরিবর্তিত)
    const login = useCallback(
        async (email, password) => {
            setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => setTimeout(resolve, 800));

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

    // FIX 2: register ফাংশনের চূড়ান্ত সংশোধন
    const register = useCallback(
        // role parameter যোগ করা হলো এবং ডিফল্ট রোল MEMBER সেট করা হলো।
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

            // মক ইউজার লিস্টে নতুন ইউজারকে যোগ করা হলো
            const newUser = {
                id: mockUsers.length + 1,
                name,
                email,
                role: role.toLowerCase(), // <<--- রোলটিকে সেট করা হলো
                token: `mock-token-${mockUsers.length + 1}`,
                password
            };

            setMockUsers((prev) => [...prev, newUser]);

            // লগইন ডেটা লোকাল স্টোরেজে সেভ করা হলো
            localStorage.setItem('access_token', newUser.token);
            localStorage.setItem('user', JSON.stringify(newUser));

            // স্টেট আপডেট করা হলো
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

    // ... (User Management Functions অপরিবর্তিত) ...

    const fetchUsers = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockUsers.map(({ password, ...user }) => user);
    }, [mockUsers]);

    const updateUser = useCallback(
        async (userId, newDetails) => {
            setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => setTimeout(resolve, 800));

            let updatedUser = null;

            setMockUsers((prevUsers) => {
                const index = prevUsers.findIndex((u) => u.id === userId);
                if (index === -1) return prevUsers;

                updatedUser = {
                    ...prevUsers[index],
                    ...newDetails,
                    role: newDetails.role || prevUsers[index].role
                };

                const newUsers = [...prevUsers];
                newUsers[index] = updatedUser;
                return newUsers;
            });

            setLoading(false);

            if (updatedUser) {
                if (state.user?.id === userId) {
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
            // setLoading(true);
            setAuthError(null);
            await new Promise((resolve) => setTimeout(resolve, 800));

            setMockUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));

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

            // FIX 3: Role Checkers-এ কনস্ট্যান্ট ব্যবহার
            isAdmin: state.user?.role === USER_ROLES.ADMIN,
            isManager: state.user?.role === USER_ROLES.PROJECT_MANAGER,
            hasRole: (roles) => {
                if (!state.user) return false;
                const roleArray = Array.isArray(roles) ? roles : [roles];
                return roleArray.includes(state.user.role);
            }
        }),
        [state, login, register, logout, fetchUsers, updateUser, deleteUser]
    );

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
