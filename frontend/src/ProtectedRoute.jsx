import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from './components/ApiClient';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    throw new Error('No access token found');
                }
                // Make a request to validate the token
                await apiClient.post('/token/verify/', { token });
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Token validation failed:', error);
                setIsAuthenticated(false);
                // Clear localStorage if token is invalid
                localStorage.clear();
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, []);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render protected routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
