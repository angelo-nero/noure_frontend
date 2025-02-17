import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Blog } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/dateFormat';
import Navbar from './Navbar';

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(() => {
        if (id) {
            fetchBlog(id);
        }
    }, [id]);

    const fetchBlog = async (blogId: string) => {
        try {
            const data = await api.getBlog(blogId);
            setBlog(data);
        } catch (error) {
            console.error('Error fetching blog:', error);
        }
    };

    const handleLike = async () => {
        if (!blog || !id) return;
        try {
            const response = await api.likeBlog(id);
            setBlog(prev => prev ? {
                ...prev,
                likes_count: response.likes_count,
                user_has_liked: response.user_has_liked
            } : null);
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    };

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <Link
                    to="/blogs"
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
                    Return to Blogs
                </Link>
                <article className="bg-white shadow rounded-lg overflow-hidden">
                    {blog.image_url && (
                        <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="w-full h-64 object-cover"
                        />
                    )}
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                            <span>{blog.author.username}</span>
                            <span>•</span>
                            <span>{formatDate(blog.created_at)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {blog.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                        <div className="mt-6 prose prose-indigo max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </div>
                        <div className="mt-6 flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${blog.user_has_liked
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                <span>{blog.likes_count}</span>
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
} 