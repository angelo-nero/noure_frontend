import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Navigate } from 'react-router-dom';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            {children}
            <Outlet />
        </>
    );
} 