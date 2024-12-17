import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input Change - Field: ${name}, Value: ${value}`); // Debug log
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission initiated'); // Debug log
        setIsLoading(true);
        setErrorMessage(''); // Reset previous error message

        console.log('Current form data:', formData); // Debug log
        // Client-side validation for password length
        if (formData.password.length < 6) {
            console.log('Password validation failed - Less than 6 characters'); // Debug log
            setIsLoading(false);
            setErrorMessage('Password must be at least 6 characters long.');
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await fetch(BASE_URL + '/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status); // Debug log
            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error response data:', errorData); // Debug log
                if (errorData.detail) {
                    console.log('Error Detail:', errorData.detail); // Debug log
                    setErrorMessage(errorData.detail); // Set error message from response
                    toast.error(errorData.detail);
                } else if (errorData.username || errorData.password) {
                    console.log('Field errors - Username:', errorData.username, 'Password:', errorData.password); // Debug log
                    setErrorMessage(`Errors: ${errorData.username?.join(', ')} ${errorData.password?.join(', ')}`);
                    toast.error(`Errors: ${errorData.username?.join(', ')} ${errorData.password?.join(', ')}`);
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                    toast.error('An unexpected error occurred. Please try again.');
                }
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Login successful - Response data:', data); // Debug log

            toast.success('Login successful!'); // Show success toast

            // Store token and user info in localStorage or state management as needed
            console.log('Storing tokens in localStorage'); // Debug log
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('username', data.username);

            // Fetch user profile data immediately after login
            try {
                const profileResponse = await fetch(`${BASE_URL}/users/${data.username}/`, {
                    headers: {
                        'Authorization': `Bearer ${data.access}`,
                        'Content-Type': 'application/json'
                    }
                });
                const profileData = await profileResponse.json();
                
                // Dispatch custom event with profile data
                window.dispatchEvent(new CustomEvent('profileUpdate', {
                    detail: profileData
                }));
            } catch (err) {
                console.error('Error fetching profile:', err);
            }

            // Redirect to another page after successful login
            console.log('Redirecting to home page'); // Debug log
            navigate('/dashboard');

        } catch (error) {
            console.error('Fetch error:', error); // Debug log
            setIsLoading(false);
            setErrorMessage('An unexpected error occurred. Please try again.');
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
            >
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Sign in to continue to your account
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-80"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errorMessage && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                required
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                            </div>
                        </div>

                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            href="/register"
                            className="w-full flex justify-center items-center py-3 px-6 rounded-xl text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                        >
                            Create Account
                        </motion.a>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
}
