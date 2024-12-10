import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

export default function Login() {
    // const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(''); // Reset previous error message

        // Client-side validation for password length
        if (formData.password.length < 6) {
            setIsLoading(false);
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.detail) {
                    setErrorMessage(errorData.detail); // Set error message from response
                } else if (errorData.username || errorData.password) {
                    // Handle specific field validation errors
                    setErrorMessage(`Errors: ${errorData.username?.join(', ')} ${errorData.password?.join(', ')}`);
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Login successful:', data); // You can remove this after debugging

            // Store token and user info in localStorage or state management as needed
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('username', data.username);

            // Redirect to another page after successful login
            // navigate('/');
            window.location.href = '/'

        } catch (error) {
            setIsLoading(false);
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
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
                        name="username" // Update to match the state property
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
                        name="password" // Update to match the state property
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
