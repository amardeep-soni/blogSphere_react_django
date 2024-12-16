import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiClient from './ApiClient';

const Comments = () => {
    const { slug } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            if (slug) {
                // Fetch post details which includes comments
                const response = await apiClient.get(`/posts/${slug}/`);
                if (response.status === 200) {
                    setPost(response.data);
                    setComments(response.data.comments || []);
                }
            } else {
                // Fetch all comments
                const response = await apiClient.get('/comments/');
                if (response.status === 200) {
                    setComments(response.data);
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
            comment.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === 'oldest') {
                return new Date(a.created_at) - new Date(b.created_at);
            }
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="w-full relative text-white h-48 overflow-hidden shadow-lg">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover opacity-80"
                    alt="Hero Image"
                />
                <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent flex items-center flex-col justify-center gap-3">
                    <h1 className="text-4xl font-bold text-center drop-shadow-md">
                        {slug ? `Comments on "${post?.title}"` : 'Community Discussions'}
                    </h1>
                    <p className="text-center text-gray-100 max-w-2xl mx-auto">
                        {slug ?? 'Explore what our community is saying across all your posts'
                        }
                    </p>
                    <nav aria-label="breadcrumb">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex items-center text-sm text-slate-500">
                                <Link to="/">Home</Link>
                                <span className="mx-2 text-slate-800">/</span>
                            </li>
                            {slug && (
                                <>
                                    <li className="flex items-center text-sm text-slate-500">
                                        <Link to="/comments">Comments</Link>
                                        <span className="mx-2 text-slate-800">/</span>
                                    </li>
                                    <li className="text-sm text-blue-500">{post?.title}</li>
                                </>
                            )}
                            {!slug && <li className="text-sm text-blue-500">Comments</li>}
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search comments..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <select
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredComments.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No comments found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to start the conversation!'}
                                </p>
                            </div>
                        ) : (
                            filteredComments.map((comment, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
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
                                                    className="w-12 h-12 rounded-full object-cover cursor-pointer"
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
                                                        to={`/blog/${comment.slug}`}
                                                        className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                                                    >
                                                        View Post
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-gray-600 leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;
