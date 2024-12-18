import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCategoryForDisplay } from '../utils/formatters';

const BlogCard = ({ blog }) => {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL;

    const handleCategoryClick = (event, category) => {
        event.stopPropagation();
        navigate(`/category/${category}`);
    };

    const handleAuthorClick = (event, author) => {
        event.stopPropagation();
        navigate(`/author/${author}`);
    };

    const blogDate = new Date(blog.created_at);
    const day = blogDate.getDate();
    const month = blogDate.toLocaleString('default', { month: 'short' });
    const year = blogDate.getFullYear();

    const formatCategoryName = (category) => {
        return category.replace(/-/g, ' ');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl 
                     transition-all duration-300 cursor-pointer h-full flex flex-col"
            onClick={() => navigate(`/blog/${blog.slug}`)}
        >
            {/* Main Image */}
            <div className="relative aspect-[5/3] overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 
                             hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Category Tag */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm 
                             rounded-xl p-3 shadow-lg"
                >
                    <div className="text-center">
                        <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 
                                  bg-clip-text text-transparent">{month}</p>
                        <p className="text-2xl font-bold leading-tight text-gray-800">{day}</p>
                        <p className="text-xs text-gray-600">{year}</p>
                    </div>
                </motion.div>

                {/* Category Badge */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="absolute top-4 right-4"
                >
                    <button
                        onClick={(event) => handleCategoryClick(event, blog.category)}
                        className="px-4 py-2 text-sm font-medium bg-white/90 backdrop-blur-sm 
                                 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors
                                 shadow-lg"
                    >
                        {formatCategoryForDisplay(blog.category)}
                    </button>
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 
                             group-hover:text-blue-600 transition-colors duration-300">
                    {blog.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-4 sm:line-clamp-3 md:line-clamp-4">
                    {blog.excerpt}
                </p>

                {/* Author and Read More Section */}
                <div className="flex items-center justify-between mt-auto border-t border-gray-200 pt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={(event) => handleAuthorClick(event, blog.author)}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100">
                            {blog.author_image ? (
                                <img
                                    src={BASE_URL.slice(0, BASE_URL.lastIndexOf('api')) + blog.author_image}
                                    alt={blog.author}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 
                                              flex items-center justify-center">
                                    <span className="text-white text-lg font-bold">
                                        {blog.author.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-700 hover:text-blue-600 
                                     transition-colors">
                            {blog.author}
                        </span>
                    </motion.button>

                    <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-blue-600 font-medium text-sm"
                    >
                        Read More
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogCard;
