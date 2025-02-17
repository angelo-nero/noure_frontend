import React from 'react';
import NewsList from '../components/NewsList';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Latest News</h1>
                <NewsList />
                {/* Other content */}
            </div>
        </div>
    );
} 