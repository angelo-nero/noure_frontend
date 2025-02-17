import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Desktop menu */}
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text hover:from-purple-500 hover:to-blue-400 transition-all duration-300">
                                DevHub
                            </span>
                        </Link>
                        <div className="hidden md:flex md:ml-10 space-x-8">
                            {[
                                { path: '/', label: 'Home' },
                                { path: '/forum', label: 'Forum' },
                                { path: '/blogs', label: 'Blogs' },
                                { path: '/snippets', label: 'Snippets' }
                            ].map(({ path, label }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-all duration-200 ${isActive(path)
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-purple-500'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* User menu and Mobile button */}
                    <div className="flex items-center gap-4">
                        {/* Admin Menu */}
                        {user?.role === 'admin' && (
                            <div className="hidden md:block relative group">
                                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-purple-500 transition-colors">
                                    Admin
                                    <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                                    {[
                                        { path: '/admin/categories', label: 'Categories' },
                                        { path: '/admin/users', label: 'Users' },
                                        { path: '/admin/languages', label: 'Languages' }
                                    ].map(({ path, label }) => (
                                        <Link
                                            key={path}
                                            to={path}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-500 transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* User Profile */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-500">
                                {user?.username}
                            </span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-full hover:from-purple-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-purple-500 hover:bg-purple-50 focus:outline-none transition-colors"
                        >
                            {!isOpen ? (
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 backdrop-blur-md shadow-lg">
                    {[
                        { path: '/', label: 'Home' },
                        { path: '/forum', label: 'Forum' },
                        { path: '/blogs', label: 'Blogs' },
                        { path: '/snippets', label: 'Snippets' }
                    ].map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(path)
                                ? 'text-purple-600 bg-purple-50'
                                : 'text-gray-500 hover:text-purple-500 hover:bg-purple-50'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}

                    {user?.role === 'admin' && (
                        <div className="pt-4">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Admin
                            </div>
                            {[
                                { path: '/admin/categories', label: 'Categories' },
                                { path: '/admin/users', label: 'Users' },
                                { path: '/admin/languages', label: 'Languages' }
                            ].map(({ path, label }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="px-3 py-2 text-sm text-gray-500">
                            {user?.username}
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-full hover:from-purple-500 hover:to-blue-400 transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 