import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Snippet } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/dateFormat';
import Navbar from './Navbar';

const CodeSnippetDetail: React.FC = () => {
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [error, setError] = useState<string>('');
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchSnippet = async () => {
            try {
                if (!id) return;
                const data = await api.getSnippet(id);
                setSnippet(data);
            } catch (error) {
                setError('Error fetching snippet details');
                console.error('Error fetching snippet:', error);
            }
        };

        fetchSnippet();
    }, [id]);

    const handleLike = async () => {
        try {
            if (!id) return;
            const response = await api.likeSnippet(id);
            setSnippet(prev => prev ? {
                ...prev,
                likes_count: response.likes_count,
                dislikes_count: response.dislikes_count,
                user_reaction: response.user_reaction
            } : null);
        } catch (error) {
            console.error('Error liking snippet:', error);
        }
    };

    const handleDislike = async () => {
        try {
            if (!id) return;
            const response = await api.dislikeSnippet(id);
            setSnippet(prev => prev ? {
                ...prev,
                likes_count: response.likes_count,
                dislikes_count: response.dislikes_count,
                user_reaction: response.user_reaction
            } : null);
        } catch (error) {
            console.error('Error disliking snippet:', error);
        }
    };

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 mt-16">
                    <div className="container mx-auto px-4 py-6">
                        <div className="bg-red-50 p-4 rounded-md">
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 mt-16">
                    <div className="container mx-auto px-4 py-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-32 bg-gray-200 rounded mb-4"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 mt-16">
                <div className="container mx-auto px-4 py-6">
                    <Link
                        to="/snippets"
                        className="inline-flex items-center mb-4 text-purple-600 hover:text-purple-700 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Return to Snippets
                    </Link>
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{snippet.title}</h1>
                                <p className="mt-2 text-gray-600">{snippet.description}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                {formatDate(snippet.created_at)}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${snippet.user_reaction === 'like'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                    </svg>
                                    <span>{snippet.likes_count}</span>
                                </button>
                                <button
                                    onClick={handleDislike}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${snippet.user_reaction === 'dislike'
                                            ? 'bg-red-100 text-red-700'
                                            : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <svg className="w-5 h-5 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                    </svg>
                                    <span>{snippet.dislikes_count}</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {snippet.codes.map((code) => (
                                <div key={code.id} className="rounded-lg overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {code.language.name}
                                        </span>
                                        <button
                                            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                                            onClick={() => {
                                                navigator.clipboard.writeText(code.code);
                                                setCopiedId(code.id);
                                                setTimeout(() => setCopiedId(null), 2000);
                                            }}
                                        >
                                            {copiedId === code.id ? (
                                                <>
                                                    <span className="text-sm text-green-600">Copied!</span>
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <pre className="bg-gray-800 text-white p-4 overflow-x-auto">
                                        <code>{code.code}</code>
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CodeSnippetDetail;
