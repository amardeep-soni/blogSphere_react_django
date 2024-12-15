import { useNavigate, useParams } from 'react-router-dom';
import BlogCard from './BlogCard';
import { useEffect, useState } from 'react';

const Category = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(true);

    const BASE_URL = "http://127.0.0.1:8000/api"; // Your API base URL

    const getCategory = async () => {
        try {
            const response = await fetch(BASE_URL + `/category/${name}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const res = await response.json();
                setCategory(res);
            } else {
                console.error('Failed to fetch category data');
            }
        } catch (error) {
            console.error('Error fetching category:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategory();
    }, [name]);

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
                    <h1 className="text-5xl font-bold text-center drop-shadow-md mb-3">{name}</h1>
                    <nav aria-label="breadcrumb text-xl" className="w-max drop-shadow-md">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
                                <a href="/">Home</a>
                                <span className="pointer-events-none mx-2 text-slate-800">
                                    /
                                </span>
                            </li>
                            <li className="flex cursor-pointer items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-800">
                                <a>{name}</a>
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
            ) : (
                <>
                    {/* Title and Description */}
                    <div className="container mx-auto px-4 mt-6 text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-3 capitalize">{name}</h2>
                        {category.description && (
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                                {category.description}
                            </p>
                        )}
                    </div>

                    {/* Blog Posts Section */}
                    <div className="container mx-auto px-4 pb-8">
                        <h3 className="text-3xl font-semibold mb-4 text-gray-700">
                            Posts in <span className="text-blue-600 uppercase">{name}</span>
                        </h3>

                        {loading ? (
                            // Skeleton Loader
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="animate-pulse bg-gray-200 rounded-lg h-60"
                                    ></div>
                                ))}
                            </div>
                        ) : category.posts && category.posts.length > 0 ? (
                            // Blog Cards Grid
                            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                                {category.posts.map((blog) => (
                                    <BlogCard key={blog.slug} blog={blog} />
                                ))}
                            </div>
                        ) : (
                            // No Posts Available
                            <div className="text-center text-gray-500 mt-8">
                                <p>No posts available in this category.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Category;
