import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import TaskList from "../../components/tasks/TaskList.jsx";
import UserList from "../components/UserList";

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch tasks
        fetch("http://localhost/chorchamp-server/api/tasks/getTasks.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setTasks(data.tasks);
            })
            .catch((err) => console.error("Failed to load tasks", err));

        // Fetch users
        fetch("http://localhost/chorchamp-server/api/users/getUsers.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") setUsers(data.data);
            })
            .catch((err) => console.error("Failed to load users", err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">Tasks ({tasks.length})</h2>
                        <TaskList tasks={tasks} />
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">Users ({users.length})</h2>
                        <UserList users={users} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
