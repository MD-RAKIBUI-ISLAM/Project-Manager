// src/components/auth/PrivateRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

/**
 * @BACKEND_TEAM_NOTE:
 * ১. Auth Persistence: ইউজার পেজ রিফ্রেশ করলে 'AuthContext' ব্যাকএন্ডের সাথে (e.g., /api/verify-token)
 * যোগাযোগ করে 'loading' স্টেট ম্যানেজ করবে।
 * ২. RBAC Sync: এখানে 'user.role' স্ট্রিংটি সরাসরি চেক করা হচ্ছে। ব্যাকএন্ড রেসপন্সে
 * রোলের নামগুলো (Admin, Member, Manager) যেন ফ্রন্টএন্ডের সাথে হুবহু মেলে তা নিশ্চিত করুন।
 * ৩. Security: ফ্রন্টএন্ডে রুট ব্লক করা হলেও, ব্যাকএন্ড এন্ডপয়েন্টে অবশ্যই 'Role-based Middleware' থাকতে হবে।
 */

function PrivateRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // ১. লোডিং স্টেট হ্যান্ডল করা
    // @BACKEND_INTEGRATION: টোকেন ভ্যালিডেশন চলাকালীন এই সেকশনটি ইউজারকে অপেক্ষা করায়।
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                <p className="text-gray-500 font-medium italic">Verifying access...</p>
            </div>
        );
    }

    // ২. অথেন্টিকেশন চেক
    // @BACKEND_NOTE: যদি ব্যাকএন্ড ৪০১ (Unauthorized) রেসপন্স দেয়, তবে AuthContext ইউজারকে নাল করে দেবে।
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ৩. রোল চেক (Role-Based Access Control)
    /**
     * @BACKEND_INTEGRATION:
     * যদি ব্যাকএন্ড থেকে রোলের পরিবর্তে পারমিশন লিস্ট (e.g. ['read:users', 'write:projects']) আসে,
     * তবে এই লজিকটি 'user.permissions.includes(requiredPermission)' এ পরিবর্তন করতে হবে।
     */
    if (requiredRole && user.role !== requiredRole) {
        console.warn(`Access Denied: Role ${user.role} does not meet ${requiredRole}`);
        // অ্যাক্সেস না থাকলে আনঅথরাইজড পেজ বা ড্যাশবোর্ডে পাঠানো
        return <Navigate to="/dashboard" replace />;
    }

    // ৪. সাকসেসফুল অথেন্টিকেশন
    return children;
}

export default PrivateRoute;
