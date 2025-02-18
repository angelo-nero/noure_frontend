import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Forum from './components/Forum';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import DiscussionDetail from './components/DiscussionDetail';
import CodeSnippets from './components/CodeSnippets';
import CodeSnippetDetail from './components/CodeSnippetDetail';
import BlogList from './components/BlogList';
import BlogCreate from './components/BlogCreate';
import BlogDetail from './components/BlogDetail';
import { AuthProvider } from './context/AuthContext';
// Import admin components
import CategoryManagement from './components/admin/CategoryManagement';
import LanguageManagement from './components/admin/LanguageManagement';
import UserManagement from './components/admin/UserManagement';
import NewsManagement from './components/admin/NewsManagement';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        {/* Regular routes */}
                        <Route path="/" element={
                            <PrivateRoute>
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <Home />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />

                        {/* Admin routes */}
                        <Route path="/admin/categories" element={
                            <PrivateRoute requiredRole="admin">
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <CategoryManagement />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/admin/languages" element={
                            <PrivateRoute requiredRole="admin">
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <LanguageManagement />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/admin/news" element={
                            <PrivateRoute requiredRole="admin">
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <NewsManagement />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/admin/users" element={
                            <PrivateRoute requiredRole="admin">
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <UserManagement />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/admin" element={
                            <PrivateRoute requiredRole="admin">
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <AdminDashboard />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />

                        {/* Existing routes */}
                        <Route path="/forum" element={
                            <PrivateRoute>
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <Forum />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/discussion/:id" element={
                            <PrivateRoute>
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <DiscussionDetail />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/snippets" element={
                            <PrivateRoute>
                                <CodeSnippets />
                            </PrivateRoute>
                        } />
                        <Route path="/snippets/:id" element={
                            <PrivateRoute>
                                <CodeSnippetDetail />
                            </PrivateRoute>
                        } />
                        <Route path="/blogs" element={
                            <PrivateRoute>
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <BlogList />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/blogs/new" element={
                            <PrivateRoute>
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <BlogCreate />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/blogs/:id" element={
                            <PrivateRoute>
                                <div className="flex flex-col min-h-screen">
                                    <Navbar />
                                    <main className="flex-1 mt-16">
                                        <BlogDetail />
                                    </main>
                                </div>
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App; 