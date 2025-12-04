import React, { useState } from "react";
import { format } from 'date-fns';
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaUser, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabaseClient';

const TaskCard = ({ task, onTaskAccepted, onViewDetails, currentUserId, onTaskDeleted, onTaskUpdated, isAdmin = false }) => {
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const statusColors = {
        open: 'bg-yellow-100 text-yellow-800',
        assigned: 'bg-green-100 text-green-800',
        in_progress: 'bg-blue-100 text-blue-800',
        completed: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const handleAcceptClick = async (e) => {
        e.stopPropagation();
        if (!currentUserId) {
            alert("Please log in to accept tasks");
            return;
        }

        if (!window.confirm("Are you sure you want to accept this task?")) {
            return;
        }

        setIsAccepting(true);

        try {
            // Delegate to parent component
            if (onTaskAccepted) {
                await onTaskAccepted(task.id);
            }
        } catch (error) {
            console.error('Failed to accept task:', error);
            alert('An error occurred while accepting the task.');
        } finally {
            setIsAccepting(false);
        }
    };

    // Handle task deletion
    const handleDeleteClick = async (e) => {
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        setIsDeleting(true);

        try {
            // Delegate to parent component
            if (onTaskDeleted) {
                await onTaskDeleted(task.id);
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("An error occurred while deleting the task.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle task edit
    const handleEditClick = (e) => {
        e.stopPropagation();
        navigate(`/edit-task/${task.id}`);
    };

    const handleCardClick = () => {
        if (onViewDetails) {
            onViewDetails(task);
        }
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'No date';
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid date';
        }
    };

    const canAcceptTask = task.status === "open" &&
        String(task.user_id) !== String(currentUserId) &&
        !isAccepting;

    const isTaskOwner = String(task.user_id) === String(currentUserId) || isAdmin;

    return (
        <div
            className="border rounded-xl p-6 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 relative overflow-hidden cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 transform rotate-45 bg-blue-600 opacity-10"></div>

            <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-200">
                {task.title || 'Untitled Task'}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-2">
                {task.description || 'No description available'}
            </p>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                    <FaUser className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">{task.created_by || task.poster_name || 'Unknown'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">{task.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FaMoneyBillWave className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">
                        R{task.budget || task.budget_amount || '0'}{task.budget_type === 'hourly' ? '/hr' : ''}
                    </span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FaClock className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">
                        {formatDate(task.created_at)}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || 'bg-gray-100 text-gray-800'}`}>
                    {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'Unknown'}
                </span>

                <div className="flex items-center space-x-2">
                    {/* Edit and Delete buttons for task owner */}
                    {isTaskOwner && (
                        <>
                            <button
                                onClick={handleEditClick}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full text-sm transition-colors duration-200 z-10"
                                title="Edit task"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                disabled={isDeleting}
                                className={`${isDeleting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                                    } text-white p-2 rounded-full text-sm transition-colors duration-200 z-10`}
                                title="Delete task"
                            >
                                {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                            </button>
                        </>
                    )}

                    {/* Accept button for non-owners */}
                    {canAcceptTask && (
                        <button
                            onClick={handleAcceptClick}
                            disabled={isAccepting}
                            className={`${isAccepting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                                } text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10 flex items-center space-x-2`}
                        >
                            {isAccepting && <FaSpinner className="animate-spin" />}
                            <span>{isAccepting ? 'Accepting...' : 'Accept Task'}</span>
                        </button>
                    )}

                    {/* "Your task" label for open tasks owned by current user */}
                    {task.status === "open" && isTaskOwner && !isDeleting && (
                        <span className="text-xs text-gray-500 italic">Your task</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
