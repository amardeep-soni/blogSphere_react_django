import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const BASE_URL = "http://127.0.0.1:8000/api"; // Your API base URL

  const [blogs, setBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([{ slug: '', title: '' }]);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    console.log("Home component mounted, fetching data...");
    getBlogs();
    getRecentBlogs();
    getCategories();
  }, []);

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
          <h1 className="text-5xl font-bold text-center drop-shadow-md">Welcome to BlogSphere!</h1>
          <p className="text-xl text-center drop-shadow-md">Your one-stop destination for blogging.</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="container my-10 mx-auto px-5">
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Left Side (Blogs) */}
          <div className="w-full md:w-2/3">
            <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Blogs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-5 flex flex-col gap-8">
              {/* Search Box */}
              <div className="bg-white shadow-lg rounded-lg p-5">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <input
                    type="text"
                    className="grow py-2 px-4 rounded-l-lg focus:outline-none min-w-0"
                    placeholder="Search blogs..."
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                    Search
                  </button>
                </div>
              </div>

              {/* Recent Blogs */}
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

              {/* Categories */}
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
    </>
  );
};

export default Home;
