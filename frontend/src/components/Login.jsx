import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

            // Redirect to another page after successful login
            console.log('Redirecting to home page'); // Debug log
            // window.location.href = '/';
            navigate('/');

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
        <div className='bg-white rounded-xl p-4 w-[480px] mx-auto my-8 shadow-xl'>
            <p className='text-3xl font-bold mb-8'>Login</p>
            <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
                {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                <div>
                    <label className='text-xl mb-2'>Username/Email</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className='bg-blue-100 p-2 rounded-lg focus-visible:outline-none text-xl w-full text-slate-700'
                        required
                    />
                </div>
                <div>
                    <label className='text-xl mb-2'>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className='bg-blue-100 p-2 rounded-lg focus-visible:outline-none text-xl w-full text-slate-700'
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-blue-500 text-white px-4 py-2 rounded-lg w-full text-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
                <hr />
                <p className='text-center text-xl'>Don&apos;t have an account? <a href='/register' className='text-blue-500 hover:underline'>Register</a></p>
            </form>
        </div>
    );
}
