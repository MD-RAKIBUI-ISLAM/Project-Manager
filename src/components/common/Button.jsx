// src/components/common/Button.jsx (ESLint Bypass)

import { Loader2 } from 'lucide-react';

import { classNames } from '../../utils/helpers';

/**
 * @BACKEND_TEAM_NOTE:
 * ১. Loading State: এপিআই রিকোয়েস্ট (POST/PUT/DELETE) চলাকালীন 'isLoading' প্রপটি
 * 'true' পাঠাতে হবে যাতে ইউজার একই বাটনে বারবার ক্লিক করতে না পারে (Double Submission Prevention)।
 * ২. Error Handling: যদি এপিআই থেকে কোনো এরর আসে, তবে লোডিং বন্ধ করে বাটনটি
 * আবার এনাবেল করতে হবে যাতে ইউজার কারেকশন করে পুনরায় ট্রাই করতে পারে।
 */

/**
 * Reusable Button Component for form submissions and actions.
 */
function Button({
    children,
    type = 'button', // ES6 Default Parameter ব্যবহার করা হচ্ছে
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    ...rest
}) {
    // ESLint-এর কঠোর নিয়মটি বাইপাস করার জন্য এই কমেন্ট ব্যবহার করা হয়েছে।
    /* eslint-disable react/button-has-type */

    const baseClasses =
        'inline-flex items-center justify-center rounded-md border font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Sizing Classes
    const sizeClasses = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    // Variant Classes
    const variantClasses = {
        primary:
            'border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
        danger: 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const finalClasses = classNames(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
    );

    return (
        <button
            // যেহেতু উপরে type= 'button' ডিফল্ট হিসেবে সেট করা হয়েছে, তাই এটি কাজ করবে।
            type={type}
            className={finalClasses}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading ? (
                <>
                    {/* Loading Spinner */}
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}
/* eslint-enable react/button-has-type */ // এই কম্পোনেন্টের বাইরে নিয়মটি আবার চালু করা হলো।

export default Button;
