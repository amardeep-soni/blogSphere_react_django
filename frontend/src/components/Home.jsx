import BlogCard from "./BlogCard";

const Home = () => {
  const categories = ["Technology", "Health", "Education", "Sports", "Finance"];
  const recentBlogs = [
    "Latest Tech Trends to Watch in 2024",
    "Top 10 Healthy Eating Habits for a Better Life",
    "The Future of Online Learning: What to Expect",
    "Upcoming Sports Events You Can't Miss in 2024",
    "Top Investment Tips for 2024",
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="w-full relative text-white h-72 overflow-hidden">
        <img
          src="/img/heroImage.jpeg"
          className="absolute w-full h-full object-cover"
          alt=""
        />
        <div className="absolute w-full h-full bg-[#00000040] flex items-center flex-col justify-center gap-3">
          <h1 className="text-5xl font-bold text-center">Welcome to BlogSphere!</h1>
          <p className="text-xl text-center">Your one-stop destination for blogging.</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="container my-5 mx-auto px-5">
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Left Side */}
          <div className="w-full md:w-2/3">
            <h2 className="text-4xl font-bold mb-4 text-center">Blogs</h2>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <BlogCard key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full md:w-1/3">
            {/* Sticky Sidebar */}
            <div className="sticky top-5 flex flex-col gap-8">
              {/* Search Box */}
              <div className="bg-white shadow p-5 rounded-lg w-full">
                <div className="flex items-center border-2">
                  <input
                    type="text"
                    className="grow py-2 px-4 focus-visible:outline-none"
                    placeholder="Search..."
                  />
                  <i className="fa fa-search text-black pr-3"></i>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white shadow p-5 rounded-lg w-full">
                <p className="text-xl font-semibold pb-4">Categories</p>
                <ul>
                  {categories.map((category) => (
                    <li key={category}>
                      <a
                        href="#category"
                        className="inline-block py-1 text-blue-600 hover:underline"
                      >
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Latest Posts */}
              <div className="bg-white shadow p-5 rounded-lg w-full">
                <p className="text-xl font-semibold pb-4">Latest Posts</p>
                <ul>
                  {recentBlogs.map((blog) => (
                    <li key={blog}>
                      <a
                        href="#category"
                        className="inline-block py-1 text-blue-600 hover:underline"
                      >
                        {blog}
                      </a>
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

export default Home;
