import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Blog } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/dateFormat';
import Navbar from './Navbar';
import { TrashIcon, ExclamationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const { user } = useAuth();

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const data = await api.getBlogs();
            setBlogs(data);
        } catch (error) {
            setError('Error fetching blogs');
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (blogId: number) => {
        try {
            await api.deleteBlog(blogId);
            fetchBlogs();
            setDeleteConfirm(null);
        } catch (error) {
            setError('Error deleting blog');
            console.error('Error deleting blog:', error);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="animate-pulse space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                                            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                        <Link
                            to="/blogs/new"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Create New Post
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="relative">
                                <Link
                                    to={`/blogs/${blog.id}`}
                                    className="block group"
                                >
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
                                        <div className="flex items-start gap-6">
                                            {blog.image && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={blog.image}
                                                        alt={blog.title}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-indigo-700">
                                                            {blog.author.username.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        {blog.author.username}
                                                    </span>
                                                    <span className="text-sm text-gray-400">•</span>
                                                    <span className="text-sm text-gray-600">
                                                        {formatDate(blog.created_at)}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    {blog.title}
                                                </h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {blog.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Admin Delete Blog Button */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4">
                                        {deleteConfirm === blog.id ? (
                                            <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
                                                <span className="text-sm text-gray-600 flex items-center">
                                                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                                    Delete blog?
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDeleteBlog(blog.id);
                                                    }}
                                                    className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                                                >
                                                    <CheckCircleIcon className="h-5 w-5" />
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setDeleteConfirm(null);
                                                    }}
                                                    className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                                                >
                                                    <XCircleIcon className="h-5 w-5" />
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setDeleteConfirm(blog.id);
                                                }}
                                                className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1 bg-white p-2 rounded-lg shadow-sm"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
} 