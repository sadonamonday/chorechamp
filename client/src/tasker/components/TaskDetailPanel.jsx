import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaUser, FaEllipsisH, FaFlag } from 'react-icons/fa';
import { format } from 'date-fns';

const TaskDetailPanel = ({ task, onAcceptTask, currentUserId }) => {
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);

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

    const handleAcceptTask = async () => {
        if (!currentUserId) {
            alert("Please log in to accept tasks");
            return;
        }

        if (!window.confirm("Are you sure you want to accept this task?")) {
            return;
        }

        setIsAccepting(true);
        try {
            await onAcceptTask(task.id);
        } catch (error) {
            console.error('Error accepting task:', error);
        } finally {
            setIsAccepting(false);
        }
    };

    const canAcceptTask = task.status === "pending" &&
        String(task.created_by) !== String(currentUserId);

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

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {canAcceptTask && (
                        <button
                            onClick={handleAcceptTask}
                            disabled={isAccepting}
                            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-colors ${isAccepting
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            {isAccepting ? 'Accepting...' : 'Make an offer'}
                        </button>
                    )}
                    {!canAcceptTask && task.status === 'pending' && (
                        <div className="flex-1 py-3 px-6 rounded-full font-semibold bg-gray-200 text-gray-600 text-center">
                            Your Task
                        </div>
                    )}
                    {task.status !== 'pending' && (
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
                {canAcceptTask && (
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
        </div>
    );
};

export default TaskDetailPanel;
