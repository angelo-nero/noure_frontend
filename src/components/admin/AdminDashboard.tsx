import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Route } from 'react-router-dom';
import NewsManagement from './NewsManagement';

const AdminDashboard: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1">
                    <nav className="space-y-2">
                        <Link to="/admin/users" className="block p-2 hover:bg-gray-100 rounded">
                            User Management
                        </Link>
                        <Link to="/admin/categories" className="block p-2 hover:bg-gray-100 rounded">
                            Category Management
                        </Link>
                        <Link to="/admin/languages" className="block p-2 hover:bg-gray-100 rounded">
                            Language Management
                        </Link>
                        <Link to="/admin/roles" className="block p-2 hover:bg-gray-100 rounded">
                            Role Management
                        </Link>
                        <Link to="/admin/news" className="block p-2 hover:bg-gray-100 rounded">
                            News Management
                        </Link>
                    </nav>
                </div>
                <div className="col-span-1 md:col-span-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 