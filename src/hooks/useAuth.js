// src/hooks/useAuth.js (FINAL Mock/API Switch Version)

import { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';
// USER_ROLES আমদানি করা হলো (যদিও এটি সরাসরি এখানে ব্যবহৃত নয়, তবে context এ দরকার হতে পারে)
// import { USER_ROLES } from '../utils/constants';

// --- Configuration Switch ---
// যখন আপনার আসল API ব্যাকএন্ড চালু থাকবে, তখন এটিকে false করুন।
const USE_MOCK_AUTH = true;
// ----------------------------

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const {
        isAuthenticated,
        user,
        loading,
        authError,
        setLoading,
        setAuthError,
        setIsAuthenticated,
        setUser,
        // Context থেকে আসল API login/register ফাংশনগুলো আনা হলো
        login: apiLogin,
        register: apiRegister,
        logout,
        updateProfile
    } = context;

    // --- MOCK API LOGIC ---

    const mockApiCall = (data, isRegister = false) =>
        new Promise((resolve) => {
            setLoading(true);
            setAuthError(null);

            const { email } = data;
            console.log(
                `Mock API called for ${isRegister ? 'Registration' : 'Login'} with:`,
                email
            );

            // Mock login/register এর পর 1 সেকেন্ড delay
            setTimeout(() => {
                setLoading(false);
                // Mock Response: Admin অ্যাক্সেস পরীক্ষা করার জন্য role: 'Admin' সেট করা হলো
                resolve({
                    token: 'mock_jwt_token',
                    user: {
                        full_name: data.full_name || 'Project Manager',
                        email: data.email,
                        // ✅ User Management page দেখার জন্য role: 'Admin' সেট করা হলো
                        role: 'Admin'
                    }
                });
            }, 1000);
        });

    // Mock Login Function
    const mockLogin = async (credentials) => {
        try {
            const response = await mockApiCall(credentials);
            localStorage.setItem('access_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setIsAuthenticated(true);
            setUser(response.user);
            return true;
        } catch (error) {
            setAuthError('Login failed (Mock Error). Try using any credentials.');
            return false;
        }
    };

    // Mock Register Function
    const mockRegister = async (data) => {
        try {
            await mockApiCall(data, true);
            return true;
        } catch (error) {
            setAuthError('Registration failed (Mock Error).');
            return false;
        }
    };

    // --- RBAC LOGIC (Role-Based Access Control) ---

    /**
     * Checks if the current user's role is included in the allowedRoles array.
     * @param {string[]} allowedRoles - Array of roles that are allowed access.
     * @returns {boolean} - True if user's role is permitted.
     */
    const isPermitted = (allowedRoles) => {
        // যদি user লগইন না করে থাকে বা তার role না থাকে, তবে access নেই।
        if (!user || !user.role || !allowedRoles || allowedRoles.length === 0) {
            return false;
        }

        // current user এর role, allowedRoles array তে আছে কিনা চেক করুন
        return allowedRoles.includes(user.role);
    };

    // --- API Switch ---
    const login = USE_MOCK_AUTH ? mockLogin : apiLogin;
    const register = USE_MOCK_AUTH ? mockRegister : apiRegister;

    // --- FINAL RETURN OBJECT ---
    return {
        isAuthenticated,
        user,
        loading,
        authError,
        login,
        register,
        logout,
        updateProfile,
        isPermitted // <--- ✅ isPermitted ফাংশনটি এখন রিটার্ন করা হয়েছে
    };
};

export default useAuth;
