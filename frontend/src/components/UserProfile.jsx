import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from './ApiClient';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        photo: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        if (!username) {
            navigate('/login');
            return;
        }
        fetchUserProfile();
    }, [username]);

    const fetchUserProfile = async () => {
        try {
            const response = await apiClient.get(`/users/${username}/`);
            setProfile(response.data);
            setFormData({
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                bio: response.data.bio,
                photo: null
            });
            setPhotoPreview(response.data.photo);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.warning('Image size should be less than 5MB');
                return;
            }
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
            setFormData(prev => ({
                ...prev,
                photo: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            data.append('first_name', formData.first_name);
            data.append('last_name', formData.last_name);
            data.append('bio', formData.bio);

            if (formData.photo instanceof File) {
                data.append('photo', formData.photo);
            }

            const response = await apiClient.put(`/users/${username}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data) {
                setProfile(response.data);
                setPhotoPreview(response.data.photo);
                
                const profileUpdateEvent = new CustomEvent('profileUpdate', {
                    detail: response.data
                });
                window.dispatchEvent(profileUpdateEvent);
                
                toast.success('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Your Profile
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Manage your personal information
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-80"
                >
                    {/* Profile Content */}
                    <div className="space-y-8">
                        {/* Profile Photo */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <img
                                    src={photoPreview || profile.photo || '/default-avatar.png'}
                                    alt={profile.username}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-md cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Rest of profile content */}
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                    >
                                        Edit Profile
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">First Name</h3>
                                        <p className="text-lg text-gray-900">{profile.first_name}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Last Name</h3>
                                        <p className="text-lg text-gray-900">{profile.last_name}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                                    <p className="text-lg text-gray-900">{profile.bio || 'No bio added yet.'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
