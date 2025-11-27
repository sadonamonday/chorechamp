import supabase from '../../services/supabaseClient';

const taskerService = {
    // Get all available tasks
    getAllTasks: async () => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*, services(name, icon)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            throw error;
        }
    },

    getMyPostedTasks: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*, services(name, icon)')
                .eq('client_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching posted tasks:', error);
            throw error;
        }
    },

    getMyAcceptedTasks: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*, services(name, icon)')
                .eq('tasker_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching accepted tasks:', error);
            throw error;
        }
    },

    // Accept a task
    acceptTask: async (taskId, userId) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({
                    status: 'assigned',
                    tasker_id: userId
                })
                .eq('id', taskId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, task: data };
        } catch (error) {
            console.error('Error accepting task:', error);
            throw error;
        }
    },

    // Get task details by ID
    getTaskById: async (taskId) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*, services(name, icon), client:profiles!client_id(*)')
                .eq('id', taskId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching task details:', error);
            throw error;
        }
    },

    // Update task status (for completing tasks, etc.)
    updateTaskStatus: async (taskId, status, userId = null) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update({ status: status })
                .eq('id', taskId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, task: data };
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    },

    // Create a new task
    createTask: async (taskData, userId) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    ...taskData,
                    client_id: userId,
                    status: 'open'
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, task: data };
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    // Delete a task
    deleteTask: async (taskId, userId) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId)
                .eq('client_id', userId); // Ensure ownership

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    // Update a task
    updateTask: async (taskData, userId = null) => {
        try {
            const { id, ...updates } = taskData;
            const { data, error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, task: data };
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }
};

export default taskerService;
