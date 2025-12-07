// src/pages/Auth/RegisterPage.jsx (FINAL MOCK INTEGRATION - WORKING)

import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import { useAuth } from '../../context/AuthContext';

// Validation Schema
const registerSchema = yup.object().shape({
    full_name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    password2: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    role: yup.string().required('Role is required')
});

function RegisterPage() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);

    const { register: authRegister, authError } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // ✅ চূড়ান্ত ফিক্স: authRegister ফাংশনে data.role আর্গুমেন্টটি পাস করা হলো।
            const result = await authRegister(data.full_name, data.email, data.password, data.role);

            if (result && result.success) {
                // রেজিস্ট্রেশন সফল হলে, ইউজারকে সরাসরি ড্যাশবোর্ডে নিয়ে যাওয়া হলো
                navigate('/dashboard', { replace: true });
            } else {
                // Mock API failure হলে Context থেকে আসা error বা default error দেখানো হলো
                setError(
                    authError ||
                        (result && result.error) ||
                        'Registration failed. Please try again.'
                );
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full p-10 bg-white shadow-xl rounded-lg">
                    <h2 className="text-center text-2xl font-extrabold text-green-600">
                        Registration Successful!
                    </h2>
                    <p className="mt-4 text-center text-gray-600">
                        Your account has been created and you are now logged in. Go to{' '}
                        <Link
                            to="/dashboard"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Dashboard
                        </Link>
                        .
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create a New Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in to your existing account
                        </Link>
                    </p>
                </div>

                {(error || authError) && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm"
                        role="alert"
                    >
                        <span className="block sm:inline">{error || authError}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <InputField
                            label="Full Name"
                            name="full_name"
                            {...register('full_name')}
                            error={errors.full_name}
                        />
                        <InputField
                            label="Email address"
                            name="email"
                            type="email"
                            {...register('email')}
                            error={errors.email}
                        />
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            {...register('password')}
                            error={errors.password}
                        />
                        <InputField
                            label="Confirm Password"
                            name="password2"
                            type="password"
                            {...register('password2')}
                            error={errors.password2}
                        />
                        <InputField
                            label="Role (e.g., admin, project_manager, member)"
                            name="role"
                            {...register('role')}
                            error={errors.role}
                        />
                    </div>

                    <div>
                        <Button type="submit" fullWidth isLoading={loading} size="lg">
                            Register Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
