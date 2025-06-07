import React, { useState } from 'react';

const TaskForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        posted_by: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost/chorchamp-server/api/tasks/postTask.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log("Response from server:", result);

            if (response.ok && result.success) {
                alert("Task created successfully.");
                setMessage("Task posted successfully!");
                setFormData({ title: '', description: '', posted_by: '' }); // clear form
            } else {
                alert("Something went wrong: " + (result.error || "Unknown error"));
                setMessage("Failed to post task.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Fetch error: " + error.message);
            setMessage("Server error.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 px-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Post a Task</h2>
            {message && <p className="text-center mb-4 text-green-600">{message}</p>}
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-xl space-y-4 border border-gray-200">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter task title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter task description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    ></textarea>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Posted By</label>
                    <input
                        type="text"
                        name="posted_by"
                        placeholder="Your name"
                        value={formData.posted_by}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all duration-150"
                >
                    Submit Task
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
