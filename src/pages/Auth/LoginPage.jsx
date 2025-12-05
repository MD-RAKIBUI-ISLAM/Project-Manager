// src/pages/Auth/LoginPage.jsx (FINAL Working Version with Login Call Fix)

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import { useAuth } from '../../context/AuthContext';

// Validation Schema
const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required')
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
        // ✅ ফিক্স: login ফাংশনে email এবং password আলাদাভাবে পাস করা হলো
        const result = await login(data.email, data.password);

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
                        <InputField
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            {...register('email')}
                            error={errors.email}
                        />

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
