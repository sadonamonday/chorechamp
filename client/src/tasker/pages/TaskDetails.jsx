// /src/tasker/pages/TaskDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskerService from '../utils/taskerService.js';
import chatService from '../../services/chatService.js';
import { useAuth } from '../../context/AuthContext';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await taskerService.getTaskById(id);
                setTask(data);
                // Check if the task is already accepted by this user
                if (data.status === 'accepted' && data.accepted_by === user?.id) {
                    setIsAccepted(true);
                }
            } catch (err) {
                setError('Failed to load task details.');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id, user?.id]);

    const handleAccept = async () => {
        if (!user) {
            alert('Please log in to accept tasks');
            return;
        }

        if (!window.confirm("Are you sure you want to accept this task?")) {
            return;
        }

        setIsAccepting(true);

        try {
            const result = await taskerService.acceptTask(id, user.id);
            if (result.success) {
                setIsAccepted(true);
                // Update the task data with the latest information
                const updatedTask = await taskerService.getTaskById(id);
                setTask(updatedTask);
                alert('Task accepted successfully!');
            } else {
                alert(`Error: ${result.message || 'Could not accept the task.'}`);
            }
        } catch (error) {
            console.error('Failed to accept task:', error);
            alert('An error occurred while accepting the task. Please try again.');
        } finally {
            setIsAccepting(false);
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;
    if (!task) return <p className="p-4">No task found.</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
            <p className="text-gray-700 mb-2"><strong>Description:</strong> {task.description}</p>
            <p className="text-gray-700 mb-2"><strong>Category:</strong> {task.category}</p>
            <p className="text-gray-700 mb-2"><strong>Location:</strong> {task.location}</p>
            <p className="text-gray-700 mb-2"><strong>Budget:</strong> R{task.budget}</p>
            <p className="text-gray-700 mb-2"><strong>Date:</strong> {task.date}</p>

            {/* Show phone number only if the task is accepted by the current user */}
            {isAccepted && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Contact Information</h3>
                    <p className="text-gray-700 mb-1">
                        <strong>Phone Number:</strong> {task.poster_phone || task.phone_number || "Not provided"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        You can now contact the task poster directly to discuss details.
                    </p>
                </div>
            )}

            {/* Only show the Accept button if the task is pending and not created by the current user */}
            {task.status === 'pending' && task.created_by !== user?.id && !isAccepted && (
                <button
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className={`mt-6 ${isAccepting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                        } text-white font-semibold px-6 py-3 rounded transition duration-300 shadow-md`}
                >
                    {isAccepting ? 'Accepting...' : 'Accept Task'}
                </button>
            )}

            {/* Show a message if the task is already accepted */}
            {task.status === 'accepted' && !isAccepted && (
                <p className="mt-6 text-yellow-600 font-medium">
                    This task has already been accepted by someone else.
                </p>
            )}

            {/* Show a message if this is the user's own task */}
            {task.created_by === user?.id && (
                <p className="mt-6 text-blue-600 font-medium">
                    This is your task. You cannot accept your own task.
                </p>
            )}

            {/* Message Button */}
            {user && task.created_by !== user.id && (
                <button
                    onClick={async () => {
                        try {
                            // Assuming we have a chatService.createConversation method
                            // We need to import chatService and useNavigate
                            const conversation = await chatService.createConversation(user.id, task.created_by, task.id);
                            navigate('/messages');
                        } catch (error) {
                            console.error('Failed to start conversation:', error);
                            alert('Failed to start conversation');
                        }
                    }}
                    className="mt-4 ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded transition duration-300 shadow-md"
                >
                    Message Poster
                </button>
            )}
        </div>
    );
};

export default TaskDetails;
