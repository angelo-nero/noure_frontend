import axios from 'axios';
import { Category, Discussion, Comment, NewDiscussion, NewComment, LoginCredentials, LoginResponse, ProgrammingLanguage, CodeSnippet, NewSnippet, Snippet, Blog, Tag, NewCategory, NewProgrammingLanguage, Role, NewRole } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
console.log('API_URL:', API_URL);

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true  // Important for CORS with credentials
});

// Function to get CSRF token
const getCSRFToken = () => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
};

// Add interceptors
axiosInstance.interceptors.request.use(
    (config) => {
        // Add CSRF token to headers
        const csrfToken = getCSRFToken();
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        // Add Authorization token if it exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
}

export interface NewUser {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'moderator' | 'admin';
}

export interface UpdateUser {
    email?: string;
    role?: 'user' | 'moderator' | 'admin';
    isActive?: boolean;
}

export const api = {
    // Auth
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await axiosInstance.post('/login/', credentials);
        return response.data;
    },

    // Categories
    getCategories: async (): Promise<Category[]> => {
        const response = await axiosInstance.get('/admin/categories/');
        return response.data;
    },

    createCategory: async (category: NewCategory): Promise<Category> => {
        const response = await axiosInstance.post('/admin/categories/', category);
        return response.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/admin/categories/${id}`);
    },

    updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
        const response = await axiosInstance.patch(`/admin/categories/${id}`, category);
        return response.data;
    },

    // Discussions
    getDiscussions: async (page: number = 1): Promise<PaginatedResponse<Discussion>> => {
        const response = await axiosInstance.get(`/discussions/?page=${page}`);
        return response.data;
    },

    getDiscussionsByCategory: async (categorySlug: string, page: number = 1): Promise<PaginatedResponse<Discussion>> => {
        const response = await axiosInstance.get(`/discussions/?category=${categorySlug}&page=${page}`);
        return response.data;
    },

    getDiscussion: async (id: string | number): Promise<Discussion> => {
        const response = await axiosInstance.get(`/discussions/${id}/`);
        return response.data;
    },

    createDiscussion: async (discussion: NewDiscussion): Promise<Discussion> => {
        const response = await axiosInstance.post(`/discussions/`, discussion);
        return response.data;
    },

    // Comments
    createComment: async (comment: NewComment): Promise<Comment> => {
        const response = await axiosInstance.post(`/comments/`, comment);
        return response.data;
    },

    getNews: async () => {
        try {
            const url = `${API_URL}/news/`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getNews:', error);
            throw error;
        }
    },

    // Get programming languages
    getLanguages: async (): Promise<ProgrammingLanguage[]> => {
        const response = await axiosInstance.get('/admin/languages/');
        return response.data;
    },

    // Get code snippets
    getSnippets: async (sortBy: 'newest' | 'oldest' | 'most_liked' = 'newest'): Promise<Snippet[]> => {
        const response = await axiosInstance.get(`/snippets/?sort=${sortBy}`);
        return response.data;
    },

    // Create code snippet
    createSnippet: async (data: NewSnippet): Promise<Snippet> => {
        const response = await axiosInstance.post(`/snippets/`, data);
        return response.data;
    },

    getSnippet: async (id: string): Promise<Snippet> => {
        const response = await axiosInstance.get(`/snippets/${id}/`);
        return response.data;
    },

    likeSnippet: async (id: string): Promise<{
        likes_count: number;
        dislikes_count: number;
        user_reaction: 'like' | 'dislike' | null;
    }> => {
        const response = await axiosInstance.post(`/snippets/${id}/like/`);
        return response.data;
    },

    dislikeSnippet: async (id: string): Promise<{
        likes_count: number;
        dislikes_count: number;
        user_reaction: 'like' | 'dislike' | null;
    }> => {
        const response = await axiosInstance.post(`/snippets/${id}/dislike/`);
        return response.data;
    },

    // Blog methods
    getBlogs: async (tag?: string): Promise<Blog[]> => {
        const url = tag ? `/blogs/?tag=${tag}` : `/blogs/`;
        const response = await axiosInstance.get(url);
        return response.data;
    },

    getBlog: async (id: string): Promise<Blog> => {
        const response = await axiosInstance.get(`/blogs/${id}/`);
        return response.data;
    },

    createBlog: async (formData: FormData): Promise<Blog> => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axiosInstance.post(`/blogs/`, formData, config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error details:', error.response?.data);
            } else {
                console.error('Error:', error);
            }
            throw error;
        }
    },

    likeBlog: async (id: string): Promise<{ likes_count: number; user_has_liked: boolean }> => {
        const response = await axiosInstance.post(`/blogs/${id}/like/`);
        return response.data;
    },

    getTags: async (): Promise<Tag[]> => {
        const response = await axiosInstance.get(`/tags/`);
        return response.data;
    },

    // User Management
    getUsers: async (): Promise<User[]> => {
        const response = await axiosInstance.get('/admin/users/');
        return response.data;
    },

    toggleUserStatus: async (userId: number, isActive: boolean): Promise<User> => {
        const response = await axiosInstance.patch(`/admin/users/${userId}/toggle/`, {
            isActive: !isActive
        });
        return response.data;
    },

    createUser: async (userData: NewUser): Promise<User> => {
        const response = await axiosInstance.post('/admin/users/create/', userData);
        return response.data;
    },

    updateUser: async (userId: number, userData: UpdateUser): Promise<User> => {
        const response = await axiosInstance.patch(`/admin/users/${userId}/`, userData);
        return response.data;
    },

    // Language Management
    createLanguage: async (language: NewProgrammingLanguage): Promise<ProgrammingLanguage> => {
        const response = await axiosInstance.post('/admin/languages/', language);
        return response.data;
    },

    deleteLanguage: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/admin/languages/${id}`);
    },

    updateLanguage: async (id: number, language: Partial<ProgrammingLanguage>): Promise<ProgrammingLanguage> => {
        const response = await axiosInstance.patch(`/admin/languages/${id}`, language);
        return response.data;
    },

    // Role Management
    getRoles: async (): Promise<Role[]> => {
        const response = await axiosInstance.get('/admin/roles/');
        return response.data;
    },

    createRole: async (role: NewRole): Promise<Role> => {
        const response = await axiosInstance.post('/admin/roles/', role);
        return response.data;
    },

    updateRole: async (id: number, role: Partial<Role>): Promise<Role> => {
        const response = await axiosInstance.patch(`/admin/roles/${id}/`, role);
        return response.data;
    },

    deleteRole: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/admin/roles/${id}/`);
    },

    createNews: async (data: { title: string; body: string }) => {
        const response = await axiosInstance.post('/news/', data);
        return response.data;
    },

    deleteNews: async (id: number) => {
        const response = await axiosInstance.delete(`/news/${id}/`);
        return response.data;
    },

    deleteDiscussion: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/discussions/${id}/`);
    },

    deleteComment: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/comments/${id}/`);
    },
};

export default api;
