import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        username: '',
        bio: '',
        photo: null, // File input
    });

    const [loading, setLoading] = useState(false); // Loading state
    const [fieldErrors, setFieldErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            photo: e.target.files[0],
        }));
    };

    const registerForm = async (e) => {
        e.preventDefault();
        setFieldErrors({}); // Reset field errors
        setLoading(true); // Start loading

        try {
            const data = new FormData();
            data.append('first_name', formData.first_name);
            data.append('last_name', formData.last_name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('username', formData.username);
            data.append('bio', formData.bio);
            if (formData.photo) data.append('photo', formData.photo);

            const response = await fetch(BASE_URL + '/register/', {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle validation errors
                if (!result.message) {
                    setFieldErrors(result);
                } else if (result.message) {
                    toast.error(result.message); // General API error
                } else {
                    toast.error('Something went wrong on the server. Please try again later.');
                }
                return;
            }

            // Success
            toast.success('Registration successful.');
            navigate('/login');
        } catch (error) {
            toast.error('An error occurred while submitting the form. Please try again.');
            console.error(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className='bg-white rounded-xl p-4 w-[480px] mx-auto my-4 shadow-xl'>
            <p className='text-3xl font-bold mb-4 text-center'>Register</p>
            <form className='flex flex-col gap-3' onSubmit={registerForm}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`bg-blue-100 p-2 rounded-lg focus-visible:outline-none lg w-full text-slate-700 ${fieldErrors.email ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email[0]}</p>}
                </div>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`bg-blue-100 p-2 rounded-lg focus-visible:outline-none lg w-full text-slate-700 ${fieldErrors.username ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {fieldErrors.username && <p className="text-red-500 text-sm">{fieldErrors.username[0]}</p>}
                </div>
                <div className='flex gap-4'>
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className={`bg-blue-100 p-2 rounded-lg focus-visible:outline-none lg w-full text-slate-700 ${fieldErrors.first_name ? 'border-2 border-red-500' : ''}`}
                            required
                        />
                        {fieldErrors.first_name && <p className="text-red-500 text-sm">{fieldErrors.first_name[0]}</p>}
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className={`bg-blue-100 p-2 rounded-lg focus-visible:outline-none lg w-full text-slate-700 ${fieldErrors.last_name ? 'border-2 border-red-500' : ''}`}
                            required
                        />
                        {fieldErrors.last_name && <p className="text-red-500 text-sm">{fieldErrors.last_name[0]}</p>}
                    </div>
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        min={8}
                        className={`bg-blue-100 p-2 rounded-lg focus-visible:outline-none lg w-full text-slate-700 ${fieldErrors.password ? 'border-2 border-red-500' : ''}`}
                        required
                    />
                    {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password[0]}</p>}
                </div>
                <div>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className={`bg-blue-100 p-2 rounded-lg focus-visible:outline-none lg w-full text-slate-700 ${fieldErrors.bio ? 'border-2 border-red-500' : ''}`}
                        rows="2"
                    />
                </div>
                <div>
                    <label>Profile</label>
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`bg-blue-100 p-2 rounded-lg focus-visible:outline-none lg w-full text-slate-700 ${fieldErrors.photo ? 'border-2 border-red-500' : ''}`}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg"
                    disabled={loading} // Disable when loading
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}
