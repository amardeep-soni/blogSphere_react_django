import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative min-h-[92vh] flex items-center">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-black/95"></div>
                        <img
                            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643"
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
                                Share Your Story With The World
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.8 }}
                        >
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-6 sm:mb-8 md:mb-12 leading-relaxed px-4">
                                Join our community of writers, thinkers, and storytellers. Create, share, and connect.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.1 }}
                            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto inline-block px-8 sm:px-12 py-4 sm:py-5 bg-white text-blue-900 text-lg sm:text-xl font-semibold rounded-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto">
                                <Link
                                    to="/blog"
                                    className="w-full sm:w-auto inline-block px-8 sm:px-12 py-4 sm:py-5 border-2 border-white text-white text-lg sm:text-xl font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                                >
                                    Explore Blogs
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold leading-normal bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Growing Community
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-32">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold leading-normal bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Why Choose BlogSpace?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the future of blogging with our innovative platform designed for creators like you.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} index={index} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-32 bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center text-white"
                    >
                        <h2 className="text-5xl font-bold mb-8">Our Mission</h2>
                        <p className="text-xl leading-relaxed mb-12 text-gray-200">
                            At BlogSpace, we believe everyone has a story worth sharing. Our mission
                            is to provide a platform where voices can be heard, ideas can flourish,
                            and communities can grow.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/register"
                                className="inline-block px-12 py-5 bg-white text-blue-900 rounded-xl text-xl font-semibold hover:shadow-2xl transition-all duration-300"
                            >
                                Join Our Community
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
        >
            <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6"
            >
                <i className={`${icon} text-3xl text-white`}></i>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </motion.div>
    );
};

// Stat Card Component
const StatCard = ({ number, label, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center text-white"
        >
            <div className="text-5xl font-bold mb-2">{number}</div>
            <div className="text-white/80 text-lg">{label}</div>
        </motion.div>
    );
};

// Data
const features = [
    {
        icon: "fas fa-pen-fancy",
        title: "Intuitive Writing",
        description: "A distraction-free editor with powerful formatting tools to bring your stories to life."
    },
    {
        icon: "fas fa-users",
        title: "Vibrant Community",
        description: "Connect with like-minded writers, receive feedback, and grow your audience organically."
    },
    {
        icon: "fas fa-shield-alt",
        title: "Content Protection",
        description: "Advanced security measures to ensure your creative work remains safe and protected."
    }
];

const stats = [
    {
        number: "10K+",
        label: "Active Writers"
    },
    {
        number: "50K+",
        label: "Published Posts"
    },
    {
        number: "100K+",
        label: "Monthly Readers"
    },
    {
        number: "95%",
        label: "Satisfaction Rate"
    }
];

export default Home;
