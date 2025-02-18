import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CodeSnippetModal from './CodeSnippetModal';
import { CodeSnippet, NewSnippet, Snippet } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/dateFormat';
import Navbar from './Navbar';
import debounce from 'lodash/debounce';
import { TrashIcon, ExclamationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

type SortOption = 'newest' | 'oldest' | 'most_liked';

const CodeSnippets: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchSnippets();
    }, [sortBy]);

    const fetchSnippets = async () => {
        try {
            const data = await api.getSnippets(sortBy);
            setSnippets(data);
        } catch (error) {
            console.error('Error fetching snippets:', error);
        }
    };

    const handleSubmit = async (title: string, description: string, codes: { language_id: number; code: string }[]) => {
        try {
            await api.createSnippet({
                title,
                description,
                codes
            });
            fetchSnippets();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating snippet:', error);
        }
    };

    const debouncedSearch = debounce((term: string) => {
        const filtered = snippets.filter(snippet =>
            snippet.title.toLowerCase().includes(term.toLowerCase()) ||
            snippet.description.toLowerCase().includes(term.toLowerCase())
        );
        setSnippets(filtered);
        if (term === '') fetchSnippets();
    }, 300);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleDeleteSnippet = async (snippetId: number) => {
        try {
            await api.deleteSnippet(snippetId);
            fetchSnippets();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting snippet:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 mt-16">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Code Snippets</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                            Create Snippet
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search snippets..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="most_liked">Most Liked</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {snippets.length === 0 ? (
                            <div className="bg-white shadow rounded-lg p-6">
                                <p className="text-gray-500 text-center">No snippets yet</p>
                            </div>
                        ) : (
                            snippets.map((snippet) => (
                                <div
                                    key={snippet.id}
                                    onClick={() => navigate(`/snippets/${snippet.id}`)}
                                    className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow relative"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{snippet.title}</h2>
                                            <div className="mt-2 flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    {snippet.codes.map((code) => (
                                                        <span
                                                            key={code.id}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {code.language.name}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center space-x-3 text-sm text-gray-500">
                                                    <div className="flex items-center space-x-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                        </svg>
                                                        <span>{snippet.likes_count}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <svg className="w-4 h-4 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                        </svg>
                                                        <span>{snippet.dislikes_count}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(snippet.created_at)}
                                            </div>
                                            {isAdmin && (
                                                <div>
                                                    {deleteConfirm === snippet.id ? (
                                                        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
                                                            <span className="text-sm text-gray-600 flex items-center">
                                                                <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                                                Delete snippet?
                                                            </span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleDeleteSnippet(snippet.id);
                                                                }}
                                                                className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                                                            >
                                                                <CheckCircleIcon className="h-5 w-5" />
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
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
                                                                e.stopPropagation();
                                                                setDeleteConfirm(snippet.id);
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
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <CodeSnippetModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                    />
                </div>
            </main>
        </div>
    );
};

export default CodeSnippets; 