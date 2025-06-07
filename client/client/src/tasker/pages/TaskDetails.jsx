// /src/tasker/pages/TaskDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import taskerService from '../utils/taskerService.js';

const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await taskerService.getTaskById(id);
                setTask(data);
            } catch (err) {
                setError('Failed to load task details.');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleAccept = () => {
        alert('Task accepted (mocked)');
        // You can POST to a task-accept endpoint here
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

            <button
                onClick={handleAccept}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded transition duration-300 shadow-md"
            >
                Accept Task
            </button>
        </div>
    );
};

export default TaskDetails;
