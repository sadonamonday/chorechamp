import React from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const TaskListItem = ({ task, isSelected, onClick }) => {
    const statusColors = {
        pending: 'bg-green-100 text-green-800',
        assigned: 'bg-blue-100 text-blue-800',
        completed: 'bg-gray-100 text-gray-800'
    };

    const statusLabels = {
        pending: 'Open',
        assigned: 'Assigned',
        completed: 'Completed'
    };

    return (
        <div
            onClick={onClick}
            className={`p-4 border-b cursor-pointer transition-colors duration-200 ${isSelected
                    ? 'bg-blue-50 border-l-4 border-l-blue-600'
                    : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 flex-1">
                    {task.title || 'Untitled Task'}
                </h3>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColors[task.status] || 'bg-gray-100 text-gray-800'}`}>
                    {statusLabels[task.status] || 'Unknown'}
                </span>
            </div>

            <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center">
                    <FaMapMarkerAlt className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="truncate">{task.location || 'Location not specified'}</span>
                </div>

                {task.schedule_type && (
                    <div className="flex items-center">
                        <FaClock className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="capitalize">{task.schedule_type}</span>
                    </div>
                )}
            </div>

            <div className="mt-2">
                <span className="text-lg font-bold text-gray-900">
                    R{task.budget || task.price_per_hour || '0'}
                </span>
            </div>
        </div>
    );
};

export default TaskListItem;
