import { useNavigate, useParams } from 'react-router-dom';
import BlogCard from './BlogCard';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_URL;

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
            const { first_name, last_name, photo, bio, posts } = data;

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-[50vh] overflow-hidden"
            >
                <div className="absolute inset-0">
                    <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-black/95"></div>
                        <img
                            src="/img/heroImage.jpeg"
                            className="w-full h-full object-cover"
                            alt="Hero Background"
                        />
                    </motion.div>
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-center z-10 space-y-4 px-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-white"
                    >
                        {loading ? 'Loading...' : `${author.first_name} ${author.last_name}`}
                    </motion.h1>
                    <motion.nav
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4"
                    >
                        <ol className="flex items-center rounded-md bg-white/10 backdrop-blur-md px-4 py-2">
                            <li className="flex items-center text-sm text-gray-300">
                                <a href="/" className="hover:text-white transition-colors">Home</a>
                                <span className="mx-2 text-gray-400">/</span>
                            </li>
                            <li className="text-sm text-blue-400">@{username}</li>
                        </ol>
                    </motion.nav>
                </div>
            </motion.div> */}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-[50vh] overflow-hidden"
            >
                <div className="absolute inset-0">
                    <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-black/95"></div>
                        <img
                            src="/img/heroImage.jpeg"
                            className="w-full h-full object-cover"
                            alt="Blog Hero"
                        />
                    </motion.div>
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-center z-10 space-y-4 px-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-white max-w-4xl"
                    >
                        {loading ? 'Loading...' : `${author.first_name} ${author.last_name}`}
                    </motion.h1>

                    <motion.nav
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4"
                    >
                        <ol className="flex items-center rounded-md bg-white/10 backdrop-blur-md px-4 py-2">
                            <li className="flex items-center text-sm text-gray-300">
                                <a href="/blog" className="hover:text-white transition-colors">Blogs</a>
                                <span className="mx-2 text-gray-400">/</span>
                            </li>
                            <li className="text-sm text-blue-400">@{username}</li>
                        </ol>
                    </motion.nav>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium">Loading profile...</p>
                    </motion.div>
                </div>
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-red-500 py-10"
                >
                    Error: {error}
                </motion.div>
            ) : (
                <div className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Profile Card */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-80 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Profile Image */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative"
                                >
                                    <div className="w-40 h-40 rounded-full ring-4 ring-blue-500 ring-offset-4 overflow-hidden">
                                        <img
                                            src={author.photo || 'https://www.gravatar.com/avatar?d=mp'}
                                            alt={`${author.first_name} ${author.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {author.first_name} {author.last_name}
                                    </h2>
                                    <p className="text-lg text-blue-600 font-medium mb-4">@{username}</p>
                                    <p className="text-gray-600 text-lg mb-6">
                                        {author.bio || "No bio available"}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex flex-wrap justify-center md:justify-start gap-6">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="bg-blue-50 px-6 py-3 rounded-xl"
                                        >
                                            <p className="text-3xl font-bold text-blue-600">{author.posts?.length || 0}</p>
                                            <p className="text-sm text-gray-600">Posts</p>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="bg-purple-50 px-6 py-3 rounded-xl"
                                        >
                                            <p className="text-3xl font-bold text-purple-600">
                                                {author.posts?.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                                            </p>
                                            <p className="text-sm text-gray-600">Comments</p>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Posts Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Post by {author.first_name} {author.last_name}
                                </h3>
                                <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full" />
                            </div>

                            {author.posts && author.posts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {author.posts.map((blog, index) => (
                                        <motion.div
                                            key={blog.slug}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <BlogCard blog={blog} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-20 bg-white rounded-2xl shadow-xl"
                                >
                                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fas fa-feather text-blue-500 text-3xl"></i>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        {author.first_name} hasn't published any posts yet.
                                        Check back later for amazing content!
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Profile;
