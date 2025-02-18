import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Category, NewCategory } from '../../types';
import { PlusCircleIcon, TrashIcon, ExclamationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState<NewCategory>({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch categories');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createCategory(newCategory);
            setNewCategory({ name: '', description: '' });
            fetchCategories();
        } catch (err) {
            setError('Failed to create category');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteCategory(id);
            setDeleteConfirm(null);  // Reset delete confirmation
            fetchCategories();
        } catch (err) {
            setError('Failed to delete category');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>Category Management</span>
            </h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        Add Category
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {deleteConfirm === category.id ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600 flex items-center">
                                                <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                                Confirm delete?
                                            </span>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                                            >
                                                <CheckCircleIcon className="h-5 w-5" />
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                                            >
                                                <XCircleIcon className="h-5 w-5" />
                                                No
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(category.id)}
                                            className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManagement; 