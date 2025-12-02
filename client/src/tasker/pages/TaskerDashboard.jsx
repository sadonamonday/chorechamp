import React, { useEffect, useState } from 'react';
import TaskCard from '../../components/tasks/TaskCard';
import taskerService from '../utils/taskerService.js'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AvailableTasksList from '../components/AvailableTasksList';
import VerificationUpload from '../../components/VerificationUpload';
import supabase from '../../services/supabaseClient';


const TaskerDashboard = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [myPostedTasks, setMyPostedTasks] = useState([]);
    const [myAcceptedTasks, setMyAcceptedTasks] = useState([]);
    const [offersReceived, setOffersReceived] = useState([]);
    const [activeTab, setActiveTab] = useState('available');
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const allTasksResponse = await taskerService.getAllTasks();
            console.log("Fetched all tasks response:", allTasksResponse);

            if (Array.isArray(allTasksResponse?.tasks)) {
                setAllTasks(allTasksResponse.tasks.filter(task => task.status === 'open'));
            } else if (Array.isArray(allTasksResponse)) {
                setAllTasks(allTasksResponse.filter(task => task.status === 'open'));
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

            // Fetch offers received on my posted tasks
            if (user?.id) {
                // First, get all task IDs for tasks posted by the current user
                const { data: userTasks } = await supabase
                    .from('tasks')
                    .select('id')
                    .eq('user_id', user.id);

                const taskIds = userTasks?.map(t => t.id) || [];

                if (taskIds.length > 0) {
                    // Then fetch offers for those tasks
                    const { data: offers, error: offersError } = await supabase
                        .from('task_offers')
                        .select(`
                            *,
                            tasks:task_id (
                                id,
                                title,
                                budget_amount,
                                status
                            ),
                            profiles:tasker_id (
                                id,
                                name,
                                profile_photo,
                                rating
                            )
                        `)
                        .in('task_id', taskIds)
                        .order('created_at', { ascending: false });

                    if (offersError) {
                        console.error("Error fetching offers:", offersError);
                        setOffersReceived([]);
                    } else {
                        console.log("Fetched offers received:", offers);
                        setOffersReceived(offers || []);
                    }
                } else {
                    setOffersReceived([]);
                }
            }

            // Fetch verification status
            if (user?.id) {
                const { data: verification } = await supabase
                    .from('verifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                setVerificationStatus(verification);
            }

        } catch (error) {
            console.error("Error fetching tasks:", error);
            setAllTasks([]);
            setMyPostedTasks([]);
            setMyAcceptedTasks([]);
            setOffersReceived([]);
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

    const handleDeleteTask = async (taskId) => {
        try {
            await taskerService.deleteTask(taskId, user?.id);
            // Refresh the task lists
            fetchAllData();
            alert("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        }
    };

    const renderTasks = () => {
        let tasksToShow = [];
        let emptyMessage = "";

        if (activeTab === 'verification') {
            if (!verificationStatus) {
                return <VerificationUpload onVerificationSubmitted={fetchAllData} />;
            }

            return (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Verification Status</h2>
                    <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold mb-4 ${verificationStatus.status === 'approved' ? 'bg-green-100 text-green-800' :
                        verificationStatus.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {verificationStatus.status.charAt(0).toUpperCase() + verificationStatus.status.slice(1)}
                    </div>

                    {verificationStatus.status === 'pending' && (
                        <p className="text-gray-600">
                            Your documents have been submitted and are currently under review.
                            This process usually takes 24-48 hours.
                        </p>
                    )}

                    {verificationStatus.status === 'approved' && (
                        <p className="text-gray-600">
                            Congratulations! Your identity has been verified. You can now accept tasks with the verified badge.
                        </p>
                    )}

                    {verificationStatus.status === 'rejected' && (
                        <div className="text-left max-w-md mx-auto mt-4">
                            <p className="text-red-600 mb-4">
                                Unfortunately, your verification was rejected.
                                {verificationStatus.admin_notes && (
                                    <span className="block mt-2 font-medium">Reason: {verificationStatus.admin_notes}</span>
                                )}
                            </p>
                            <button
                                onClick={() => setVerificationStatus(null)}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            );
        }

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
            case 'offers_received':
                // Offers will be rendered separately below
                break;
            default:
                tasksToShow = [];
        }

        if (loading) {
            return <div className="text-center py-8">Loading tasks...</div>;
        }

        // Render Offers Received
        if (activeTab === 'offers_received') {
            if (offersReceived.length === 0) {
                return <div className="text-center py-8 text-gray-600">You haven't received any offers yet.</div>;
            }

            return (
                <div className="space-y-4">
                    {offersReceived.map(offer => (
                        <div key={offer.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {offer.tasks?.title || 'Task'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Task Budget: R{offer.tasks?.budget_amount || 0}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                </div>
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                                    {offer.profiles?.name?.charAt(0).toUpperCase() || 'T'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{offer.profiles?.name || 'Tasker'}</p>
                                    <p className="text-sm text-gray-500">
                                        Rating: {offer.profiles?.rating ? `${offer.profiles.rating}/5` : 'No rating yet'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600">Offer Price</p>
                                    <p className="text-xl font-bold text-blue-600">R{offer.price}</p>
                                </div>
                                {offer.estimated_hours && (
                                    <div>
                                        <p className="text-sm text-gray-600">Estimated Hours</p>
                                        <p className="text-lg font-semibold text-gray-900">{offer.estimated_hours}h</p>
                                    </div>
                                )}
                            </div>

                            {offer.message && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Message</p>
                                    <p className="text-gray-800 bg-gray-50 p-3 rounded">{offer.message}</p>
                                </div>
                            )}

                            {offer.available_from && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">Available From</p>
                                    <p className="text-gray-800">{new Date(offer.available_from).toLocaleDateString()}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                                <span>Submitted: {new Date(offer.created_at).toLocaleDateString()}</span>
                                {offer.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                                            Accept
                                        </button>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Use new split-view layout for Available Tasks
        if (activeTab === 'available') {
            if (tasksToShow.length === 0) {
                return <div className="text-center py-8 text-gray-600">{emptyMessage}</div>;
            }
            return (
                <AvailableTasksList
                    tasks={tasksToShow}
                    onAcceptTask={handleAcceptTask}
                    currentUserId={user?.id}
                />
            );
        }

        // Use grid layout for other tabs
        if (tasksToShow.length === 0) {
            return <div className="text-center py-8 text-gray-600">{emptyMessage}</div>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasksToShow.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        currentUserId={user?.id}
                        onTaskAccepted={activeTab === 'available' ? handleAcceptTask : null}
                        onViewDetails={() => navigate(`/tasker/task/${task.id}`)}
                        onTaskDeleted={handleDeleteTask}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Tasker Dashboard</h1>

            <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 whitespace-nowrap ${activeTab === 'available'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Available Tasks ({allTasks?.length ?? 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('posted')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 whitespace-nowrap ${activeTab === 'posted'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        My Posted Tasks ({myPostedTasks?.length ?? 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('accepted')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 whitespace-nowrap ${activeTab === 'accepted'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        My Accepted Tasks ({myAcceptedTasks?.length ?? 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('offers_received')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 whitespace-nowrap ${activeTab === 'offers_received'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Offers Received ({offersReceived?.length ?? 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('verification')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 whitespace-nowrap ${activeTab === 'verification'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Verification {verificationStatus && verificationStatus.status !== 'approved' && '⚠️'}
                    </button>
                </div>
            </div>


            {renderTasks()}
        </div>
    );
};

export default TaskerDashboard;
