import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from './ApiClient';
import DeleteDialog from './DeleteDialog';
import { motion } from 'framer-motion';

const AllPosts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const BASE_URL = import.meta.env.VITE_API_URL;

    const fetchPosts = async () => {
        try {
            const response = await apiClient.get('/user/posts/');
            if (response.status === 200) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleEdit = (slug) => {
        navigate(`/posts/edit/${slug}`, {
            state: { from: location.pathname }
        });
    };

    const handleDelete = (slug) => {
        setPostToDelete(slug);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await apiClient.delete(`/posts/${postToDelete}/`);
            if (response.status === 204) {
                fetchPosts();
                setShowDeleteDialog(false);
                setPostToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filteredPosts = posts
        .filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === 'oldest') {
                return new Date(a.created_at) - new Date(b.created_at);
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Enhanced Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-[40vh] overflow-hidden"
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
                            alt="Posts Background"
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
                        Your Posts
                    </motion.h1>
                    <motion.nav
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4"
                    >
                        <ol className="flex items-center rounded-md bg-white/10 backdrop-blur-md px-4 py-2">
                            <li className="flex items-center text-sm text-gray-300">
                                <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                                <span className="mx-2 text-gray-400">/</span>
                            </li>
                            <li className="text-sm text-blue-400">Posts</li>
                        </ol>
                    </motion.nav>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80 cursor-pointer"
                        onClick={() => navigate('/posts')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg text-gray-600">Total Posts</p>
                                <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                                    {posts.length}
                                </h3>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <i className="fas fa-file-alt text-2xl text-blue-600"></i>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80 cursor-pointer"
                        onClick={() => navigate('/comments')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg text-gray-600">Total Comments</p>
                                <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                                    {posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                                </h3>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl">
                                <i className="fas fa-comments text-2xl text-purple-600"></i>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Controls Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-6xl mx-auto mb-8"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-3 rounded-xl">
                                    <i className="fas fa-file-alt text-blue-500 text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Total Posts</h3>
                                    <p className="text-gray-500">
                                        Showing {filteredPosts.length} of {posts.length} posts
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div className="relative w-full md:w-96">
                                    <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Search posts..."
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="title">By Title</option>
                                </select>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/posts/new')}
                                className="w-full md:w-auto px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <i className="fas fa-plus-circle"></i>
                                <span>Create New Post</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-gray-500 font-medium">Loading posts...</p>
                        </motion.div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 gap-6">
                            {filteredPosts.map((post, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    key={post.slug}
                                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row h-[240px]">
                                        {/* Post Image Section */}
                                        {post.image && (
                                            <div className="md:w-1/3 relative overflow-hidden">
                                                <img
                                                    src={BASE_URL.slice(0, BASE_URL.lastIndexOf('api')) + post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Link
                                                        to={`/category/${post.category}`}
                                                        className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-200"
                                                    >
                                                        {post.category}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex-1 p-6 flex flex-col">
                                            <div className="flex-grow">
                                                <Link
                                                    to={`/blog/${post.slug}`}
                                                    className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-1"
                                                >
                                                    {post.title}
                                                </Link>
                                                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <i className="far fa-calendar-alt"></i>
                                                        {formatDate(post.created_at)}
                                                    </span>
                                                    {post.updated_at !== post.created_at && (
                                                        <span className="flex items-center gap-1">
                                                            <i className="fas fa-edit"></i>
                                                            Updated: {formatDate(post.updated_at)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mt-3 mb-4 line-clamp-3 max-h-[4.5em]">
                                                    {post.excerpt.length > 255 ? post.excerpt.substring(0, 255) + '...' : post.excerpt}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <Link
                                                        to={`/comments/${post.slug}`}
                                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200"
                                                    >
                                                        <i className="fas fa-comments"></i>
                                                        <span>{post.comments?.length || 0}</span>
                                                    </Link>
                                                    <Link
                                                        to={`/blog/${post.slug}`}
                                                        className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1"
                                                    >
                                                        Read More
                                                        <i className="fas fa-arrow-right"></i>
                                                    </Link>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleEdit(post.slug)}
                                                        className="px-3 py-1 text-sm text-blue-500 hover:bg-blue-50 rounded-xl transition-colors duration-200 flex items-center gap-1"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                        Edit
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDelete(post.slug)}
                                                        className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 flex items-center gap-1"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                        Delete
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <DeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setPostToDelete(null);
                }}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this post? This action cannot be undone."
            />
        </div>
    );
};

export default AllPosts;

