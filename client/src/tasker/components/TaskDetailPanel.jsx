import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaUser, FaEllipsisH, FaFlag, FaHourglass } from 'react-icons/fa';
import { format } from 'date-fns';
import supabase from '../../services/supabaseClient';
import OfferModal from './OfferModal';

const TaskDetailPanel = ({ task, onAcceptTask, currentUserId }) => {
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerSuccess, setOfferSuccess] = useState(false);

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-lg font-medium">Select a task to view details</p>
                <p className="text-sm mt-2">Click on any task from the list to see more information</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'No date';
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid date';
        }
    };

    const handleSubmitOffer = async (offerData) => {
        if (!currentUserId) {
            throw new Error("Please log in to make offers");
        }

        const { error } = await supabase
            .from('task_offers')
            .insert([{
                task_id: offerData.task_id,
                tasker_id: currentUserId,
                price: offerData.price,
                message: offerData.message,
                estimated_hours: offerData.estimated_hours,
                available_from: offerData.available_from,
                status: 'pending'
            }]);

        if (error) {
            throw new Error(error.message || 'Failed to submit offer');
        }

        setOfferSuccess(true);
        setTimeout(() => setOfferSuccess(false), 5000);
    };

    const canMakeOffer = task.status === "open" &&
        String(task.user_id) !== String(currentUserId);

    const isTaskExpired = task.expires_at && new Date(task.expires_at) < new Date();

    const openMap = () => {
        if (task.location) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`, '_blank');
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-white">
            {/* Header with Budget */}
            <div className="border-b p-6 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-sm text-gray-600 mb-1">TASK BUDGET</div>
                        <div className="text-4xl font-bold text-gray-900">
                            R{task.budget || task.price_per_hour || '0'}
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            title="More options"
                        >
                            <FaEllipsisH className="text-gray-600" />
                        </button>
                        {showMoreOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                <button
                                    onClick={() => {
                                        alert('Report functionality coming soon');
                                        setShowMoreOptions(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm text-gray-700"
                                >
                                    <FaFlag className="mr-2" />
                                    Report this task
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Success Message */}
                {offerSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">✓ Offer submitted successfully!</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {canMakeOffer && !isTaskExpired && (
                        <button
                            onClick={() => setShowOfferModal(true)}
                            className="flex-1 py-3 px-6 rounded-full font-semibold transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Make an offer
                        </button>
                    )}
                    {canMakeOffer && isTaskExpired && (
                        <div className="flex-1 py-3 px-6 rounded-full font-semibold bg-gray-200 text-gray-600 text-center">
                            Task Expired
                        </div>
                    )}
                    {!canMakeOffer && task.status === 'open' && (
                        <div className="flex-1 py-3 px-6 rounded-full font-semibold bg-gray-200 text-gray-600 text-center">
                            Your Task
                        </div>
                    )}
                    {task.status !== 'open' && (
                        <div className="flex-1 py-3 px-6 rounded-full font-semibold bg-gray-200 text-gray-600 text-center capitalize">
                            {task.status}
                        </div>
                    )}
                </div>
            </div>

            {/* Task Details */}
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {task.title || 'Untitled Task'}
                </h1>

                {/* Details Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Details</h2>

                    <div className="space-y-3">
                        {/* Location */}
                        <div className="flex items-start">
                            <FaMapMarkerAlt className="w-5 h-5 mr-3 text-gray-400 mt-1" />
                            <div className="flex-1">
                                <div className="text-sm text-gray-600">LOCATION</div>
                                <div className="font-medium text-gray-900">
                                    {task.location || 'Location not specified'}
                                </div>
                                {task.location && (
                                    <button
                                        onClick={openMap}
                                        className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                                    >
                                        View map
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="flex items-start">
                            <FaClock className="w-5 h-5 mr-3 text-gray-400 mt-1" />
                            <div className="flex-1">
                                <div className="text-sm text-gray-600">TO BE DONE ON</div>
                                <div className="font-medium text-gray-900 capitalize">
                                    {task.schedule_type || 'Flexible'}
                                </div>
                            </div>
                        </div>

                        {/* Posted By */}
                        <div className="flex items-start">
                            <FaUser className="w-5 h-5 mr-3 text-gray-400 mt-1" />
                            <div className="flex-1">
                                <div className="text-sm text-gray-600">POSTED BY</div>
                                <div className="font-medium text-gray-900">
                                    {task.poster_name || task.created_by || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {formatDate(task.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Expires At */}
                        {task.expires_at && (
                            <div className="flex items-start">
                                <FaHourglass className="w-5 h-5 mr-3 text-gray-400 mt-1" />
                                <div className="flex-1">
                                    <div className="text-sm text-gray-600">EXPIRES ON</div>
                                    <div className={`font-medium ${isTaskExpired ? 'text-red-600' : 'text-gray-900'}`}>
                                        {formatDate(task.expires_at)}
                                        {isTaskExpired && <span className="ml-2 text-sm">(Expired)</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {task.description || 'No description available'}
                    </p>
                </div>

                {/* Cancellation Policy */}
                {canMakeOffer && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Cancellation policy</h3>
                        <p className="text-sm text-gray-700">
                            If you are responsible for cancelling this task, a Cancellation Fee will be
                            deducted from your next payment payout.
                        </p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm mt-2 font-medium">
                            Learn more
                        </button>
                    </div>
                )}
            </div>

            {/* Offer Modal */}
            <OfferModal
                isOpen={showOfferModal}
                onClose={() => setShowOfferModal(false)}
                taskId={task.id}
                taskBudget={task.budget_amount}
                taskTitle={task.title}
                onSubmitOffer={handleSubmitOffer}
            />
        </div>
    );
};

export default TaskDetailPanel;
