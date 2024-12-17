import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import apiClient from './ApiClient';
import CreateCategoryDialog from './CreateCategoryDialog';
import { motion } from 'framer-motion';

const PostForm = ({ mode = 'create' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard'; // Default to dashboard if no previous location
    const { slug } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category_id: '',
        image: null
    });
    
    console.log(location);
    
    const [categories, setCategories] = useState([]);
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Rich Text Editor modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'video'],
            ['clean'],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
        ],
    };

    // Image Drop Zone configuration
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.warning('Image size should be less than 5MB');
            return;
        }
        setFormData(prev => ({ ...prev, image: file }));

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        // Cleanup preview URL when component unmounts
        return () => URL.revokeObjectURL(previewUrl);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        multiple: false
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (mode === 'edit' && slug && categories.length > 0) {
            fetchPostData();
        }
    }, [mode, slug, categories]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/category/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        }
    };

    const fetchPostData = async () => {
        try {
            const response = await apiClient.get(`/posts/${slug}/`);
            const post = response.data;

            // Pre-fill the form data
            setFormData({
                title: post.title,
                content: post.content,
                excerpt: post.excerpt,
                category_id: '', // We'll set this after finding the category
                image: null
            });

            // Set the image preview if there's an existing image
            if (post.image) {
                setImagePreview(post.image);
            }

            // Find the category by name instead of ID
            if (post.category) {
                const selectedCategory = categories.find(cat => cat.name.toLowerCase() === post.category.toLowerCase());
                if (selectedCategory) {
                    const categoryOption = {
                        value: selectedCategory.id,
                        label: selectedCategory.name
                    };
                    setSelectedCategory(categoryOption);
                    setFormData(prev => ({
                        ...prev,
                        category_id: selectedCategory.id
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            navigate('/dashboard');
        }
    };

    // Convert categories to react-select format
    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }));

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setFormData({ ...formData, category_id: selectedOption ? selectedOption.value : '' });
    };

    // Custom styles for react-select
    const customStyles = {
        control: (base) => ({
            ...base,
            minHeight: '42px',
            borderRadius: '0.5rem',
            borderColor: '#e2e8f0',
            '&:hover': {
                borderColor: '#3b82f6'
            }
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e2e8f0' : 'white',
            color: state.isSelected ? 'white' : 'black',
        })
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            toast.warning('Please enter a title');
            return false;
        }
        if (!formData.excerpt.trim()) {
            toast.warning('Please enter an excerpt');
            return false;
        }
        if (formData.excerpt.length > 255) {
            toast.warning('Excerpt must be less than 255 characters');
            return false;
        }
        if (!formData.content.trim()) {
            toast.warning('Please enter content');
            return false;
        }
        if (!formData.category_id) {
            toast.warning('Please select a category');
            return false;
        }
        if (mode === 'create' && !formData.image && !imagePreview) {
            toast.warning('Please upload an image');
            return false;
        }
        return true;
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('excerpt', formData.excerpt.trim());
            formDataToSend.append('content', formData.content.trim());
            formDataToSend.append('category_id', formData.category_id);
            
            let response;
            if (mode === 'edit') {
                // For edit mode, only send image if there's a new one
                if (formData.image) {
                    formDataToSend.append('image', formData.image);
                }
                
                response = await apiClient.put(`/posts/${slug}/`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Post updated successfully!');
            } else {
                // For create mode, always send the image
                formDataToSend.append('image', formData.image);
                response = await apiClient.post('/posts/', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Post created successfully!');
            }

            navigate(from);
        } catch (error) {
            console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} post:`, error);
            toast.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} post. Please try again.`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {mode === 'edit' ? 'Edit Post' : 'Create New Post'}
                    </h1>
                    <p className="mt-3 text-gray-600">
                        {mode === 'edit' ? 'Update your post details' : 'Share your thoughts with the world'}
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-80"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
                                required
                            />
                        </div>

                        {/* Excerpt Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt <span className="text-red-500">*</span>
                                <span className="text-gray-500 font-normal ml-2">
                                    ({255 - formData.excerpt.length} characters remaining)
                                </span>
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none resize-none"
                                rows="3"
                                maxLength="255"
                                required
                            />
                        </div>

                        {/* Category Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={categoryOptions}
                                onChange={handleCategoryChange}
                                value={selectedCategory}
                                styles={customStyles}
                                isClearable
                                isSearchable
                                placeholder="Select or search a category..."
                                className="rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCategoryDialog(true)}
                                className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                            >
                                + Add New Category
                            </button>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image <span className="text-red-500">*</span>
                            </label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer
                                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                                    hover:border-blue-500 transition-colors duration-200`}
                            >
                                <input {...getInputProps()} />
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-48 mx-auto rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage();
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500">
                                            Drag & drop an image here, or click to select
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            (Supported formats: JPG, PNG, GIF)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <div className="rounded-xl overflow-hidden border border-gray-200">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    modules={modules}
                                    className="rounded-xl"
                                    style={{ height: '400px', marginBottom: '50px' }}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl mt-8"
                        >
                            {mode === 'edit' ? 'Update Post' : 'Create Post'}
                        </motion.button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            type="button"
                            onClick={() => navigate(from)}
                            className="w-full flex justify-center items-center py-3 px-6 rounded-xl text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                        >
                            Cancel
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>

            {/* Category Dialog */}
            {showCategoryDialog && (
                <CreateCategoryDialog
                    isOpen={showCategoryDialog}
                    onClose={() => setShowCategoryDialog(false)}
                    onCategoryCreated={() => {
                        fetchCategories();
                        setShowCategoryDialog(false);
                    }}
                />
            )}
        </div>
    );
};

export default PostForm;
