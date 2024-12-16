import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from './ApiClient';
import DeleteDialog from './DeleteDialog';

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

    // In Dashboard.jsx
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
        <>
            {/* Hero Section */}
            <div className="w-full relative text-white h-56 overflow-hidden shadow-lg">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover opacity-80"
                    alt="Hero Image"
                />
                <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent flex items-center flex-col justify-center gap-3 p-5">
                    <h1 className="text-5xl font-bold text-center drop-shadow-md mb-3">Dashboard</h1>
                    <nav aria-label="breadcrumb text-xl" className="w-max drop-shadow-md">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex items-center text-sm text-slate-500">
                                <Link to="/">Home</Link>
                                <span className="mx-2 text-slate-800">/</span>
                            </li>
                            <li className="text-sm text-blue-500">Dashboard</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="container mx-auto px-4">
                    <div className='flex justify-center gap-8 mt-8'>
                        <div className="px-5 py-3 border-2 border-blue-500 text-center rounded-lg">
                            <h2 className='text-xl font-bold'>Total Posts</h2>
                            <p className='text-lg'>{dashboardData.totalPosts}</p>
                        </div>
                        <div className="px-5 py-3 border-2 border-blue-500 text-center rounded-lg">
                            <h2 className='text-xl font-bold'>Total Comments</h2>
                            <p className='text-lg'>{dashboardData.totalComments}</p>
                        </div>
                    </div>

                    <div className="flex gap-8 md:flex-row flex-col mt-12 w-full">
                        {/* Recent Posts */}
                        <div className="mb-8 w-full">
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className="text-2xl font-bold">Latest Posts</h3>
                                <div className='flex gap-2 items-center'>
                                    <Link to="/posts" className='text-blue-500 mr-4'>View All</Link>
                                    <button
                                        onClick={() => navigate('/posts/new', { state: { from: location.pathname } })}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <i className="fas fa-plus"></i>
                                        New Post
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {dashboardData.recentPosts.map((post, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <Link to={`/blog/${post.slug}`} className="font-medium text-gray-900 hover:text-blue-500 break-words pr-4">{post.title}</Link>
                                                </div>
                                                <span className="text-sm text-gray-500 whitespace-nowrap">
                                                    {formatDate(post.created_at)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Link
                                                    to={`/comments/${post.slug}`}
                                                    className="text-blue-500 text-sm hover:text-blue-700 cursor-pointer inline-block"
                                                >
                                                    Comments ({post.comments_count})
                                                </Link>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded"
                                                        onClick={() => handleEdit(post.slug)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                                                        onClick={() => handleDelete(post.slug)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">{post.excerpt}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Comments */}
                        <div className="mb-8 w-full">
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className="text-2xl font-bold">Latest Comments</h3>
                                <Link to="/comments" className='text-blue-500 mr-4'>View All</Link>
                            </div>
                            <div className="space-y-4">
                                {dashboardData.recentComments.map((comment, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start flex-col">
                                                <h4 className="font-medium text-gray-900">{comment.name}</h4>
                                                <Link to={`/blog/${comment.slug}`} className="text-blue-500 text-sm hover:text-blue-700 cursor-pointer">on {comment.post}</Link>
                                            </div>
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {formatDate(comment.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-3 ml-13 leading-relaxed">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
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
        </>
    );
};

export default Dashboard;
