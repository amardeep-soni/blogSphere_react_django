import { useNavigate, useParams } from 'react-router-dom';
import BlogCard from './BlogCard';
import { useEffect, useState } from 'react';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_URL; // Your API base URL

    const getAuthor = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/${username}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch author data');
            }

            const data = await response.json();
            const { first_name, last_name, photo, bio, posts } = data; // Destructuring the response

            setAuthor({ first_name, last_name, photo, bio, posts });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAuthor();
    }, [username]);

    return (
        <>
            {/* Hero Section always visible */}
            <div className="w-full relative text-white h-56 overflow-hidden shadow-lg">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover opacity-80"
                    alt="Hero Image"
                />
                <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent flex items-center flex-col justify-center gap-3 p-5">
                    <h1 className="text-5xl font-bold text-center drop-shadow-md mb-3">{author ? `${author.first_name} ${author.last_name}` : 'Loading..'}</h1>
                    <nav aria-label="breadcrumb text-xl" className="w-max drop-shadow-md">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
                                <a href="/">Home</a>
                                <span className="pointer-events-none mx-2 text-slate-800">
                                    /
                                </span>
                            </li>
                            <li className="flex cursor-pointer items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-800">
                                <a>{username}</a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="container p-5 sm:p-8 lg:mx-auto">
                {/* Profile Header */}
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>

                ) : (
                    <>
                        <div className="flex items-center flex-col sm:flex-row mb-10 bg-white shadow-lg p-5 rounded-xl">
                            <img
                                src={author.photo}
                                alt={`${author.first_name} ${author.last_name}`}
                                className="w-32 h-32 mr-6 rounded-full border-4 border-white mb-4 sm:mb-0 shadow-lg"
                            />
                            <div className="text-center sm:text-left">
                                <h1 className="text-3xl font-bold text-gray-900">{author.first_name} {author.last_name} ({username})</h1>
                                <p className="text-lg text-gray-600">{author.bio}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold mb-6">
                                Posts by <span className="text-blue-600">{author.first_name} {author.last_name}</span>
                            </h3>

                            {author.posts && author.posts.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                                    {author.posts.map((blog) => (
                                        <BlogCard key={blog.slug} blog={blog} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-lg">No posts available.</p>
                            )}
                        </div>

                    </>
                )}

            </div>
        </>
    );
};

export default Profile;
