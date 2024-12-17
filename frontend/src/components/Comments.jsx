import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiClient from './ApiClient';
import { motion } from 'framer-motion';

const Comments = () => {
    const { slug } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const navigate = useNavigate();
    const [totalUserComments, setTotalUserComments] = useState(0);

    useEffect(() => {
        fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            if (slug) {
                const response = await apiClient.get(`/posts/${slug}/`);
                if (response.status === 200) {
                    setPost(response.data);
                    setComments(response.data.comments || []);
                }
            } else {
                const response = await apiClient.get('/comments/');
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        setComments(response.data);
                    } else {
                        setComments(response.data.comments);
                        setTotalUserComments(response.data.total_user_comments);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

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
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
    };

    const filteredComments = comments
        .filter(comment =>
            comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.created_at) - new Date(a.created_at);
            } else {
                return new Date(a.created_at) - new Date(b.created_at);
            }
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
                            alt="Comments Background"
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
                        {slug
                            ? `Comments on "${post?.title}"`
                            : totalUserComments > 0
                                ? 'Comments on Your Posts'
                                : 'All Comments'
                        }
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
                            {slug && (
                                <>
                                    <li className="flex items-center text-sm text-gray-300">
                                        <Link to="/comments" className="hover:text-white transition-colors">Comments</Link>
                                        <span className="mx-2 text-gray-400">/</span>
                                    </li>
                                    <li className="text-sm text-blue-400">{post?.title}</li>
                                </>
                            )}
                            {!slug && <li className="text-sm text-blue-400">Comments</li>}
                        </ol>
                    </motion.nav>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-12">
                {/* Controls Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80 mb-8 max-w-4xl mx-auto"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-3 rounded-xl">
                                <i className="fas fa-comments text-blue-500 text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Total Comments</h3>
                                <p className="text-gray-500">
                                    Showing {filteredComments.length} of {comments.length} comments
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search comments..."
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
                        </select>
                    </div>
                </motion.div>

                {/* Comments Section */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-gray-500 font-medium">Loading comments...</p>
                        </motion.div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {filteredComments.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-20 bg-white rounded-2xl shadow-xl"
                            >
                                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-comments text-blue-500 text-3xl"></i>
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No comments found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to start the conversation!'}
                                </p>
                            </motion.div>
                        ) : (
                            filteredComments.map((comment, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    key={index}
                                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={
                                                        comment.user_image !== 'not found'
                                                            ? `${import.meta.env.VITE_API_URL.slice(0, import.meta.env.VITE_API_URL.lastIndexOf('api'))}${comment.user_image}`
                                                            : 'https://www.gravatar.com/avatar?d=mp'
                                                    }
                                                    alt={comment.name}
                                                    className="w-12 h-12 rounded-xl object-cover cursor-pointer"
                                                    onClick={() => comment.username !== 'not found' && navigate(`/author/${comment.username}`)}
                                                />
                                                <div>
                                                    <h3
                                                        className={`font-semibold text-gray-900 ${comment.username !== 'not found' ? 'cursor-pointer hover:text-blue-600' : ''}`}
                                                        onClick={() => comment.username !== 'not found' && navigate(`/author/${comment.username}`)}
                                                    >
                                                        {comment.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{comment.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <time className="text-sm text-gray-500">
                                                    {formatDate(comment.created_at)}
                                                </time>
                                                {!slug && (
                                                    <Link
                                                        to={`/blog/${comment.post_slug}`}
                                                        className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                                                    >
                                                        View Post
                                                        <i className="fas fa-arrow-right text-xs"></i>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-gray-600 leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;
