import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { INITIAL_MOCK_USERS, USER_ROLES } from '../utils/constants';

// BACKEND TEAM: All localStorage logic for 'mockUsers' should be replaced by real DB queries via API.
const getInitialMockUsers = () => {
    const storedUsers = localStorage.getItem('mockUsers');
    if (storedUsers) {
        try {
            return JSON.parse(storedUsers);
        } catch (e) {
            console.error('Failed to parse mockUsers from localStorage', e);
            return INITIAL_MOCK_USERS;
        }
    }
    return INITIAL_MOCK_USERS;
};

// BACKEND TEAM: Next ID should be handled by DB (Auto-increment or UUID).
const getNextId = (users) => {
    const maxId = users.reduce((max, user) => Math.max(max, Number(user.id)), 0);
    return maxId + 1;
};

export const AuthContext = createContext();

const getInitialState = () => {
    // BACKEND TEAM: Authenticate using JWT stored in Cookies or LocalStorage.
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

    const role = user?.role || null;

    return {
        isAuthenticated: !!token && !!user,
        user,
        loading: false,
        authError: null,
        role
    };
};

export function AuthProvider({ children }) {
    const [state, setState] = useState(getInitialState);
    const [mockUsers, setMockUsers] = useState(getInitialMockUsers);

    useEffect(() => {
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }, [mockUsers]);

    const setLoading = useCallback((val) => setState((s) => ({ ...s, loading: val })), []);
    const setAuthError = useCallback((err) => setState((s) => ({ ...s, authError: err })), []);
    const updateState = useCallback((updates) => setState((s) => ({ ...s, ...updates })), []);

    const updateProfile = useCallback(
        (newUserData) => {
            // BACKEND TEAM: Sync local state with DB update (PATCH /api/users/profile)
            updateState((s) => {
                const updatedUser = { ...s.user, ...newUserData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return {
                    user: updatedUser,
                    role: updatedUser.role
                };
            });
        },
        [updateState]
    );

    const login = useCallback(
        async (name, email, password) => {
            setLoading(true);
            setAuthError(null);
            // BACKEND TEAM: Replace with POST /api/auth/login
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
                    loading: false,
                    role: foundUser.role
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

    const register = useCallback(
        async (name, email, password, role = USER_ROLES.MEMBER) => {
            setLoading(true);
            setAuthError(null);
            // BACKEND TEAM: Replace with POST /api/auth/register
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

            const newId = getNextId(mockUsers);
            const newUser = {
                id: newId,
                name,
                email,
                role: role.toLowerCase(),
                token: `mock-token-${newId}`,
                password
            };

            setMockUsers((prev) => [...prev, newUser]);

            localStorage.setItem('access_token', newUser.token);
            localStorage.setItem('user', JSON.stringify(newUser));

            updateState({
                user: newUser,
                isAuthenticated: true,
                loading: false,
                role: newUser.role
            });
            return { success: true };
        },
        [setLoading, setAuthError, mockUsers, setMockUsers, updateState]
    );

    const logout = useCallback(() => {
        // BACKEND TEAM: Potentially blacklist token on server
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        setState({
            isAuthenticated: false,
            user: null,
            loading: false,
            authError: null,
            role: null
        });
    }, [setState]);

    const adminCreateUser = useCallback(
        async (name, email, password, role) => {
            setLoading(true);
            setAuthError(null);
            // BACKEND TEAM: Replace with POST /api/admin/users
            await new Promise((resolve) => setTimeout(resolve, 800));

            const isEmailTaken = mockUsers.some(
                (u) => u.email.toLowerCase() === email.toLowerCase()
            );

            if (isEmailTaken) {
                setLoading(false);
                return { success: false, error: 'User with this email already exists.' };
            }

            const newId = getNextId(mockUsers);
            const newUser = {
                id: newId,
                name,
                email,
                role: role.toLowerCase(),
                token: `mock-token-${newId}`,
                password
            };

            setMockUsers((prev) => [...prev, newUser]);
            setLoading(false);
            return { success: true, user: newUser };
        },
        [setLoading, setAuthError, mockUsers, setMockUsers]
    );

    const fetchUsers = useCallback(async () => {
        // BACKEND TEAM: Replace with GET /api/users
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockUsers.map(({ password, ...user }) => ({ ...user, id: String(user.id) }));
    }, [mockUsers]);

    const updateUser = useCallback(
        async (userId, newDetails) => {
            setLoading(true);
            setAuthError(null);
            // BACKEND TEAM: Replace with PATCH /api/users/:id
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
            // BACKEND TEAM: Replace with DELETE /api/users/:id
            await new Promise((resolve) => setTimeout(resolve, 800));

            setMockUsers((prevUsers) => prevUsers.filter((u) => String(u.id) !== String(userId)));
            setLoading(false);
            return { success: true };
        },
        [setLoading, setAuthError, setMockUsers]
    );

    const authContextValue = useMemo(
        () => ({
            ...state,
            login,
            register,
            logout,
            fetchUsers,
            updateUser,
            deleteUser,
            adminCreateUser,
            isAdmin: state.role === USER_ROLES.ADMIN,
            isManager: state.role === USER_ROLES.PROJECT_MANAGER,
            hasRole: (roles) => {
                if (!state.user) return false;
                const roleArray = Array.isArray(roles) ? roles : [roles];
                return roleArray.includes(state.role);
            }
        }),
        [state, login, register, logout, fetchUsers, updateUser, deleteUser, adminCreateUser]
    );

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
