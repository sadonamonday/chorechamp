import React, { useEffect, useState } from "react";
import TaskCard from "../../components/tasks/TaskCard.jsx";
import axios from "axios";

const AcceptedTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost/chorchamp-server/api/tasks/getTasks.php")
            .then(res => setTasks(res.data.filter(task => task.status === "accepted")))
            .catch(err => console.error("Error:", err));
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Accepted Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default AcceptedTasks;
