// src/components/common/InputField.jsx

import React from 'react';

import { classNames } from '../../utils/helpers';

/**
 * Reusable Input Field Component, designed for use with react-hook-form.
 */
const InputField = React.forwardRef(
    ({ label, type = 'text', name, error, fullWidth = true, ...rest }, ref) => {
        // Tailwind CSS ক্লাসের শর্ত
        const inputClasses = classNames(
            'mt-1 block appearance-none rounded-md border',
            'px-3 py-2 placeholder-gray-400 focus:outline-none sm:text-sm transition duration-150 ease-in-out',
            fullWidth ? 'w-full' : 'w-auto', // width control
            // Error State Styling:
            error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        );

        return (
            <div className={fullWidth ? 'w-full' : 'inline-block'}>
                {/* Label */}
                {label && (
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                {/* Input Element */}
                <input
                    id={name}
                    name={name}
                    type={type}
                    ref={ref} // react-hook-form registration-এর জন্য ref
                    className={inputClasses}
                    {...rest} // অন্যান্য prop (e.g., placeholder, required)
                />

                {/* Error Message */}
                {error && <p className="mt-1 text-xs text-red-600 font-medium">{error.message}</p>}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;
