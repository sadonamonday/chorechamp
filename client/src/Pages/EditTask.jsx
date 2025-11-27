import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskerService from '../tasker/utils/taskerService';
import { useAuth } from '../context/AuthContext';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        budget: '',
        category: ''
    });

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const taskData = await taskerService.getTaskById(id);
                
                // Check if the current user is the task owner
                if (String(taskData.created_by) !== String(user?.id)) {
                    setError("You don't have permission to edit this task");
                    return;
                }
                
                setFormData({
                    title: taskData.title || '',
                    description: taskData.description || '',
                    location: taskData.location || '',
                    budget: taskData.budget || '',
                    category: taskData.category || ''
                });
            } catch (err) {
                setError('Failed to load task details.');
            } finally {
                setLoading(false);
            }
        };
        
        if (user) {
            fetchTask();
        } else {
            setError("Please log in to edit tasks");
            setLoading(false);
        }
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            await taskerService.updateTask({
                id: id,
                ...formData
            }, user?.id);
            
            alert("Task updated successfully!");
            navigate('/tasker/dashboard');
        } catch (error) {
            console.error("Error updating task:", error);
            setError("Failed to update task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Task</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        rows="4"
                        required
                    ></textarea>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Budget (R)</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Gardening">Gardening</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition duration-300 shadow-md"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Task'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/tasker/dashboard')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded transition duration-300 shadow-md"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTask;