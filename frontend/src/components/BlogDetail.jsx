import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blogDetail, setBlogDetail] = useState({});
    const [showAllComments, setShowAllComments] = useState(false); // State to toggle comments display
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const BASE_URL = import.meta.env.VITE_API_URL; // Your API base URL

    const getBlogDetail = async () => {
        try {
            const response = await fetch(`${BASE_URL}/posts/${slug}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch blog details');

            const data = await response.json();
            setBlogDetail(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBlogDetail();
    }, [slug]);

    const handleCategoryClick = (event, category) => {
        event.stopPropagation();
        navigate(`/category/${category}`);
    };

    const handleAuthorClick = (event, author) => {
        event.stopPropagation();
        navigate(`/author/${author}`);
    };

    const [commentData, setCommentData] = useState({
        slug: slug,
        email: '',
        name: '',
        content: '',
    });

    const handleCommentInputChange = (e) => {
        const { name, value } = e.target;
        setCommentData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/comments/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the comment');
            }

            const newComment = await response.json();
            setBlogDetail((prevState) => ({
                ...prevState,
                comments: [newComment, ...prevState.comments],
            }));

            setCommentData({ slug, email: '', name: '', content: '' });

            // Show success toast
            toast.success('Comment posted successfully!');
        } catch (error) {
            console.error('Failed to post comment:', error);

            // Show error toast
            toast.error('Failed to post comment. Please try again.');
        }
    };


    const redirectUser = (username) => {
        if (username !== 'not found') {
            navigate(`/author/${username}`);
        } else {
            console.log('This user has no account');
        }
    };

    const commentsToDisplay = showAllComments ? blogDetail.comments : blogDetail.comments?.slice(0, 4);

    // Add new function to handle sharing
    const handleShare = async (platform) => {
        const currentUrl = window.location.href;
        const title = blogDetail.title;
        const text = blogDetail.excerpt || title;

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(currentUrl);
                    toast.success('Link copied to clipboard!');
                } catch (err) {
                    toast.error('Failed to copy link');
                }
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
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
                            src={blogDetail.image || "/img/heroImage.jpeg"}
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
                        {loading ? 'Loading...' : blogDetail.title}
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
                            <li className="text-sm text-blue-400">{slug}</li>
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
                        <p className="text-gray-500 font-medium">Loading post...</p>
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
                        className="max-w-4xl mx-auto"
                    >
                        {/* Enhanced Blog Content Card */}
                        <motion.article
                            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Featured Image */}
                            <div className="relative h-[300px] w-full">
                                <img
                                    src={blogDetail.image || "/img/heroImage.jpeg"}
                                    alt={blogDetail.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>

                            <div className="p-8">
                                {/* Title and Meta */}
                                <div className="mb-6">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                        {blogDetail.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-2">
                                            <i className="far fa-calendar"></i>
                                            {new Date(blogDetail.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Author Section */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-6 mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
                                    onClick={() => navigate(`/author/${blogDetail.author}`)}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                >
                                    <div className="relative">
                                        <img
                                            src={blogDetail.author_image ? BASE_URL.slice(0, BASE_URL.lastIndexOf('api')) + blogDetail.author_image : 'https://www.gravatar.com/avatar?d=mp'}
                                            alt={blogDetail.author}
                                            className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full">
                                            <i className="fas fa-pen-fancy text-sm"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-blue-600 mb-1 block">
                                            Written by
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                                            {blogDetail.author}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Click to see all posts by this author
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Categories */}
                                <motion.div className="flex flex-wrap gap-3 mb-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(event) => handleCategoryClick(event, blogDetail.category)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                                    >
                                        <i className="fas fa-tag mr-2"></i>
                                        {blogDetail.category}
                                    </motion.button>
                                </motion.div>

                                {/* Blog Content */}
                                <div className="prose prose-lg max-w-none">
                                    {blogDetail.excerpt && (
                                        <motion.blockquote
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-lg mb-6"
                                        >
                                            <p className="text-lg text-gray-700 italic">
                                                {blogDetail.excerpt}
                                            </p>
                                        </motion.blockquote>
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-blue-600 prose-strong:text-gray-800"
                                        dangerouslySetInnerHTML={{ __html: blogDetail.content }}
                                    />
                                </div>

                                {/* Tags Section (if you have tags) */}
                                {blogDetail.tags && (
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <div className="flex flex-wrap gap-2">
                                            {blogDetail.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.article>

                        {/* Comments Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-80 mb-8"
                        >
                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Comments ({blogDetail.comments ? blogDetail.comments.length : '0'})
                            </h2>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {blogDetail.comments && blogDetail.comments.length > 0 ? (
                                    commentsToDisplay.map((comment, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                                        >
                                            <img
                                                src={comment.user_image !== 'not found'
                                                    ? `${BASE_URL.slice(0, BASE_URL.lastIndexOf('api'))}${comment.user_image}`
                                                    : 'https://www.gravatar.com/avatar?d=mp'}
                                                alt={comment.name}
                                                className="w-12 h-12 rounded-full object-cover cursor-pointer"
                                                onClick={() => redirectUser(comment.username)}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                                                            onClick={() => redirectUser(comment.username)}>
                                                            {comment.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(comment.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{comment.content}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No comments yet.</p>
                                )}
                            </div>

                            {blogDetail.comments && blogDetail.comments.length > 4 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAllComments(!showAllComments)}
                                    className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 w-full"
                                >
                                    {showAllComments ? 'Show Less' : 'Show More'}
                                </motion.button>
                            )}
                        </motion.div>

                        {/* Comment Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-80"
                        >
                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Leave a Comment
                            </h2>
                            <form onSubmit={handleCommentSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                        name="content"
                                        placeholder="Your comment..."
                                        rows={5}
                                        onChange={handleCommentInputChange}
                                        value={commentData.content}
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                            name="name"
                                            placeholder="Your name"
                                            onChange={handleCommentInputChange}
                                            value={commentData.name}
                                        />
                                        <input
                                            type="email"
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                            name="email"
                                            placeholder="Your email"
                                            onChange={handleCommentInputChange}
                                            value={commentData.email}
                                        />
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                >
                                    Post Comment
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>

                    {/* Floating Share Button */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="fixed right-4 bottom-4 z-50"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-2xl shadow-xl p-4 backdrop-blur-lg bg-opacity-80"
                        >
                            <div className="flex flex-col gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleShare('twitter')}
                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                                    title="Share on Twitter"
                                >
                                    <i className="fab fa-twitter"></i>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleShare('facebook')}
                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                                    title="Share on Facebook"
                                >
                                    <i className="fab fa-facebook"></i>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleShare('linkedin')}
                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                                    title="Share on LinkedIn"
                                >
                                    <i className="fab fa-linkedin"></i>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleShare('copy')}
                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                                    title="Copy Link"
                                >
                                    <i className="fas fa-link"></i>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
