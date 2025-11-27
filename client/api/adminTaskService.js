const API_BASE_URL = "https://chorechamp.kesug.com/api";

const adminTaskService = {
    // Get all tasks (including completed and deleted ones)
    getAllTasks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/tasks/getAllTasks.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

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

    // Delete a task (admin )
    deleteTask: async (taskId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/tasks/deleteTask.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task_id: taskId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete task');
            }

            return data;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
};

export default adminTaskService;
