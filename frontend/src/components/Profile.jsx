import { useParams } from "react-router-dom";
import BlogCard from "./BlogCard";

const Profile = () => {
    const { username } = useParams();

    // Demo data for the profile and posts
    const userData = {
        username: "amardeep_soni",
        name: "Amardeep soni",
        bio: "Passionate writer and technology enthusiast. Loves to write about programming and web development.",
        avatarUrl: "https://via.placeholder.com/150",
    };

    return (
        <>
            <div className="w-full relative text-white h-44 overflow-hidden">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover"
                    alt=""
                />
                <div className="absolute w-full h-full bg-[#00000099] flex items-center flex-col justify-center gap-3">
                    <h1 className="text-5xl font-bold text-center">{userData.name}</h1>
                    <nav aria-label="breadcrumb text-xl" className="w-max">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
                                <a href="/">Home</a>
                                <span className="pointer-events-none mx-2 text-slate-800">
                                    /
                                </span>
                            </li>
                            <li className="flex cursor-pointer items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-800">
                                <a >{username}</a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="container p-5 sm:p-8 mx-4 lg:mx-auto my-8">
                {/* Profile Header */}
                <div className="flex items-center flex-col sm:flex-row mb-10">
                    <img
                        src={userData.avatarUrl}
                        alt={`${userData.username}'s avatar`}
                        className="w-32 h-32 rounded-full mr-6"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">{userData.name} ({username})</h1>
                        <p className="text-lg text-gray-600">{userData.bio}</p>
                    </div>
                </div>

                {/* Posts Section */}
                <div>
                    <h3 className="text-2xl font-semibold mb-6">Posts by <span className="text-blue-600">{userData.name}</span></h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <BlogCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
