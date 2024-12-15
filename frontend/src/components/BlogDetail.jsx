import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blogDetail, setBlogDetail] = useState({});
    const [showAllComments, setShowAllComments] = useState(false); // State to toggle comments display
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const BASE_URL = "http://127.0.0.1:8000/api"; // Your API base URL

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
                    <h1 className="text-5xl font-bold text-center mb-2">{loading ? 'Loading...' : blogDetail.title}</h1>
                    <nav aria-label="breadcrumb text-xl" className="w-max drop-shadow-md">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
                                <a href="/">Home</a>
                                <span className="pointer-events-none mx-2 text-slate-800">
                                    /
                                </span>
                            </li>
                            <li className="flex cursor-pointer items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-800">
                                <a>{slug}</a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Loader in Main Section */}
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">Error: {error}</div>
            ) : (
                <>
                    {/* Blog Details */}
                    <div div className="lg:w-3/4 bg-white shadow-lg p-5 sm:p-8 mx-4 lg:mx-auto my-8">
                        <div className="aspect-square w-full h-48 sm:h-96 overflow-hidden mb-4">
                            <img src={blogDetail.image} className="w-full h-full object-cover" alt="Blog Image" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{blogDetail.title}</h1>
                        <p className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
                            <a
                                onClick={(event) => handleCategoryClick(event, blogDetail.category)}
                                className="text-blue-600 hover:underline cursor-pointer"
                            >
                                <i className="fas fa-tag"></i> {blogDetail.category}
                            </a>
                            <span>/</span>
                            <a
                                onClick={(event) => handleAuthorClick(event, blogDetail.author)}
                                className="text-blue-600 hover:underline cursor-pointer"
                            >
                                <i className="fas fa-user"></i> By {blogDetail.author}
                            </a>
                        </p>
                        <p className="text-sm text-gray-600 mb-4 text-justify" dangerouslySetInnerHTML={{ __html: blogDetail.content }}></p>
                    </div>

                    {/* Comments Section */}
                    <div className="lg:w-3/4 bg-white shadow-lg p-5 sm:p-8 mx-4 lg:mx-auto my-8">
                        <h2 className="text-2xl font-bold mb-4">
                            Comments ({blogDetail.comments ? blogDetail.comments.length : '0'})
                        </h2>
                        {blogDetail.comments && blogDetail.comments.length > 0 ? (
                            commentsToDisplay.map((comment, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-4 p-4 border-b ${blogDetail.comments.length - 1 === index ? 'border-transparent' : 'border-gray-200 mb-6'
                                        }`}
                                >
                                    <img
                                        src={
                                            comment.user_image !== 'not found'
                                                ? `${BASE_URL.slice(0, BASE_URL.lastIndexOf('api'))}${comment.user_image}`
                                                : 'https://www.gravatar.com/avatar?d=mp'
                                        }
                                        alt={comment.name}
                                        className="w-12 h-12 rounded-full object-cover cursor-pointer"
                                        onClick={() => redirectUser(comment.username)}
                                    />
                                    <div className="flex flex-col w-full">
                                        <div className="flex items-start flex-col mb-2">
                                            <p
                                                className="text-lg font-semibold text-gray-800 cursor-pointer"
                                                onClick={() => redirectUser(comment.username)}
                                            >
                                                {comment.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(comment.created_at).toLocaleString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No comments yet.</p>
                        )}

                        {blogDetail.comments && blogDetail.comments.length > 4 && (
                            <button
                                className="text-blue-500 mt-4"
                                onClick={() => setShowAllComments(!showAllComments)}
                            >
                                {showAllComments ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>

                    <div className="lg:w-3/4 bg-white shadow-lg p-5 sm:p-8 mx-4 lg:mx-auto my-8">
                        <h2 className="text-2xl font-bold mb-4">Leave a Comment</h2>
                        <form onSubmit={handleCommentSubmit}>
                            <div className="mb-4">
                                <textarea
                                    className="block w-full px-3 py-2 text-sm border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:border-blue-500"
                                    name="content"
                                    placeholder="Type Message here..."
                                    autoComplete="off"
                                    rows={5}
                                    onChange={handleCommentInputChange}
                                    value={commentData.content}
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <input
                                    type="text"
                                    className="block w-full px-3 py-2 text-sm border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:border-blue-500"
                                    name="name"
                                    placeholder="Your name"
                                    autoComplete="off"
                                    onChange={handleCommentInputChange}
                                    value={commentData.name}
                                />

                                <input
                                    type="email"
                                    className="block w-full px-3 py-2 text-sm border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:border-blue-500"
                                    name="email"
                                    placeholder="Your email address"
                                    autoComplete="off"
                                    onChange={handleCommentInputChange}
                                    value={commentData.email}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
};

export default BlogDetail;
