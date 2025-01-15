import { useNavigate, useParams } from 'react-router-dom';
import BlogCard from './BlogCard';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatCategoryForDisplay } from '../utils/formatters';
import { toast } from 'react-toastify';

const Category = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_API_URL;

    const getCategory = async () => {
        try {
            const response = await fetch(`${BASE_URL}/category/${name}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                setCategory(data);
            } else {
                toast.error('Category not found');
                navigate('/blog');
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            toast.error('Error loading category');
            navigate('/blog');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategory();
    }, [name]);

    const displayName = formatCategoryForDisplay(name);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Enhanced Hero Section */}
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
                            alt="Category Background"
                        />
                    </motion.div>
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-center z-10 space-y-4 px-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-white capitalize"
                    >
                        {displayName}
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
                            <li className="text-sm text-blue-400 capitalize">{displayName}</li>
                        </ol>
                    </motion.nav>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-12">
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto"
                    >
                        {/* Category Description */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-80 mb-12"
                        >
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 capitalize">
                                About {displayName}
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {category.description || `Explore our collection of posts in the ${displayName} category.`}
                            </p>
                        </motion.div>

                        {/* Posts Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Posts in {displayName}
                                </h3>
                                <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full" />
                            </div>

                            {category.posts && category.posts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.posts.map((blog, index) => (
                                        <motion.div
                                            key={blog.slug}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            whileHover={{ y: -5 }}
                                            className="transform transition-all duration-300"
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
                                        <i className="fas fa-folder-open text-blue-500 text-3xl"></i>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No posts available</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        There are no posts in this category yet.
                                        Check back later for new content!
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/')}
                                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Browse Other Categories
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Category;
