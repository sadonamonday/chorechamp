import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import supabase from '../../services/supabaseClient';

const TaskList = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);

            // Join with task_categories to get category details
            const { data, error } = await supabase
                .from('tasks')
                .select('*, task_categories(name)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map data to include category name directly
            const mappedData = data?.map(task => ({
                ...task,
                category: task.task_categories?.name
            })) || [];

            setTasks(mappedData);
        } catch (error) {
            setError("Failed to fetch tasks. Please try again later.");
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const acceptTask = async (taskId) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('tasks')
                .update({
                    status: 'assigned',
                    assigned_worker_id: user.id
                })
                .eq('id', taskId);

            if (error) throw error;

            fetchTasks();
        } catch (err) {
            console.error("Error accepting task:", err);
        }
    };

    const filteredTasks = tasks
        .filter(task => {
            if (filter === "all") return true;
            return task.status === filter;
        })
        .filter(task =>
            task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto mt-8 px-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto mt-8 px-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Available Tasks</h2>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-full w-full md:w-40 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Tasks</option>
                            <option value="open">Open</option>
                            <option value="assigned">Assigned</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No tasks found
                    </h3>
                    <p className="text-gray-500">
                        {searchTerm
                            ? "Try adjusting your search terms"
                            : "There are no tasks available at the moment"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            currentUserId={user?.id}
                            onTaskAccepted={acceptTask}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;
