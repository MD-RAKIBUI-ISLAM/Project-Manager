// src/pages/Admin/AddUserModal.jsx (NEW FILE)

import { X } from 'lucide-react';
import { useState } from 'react';

import Button from '../../components/common/Button'; // Assuming you have this Button component
import { USER_ROLES } from '../../utils/constants'; // USER_ROLES অবশ্যই ইমপোর্ট করতে হবে

function AddUserModal({ onClose, onSave }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // Default role হিসেবে Developer সেট করা হলো
    const [role, setRole] = useState(USER_ROLES.DEVELOPER);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation check
        if (!name || !email) return;

        onSave({ name, email, role });
    };

    return (
        // Modal Overlay (Tailwind CSS for full-screen dim background)
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {/* USER_ROLES constants থেকে রোল অপশনগুলো রেন্ডার করা */}
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
