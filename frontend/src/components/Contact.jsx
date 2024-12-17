import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        toast.info('Sending message...');

        try {
            const result = await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formData,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            if (result.text === 'OK') {
                toast.success('Message sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            toast.error('Failed to send message. Please try again later.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Let's Connect
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Have an exciting project in mind? Let's build something amazing together.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-80"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Send a Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                    placeholder="What's this about?"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none resize-none"
                                    placeholder="Write your message here..."
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <svg
                                            className="ml-2 -mr-1 w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-80"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Contact Information
                        </h2>

                        <div className="space-y-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center space-x-4 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-all duration-300"
                            >
                                <div className="flex-shrink-0">
                                    <div className="bg-blue-500 rounded-full px-4 py-3">
                                        <i className="fas fa-envelope text-white text-xl"></i>
                                    </div>
                                </div>
                                <a href="mailto:amardeep10as@gmail.com" className='cursor-pointer w-full'>
                                    <p className="text-gray-600">Email</p>
                                    <p className="text-gray-900 font-medium">amardeep10as@gmail.com</p>
                                </a>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center space-x-4 p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-all duration-300"
                            >
                                <div className="flex-shrink-0">
                                    <div className="bg-green-500 rounded-full px-4 py-3">
                                        <i className="fas fa-phone text-white text-xl"></i>
                                    </div>
                                </div>
                                <a href="tel:+9779809161011" className='cursor-pointer w-full'>
                                    <p className="text-gray-600">Phone</p>
                                    <p className="text-gray-900 font-medium">+977 9809161011</p>
                                </a>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center space-x-4 p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-all duration-300"
                            >
                                <div className="flex-shrink-0">
                                    <div className="bg-purple-500 rounded-full px-4 py-3">
                                        <i className="fas fa-map-marker-alt text-white text-xl"></i>
                                    </div>
                                </div>
                                <a href="https://www.google.com/maps/place/janakpur,+Nepal" className='cursor-pointer w-full'>
                                    <p className="text-gray-600">Location</p>
                                    <p className="text-gray-900 font-medium">JanakpurDham, Nepal</p>
                                </a>
                            </motion.div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-12">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Connect with me
                            </h3>
                            <div className="flex space-x-6">
                                <motion.a
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    href="https://github.com/amardeep-soni"
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <i className="fab fa-github text-3xl"></i>
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.2, rotate: -5 }}
                                    href="https://linkedin.com/in/amardeepsoni11"
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <i className="fab fa-linkedin text-3xl"></i>
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    href="https://www.facebook.com/amardeepsoni11"
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <i className="fab fa-facebook text-3xl"></i>
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;
