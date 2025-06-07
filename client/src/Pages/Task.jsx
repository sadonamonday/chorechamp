import React, { useEffect, useState } from "react";
import TaskCard from "../components/tasks/TaskCard";
import { useAuth } from '../context/AuthContext.jsx';

const Task = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        status: "",
        priceRange: "all"
    });

    const handleTaskAccepted = (taskId, updatedTask) => {
        setTasks(prevTasks => 
            prevTasks.map(task => task.id === taskId ? updatedTask : task)
        );
    };

    const handleViewDetails = (task) => {
        console.log("Viewing details for task:", task);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost/chorchamp-server/api/tasks/getTasks.php");
            const data = await response.json();
            if (Array.isArray(data.data)) {
                setTasks(data.data);
            } else {
                console.error("Expected array but got:", data);
                setTasks([]);
            }
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                            task.description.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = !filters.category || task.category === filters.category;
        const matchesStatus = !filters.status || task.status === filters.status;
        const matchesPriceRange = filters.priceRange === "all" ||
            (filters.priceRange === "under50" && task.price_per_hour < 50) ||
            (filters.priceRange === "50to100" && task.price_per_hour >= 50 && task.price_per_hour <= 100) ||
            (filters.priceRange === "over100" && task.price_per_hour > 100);

        return matchesSearch && matchesCategory && matchesStatus && matchesPriceRange;
    });

    const categories = [...new Set(tasks.map(task => task.category))];

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            {/* Your existing code */}

            {!user && (
                <div className="bg-yellow-100 p-4 mb-4 rounded text-yellow-800">
                    Please log in to accept tasks.
                </div>
            )}

            <div className="mb-6 space-y-4">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full p-2 border rounded"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        className="p-2 border rounded"
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select
                        className="p-2 border rounded"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        className="p-2 border rounded"
                        value={filters.priceRange}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    >
                        <option value="all">All Prices</option>
                        <option value="under50">Under R50/hr</option>
                        <option value="50to100">R50-R100/hr</option>
                        <option value="over100">Over R100/hr</option>
                    </select>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Latest Tasks</h2>
            {loading ? (
                <p className="text-center mt-4">Loading...</p>
            ) : filteredTasks.length === 0 ? (
                <p className="text-gray-600">No tasks found.</p>
            ) : (
                <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            currentUserId={user?.id}
                            onTaskAccepted={handleTaskAccepted}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Task;
