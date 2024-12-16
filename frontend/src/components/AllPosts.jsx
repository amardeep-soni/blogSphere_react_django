import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from './ApiClient';
import DeleteDialog from './DeleteDialog';

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
        <>
            {/* Hero Section */}
            <div className="w-full relative text-white h-48 overflow-hidden shadow-lg">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover opacity-80"
                    alt="Hero Image"
                />
                <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent flex items-center flex-col justify-center gap-3">
                    <h1 className="text-4xl font-bold text-center drop-shadow-md">All Posts</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex items-center text-sm text-slate-500">
                                <Link to="/">Home</Link>
                                <span className="mx-2 text-slate-800">/</span>
                            </li>
                            <li className="text-sm text-blue-500">Posts</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Controls Section */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">By Title</option>
                        </select>
                    </div>
                    <button
                        onClick={() => navigate('/posts/new', { state: { from: location.pathname } })}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 w-full md:w-auto justify-center"
                    >
                        <i className="fas fa-plus"></i>
                        New Post
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredPosts.map((post) => (
                            <div key={post.slug} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Post Image with Category */}
                                    {post.image && (
                                        <div className="md:w-1/4 h-[180px] md:h-[220px] relative overflow-hidden flex-shrink-0">
                                            <img
                                                src={BASE_URL.slice(0, BASE_URL.lastIndexOf('api')) + post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <Link
                                                to={`/category/${post.category}`}
                                                className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors duration-200"
                                            >
                                                {post.category}
                                            </Link>
                                        </div>
                                    )}

                                    {/* Post Content */}
                                    <div className="flex-1 p-5 flex flex-col justify-between">
                                        <div>
                                            {/* Title and Date */}
                                            <div className="mb-3">
                                                <Link
                                                    to={`/blog/${post.slug}`}
                                                    className="text-xl font-semibold text-gray-900 hover:text-blue-500 transition-colors duration-200 block mb-2"
                                                >
                                                    {post.title}
                                                </Link>
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(post.created_at)}
                                                    {post.updated_at !== post.created_at && (
                                                        <span className="ml-2 text-gray-400">(edited)</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Excerpt */}
                                            <p className="text-gray-600 text-sm">{post.excerpt}</p>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    to={`/comments/${post.slug}`}
                                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                                                >
                                                    <i className="fas fa-comments"></i>
                                                    <span className="text-sm">{post.comments?.length || 0}</span>
                                                </Link>
                                                <Link
                                                    to={`/blog/${post.slug}`}
                                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    Read More
                                                    <i className="fas fa-arrow-right text-xs"></i>
                                                </Link>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(post.slug)}
                                                    className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
                                                    title="Edit post"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.slug)}
                                                    className="text-red-500 hover:text-red-400 transition-colors duration-200"
                                                    title="Delete post"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
        </>
    );
};

export default AllPosts;

