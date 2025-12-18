// src/pages/Admin/UserManagementPage.jsx

import { AlertTriangle, CheckCircle, Edit, Plus, Trash2, UserCheck, UserX } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

/**
 * BACKEND TEAM INTEGRATION GUIDE:
 * 1. AUTHORIZATION: All endpoints (GET /users, PATCH /users/:id, DELETE /users/:id)
 * must be protected by server-side 'isAdmin' middleware.
 * 2. SELF-ACTION PREVENTION: Backend must prevent an admin from deleting themselves
 * or changing their own role to avoid system lockout.
 * 3. RELATIONSHIPS: Ensure logic handles what happens to projects/tasks assigned
 * to a user when that user is deleted.
 */

// --- Helper Components (RoleBadge and StatusIndicator remain the same) ---
function RoleBadge({ role }) {
    let color = 'bg-gray-200 text-gray-800';
    if (role === USER_ROLES.ADMIN) color = 'bg-red-100 text-red-800';
    else if (role === USER_ROLES.PROJECT_MANAGER) color = 'bg-indigo-100 text-indigo-800';
    else if (role === USER_ROLES.DEVELOPER) color = 'bg-blue-100 text-blue-800';

    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color}`}>{role}</span>;
}

function StatusIndicator({ status }) {
    const isActive = status === 'Active';
    const Icon = isActive ? UserCheck : UserX;
    const color = isActive ? 'text-green-500' : 'text-red-500';
    return <Icon className={`h-5 w-5 ${color}`} title={status} />;
}

// --- Main Component ---
function UserManagementPage() {
    // ✅ FIX 2: register-এর বদলে adminCreateUser-কে আমদানি করা হয়েছে
    const {
        user,
        loading: authLoading,
        fetchUsers,
        updateUser,
        deleteUser,
        adminCreateUser
    } = useAuth();

    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // Confirmation State: { id: number, name: string }
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Success Notification State
    const [successMessage, setSuccessMessage] = useState(null);

    // ✅ FIX 1: Error Notification State (NEW)
    const [errorMessage, setErrorMessage] = useState(null);

    // 3. ইউজার ডেটা ফেচ করার লজিক
    const loadUsers = useCallback(async () => {
        setIsFetching(true);
        try {
            const fetchedUsers = await fetchUsers();
            setUsers(fetchedUsers.map((u) => ({ ...u, status: 'Active' }))); // Mock status for display
        } catch (error) {
            setErrorMessage('Failed to fetch users data.');
            console.error('Failed to fetch users:', error);
        } finally {
            setIsFetching(false);
        }
    }, [fetchUsers]);

    // Initial data fetch
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Success Message Auto-Hide Logic
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
        return undefined;
    }, [successMessage]);

    // ✅ FIX 1: Error Message Auto-Hide Logic (NEW)
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
        return undefined;
    }, [errorMessage]);

    // 4. Role Change (Role Select Dropdown)
    const handleRoleChange = useCallback(
        async (userId, newRole) => {
            setErrorMessage(null); // Clear previous messages
            setSuccessMessage(null);

            const result = await updateUser(userId, { role: newRole });
            if (result.success) {
                await loadUsers();
                setSuccessMessage(`Role for user ID **${userId}** updated to **${newRole}**.`);
            } else {
                setErrorMessage(
                    `Error updating role: ${result.error || 'An unknown error occurred.'}`
                );
            }
        },
        [updateUser, loadUsers]
    );

    // 5. User Deletion - Initial Click (Sets Confirmation State)
    const handleDelete = useCallback((userId, userName) => {
        setConfirmDelete({ id: userId, name: userName });
        setErrorMessage(null); // Clear errors when confirming
        setSuccessMessage(null); // Clear success when confirming
    }, []);

    // 5.1. User Deletion - Confirmation Logic
    const confirmDeletion = useCallback(async () => {
        if (!confirmDelete) return;

        const userId = confirmDelete.id;
        const userName = confirmDelete.name;

        setErrorMessage(null);
        setSuccessMessage(null);

        // ডিলিট অপারেশন শুরু
        const result = await deleteUser(userId);

        if (result.success) {
            // ✅ রিলোড না করে, তালিকা থেকে UI-এর মাধ্যমে ইউজারকে সরিয়ে ফেলা
            setUsers((currentUsers) => currentUsers.filter((u) => u.id !== userId));

            // ✅ inline notification সেট করা হয়েছে
            setSuccessMessage(`User **${userName}** successfully deleted.`);
        } else {
            setErrorMessage(
                `Error deleting user **${userName}**: ${result.error || 'An unknown error occurred.'}`
            );
        }

        // কনফার্মেশন স্টেট রিসেট করা
        setConfirmDelete(null);
    }, [deleteUser, confirmDelete]);

    // 5.2. User Deletion - Cancel Logic
    const cancelDeletion = () => {
        setConfirmDelete(null);
    };

    // 6. Add New User
    const handleAddUser = useCallback(
        async ({ name, email, role, password }) => {
            setErrorMessage(null); // Clear previous errors
            setSuccessMessage(null); // Clear previous success

            console.log('Attempting to create user with role:', role);

            // ✅ FIX 2: adminCreateUser ব্যবহার করা হয়েছে
            const result = await adminCreateUser(name, email, password, role);

            if (result.success) {
                await loadUsers();
                setIsAddModalOpen(false);
                // ✅ FIX 1: inline success message ব্যবহার করা হয়েছে
                setSuccessMessage(`User **${name}** successfully added as a **${role}**.`);
            } else {
                setIsAddModalOpen(false);
                // ✅ FIX 1: inline error message ব্যবহার করা হয়েছে
                setErrorMessage(
                    `Error adding user: ${result.error || 'An unknown error occurred.'}`
                );
            }
        },
        [adminCreateUser, loadUsers] // Dependency updated
    );

    // 7. Edit Existing User
    const handleEditUser = useCallback(
        async (updatedUserData) => {
            setErrorMessage(null);
            setSuccessMessage(null);

            const result = await updateUser(updatedUserData.id, updatedUserData);
            if (result.success) {
                await loadUsers();
                setIsEditModalOpen(false);
                setUserToEdit(null);
                setSuccessMessage(`User **${updatedUserData.name}** updated successfully!`);
            } else {
                setErrorMessage(
                    `Error updating user **${updatedUserData.name}**: ${result.error || 'An unknown error occurred.'}`
                );
            }
        },
        [updateUser, loadUsers]
    );

    // Edit button click handler
    const handleEditClick = (selectedUser) => {
        setUserToEdit(selectedUser);
        setIsEditModalOpen(true);
        setErrorMessage(null); // Clear previous messages
        setSuccessMessage(null);
    };

    // Modal close helper function for Edit Modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setUserToEdit(null);
    };

    // Loading State UI - শুধুমাত্র প্রথমবার ডেটা ফেচ করার সময় বা অন্য কোনো ম্যানুয়াল লোডিং-এর সময় দেখাবে
    if (isFetching) {
        return (
            <div className="p-8 text-center text-gray-500 text-xl font-semibold">
                <svg
                    className="animate-spin inline mr-3 h-5 w-5 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                Loading users...
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    User Management ({users.length} Total)
                </h1>

                {/* Add New User Button */}
                <Button
                    variant="primary"
                    size="md"
                    className="space-x-2"
                    onClick={() => {
                        setIsAddModalOpen(true);
                        setErrorMessage(null);
                        setSuccessMessage(null);
                    }}
                    disabled={authLoading}
                >
                    <Plus className="h-5 w-5" />
                    <span>Add New User</span>
                </Button>
            </div>

            {/* Warning for demonstration (unchanged) */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                    This page is protected by{' '}
                    <code className="font-mono text-xs">PrivateRoute</code>
                    and only accessible to users with the **{USER_ROLES.ADMIN}** role. (Your current
                    user role is: <strong>{user?.role || 'Guest'}</strong>)
                </p>
            </div>

            {/* --- Success Notification Bar --- */}
            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-800">
                        <strong>Operation Success.</strong> {successMessage}
                    </p>
                </div>
            )}

            {/* --- ✅ FIX 1: Error Notification Bar (NEW) --- */}
            {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-center space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <p className="text-sm font-medium text-red-800">
                        <strong>Operation Failed.</strong> {errorMessage}
                    </p>
                </div>
            )}
            {/* ------------------------------- */}

            {/* --- Inline Confirmation Bar (unchanged) --- */}
            {confirmDelete && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex justify-between items-center">
                    <p className="text-sm font-medium text-red-800 flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <span>Do you want to delete user **{confirmDelete.name}**?</span>
                    </p>
                    <div className="flex space-x-3">
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={confirmDeletion}
                            disabled={authLoading}
                        >
                            Yes, Delete
                        </Button>
                        <Button variant="secondary" size="sm" onClick={cancelDeletion}>
                            No, Cancel
                        </Button>
                    </div>
                </div>
            )}
            {/* ------------------------------- */}

            {/* User Table (rest of the table logic is unchanged) */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name / Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                {/* User Info */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {u.name}
                                    </div>
                                    <div className="text-xs text-gray-500">{u.email}</div>
                                </td>

                                {/* Role Selection */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        disabled={authLoading || u.email === user?.email} // নিজে নিজের রোল পরিবর্তন করতে পারবে না
                                    >
                                        {Object.values(USER_ROLES).map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mt-1">
                                        <RoleBadge role={u.role} />
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusIndicator status={u.status || 'Active'} />
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* Edit Button */}
                                    <button
                                        type="button"
                                        className="text-indigo-600 hover:text-indigo-900 p-2"
                                        title="Edit User"
                                        onClick={() => handleEditClick(u)}
                                        disabled={authLoading}
                                    >
                                        <Edit className="h-5 w-5 inline" />
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(u.id, u.name)}
                                        className="text-red-600 hover:text-red-900 p-2 ml-2"
                                        title="Delete User"
                                        // এডমিন নিজেকে ডিলিট করতে পারবে না
                                        disabled={
                                            u.email === user?.email || authLoading || confirmDelete
                                        }
                                    >
                                        <Trash2 className="h-5 w-5 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {isAddModalOpen && (
                <AddUserModal onClose={() => setIsAddModalOpen(false)} onSave={handleAddUser} />
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && userToEdit && (
                <EditUserModal user={userToEdit} onClose={closeEditModal} onSave={handleEditUser} />
            )}
        </div>
    );
}

export default UserManagementPage;
