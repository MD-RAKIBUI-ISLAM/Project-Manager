// src/pages/Admin/EditUserModal.jsx (NEW FILE)

import { X } from 'lucide-react';
import { useState } from 'react';

import Button from '../../components/common/Button';
import { USER_ROLES } from '../../utils/constants';

/**
 * BACKEND TEAM INTEGRATION GUIDE:
 * 1. ENDPOINT: Use PATCH or PUT /api/users/:id to update user details.
 * 2. ID PERSISTENCE: The 'id' being passed in onSave is crucial for the SQL/NoSQL query.
 * 3. VALIDATION: If the email is updated, verify on the backend that it doesn't
 * conflict with another existing user's email.
 */

function EditUserModal({ user, onClose, onSave }) {
    // বর্তমান ইউজার ডেটা দিয়ে স্টেট ইনিশিয়ালাইজ করা
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email) return;

        // Modal বন্ধ করা এবং আপডেট করা ডেটা প্যারেন্ট কম্পোনেন্টে পাঠানো
        // BACKEND TEAM: Ensure you receive this object and perform a partial update in the DB.
        onSave({
            id: user.id,
            name,
            email,
            role,
            status: user.status // Status typically managed via a separate toggle/API
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all scale-100 ease-out duration-300">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Edit User: {user.name}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
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
                            required
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUserModal;
