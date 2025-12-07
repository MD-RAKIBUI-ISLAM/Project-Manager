import { AlertTriangle, CheckCircle, Edit, Plus, Trash2, UserCheck, UserX } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

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
    const { user, loading: authLoading, fetchUsers, updateUser, deleteUser, register } = useAuth();

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

    // 3. ইউজার ডেটা ফেচ করার লজিক
    const loadUsers = useCallback(async () => {
        setIsFetching(true);
        try {
            const fetchedUsers = await fetchUsers();
            setUsers(fetchedUsers.map((u) => ({ ...u, status: 'Active' }))); // Mock status for display
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsFetching(false);
        }
    }, [fetchUsers]);

    // Initial data fetch
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Success Message Auto-Hide Logic (Linter fixed)
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000); // 3 সেকেন্ড পর মেসেজ হাইড হবে

            // যখন successMessage থাকে, তখন ক্লিনার ফাংশন রিটার্ন করো
            return () => clearTimeout(timer);
        }

        // ✅ Linter fix: স্পষ্ট করে undefined রিটার্ন করা হলো
        return undefined;
    }, [successMessage]);

    // 4. Role Change (Role Select Dropdown)
    const handleRoleChange = useCallback(
        async (userId, newRole) => {
            const result = await updateUser(userId, { role: newRole });
            if (result.success) {
                await loadUsers();
            } else {
                alert(`Error updating role: ${result.error}`);
            }
        },
        [updateUser, loadUsers]
    );

    // 5. User Deletion - Initial Click (Sets Confirmation State)
    const handleDelete = useCallback((userId, userName) => {
        setConfirmDelete({ id: userId, name: userName });
    }, []);

    // 5.1. User Deletion - Confirmation Logic (No Page Reload, No Loading State)
    const confirmDeletion = useCallback(async () => {
        if (!confirmDelete) return;

        const userId = confirmDelete.id;
        const userName = confirmDelete.name;

        // ডিলিট অপারেশন শুরু
        const result = await deleteUser(userId);

        if (result.success) {
            // ✅ রিলোড না করে, তালিকা থেকে UI-এর মাধ্যমে ইউজারকে সরিয়ে ফেলা
            setUsers((currentUsers) => currentUsers.filter((u) => u.id !== userId));

            // ✅ inline notification সেট করা হয়েছে
            setSuccessMessage(`User ${userName} successfully deleted.`);

            // [গুরুত্বপূর্ণ]: loadUsers() কল করা হচ্ছে না, তাই লোডিং স্টেট ট্রিগার হবে না।
        } else {
            alert(`Error deleting user: ${result.error}`); // Error still uses alert for simplicity
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
            console.log('Attempting to register user with role:', role);
            const result = await register(name, email, password, role);
            if (result.success) {
                await loadUsers();
                setIsAddModalOpen(false);
                alert(
                    `User ${name} added successfully with role: ${role}. 
                     You are now logged in as this user. Please ensure the sidebar is visible.`
                );
            } else {
                alert(`Error adding user: ${result.error}`);
            }
        },
        [register, loadUsers]
    );

    // 7. Edit Existing User
    const handleEditUser = useCallback(
        async (updatedUserData) => {
            const result = await updateUser(updatedUserData.id, updatedUserData);
            if (result.success) {
                await loadUsers();
                setIsEditModalOpen(false);
                setUserToEdit(null);
                alert(`User ${updatedUserData.name} updated successfully!`);
            } else {
                alert(`Error updating user: ${result.error}`);
            }
        },
        [updateUser, loadUsers]
    );

    // Edit button click handler
    const handleEditClick = (selectedUser) => {
        setUserToEdit(selectedUser);
        setIsEditModalOpen(true);
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
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={authLoading}
                >
                    <Plus className="h-5 w-5" />
                    <span>Add New User</span>
                </Button>
            </div>

            {/* Warning for demonstration */}
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
                        <strong>Successfully Deleted.</strong> {successMessage}
                    </p>
                </div>
            )}

            {/* --- Inline Confirmation Bar --- */}
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

            {/* User Table */}
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
                                        disabled={authLoading}
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
