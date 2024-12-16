import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';

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
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="w-full relative text-white h-56 overflow-hidden shadow-lg">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover opacity-80"
                    alt="Hero Image"
                />
                <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent flex items-center flex-col justify-center gap-3 p-5">
                    <h1 className="text-5xl font-bold text-center drop-shadow-md mb-2">Search Results</h1>
                    <p className="text-lg">
                        Found <span className="font-semibold drop-shadow bg-blue-600 px-4 py-1 rounded-xl">{searchResults.length}</span> results
                        for "<span className="font-medium italic">{query}</span>"
                    </p>
                    <nav aria-label="breadcrumb text-xl" className="w-max drop-shadow-md">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex items-center text-sm text-slate-500">
                                <Link to="/">Home</Link>
                                <span className="mx-2 text-slate-800">/</span>
                            </li>
                            <li className="text-sm text-blue-500">Search Results</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container my-10 mx-auto px-5">
                <div className="flex gap-8 flex-col md:flex-row">
                    <div className="w-full md:w-2/3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                                <p className="text-gray-500 text-lg font-medium animate-pulse">Searching posts...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {searchResults.map((post) => (
                                    <BlogCard key={post.slug} blog={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
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
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-1/3">
                        <div className="sticky top-5 flex flex-col gap-8">
                            <div className="bg-white shadow-lg rounded-lg p-5">
                                <form onSubmit={handleSearch} className="flex items-center border-2 border-gray-300 rounded-lg">
                                    <input
                                        type="text"
                                        className="grow py-2 px-4 rounded-l-lg focus:outline-none min-w-0"
                                        placeholder="Search blogs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white shadow-lg rounded-lg p-5">
                                <h3 className="text-xl font-bold mb-3">Recent Blogs</h3>
                                <ul className="space-y-2">
                                    {recentBlogs.map((blog) => (
                                        <li
                                            key={blog.slug}
                                            className="text-blue-600 hover:underline cursor-pointer"
                                            onClick={() => navigate(`/blog/${blog.slug}`)}
                                        >
                                            {blog.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white shadow-lg rounded-lg p-5">
                                <h3 className="text-xl font-bold mb-3">Categories</h3>
                                <ul className="space-y-2">
                                    {categories.map((category, index) => (
                                        <li
                                            key={index}
                                            className="text-blue-600 hover:underline cursor-pointer"
                                            onClick={() => navigate(`/category/${category}`)}
                                        >
                                            {category}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
