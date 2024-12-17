import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
    const navigate = useNavigate();
    const author = {
        name: "Amardeep Soni",
        role: "Full Stack Web Developer",
        image: "https://avatars.githubusercontent.com/u/105788041?v=4",
        description: "Passionate software engineer with expertise in building scalable web applications. Experienced in modern JavaScript frameworks and cloud technologies. Committed to writing clean, maintainable code and delivering exceptional user experiences.",
        social: {
            facebook: "https://www.facebook.com/yourusername",
            linkedin: "https://www.linkedin.com/in/yourusername",
            github: "https://github.com/yourusername"
        }
    };

    const expertise = [
        {
            icon: "fas fa-laptop-code",
            title: "Frontend Development",
            description: "Building responsive and interactive user interfaces using React, Next.js, and modern CSS frameworks."
        },
        {
            icon: "fas fa-server",
            title: "Backend Development",
            description: "Developing robust server-side applications using Node.js, Express, and various database technologies."
        },
        {
            icon: "fas fa-flask",
            title: "UI/UX Design",
            description: "Creating visually appealing and user-friendly interfaces using Figma "
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-[50vh] overflow-hidden"
            >
                <div className="absolute inset-0">
                    <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-black/95"></div>
                        <img
                            src="/img/heroImage.jpeg"
                            className="w-full h-full object-cover"
                            alt="About Us Background"
                        />
                    </motion.div>
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-center z-10 space-y-4 px-4">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-6xl font-bold text-white"
                    >
                        About Me
                    </motion.h1>
                    <motion.nav
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4"
                    >
                        <ol className="flex items-center rounded-md bg-white/10 backdrop-blur-md px-4 py-2">
                            <li className="flex items-center text-sm text-gray-300">
                                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                <span className="mx-2 text-gray-400">/</span>
                            </li>
                            <li className="text-sm text-blue-400">About</li>
                        </ol>
                    </motion.nav>
                </div>
            </motion.div>

            {/* About Me Section */}
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto mb-16"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                            <motion.img
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                src={author.image}
                                alt={author.name}
                                className="w-40 h-40 rounded-full object-cover shadow-lg"
                            />
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {author.name}
                                </h2>
                                <p className="text-xl text-blue-600 mb-4">{author.role}</p>
                                <div className="flex justify-center md:justify-start gap-4">
                                    <a href={author.social.facebook} className="text-gray-400 hover:text-blue-500 transition-colors">
                                        <i className="fab fa-facebook text-xl"></i>
                                    </a>
                                    <a href={author.social.linkedin} className="text-gray-400 hover:text-blue-500 transition-colors">
                                        <i className="fab fa-linkedin text-xl"></i>
                                    </a>
                                    <a href={author.social.github} className="text-gray-400 hover:text-blue-500 transition-colors">
                                        <i className="fab fa-github text-xl"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {author.description}
                        </p>
                    </div>
                </motion.div>

                {/* Expertise Section */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Areas of Expertise
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {expertise.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl shadow-xl p-8 text-center"
                            >
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6"
                                >
                                    <i className={`${item.icon} text-2xl text-white`}></i>
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto mt-24 text-center"
                >
                    <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Let's Connect
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Interested in collaborating or have questions? Feel free to reach out!
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-200"
                        onClick={() => navigate("/contact")}
                    >
                        Get in Touch
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default About;