// Footer.jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate()
    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg mt-8"
        >
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                        {/* Logo Section */}
                        <motion.div
                            onClick={() => navigate('/')}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <img
                                src="/img/logo-portrait.png"
                                alt="Logo"
                                className="w-48 mx-auto md:mx-0 cursor-pointer"
                            />
                        </motion.div>

                        {/* Social Links Section */}
                        <div className="text-center md:text-right">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            >
                                Stay Connected
                            </motion.h2>
                            <div className="flex gap-4 justify-center md:justify-end">
                                {[
                                    { icon: "github", url: "https://github.com/amardeep-soni" },
                                    { icon: "linkedin", url: "https://linkedin.com/in/amardeepsoni11" },
                                    { icon: "facebook", url: "https://facebook.com/amardeep-soni11" },
                                ].map((social, index) => (
                                    <motion.a
                                        key={social.icon}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r from-blue-600 to-purple-600 hover:border-transparent hover:text-white transition-all duration-300"
                                    >
                                        <i className={`fa-brands fa-${social.icon} text-xl`}></i>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="border-t border-gray-200 pt-4 text-center text-gray-600"
                    >
                        <p>
                            © 2023 BlogSphere. All rights reserved. | Designed & Developed by{' '}
                            <a
                                href="https://www.linkedin.com/in/amardeepsoni11/"
                                className="text-blue-600 hover:text-purple-600 transition-colors duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Amardeep Soni
                            </a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;