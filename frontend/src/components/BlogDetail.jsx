import { useParams } from 'react-router-dom';

const BlogDetail = () => {
    const { slug } = useParams();

    return (
        <>
            {/* Hero Section */}
            <div className="w-full relative text-white h-44 overflow-hidden">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover"
                    alt=""
                />
                <div className="absolute w-full h-full bg-[#00000099] flex items-center flex-col justify-center gap-3">
                    <h1 className="text-5xl font-bold text-center">This is title</h1>
                    <nav aria-label="breadcrumb text-xl" className="w-max">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
                                <a href="/">Home</a>
                                <span className="pointer-events-none mx-2 text-slate-800">
                                    /
                                </span>
                            </li>
                            <li className="flex cursor-pointer items-center text-sm text-slate-500 transition-colors duration-300 hover:text-slate-800">
                                <a href="/">Blogs</a>
                                <span className="pointer-events-none mx-2 text-slate-800">
                                    /
                                </span>
                            </li>
                            <li className="flex cursor-pointer items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-800">
                                <a >{slug}</a>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Blog Details */}
            <div className="lg:w-3/4 bg-white shadow-lg p-5 sm:p-8 mx-4 lg:mx-auto my-8">
                <div className='aspect-square w-full h-48 sm:h-96 overflow-hidden mb-4'>
                    <img src="https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75" className="w-full h-full object-cover" alt="" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Blog Title</h1>
                <nav aria-label="breadcrumb" className="w-max">
                    <ol className="flex w-full flex-wrap items-center rounded-md py-2 mb-2">
                        <li className="flex cursor-pointer items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-800">
                            <a href="#">Category</a>
                            <span className="pointer-events-none mx-2 text-blue-800">
                                /
                            </span>
                        </li>
                        <li className="flex cursor-pointer items-center text-sm text-blue-500 transition-colors duration-300 hover:text-blue-800">
                            <a href="#">By Amardeep</a>
                        </li>
                    </ol>
                </nav>
                <p className="text-sm text-gray-600 mb-4 text-justify">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione ut iste quas ipsa autem modi officiis laudantium molestias illum ex ipsum quod molestiae fugit voluptatum nam excepturi, aperiam sed atque iure facilis dicta dolorem provident beatae culpa. Inventore earum molestiae fugit. Similique excepturi qui cum, odio animi placeat cumque provident iste beatae magni. Voluptatum praesentium sint repudiandae incidunt fuga distinctio, delectus quaerat sapiente ut ea vero doloribus eaque porro odio consequuntur id officiis fugiat in autem voluptatibus nemo itaque inventore? Atque ratione porro dolorem perferendis aut nostrum quidem saepe praesentium sapiente modi. Earum fugit amet sapiente voluptate, tempore pariatur animi tempora fugiat nam asperiores reiciendis molestiae ea. Ab ad facilis recusandae corporis, labore ipsum maxime, qui magni aperiam, sit quaerat magnam omnis dolore autem earum voluptate. Quaerat obcaecati quibusdam qui vitae est error aspernatur consequuntur amet iusto assumenda eum soluta maxime nihil ea, aliquid beatae ipsa ducimus, reprehenderit porro itaque mollitia expedita corporis! Fugit ducimus, laboriosam recusandae a dolor magni, eum veritatis harum accusamus sequi enim sapiente, consectetur quos soluta velit numquam veniam quisquam itaque inventore saepe est officia cum? Vero aut dolores ipsum ullam, dolorum nemo nulla quos maxime amet voluptate repellendus ut laboriosam laudantium molestiae non labore id exercitationem aliquam, itaque quia fuga. Labore voluptatum magni animi nostrum. Porro fugiat omnis ratione quis? Veniam illo inventore autem ratione, dolorem repellendus quam sapiente enim magni nemo voluptas deleniti? Molestias cupiditate deserunt qui vitae asperiores. Architecto reiciendis nulla eveniet, voluptates doloribus iure totam voluptatibus unde magnam optio, beatae corrupti? Voluptates voluptatibus porro quaerat sed illum dolor tempora, odit quasi, cupiditate dolorum optio, commodi laboriosam! Libero perspiciatis incidunt nihil, iste nulla hic. Culpa natus eaque commodi corporis sint tenetur eius, repellendus aliquid reiciendis, dicta praesentium? Temporibus voluptatibus, quae, minus illum nobis voluptate voluptas reiciendis a totam, provident unde impedit quam placeat!
                </p>
            </div>

            <div className="lg:w-3/4 bg-white shadow-lg p-5 sm:p-8 mx-4 lg:mx-auto my-8">
                <h2 className="text-2xl font-bold mb-4">Leave a Comment</h2>
                <form>
                    <div className="mb-4">
                        <textarea
                            className="block w-full px-3 py-2 text-sm border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:border-blue-500"
                            name='content'
                            placeholder="Type Message here..."
                            rows={5}
                        ></textarea>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        {/* name , email*/}
                        <input
                            type="text"
                            className="block w-full px-3 py-2 text-sm border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:border-blue-500"
                            name='name'
                            placeholder='Your name'
                            id="name" />

                        <input
                            type="email"
                            className="block w-full px-3 py-2 text-sm border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:border-blue-500"
                            name='email'
                            placeholder='Your email address'
                            id="email" />
                    </div>

                    <div className="flex items-center justify-between">
                        <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
                            Post Comment
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default BlogDetail