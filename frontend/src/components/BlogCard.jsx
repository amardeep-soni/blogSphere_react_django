
const BlogCard = () => {
    return (
        <div className="card rounded-lg overflow-hidden shadow-lg cursor-pointer bg-white">
            <div className="w-full h-[220px] overflow-hidden relative">
                <img src="https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75" className="w-full h-full object-cover" alt="" />

                <div className="bg-blue-600 text-lg text-white absolute top-0 left-0 py-2 px-8 flex justify-center flex-col items-center rounded -space-y-1">
                    <p>Oct</p>
                    <p className="text-5xl font-bold">10</p>
                    <p>2017</p>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-3xl font-semibold">Title</h1>
                <p className="text-blue-600">
                    <a href="#category" className="hover:underline">Category</a> / <a href="profile" className="hover:underline">By Amardeep</a>
                </p>
                <p className="mt-5">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe nihil ipsum nisi tempore! Architecto, consectetur numquam id optio ducimus minus unde dolorem accusantium suscipit a facilis earum cumque tenetur recusandae ipsa, odio corrupti laudantium ullam doloribus natus?
                </p>

                <a href="post" className="mt-5 text-blue-600 hover:underline inline-block">Read More...</a>
            </div>
        </div>
    )
}

export default BlogCard