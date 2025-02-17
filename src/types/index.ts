export interface User {
    id: string;
    username: string;
    role: 'user' | 'moderator' | 'admin';
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
}

export interface Discussion {
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
    comments: Comment[];
}

export interface Comment {
    id: number;
    content: string;
    author: {
        username: string;
    };
    created_at: string;
}

export interface NewDiscussion {
    title: string;
    content: string;
    category: number;
}

export interface NewComment {
    discussion: number;
    content: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface CodeSnippet {
    language: string;
    code: string;
}

export interface Snippet {
    id: number;
    title: string;
    description: string;
    author: {
        username: string;
        avatar: string;
    };
    created_at: string;
    codes: {
        id: number;
        language: ProgrammingLanguage;
        code: string;
    }[];
    likes_count: number;
    dislikes_count: number;
    user_reaction: 'like' | 'dislike' | null;
}

export interface ProgrammingLanguage {
    id: number;
    name: string;
    slug: string;
    code: string;
}

export interface NewSnippet {
    title: string;
    description: string;
    codes: {
        language_id: number;
        code: string;
    }[];
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface Blog {
    id: number;
    title: string;
    content: string;
    image: string | null;
    image_url: string | null;
    author: {
        username: string;
        avatar: string;
    };
    tags: Tag[];
    created_at: string;
    updated_at: string;
    likes_count: number;
    user_has_liked: boolean;
}

export interface NewBlog {
    title: string;
    content: string;
    image?: File;
    tags: string[];
}

export interface NewCategory {
    name: string;
    description: string;
}

export interface NewProgrammingLanguage {
    name: string;
    code: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface NewRole {
    name: string;
} 