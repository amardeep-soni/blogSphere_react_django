
const Footer = () => {
    return (
        <div>
            <div className="bg-white shadow-lg mt-8 p-8 pb-0">
                <div className="lg:w-3/4 w-full lg:mx-auto">
                    <div className="flex justify-between flex-col sm:flex-row items-center pb-4">
                        <img src="/img/logo-portrait.png" alt="Logo" className="w-48 pb-4 sm:pb-0" />
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Stay Connected</h2>
                            <div className="flex gap-4 justify-center mt-4">
                                <a href="https://facebook.com/amardeep-soni11" className="text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 duration-500 transition-colors  text-xl border-2 px-2 py-1 rounded-full">
                                    <i className="fa-brands fa-facebook"></i>
                                </a>
                                <a href="https://instagram.com/amardeepsoni12" className="text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 duration-500 transition-colors  text-xl border-2 px-2 py-1 rounded-full">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="https://linkedin.com/in/amardeepsoni11" className="text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 duration-500 transition-colors  text-xl border-2 px-2 py-1 rounded-full">
                                    <i className="fa-brands fa-linkedin"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <p className="border-t-2 py-4 text-center">
                        © 2023 BlogSphere. All rights reserved. | Designed by <a href="https://www.linkedin.com/in/amardeepsoni11/">Amardeep Soni</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer