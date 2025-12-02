import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase, { getServices } from '../services/supabaseClient';
import ImageUpload from '../components/common/ImageUpload';

const PostTask = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        due_date: '',
        category_id: '',
        location: '',
        description: '',
        image_urls: [],
        budget_amount: '',
        urgency: 'flexible',
        budget_type: 'fixed' // Default to fixed
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/post' } });
        }

        const loadServices = async () => {
            try {
                const data = await getServices();
                setServices(data);
            } catch (error) {
                console.error("Error loading services:", error);
            }
        };

        loadServices();
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageUpload = (urls) => {
        setFormData(prev => ({ ...prev, image_urls: [...prev.image_urls, ...urls] }));
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.title.trim()) newErrors.title = 'Title is required';
            if (!formData.due_date) newErrors.due_date = 'Date is required';
            // Basic date validation
            if (formData.due_date && new Date(formData.due_date) < new Date().setHours(0, 0, 0, 0)) {
                newErrors.due_date = 'Date cannot be in the past';
            }
        } else if (currentStep === 2) {
            if (!formData.category_id) newErrors.category_id = 'Category is required';
        } else if (currentStep === 3) {
            if (!formData.location.trim()) newErrors.location = 'Location is required';
        } else if (currentStep === 4) {
            if (!formData.description.trim()) newErrors.description = 'Description is required';
            if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
        } else if (currentStep === 5) {
            if (!formData.budget_amount || isNaN(formData.budget_amount) || Number(formData.budget_amount) <= 0) {
                newErrors.budget_amount = 'Valid budget is required';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(step)) return;

        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase.from('tasks').insert([{
                user_id: user.id,
                title: formData.title,
                description: formData.description,
                location_id: null, // We need to handle location properly, for now storing in description or separate field if schema allows? 
                // Wait, schema has location_id referencing locations table. 
                // For MVP/this task, we might need to create a location record first or just skip if complex.
                // Let's check schema again. tasks has location_id. locations table has address, city etc.
                // To keep it simple for now, I will assume we might need to insert into locations first.
                // OR, if the user just wants a string location, I might need to check if 'tasks' has a text location field.
                // Schema says: location_id bigint.
                // Let's create a location record first.

                category_id: formData.category_id,
                budget_amount: formData.budget_amount,
                budget_type: formData.budget_type,
                due_date: formData.due_date,
                status: 'open',
                urgency: formData.urgency,
                image_urls: formData.image_urls
            }]);

            // Wait, I need to handle the location insert.
            // Let's do a quick insert into locations table.
            const { data: locationData, error: locationError } = await supabase.from('locations').insert([
                { user_id: user.id, address: formData.location }
            ]).select().single();

            if (locationError) throw locationError;

            const { error: taskError } = await supabase.from('tasks').insert([{
                user_id: user.id,
                title: formData.title,
                description: formData.description,
                location_id: locationData.id,
                category_id: formData.category_id,
                budget_amount: formData.budget_amount,
                budget_type: formData.budget_type,
                due_date: formData.due_date,
                status: 'open',
                urgency: formData.urgency,
                image_urls: formData.image_urls
            }]);

            if (taskError) throw taskError;

            setMessage("Task posted successfully!");
            setTimeout(() => {
                navigate('/tasks');
            }, 1500);
        } catch (error) {
            console.error("Error posting task:", error);
            setMessage("An error occurred: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // UI Components for each step
    const renderStep1 = () => (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Let's start with the basics</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">In a few words, what do you need done?</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Help move my sofa"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">When do you need this done?</label>
                <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.due_date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Select a Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map(service => (
                    <button
                        key={service.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category_id: service.id }))}
                        className={`p-4 border rounded-lg text-center transition-all hover:shadow-md ${formData.category_id === service.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200'}`}
                    >
                        <span className="block font-medium">{service.name}</span>
                    </button>
                ))}
            </div>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Where is the task located?</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter address or suburb"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Tell us the details</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe your task in detail..."
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Images (Optional)</label>
                <ImageUpload onUpload={handleImageUpload} />
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">Budget & Priority</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Type</label>
                <div className="flex gap-4 mb-3">
                    {['fixed', 'hourly'].map(type => (
                        <label key={type} className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all ${formData.budget_type === type ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200'}`}>
                            <input
                                type="radio"
                                name="budget_type"
                                value={type}
                                checked={formData.budget_type === type}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <div className="text-center capitalize font-medium">{type} Price</div>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What is your budget?</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">R</span>
                    <input
                        type="number"
                        name="budget_amount"
                        value={formData.budget_amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.budget_amount ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </div>
                {errors.budget_amount && <p className="text-red-500 text-sm mt-1">{errors.budget_amount}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                <div className="flex gap-4">
                    {['flexible', 'urgent'].map(type => (
                        <label key={type} className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all ${formData.urgency === type ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200'}`}>
                            <input
                                type="radio"
                                name="urgency"
                                value={type}
                                checked={formData.urgency === type}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <div className="text-center capitalize font-medium">{type}</div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Step {step} of 5</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{Math.round((step / 5) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${(step / 5) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={(e) => e.preventDefault()}>
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                            {step === 4 && renderStep4()}
                            {step === 5 && renderStep5()}

                            <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                ) : (
                                    <div></div> // Spacer
                                )}

                                {step < 5 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className={`px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Posting...' : 'Post Task'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Side Navigation (Desktop only, optional based on design) */}
                <div className="hidden lg:block fixed left-10 top-1/2 transform -translate-y-1/2 space-y-4">
                    {['Title & Date', 'Category', 'Location', 'Details', 'Budget'].map((label, idx) => (
                        <div key={idx} className={`flex items-center space-x-3 ${step === idx + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === idx + 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                                {idx + 1}
                            </div>
                            <span className="font-medium">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostTask;

