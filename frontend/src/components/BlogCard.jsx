import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
    const navigate = useNavigate();

    console.log("BlogCard component rendered with blog:", blog);

    const handleCategoryClick = (event, category) => {
        event.stopPropagation();
        console.log("Category clicked:", category);
        navigate(`/category/${category}`);
    };

    const handleAuthorClick = (event, author) => {
        event.stopPropagation();
        console.log("Author clicked:", author);
        navigate(`/author/${author}`);
    };

    // Extract date components from the blog's date
    const blogDate = new Date(blog.created_at);
    const day = blogDate.getDate();
    const month = blogDate.toLocaleString('default', { month: 'short' });
    const year = blogDate.getFullYear();

    console.log("Extracted blog date:", { day, month, year });

    return (
        <div
            className="card rounded-lg overflow-hidden shadow-xl cursor-pointer bg-white transform hover:shadow-2xl"
            onClick={() => {
                console.log("Card clicked, navigating to blog slug:", blog.slug);
                navigate(`/blog/${blog.slug}`);
            }}
        >
            {/* Blog Image Section */}
            <div className="relative w-full h-[220px] overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                {/* Date Badge */}
                <div className="bg-blue-600 text-white absolute top-0 left-0 py-2 px-6 text-center rounded-br-lg">
                    <p className="text-sm">{month}</p>
                    <p className="text-3xl font-bold leading-tight">{day}</p>
                    <p className="text-sm">{year}</p>
                </div>
            </div>

            {/* Blog Content Section */}
            <div className="p-5">
                {/* Blog Title */}
                <h1 className="text-2xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                    {blog.title}
                </h1>

                {/* Category and Author */}
                <p className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
                    <a
                        onClick={(event) => handleCategoryClick(event, blog.category)}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        <i className="fas fa-tag"></i> {blog.category}
                    </a>
                    <span>/</span>
                    <a
                        onClick={(event) => handleAuthorClick(event, blog.author)}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        <i className="fas fa-user"></i> By {blog.author}
                    </a>
                </p>

                {/* Blog Content Preview */}
                <p className="text-gray-600 line-clamp-3">{blog.content}</p>

                {/* Read More Link */}
                <a
                    onClick={() => {
                        console.log("Read More clicked, navigating to blog slug:", blog.slug);
                        navigate(`/blog/${blog.slug}`);
                    }}
                    className="inline-block mt-4 text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                    Read More...
                </a>
            </div>
        </div>
    );
};

export default BlogCard;
