import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import TaskList from "../../components/tasks/TaskList.jsx";
import UserList from "../components/UserList";
import { FaTrash } from 'react-icons/fa';
import adminTaskService from "../../../api/adminTaskService";
import adminUserService from "../../../api/adminUserService.js";

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch tasks
            const tasksResponse = await fetch("http://localhost/chorchamp-server/api/tasks/getTasks.php");
            const tasksData = await tasksResponse.json();
            if (tasksData.success) setTasks(tasksData.tasks);

            // Fetch users
            const usersResponse = await fetch("http://localhost/chorchamp-server/api/users/getUsers.php");
            const usersData = await usersResponse.json();
            if (usersData.status === "success") setUsers(usersData.data);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await adminTaskService.deleteTask(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
            alert("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await adminUserService.deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            alert("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        }
    };

    // Custom TaskCard for admin with delete button
    const AdminTaskCard = ({ task }) => {
        return (
            <div className="border p-3 rounded-lg hover:bg-gray-100 flex justify-between items-center">
                <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-gray-600">Posted by: {task.created_by || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">Status: {task.status}</p>
                </div>

                <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full text-sm transition-colors duration-200"
                    title="Delete task"
                >
                    <FaTrash />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                {loading ? (
                    <p>Loading data...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">Tasks ({tasks.length})</h2>
                            {tasks.length > 0 ? (
                                <div className="space-y-2">
                                    {tasks.map(task => (
                                        <AdminTaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            ) : (
                                <p>No tasks found.</p>
                            )}
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">Users ({users.length})</h2>
                            <UserList users={users} onDeleteUser={handleDeleteUser} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
