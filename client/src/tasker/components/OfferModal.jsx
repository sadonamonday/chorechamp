import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const OfferModal = ({ isOpen, onClose, taskId, taskBudget, taskTitle, onSubmitOffer }) => {
    const [formData, setFormData] = useState({
        price: taskBudget || '',
        message: '',
        estimated_hours: '',
        available_from: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = 'Please enter a valid price';
        }

        if (formData.message && formData.message.length > 500) {
            newErrors.message = 'Message must be 500 characters or less';
        }

        if (formData.estimated_hours && (isNaN(formData.estimated_hours) || Number(formData.estimated_hours) <= 0)) {
            newErrors.estimated_hours = 'Please enter valid hours';
        }

        if (formData.available_from && new Date(formData.available_from) < new Date()) {
            newErrors.available_from = 'Date must be in the future';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmitOffer({
                task_id: taskId,
                price: Number(formData.price),
                message: formData.message || null,
                estimated_hours: formData.estimated_hours ? Number(formData.estimated_hours) : null,
                available_from: formData.available_from || null
            });

            // Reset form
            setFormData({
                price: taskBudget || '',
                message: '',
                estimated_hours: '',
                available_from: ''
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error submitting offer:', error);
            setErrors({ submit: error.message || 'Failed to submit offer' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Make an Offer</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        type="button"
                    >
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                {/* Task Info */}
                <div className="px-6 pt-4 pb-2 bg-gray-50 border-b">
                    <p className="text-sm text-gray-600 mb-1">Task</p>
                    <p className="font-semibold text-gray-900">{taskTitle}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Offer Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">R</span>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                className={`w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        {taskBudget && (
                            <p className="text-xs text-gray-500 mt-1">Task budget: R{taskBudget}</p>
                        )}
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message (Optional)
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tell the customer why you're the best fit for this task..."
                            maxLength="500"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                            <p className="text-xs text-gray-500 ml-auto">{formData.message.length}/500</p>
                        </div>
                    </div>

                    {/* Estimated Hours */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estimated Hours (Optional)
                        </label>
                        <input
                            type="number"
                            name="estimated_hours"
                            value={formData.estimated_hours}
                            onChange={handleChange}
                            placeholder="e.g., 2.5"
                            step="0.5"
                            min="0"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.estimated_hours ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.estimated_hours && <p className="text-red-500 text-sm mt-1">{errors.estimated_hours}</p>}
                    </div>

                    {/* Available From */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Available From (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            name="available_from"
                            value={formData.available_from}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.available_from ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.available_from && <p className="text-red-500 text-sm mt-1">{errors.available_from}</p>}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-colors ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfferModal;
