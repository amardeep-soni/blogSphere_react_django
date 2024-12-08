import { useParams } from 'react-router-dom';
import BlogCard from './BlogCard';

const Category = () => {
    const { name } = useParams();
    return (
        <>
            {/* Hero Section */}
            <div className="w-full relative text-white h-44 overflow-hidden">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover"
                />
                <div className="absolute w-full h-full bg-[#00000099] flex items-center flex-col justify-center gap-3">
                    <h1 className="text-5xl font-bold text-center uppercase">{name}</h1>
                    <nav aria-label="breadcrumb text-xl" className="w-max">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
                                <a href="/">Home</a>
                                <span className="pointer-events-none mx-2 text-slate-800">
                                    /
                                </span>
                            </li>
                            <li className="flex cursor-pointer items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-800">
                                <a >{name}</a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className='container mx-auto px-4'>
                <h1 className='text-3xl font-bold py-5'>Posts in <span className='text-blue-600 uppercase'>{name}</span> Category</h1>
                {/* Blog Post Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <BlogCard key={i} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Category