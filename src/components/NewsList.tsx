import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface News {
    id: number;
    title: string;
    body: string;
    created_at: string;
}

export default function NewsList() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await api.getNews();
            setNews(response);
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading news...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600">{error}</div>;
    }

    if (news.length === 0) {
        return <div className="text-center py-4">No news available.</div>;
    }

    return (
        <div className="space-y-6">
            {news.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                    <p className="text-gray-700 mb-2">{item.body}</p>
                    <span className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                    </span>
                </div>
            ))}
        </div>
    );
} 