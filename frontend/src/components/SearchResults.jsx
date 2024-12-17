import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';
import { motion } from 'framer-motion';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentBlogs, setRecentBlogs] = useState([{ slug: '', title: '' }]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const query = searchParams.get('q');
    const BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/posts/search/?q=${query}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
            setLoading(false);
        };

        if (query) {
            fetchSearchResults();
            setSearchQuery(query);
        }
    }, [query]);

    const getRecentBlogs = async () => {
        try {
            const response = await fetch(`${BASE_URL}/posts/recent`);
            if (response.ok) {
                const res = await response.json();
                const blogNames = res.map((c) => ({ title: c.title, slug: c.slug }));
                setRecentBlogs(blogNames);
            }
        } catch (error) {
            console.error("Error fetching recent blogs:", error);
        }
    };

    const getCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/category/`);
            if (response.ok) {
                const res = await response.json();
                const categoryNames = res.map((c) => c.name);
                setCategories(categoryNames);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        getRecentBlogs();
        getCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                            alt="Hero Background"
                        />
                    </motion.div>
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-center z-10 space-y-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-6xl font-bold text-white"
                    >
                        Search Results
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-200"
                    >
                        Found <span className="font-semibold bg-blue-600/80 px-4 py-1 rounded-xl">{searchResults.length}</span> results
                        for "<span className="font-medium italic">{query}</span>"
                    </motion.p>
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
                            <li className="text-sm text-blue-400">Search Results</li>
                        </ol>
                    </motion.nav>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="w-full lg:w-2/3"
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                                <p className="text-gray-500 text-lg font-medium animate-pulse">Searching posts...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {searchResults.map((post) => (
                                    <motion.div
                                        key={post.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <BlogCard blog={post} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 bg-white rounded-2xl shadow-xl backdrop-blur-lg bg-opacity-80"
                            >
                                <div className="text-gray-400 text-7xl mb-6">
                                    <i className="fas fa-search-minus"></i>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                                    No matching results
                                </h3>
                                <p className="text-gray-600 text-lg mb-8">
                                    We couldn't find any posts matching "<span className="font-medium text-blue-600">{query}</span>"
                                </p>
                                <div className="max-w-md mx-auto px-6 space-y-4">
                                    <p className="text-gray-500">
                                        Try adjusting your search terms or explore our suggestions below
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                                        <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                            Browse Other Posts
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="w-full lg:w-1/3"
                    >
                        <div className="sticky top-5 space-y-8">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80"
                            >
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Search Posts
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                            placeholder="Search blogs..."
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                        >
                                            <i className="fas fa-search"></i>
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80"
                            >
                                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Recent Posts
                                </h3>
                                <div className="space-y-4">
                                    {recentBlogs.map((blog) => (
                                        <motion.div
                                            key={blog.slug}
                                            whileHover={{ x: 10 }}
                                            className="group cursor-pointer"
                                            onClick={() => navigate(`/blog/${blog.slug}`)}
                                        >
                                            <h4 className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                                                {blog.title}
                                            </h4>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-80"
                            >
                                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Categories
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map((category, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/category/${category}`)}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                                        >
                                            {category}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
