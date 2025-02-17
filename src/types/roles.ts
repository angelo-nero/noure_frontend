export type Role = 'user' | 'moderator' | 'admin';

export interface Permission {
    id: string;
    name: string;
    description: string;
}

export interface UserRole {
    id: string;
    name: Role;
    permissions: string[]; // permission IDs
} 