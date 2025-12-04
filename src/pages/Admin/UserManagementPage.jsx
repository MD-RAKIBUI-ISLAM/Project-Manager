// src/pages/Admin/UserManagementPage.jsx (FINAL VERSION with Add & Edit functionality)

import { AlertTriangle, Edit, Plus, Trash2, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';

import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

// --- Mock User Data ---
const initialUsers = [
    {
        id: 1,
        name: 'Alice Smith',
        email: 'alice@task.com',
        role: USER_ROLES.ADMIN,
        status: 'Active'
    },
    {
        id: 2,
        name: 'Bob Johnson',
        email: 'bob@task.com',
        role: USER_ROLES.PROJECT_MANAGER,
        status: 'Active'
    },
    {
        id: 3,
        name: 'Charlie Brown',
        email: 'charlie@task.com',
        role: USER_ROLES.DEVELOPER,
        status: 'Inactive'
    },
    {
        id: 4,
        name: 'Diana Prince',
        email: 'diana@task.com',
        role: USER_ROLES.DEVELOPER,
        status: 'Active'
    },
    { id: 5, name: 'Eve Adams', email: 'eve@task.com', role: USER_ROLES.VIEWER, status: 'Active' }
];

// --- Helper Components (RoleBadge and StatusIndicator are used below) ---
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
    const { user } = useAuth(); // Global user is used in warning box and delete button
    const [users, setUsers] = useState(initialUsers);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // Mock function to simulate role update
    const handleRoleChange = (userId, newRole) => {
        setUsers((prevUsers) =>
            prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        console.log(`User ${userId} role changed to ${newRole}`);
    };

    // Mock function to simulate user deletion
    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
            console.log(`User ${userId} deleted.`);
        }
    };

    // Function to handle adding new user
    const handleAddUser = ({ name, email, role }) => {
        const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
        const newUser = { id: newId, name, email, role, status: 'Active' };
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setIsAddModalOpen(false);
        alert(`User ${name} added successfully!`);
    };

    // ✅ FIX: Edit বাটন ক্লিক হ্যান্ডলার (প্যারামিটার নাম পরিবর্তন)
    const handleEditClick = (selectedUser) => {
        setUserToEdit(selectedUser); // ইউজার ডেটা স্টেটে সেট করা
        setIsEditModalOpen(true); // Edit Modal ওপেন করা
    };

    // Function to handle saving edited user data
    const handleEditUser = (updatedUserData) => {
        setUsers((prevUsers) =>
            prevUsers.map((u) => (u.id === updatedUserData.id ? updatedUserData : u))
        );
        setIsEditModalOpen(false);
        setUserToEdit(null);
        alert(`User ${updatedUserData.name} updated successfully!`);
    };

    // Modal close helper function for Edit Modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setUserToEdit(null);
    };

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
                >
                    <Plus className="h-5 w-5" />
                    <span>Add New User</span>
                </Button>
            </div>

            {/* Warning for demonstration - 'user' is read here */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                    This page is protected by{' '}
                    <code className="font-mono text-xs">PrivateRoute</code>
                    and only accessible to users with the **{USER_ROLES.ADMIN}** role. (Your current
                    user role is: <strong>{user?.role || 'Guest'}</strong>)
                </p>
            </div>

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
                                    <StatusIndicator status={u.status} />
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* Edit Button with onClick handler */}
                                    <button
                                        type="button"
                                        className="text-indigo-600 hover:text-indigo-900 p-2"
                                        title="Edit User"
                                        onClick={() => handleEditClick(u)}
                                    >
                                        <Edit className="h-5 w-5 inline" />
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(u.id)}
                                        className="text-red-600 hover:text-red-900 p-2 ml-2"
                                        title="Delete User"
                                        disabled={u.email === user?.email}
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
