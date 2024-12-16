import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import apiClient from './ApiClient';
import CreateCategoryDialog from './CreateCategoryDialog';

const PostForm = ({ mode = 'create' }) => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category_id: '',
        image: null
    });
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
        if (!formData.image) {
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
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            let response;
            if (mode === 'edit') {
                response = await apiClient.put(`/posts/${slug}/`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Post updated successfully!');
            } else {
                response = await apiClient.post('/posts/', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Post created successfully!');
            }

            navigate(`/blog/${response.data.slug}`);
        } catch (error) {
            console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} post:`, error);
            toast.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} post. Please try again.`);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <div className="w-full relative text-white h-56 overflow-hidden shadow-lg">
                <img
                    src="/img/heroImage.jpeg"
                    className="absolute w-full h-full object-cover opacity-80"
                    alt="Hero Image"
                />
                <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent flex items-center flex-col justify-center gap-3 p-5">
                    <h1 className="text-5xl font-bold text-center drop-shadow-md mb-3">
                        {mode === 'edit' ? 'Edit Post' : 'Create New Post'}
                    </h1>
                    <nav aria-label="breadcrumb text-xl" className="w-max drop-shadow-md">
                        <ol className="flex w-full flex-wrap items-center rounded-md bg-slate-50 px-4 py-2">
                            <li className="flex items-center text-sm text-slate-500">
                                <Link to="/">Home</Link>
                                <span className="mx-2 text-slate-800">/</span>
                            </li>
                            <li className="flex items-center text-sm text-slate-500">
                                <Link to="/dashboard">Dashboard</Link>
                                <span className="mx-2 text-slate-800">/</span>
                            </li>
                            <li className="text-sm text-blue-500">
                                {mode === 'edit' ? 'Edit Post' : 'Create Post'}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Excerpt <span className="text-red-500">*</span>
                                <span className="text-gray-500 font-normal ml-2">
                                    ({255 - formData.excerpt.length} characters remaining)
                                </span>
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                rows="3"
                                maxLength="255"
                                placeholder="Enter a short description of your post (max 255 characters)"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Select
                                    options={categoryOptions}
                                    onChange={handleCategoryChange}
                                    value={selectedCategory}
                                    styles={customStyles}
                                    isClearable
                                    isSearchable
                                    placeholder="Select or search a category..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryDialog(true)}
                                    className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                                >
                                    + Add New Category
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Featured Image <span className="text-red-500">*</span>
                            </label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
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

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <div className="border rounded-lg">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    modules={modules}
                                    style={{ height: '500px', marginBottom: '50px' }}
                                    className="resize-y"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-20">
                            <Link
                                to="/dashboard"
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                {mode === 'edit' ? 'Update Post' : 'Create Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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
        </>
    );
};

export default PostForm;
