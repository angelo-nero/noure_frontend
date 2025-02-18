import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import RichTextEditor from './RichTextEditor';
import { TrashIcon, ExclamationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';

interface Comment {
    id: number;
    content: string;
    author: {
        username: string;
    };
    created_at: string;
}

interface Discussion {
    id: number;
    title: string;
    content: string;
    author: {
        username: string;
    };
    category: {
        name: string;
    };
    created_at: string;
    comments: Comment[];
}

export default function DiscussionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [discussion, setDiscussion] = useState<Discussion | null>(null);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<'discussion' | number | null>(null);

    useEffect(() => {
        fetchDiscussion();
    }, [id]);

    const fetchDiscussion = async () => {
        try {
            const discussion = await api.getDiscussion(id!);
            setDiscussion(discussion);
        } catch (error) {
            console.error('Error fetching discussion:', error);
            navigate('/forum');
        }
    };

    const handleDeleteDiscussion = async () => {
        try {
            await api.deleteDiscussion(Number(id));
            navigate('/forum');
        } catch (error) {
            console.error('Error deleting discussion:', error);
            setError('Failed to delete discussion');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await api.deleteComment(commentId);
            fetchDiscussion();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting comment:', error);
            setError('Failed to delete comment');
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.createComment({
                discussion: Number(id),
                content: newComment.trim()
            });
            setNewComment('');
            fetchDiscussion();
        } catch (error) {
            console.error('Error posting comment:', error);
            setError('Failed to post comment');
        }
    };

    if (!discussion) return <div>Loading...</div>;

    const isAdmin = user?.role === 'admin';

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Return to Forum Link */}
            <div className="flex justify-between items-center mb-4">
                <Link
                    to="/forum"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
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
                    Return to Forum
                </Link>

                {/* Admin Delete Discussion Button */}
                {isAdmin && (
                    <div className="flex items-center gap-2">
                        {deleteConfirm === 'discussion' ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 flex items-center">
                                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                    Delete discussion?
                                </span>
                                <button
                                    onClick={handleDeleteDiscussion}
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
                                onClick={() => setDeleteConfirm('discussion')}
                                className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                            >
                                <TrashIcon className="h-5 w-5" />
                                Delete Discussion
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Discussion Header */}
                <div className="p-4 sm:p-6 border-b">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{discussion.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-2">
                        <span>Posted by {discussion.author.username}</span>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span>{discussion.category.name}</span>
                    </div>
                </div>

                {/* Discussion Content */}
                <div className="p-4 sm:p-6 border-b">
                    <div
                        className="text-gray-800 prose max-w-none prose-sm sm:prose-base"
                        dangerouslySetInnerHTML={{ __html: discussion.content }}
                    />
                </div>

                {/* Comments Section */}
                <div className="p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {discussion.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="font-medium text-gray-900">
                                            {comment.author.username}
                                        </span>
                                        <span className="hidden sm:inline text-gray-500">•</span>
                                        <span className="text-gray-500 text-sm">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Admin Delete Comment Button */}
                                    {isAdmin && (
                                        <div className="flex items-center gap-2">
                                            {deleteConfirm === comment.id ? (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-600 flex items-center">
                                                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                                        Delete comment?
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
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
                                                    onClick={() => setDeleteConfirm(comment.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="text-gray-800 prose max-w-none prose-sm sm:prose-base"
                                    dangerouslySetInnerHTML={{ __html: comment.content }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comment Form */}
                <div className="p-4 sm:p-6 border-b bg-gray-50">
                    <form onSubmit={handleCommentSubmit}>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <RichTextEditor
                            value={newComment}
                            onChange={setNewComment}
                            placeholder="Write your comment here..."
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Post Comment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 