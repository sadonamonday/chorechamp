import React, { useEffect, useState } from 'react';
import TaskCard from '../../components/tasks/TaskCard';
import taskerService from '../utils/taskerService.js'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TaskerDashboard = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [myPostedTasks, setMyPostedTasks] = useState([]);
    const [myAcceptedTasks, setMyAcceptedTasks] = useState([]);
    const [activeTab, setActiveTab] = useState('available');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const allTasksResponse = await taskerService.getAllTasks();
            console.log("Fetched all tasks response:", allTasksResponse);

            if (Array.isArray(allTasksResponse?.tasks)) {
                setAllTasks(allTasksResponse.tasks.filter(task => task.status === 'pending'));
            } else if (Array.isArray(allTasksResponse)) {
                setAllTasks(allTasksResponse.filter(task => task.status === 'pending'));
            }

            const postedTasksResponse = await taskerService.getMyPostedTasks(user?.id);
            console.log("Fetched posted tasks response:", postedTasksResponse);

            if (Array.isArray(postedTasksResponse?.tasks)) {
                setMyPostedTasks(postedTasksResponse.tasks);
            } else if (Array.isArray(postedTasksResponse)) {
                setMyPostedTasks(postedTasksResponse);
            }

            const acceptedTasksResponse = await taskerService.getMyAcceptedTasks(user?.id);
            console.log("Fetched accepted tasks response:", acceptedTasksResponse);

            if (Array.isArray(acceptedTasksResponse?.tasks)) {
                setMyAcceptedTasks(acceptedTasksResponse.tasks);
            } else if (Array.isArray(acceptedTasksResponse)) {
                setMyAcceptedTasks(acceptedTasksResponse);
            }

        } catch (error) {
            console.error("Error fetching tasks:", error);
            setAllTasks([]);
            setMyPostedTasks([]);
            setMyAcceptedTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptTask = async (taskId) => {
        try {
            const response = await taskerService.acceptTask(taskId, user?.id);
            console.log("Task acceptance response:", response);

            await fetchAllData();

            alert("Task accepted successfully!");

        } catch (error) {
            console.error("Error accepting task:", error);
            alert("Failed to accept task. Please try again.");
        }
    };

    const renderTasks = () => {
        let tasksToShow = [];
        let emptyMessage = "";

        switch (activeTab) {
            case 'available':
                tasksToShow = allTasks;
                emptyMessage = "No available tasks found.";
                break;
            case 'posted':
                tasksToShow = myPostedTasks;
                emptyMessage = "You haven't posted any tasks yet.";
                break;
            case 'accepted':
                tasksToShow = myAcceptedTasks;
                emptyMessage = "You haven't accepted any tasks yet.";
                break;
            default:
                tasksToShow = [];
        }

        if (loading) {
            return <div className="text-center py-8">Loading tasks...</div>;
        }

        if (tasksToShow.length === 0) {
            return <div className="text-center py-8 text-gray-600">{emptyMessage}</div>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasksToShow.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onAccept={activeTab === 'available' ? handleAcceptTask : null}
                        onClick={() => navigate(`/tasker/task/${task.id}`)}
                        actionLabel={activeTab === 'available' ? "Accept Task" : "View Details"}
                        showAcceptButton={activeTab === 'available'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Tasker Dashboard</h1>

            <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                            activeTab === 'available'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Available Tasks ({allTasks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('posted')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                            activeTab === 'posted'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        My Posted Tasks ({myPostedTasks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('accepted')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                            activeTab === 'accepted'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        My Accepted Tasks ({myAcceptedTasks.length})
                    </button>
                </div>
            </div>


            {renderTasks()}
        </div>
    );
};

export default TaskerDashboard;
