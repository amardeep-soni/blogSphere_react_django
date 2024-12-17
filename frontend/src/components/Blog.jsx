import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import BlogCard from "./BlogCard";

const Blog = () => {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL; // Your API base URL

  const [blogs, setBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([{ slug: '', title: '' }]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getBlogs = async () => {
    try {
      console.log("Fetching blogs...");
      const response = await fetch(`${BASE_URL}/posts/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Response from blogs endpoint:", response);

      if (response.ok) {
        const res = await response.json();
        console.log("Blogs fetched successfully:", res);
        setBlogs(res);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const getRecentBlogs = async () => {
    try {
      console.log("Fetching recent blogs...");
      const response = await fetch(`${BASE_URL}/posts/recent`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Response from recent blogs endpoint:", response);

      if (response.ok) {
        const res = await response.json();
        const blogNames = res.map((c) => ({ title: c.title, slug: c.slug }));
        console.log("Recent blogs fetched successfully:", blogNames);
        setRecentBlogs(blogNames);
      }
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
    }
  };

  const getCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await fetch(`${BASE_URL}/category/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Response from categories endpoint:", response);

      if (response.ok) {
        const res = await response.json();
        const categoryNames = res.map((c) => c.name);
        console.log("Categories fetched successfully:", categoryNames);
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
    console.log("Home component mounted, fetching data...");
    getBlogs();
    getRecentBlogs();
    getCategories();
  }, []);

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
              src="/img/heroImage.jpeg"
              className="w-full h-full object-cover"
              alt="Hero Background"
            />
          </motion.div>
        </div>

        <div className="relative h-full flex items-center justify-center text-center z-10">
          <div className="space-y-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white"
            >
              Explore Our Blog
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-200 max-w-2xl mx-auto"
            >
              Discover stories, thinking, and expertise from writers on any topic
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Blog Posts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:w-2/3"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog Posts
              </h3>
              <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.slug}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full lg:w-1/3"
          >
            <div className="sticky top-4 space-y-8">
              {/* Search Box */}
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

              {/* Recent Posts */}
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

              {/* Categories */}
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

export default Blog;
