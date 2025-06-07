import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostTask = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/post' } });
        }
    }, [user, navigate]);

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category: '',
        budget: '',
        deadline: '',
    });

    const categories = [
        'Cleaning',
        'Gardening',
        'Handyman',
        'Moving',
        'Painting',
        'Pet Care',
        'Other'
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.budget || isNaN(formData.budget)) {
            newErrors.budget = 'Valid price is required';
        }
        if (!formData.deadline) newErrors.deadline = 'Deadline is required';

        const deadlineDate = new Date(formData.deadline);
        if (deadlineDate <= new Date()) {
            newErrors.deadline = 'Deadline must be in the future';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) return;

        try {
            const response = await axios.post("http://localhost/chorchamp-server/api/tasks/postTask.php", {
                ...formData,
                created_by: user.id, // Use the authenticated user's ID
            });

            if (response.data.success) {
                setMessage("Task posted successfully!");
                navigate('/tasks'); // Redirect to tasks page
            } else {
                setMessage(response.data.message || "Failed to post task.");
            }
        } catch (error) {
            console.error("Error posting task:", error);
            setMessage("An error occurred while posting the task.");
        }

    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Post a Task</h2>

            {message && <p className="mb-4 text-red-500">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Task Title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                    <textarea
                        name="description"
                        placeholder="Task Description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
                        rows="4"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.location ? 'border-red-500' : ''}`}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                    <input
                        type="number"
                        name="budget"
                        placeholder="Price per Hour (R)"
                        value={formData.budget}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`w-full p-2 border rounded ${errors.budget ? 'border-red-500' : ''}`}
                    />
                    {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                </div>

                <div>
                    <input
                        type="datetime-local"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded ${errors.deadline ? 'border-red-500' : ''}`}
                    />
                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Post Task
                </button>
            </form>
        </div>
    );
};

export default PostTask;
