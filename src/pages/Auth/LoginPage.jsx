// src/pages/Auth/LoginPage.jsx (FINAL Working Version with Name, Email, Password)

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import { useAuth } from '../../context/AuthContext';

/**
 * BACKEND TEAM INTEGRATION GUIDE:
 * 1. ENDPOINT: Use POST /api/auth/login.
 * 2. REQUEST BODY: Ensure the server expects { name, email, password }.
 * NOTE: Standard login usually only requires email/password, but 'name' is
 * included here as per specific UI requirements.
 * 3. RESPONSE: Server should return a JWT token and user object on success.
 */

// ✅ পরিবর্তন #1: Validation Schema তে তিনটি ফিল্ড যোগ করা হলো
const loginSchema = yup.object().shape({
    name: yup.string().required('Name is required'), // নতুন: নাম
    email: yup.string().email('Invalid email address').required('Email is required'), // ইমেল
    password: yup.string().required('Password is required') // পাসওয়ার্ড
});

function LoginPage() {
    const { isAuthenticated, login, loading, authError } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema)
    });

    // ফর্ম সাবমিশন হ্যান্ডলার
    const onSubmit = async (data) => {
        // ✅ পরিবর্তন #2: login ফাংশনে name, email, এবং password তিনটিই পাস করা হলো
        // BACKEND TEAM: Ensure the login function in AuthContext maps these to the API call.
        const result = await login(data.name, data.email, data.password);

        // result অবজেক্টের মধ্যে success প্রপার্টিটি চেক করা হলো
        if (result && result.success) {
            navigate('/dashboard', { replace: true });
        } else {
            console.error('Login Failed. Displayed error to user via authError.');
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to Task Manager
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link
                            to="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                {/* Global Error Display */}
                {authError && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm"
                        role="alert"
                    >
                        <span className="block sm:inline">{authError}</span>
                    </div>
                )}

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* ✅ নতুন ফিল্ড: Name Input Field */}
                        <InputField
                            label="Name"
                            name="name"
                            type="text"
                            placeholder="Your Full Name"
                            {...register('name')}
                            error={errors.name}
                        />

                        {/* Email Input Field */}
                        <InputField
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            {...register('email')}
                            error={errors.email}
                        />

                        {/* Password Input Field */}
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            error={errors.password}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <Button type="submit" fullWidth isLoading={loading} size="lg">
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
