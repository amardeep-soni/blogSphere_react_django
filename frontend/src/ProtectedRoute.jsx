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
                const username = localStorage.getItem('username');
                if (!token) {
                    throw new Error('No access token found');
                }
                
                // Instead of directly validating the token, make any authenticated request
                // This will trigger the refresh token flow if needed
                await apiClient.get(`/users/${username}/`); // or any other authenticated endpoint
                setIsAuthenticated(true);
            } catch (error) {
                // Only clear storage and set authenticated to false if refresh token also failed
                if (!localStorage.getItem('refreshToken') || 
                    (error.response && error.response.status === 401)) {
                    console.error('Authentication failed:', error);
                    setIsAuthenticated(false);
                    localStorage.clear();
                } else {
                    // If there was a different error, we'll assume the user is still authenticated
                    setIsAuthenticated(true);
                }
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
