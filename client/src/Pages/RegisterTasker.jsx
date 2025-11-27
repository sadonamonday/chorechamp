import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterTasker = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        skills: '',
        hourly_rate: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
        if (!formData.hourly_rate) newErrors.hourly_rate = 'Hourly rate is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await register(
                formData.username,
                formData.email,
                formData.password,
                'tasker',
                {
                    phone: formData.phone,
                    skills: formData.skills,
                    hourly_rate: parseFloat(formData.hourly_rate)
                }
            );

            if (result.success) {
                setMessage('Registration successful! Redirecting...');
                setTimeout(() => navigate('/tasker/dashboard'), 1500);
            } else {
                setMessage(result.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Join as a Tasker
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Earn money by completing tasks
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    {message && (
                        <div className={`mb-6 p-4 rounded-md ${message.includes('successful') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 0123456789" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Cleaning, Plumbing" />
                            {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (R)</label>
                            <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. 50" />
                            {errors.hourly_rate && <p className="text-red-500 text-xs mt-1">{errors.hourly_rate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Tasker Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/register" className="text-sm text-blue-600 hover:text-blue-500">
                            Back to selection
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterTasker;
