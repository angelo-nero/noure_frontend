import React, { useState, useEffect } from 'react';
import { User, NewUser, UpdateUser, api } from '../../services/api';
import { PlusCircleIcon, PencilIcon, ExclamationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface EditModalProps {
    user: User;
    onClose: () => void;
    onSave: (userId: number, data: UpdateUser) => Promise<void>;
}

interface CreateModalProps {
    onClose: () => void;
    onSave: (data: NewUser) => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<UpdateUser>({
        email: user.email,
        role: user.role as 'user' | 'moderator' | 'admin',
        isActive: user.isActive
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(user.id, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <h3 className="text-xl font-bold mb-4">Edit User</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'moderator' | 'admin' })}
                            className="w-full border p-2 rounded"
                        >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium">Active</span>
                        </label>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            <XCircleIcon className="h-5 w-5" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState<NewUser>({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-xl font-bold mb-4">Create User</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'moderator' | 'admin' })}
                            className="w-full border p-2 rounded"
                        >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [statusConfirm, setStatusConfirm] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.getUsers();
            setUsers(response);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleStatusToggle = async (userId: number, currentStatus: boolean) => {
        try {
            await api.toggleUserStatus(userId, currentStatus);
            setStatusConfirm(null);
            fetchUsers();
        } catch (err) {
            setError('Failed to update user status');
        }
    };

    const handleCreateUser = async (userData: NewUser) => {
        try {
            await api.createUser(userData);
            fetchUsers();
        } catch (err) {
            setError('Failed to create user');
        }
    };

    const handleUpdateUser = async (userId: number, userData: UpdateUser) => {
        try {
            await api.updateUser(userId, userData);
            fetchUsers();
        } catch (err) {
            setError('Failed to update user');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>User Management</span>
            </h2>

            <div className="mb-6">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <PlusCircleIcon className="h-5 w-5" />
                    Create User
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Username</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-sm rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                            Edit
                                        </button>
                                        {statusConfirm === user.id ? (
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600 flex items-center">
                                                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                                    {user.isActive ? 'Deactivate' : 'Activate'}?
                                                </span>
                                                <button
                                                    onClick={() => handleStatusToggle(user.id, user.isActive)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                                                >
                                                    <CheckCircleIcon className="h-5 w-5" />
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setStatusConfirm(null)}
                                                    className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                                                >
                                                    <XCircleIcon className="h-5 w-5" />
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setStatusConfirm(user.id)}
                                                className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                                            >
                                                <ExclamationCircleIcon className="h-5 w-5" />
                                                Toggle Status
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingUser && (
                <EditModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleUpdateUser}
                />
            )}

            {showCreateModal && (
                <CreateModal
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleCreateUser}
                />
            )}
        </div>
    );
};

export default UserManagement; 