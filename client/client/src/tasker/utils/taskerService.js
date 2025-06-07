
const API_BASE_URL = 'http://localhost/chorchamp-server/api';

const taskerService = {
    // Get all available tasks
    getAllTasks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/getTasks.php`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch tasks');
            }

            return data;
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            throw error;
        }
    },


    getMyPostedTasks: async (userId = null) => {
        try {
            let url = `${API_BASE_URL}/tasks/getMyPostedTasks.php`;
            if (userId) {
                url += `?user_id=${userId}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch posted tasks');
            }

            return data;
        } catch (error) {
            console.error('Error fetching posted tasks:', error);
            throw error;
        }
    },


    getMyAcceptedTasks: async (userId = null) => {
        try {
            let url = `${API_BASE_URL}/tasks/getMyAcceptedTasks.php`;
            if (userId) {
                url += `?user_id=${userId}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch accepted tasks');
            }

            return data;
        } catch (error) {
            console.error('Error fetching accepted tasks:', error);
            throw error;
        }
    },

    // Accept a task
    acceptTask: async (taskId, userId = null) => {
        try {
            const body = { task_id: taskId };
            if (userId) {
                body.user_id = userId;
            }

            const response = await fetch(`${API_BASE_URL}/tasks/acceptTask.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to accept task');
            }

            return data;
        } catch (error) {
            console.error('Error accepting task:', error);
            throw error;
        }
    },

    // Get task details by ID
    getTaskById: async (taskId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/getTaskById.php?id=${taskId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch task details');
            }

            return data;
        } catch (error) {
            console.error('Error fetching task details:', error);
            throw error;
        }
    },

    // Update task status (for completing tasks, etc.)
    updateTaskStatus: async (taskId, status, userId = null) => {
        try {
            const body = { task_id: taskId, status: status };
            if (userId) {
                body.user_id = userId;
            }

            const response = await fetch(`${API_BASE_URL}/tasks/updateTaskStatus.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update task status');
            }

            return data;
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    },

    // Create a new task
    createTask: async (taskData, userId = null) => {
        try {
            if (userId) {
                taskData.user_id = userId;
            }

            const response = await fetch(`${API_BASE_URL}/tasks/createTask.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create task');
            }

            return data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }
};

export default taskerService;