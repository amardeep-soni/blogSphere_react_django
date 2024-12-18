import React, { useState } from 'react';
import apiClient from './ApiClient';
import { formatCategoryForDB } from '../utils/formatters';

const CreateCategoryDialog = ({ isOpen, onClose, onCategoryCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const processedFormData = {
                ...formData,
                name: formatCategoryForDB(formData.name)
            };

            const response = await apiClient.post('/category/', processedFormData);
            if (response.status === 201) {
                onCategoryCreated();
                setFormData({ name: '', description: '' });
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create New Category</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            rows="4"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Create Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategoryDialog;
