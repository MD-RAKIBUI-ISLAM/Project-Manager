// src/pages/Admin/AddUserModal.jsx (MODIFIED - Added Password Field)

import { X } from 'lucide-react';
import { useState } from 'react';

import Button from '../../components/common/Button';
import { USER_ROLES } from '../../utils/constants';

/**
 * BACKEND TEAM INTEGRATION GUIDE:
 * 1. PASSWORD SECURITY: Do NOT store the 'password' in plain text. Use a hashing library like bcrypt.
 * 2. VALIDATION: Ensure the backend validates:
 * - Email uniqueness (check if user already exists).
 * - Password strength (minimum length, complexity).
 * 3. RESPONSE: Return the newly created user object (excluding the password) or an appropriate error message.
 */

function AddUserModal({ onClose, onSave }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(USER_ROLES.MEMBER);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation check
        if (!name || !email || !password) return;

        // onSave-এ password পাঠানো হচ্ছে
        // BACKEND TEAM: This object will be sent via POST /api/admin/users
        onSave({ name, email, role, password });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password (Initial)
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter temporary password"
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {Object.values(USER_ROLES).map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Add User
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUserModal;
