import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import NewsModal from '../NewsModal';
import { formatDate } from '../../utils/dateFormat';
import {
    PencilIcon,
    TrashIcon,
    PlusCircleIcon,
    MagnifyingGlassIcon,
    ExclamationCircleIcon,
    XCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface News {
    id: number;
    title: string;
    body: string;
    created_at: string;
}

const NewsManagement: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const data = await api.getNews();
            setNews(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch news');
            setLoading(false);
        }
    };

    const handleCreateNews = async (title: string, body: string) => {
        try {
            await api.createNews({ title, body });
            fetchNews();
            setIsModalOpen(false);
        } catch (err) {
            setError('Failed to create news');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteNews(id);
            setDeleteConfirm(null);
            fetchNews();
        } catch (err) {
            setError('Failed to delete news');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">News Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <PlusCircleIcon className="h-5 w-5" />
                    Add News
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search news..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* News Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {news.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(item.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                                        Published
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <button className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1">
                                            <PencilIcon className="h-5 w-5" />
                                            Edit
                                        </button>
                                        {deleteConfirm === item.id ? (
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600 flex items-center">
                                                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                                    Confirm delete?
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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
                                                onClick={() => setDeleteConfirm(item.id)}
                                                className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <NewsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateNews}
            />
        </div>
    );
};

export default NewsManagement; 