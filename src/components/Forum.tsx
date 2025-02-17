import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import { api } from '../services/api';
import debounce from 'lodash/debounce';
import { PaginatedResponse } from '../services/api';
import { formatDate } from '../utils/dateFormat';
import { getDefaultAvatar } from '../utils/defaultAvatar';
import { Listbox, Transition } from '@headlessui/react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface Discussion {
    id: number;
    title: string;
    content: string;
    author: {
        username: string;
        avatar: string;
    };
    created_at: string;
    category: Category;
    views: number;
}

interface NewDiscussion {
    title: string;
    content: string;
    category: number;
}

export default function Forum() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [newDiscussion, setNewDiscussion] = useState<NewDiscussion>({
        title: '',
        content: '',
        category: 0
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const observer = useRef<IntersectionObserver>();
    const lastDiscussionRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            setDebouncedSearchTerm(term);
        }, 300),
        []
    );

    useEffect(() => {
        fetchCategories();
        fetchDiscussions(selectedCategory || undefined, page);
    }, [page, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const categories = await api.getCategories();
            setCategories(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchDiscussions = async (categorySlug?: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            const response: PaginatedResponse<Discussion> = categorySlug
                ? await api.getDiscussionsByCategory(categorySlug, pageNum)
                : await api.getDiscussions(pageNum);

            if (pageNum === 1) {
                setDiscussions(response.results);
            } else {
                setDiscussions(prev => [...prev, ...response.results]);
            }

            setHasMore(!!response.next);
        } catch (error) {
            console.error('Error fetching discussions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categorySlug: string | null) => {
        if (categorySlug === selectedCategory) {
            setSelectedCategory(null);
            setPage(1);
        } else {
            setSelectedCategory(categorySlug || '');
            setPage(1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createDiscussion(newDiscussion);
            setNewDiscussion({ title: '', content: '', category: 0 });
            setIsFormOpen(false);
            fetchDiscussions(selectedCategory || undefined, page);
        } catch (error) {
            console.error('Error creating discussion:', error);
        }
    };

    // Update the search input handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    // Update the filtering function to use debouncedSearchTerm
    const getFilteredDiscussions = () => {
        return discussions.filter(discussion => {
            const searchLower = debouncedSearchTerm.toLowerCase();
            return (
                discussion.title.toLowerCase().includes(searchLower) ||
                discussion.content.toLowerCase().includes(searchLower) ||
                discussion.author.username.toLowerCase().includes(searchLower) ||
                discussion.category.name.toLowerCase().includes(searchLower)
            );
        });
    };

    // Add this helper function
    const getAllCategoriesOption = (): Category => ({
        id: 0,
        name: 'All Categories',
        slug: '',
        description: 'Show all categories'
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between py-4 sm:h-16">
                        {/* Replace the categories buttons with Listbox */}
                        <div className="w-64">
                            <Listbox value={selectedCategory} onChange={(value) => handleCategoryClick(value)}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm">
                                        <span className="block truncate">
                                            {selectedCategory
                                                ? categories.find(cat => cat.slug === selectedCategory)?.name
                                                : 'All Categories'}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        as={React.Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                                            <Listbox.Option
                                                value=""
                                                className={({ active }) =>
                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                                    }`
                                                }
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                            All Categories
                                                        </span>
                                                        {selected && (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                            {categories.map((category) => (
                                                <Listbox.Option
                                                    key={category.id}
                                                    value={category.slug}
                                                    className={({ active }) =>
                                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                {category.name}
                                                            </span>
                                                            {selected && (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>

                        {/* Search */}
                        <div className="flex items-center mt-4 sm:mt-0">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search discussions..."
                                    className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Forum</h1>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Discussion
                    </button>
                </div>

                {isFormOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Create New Discussion</h2>
                                    <button
                                        onClick={() => setIsFormOpen(false)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={newDiscussion.title}
                                            onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                            placeholder="Enter discussion title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={newDiscussion.category}
                                            onChange={(e) => setNewDiscussion({ ...newDiscussion, category: Number(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        >
                                            <option value={0}>Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                        <div className="rounded-lg border border-gray-300 overflow-hidden">
                                            <RichTextEditor
                                                value={newDiscussion.content}
                                                onChange={(content) => setNewDiscussion({ ...newDiscussion, content })}
                                                placeholder="Write your discussion content here..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsFormOpen(false)}
                                            className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            Create Discussion
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Discussions List */}
                    <div className="lg:col-span-2 space-y-6">
                        {getFilteredDiscussions().length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No discussions found</h3>
                                <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <>
                                {getFilteredDiscussions().map((discussion, index) => (
                                    <div
                                        ref={index === getFilteredDiscussions().length - 1 ? lastDiscussionRef : undefined}
                                        key={discussion.id}
                                    >
                                        <Link to={`/discussion/${discussion.id}`}>
                                            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex items-start space-x-4">
                                                    <img
                                                        src={discussion.author.avatar || getDefaultAvatar(discussion.author.username)}
                                                        alt={discussion.author.username}
                                                        className="w-12 h-12 rounded-full"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = getDefaultAvatar(discussion.author.username);
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                            {discussion.title}
                                                        </h3>
                                                        <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                                                            <span>{discussion.author.username}</span>
                                                            <span>•</span>
                                                            <span>{formatDate(discussion.created_at)}</span>
                                                            <span>•</span>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                {discussion.category.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-center p-6">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
                            <div className="space-y-3">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.slug)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${selectedCategory === category.slug
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 