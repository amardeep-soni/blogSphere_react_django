import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from './ApiClient';
import DeleteDialog from './DeleteDialog';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const BASE_URL = import.meta.env.VITE_API_URL; // Your API base URL
    const [dashboardData, setDashboardData] = useState({
        totalPosts: 0,
        totalComments: 0,
        recentPosts: [],
        recentComments: [],
    });
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const response = await apiClient.get(`/dashboard/`);
            console.log(response);
            if (response.status === 200) {
                const data = response.data;
                console.log(data);

                setDashboardData(data);
            } else {
                console.error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        } else {
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

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
                fetchDashboardData();
                setShowDeleteDialog(false);
                setPostToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

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
                            alt="Dashboard Background"
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
                        Dashboard
                    </motion.h1>
                    <motion.nav
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4"
                    >
                        <ol className="flex items-center rounded-md bg-white/10 backdrop-blur-md px-4 py-2">
                            <li className="flex items-center text-sm text-gray-300">
                                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                <span className="mx-2 text-gray-400">/</span>
                            </li>
                            <li className="text-sm text-blue-400">Dashboard</li>
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
                        <p className="text-gray-500 font-medium">Loading dashboard...</p>
                    </motion.div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-12">
                    {/* Stats Grid */}
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80 w-full max-w-[280px] cursor-pointer"
                            onClick={() => navigate('/posts')}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg text-gray-600">Total Posts</p>
                                    <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                                        {dashboardData.totalPosts}
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
                            className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80 w-full max-w-[280px] cursor-pointer"
                            onClick={() => navigate('/comments')}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg text-gray-600">Total Comments</p>
                                    <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                                        {dashboardData.totalComments}
                                    </h3>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl">
                                    <i className="fas fa-comments text-2xl text-purple-600"></i>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Recent Posts */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="xl:col-span-2"
                        >
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            Recent Posts
                                        </h2>
                                        <div className="flex flex-wrap gap-4">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate('/posts/new')}
                                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                            >
                                                <i className="fas fa-plus-circle"></i>
                                                <span>New Post</span>
                                            </motion.button>
                                            <Link
                                                to="/posts"
                                                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                                            >
                                                <span>View All</span>
                                                <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {dashboardData.recentPosts.map((post, index) => (
                                        <motion.div
                                            key={post.slug}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        to={`/blog/${post.slug}`}
                                                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                    <p className="mt-1 text-gray-600 line-clamp-2">{post.excerpt}</p>
                                                    <div className="mt-2 flex flex-wrap items-center gap-4">
                                                        <span className="text-sm text-gray-500">
                                                            <i className="fas fa-clock mr-1"></i>
                                                            {formatDate(post.created_at)}
                                                        </span>
                                                        <Link
                                                            to={`/comments/${post.slug}`}
                                                            className="text-sm text-blue-500 hover:text-blue-700"
                                                        >
                                                            <i className="fas fa-comment mr-1"></i>
                                                            {post.comments_count} Comments
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 sm:self-start">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(post.slug)}
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(post.slug)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Comments */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="w-full"
                        >
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            Recent Comments
                                        </h2>
                                        <Link
                                            to="/comments"
                                            className="text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
                                        >
                                            <span>View All</span>
                                            <i className="fas fa-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {dashboardData.recentComments.map((comment, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                                                        <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                                                    </div>
                                                    <Link
                                                        to={`/blog/${comment.slug}`}
                                                        className="text-sm text-blue-500 hover:text-blue-700 block mt-1"
                                                    >
                                                        on {comment.post}
                                                    </Link>
                                                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">{comment.content}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

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

export default Dashboard;
