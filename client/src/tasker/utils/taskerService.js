import supabase from '../../services/supabaseClient';

const taskerService = {
    // Get all available tasks
    getAllTasks: async () => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
                    *,
                    task_categories(name),
                    locations(address, city),
                    creator:profiles!user_id(name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map data to match frontend expectations
            const mappedData = data?.map(task => ({
                ...task,
                category: task.task_categories?.name,
                location: task.locations?.city || task.locations?.address,
                budget: task.budget_amount,
                created_by: task.creator?.name
            })) || [];

            return mappedData;
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            throw error;
        }
    },

    getMyPostedTasks: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
                    *,
                    task_categories(name),
                    locations(address, city),
                    creator:profiles!user_id(name)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map data to match frontend expectations
            const mappedData = data?.map(task => ({
                ...task,
                category: task.task_categories?.name,
                location: task.locations?.city || task.locations?.address,
                budget: task.budget_amount,
                created_by: task.creator?.name
            })) || [];

            return mappedData;
        } catch (error) {
            console.error('Error fetching posted tasks:', error);
            throw error;
        }
    },

    getMyAcceptedTasks: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
                    *,
                    task_categories(name),
                    locations(address, city),
                    creator:profiles!user_id(name)
                `)
                .eq('assigned_worker_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map data to match frontend expectations
            const mappedData = data?.map(task => ({
                ...task,
                category: task.task_categories?.name,
                location: task.locations?.city || task.locations?.address,
                budget: task.budget_amount,
                created_by: task.creator?.name
            })) || [];

            return mappedData;
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
                    assigned_worker_id: userId
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
                .select(`
                    *,
                    task_categories(name),
                    locations(address, city),
                    creator:profiles!user_id(*),
                    assigned_worker:profiles!assigned_worker_id(*)
                `)
                .eq('id', taskId)
                .single();

            if (error) throw error;

            // Map data to match frontend expectations
            const mappedData = {
                ...data,
                category: data.task_categories?.name,
                location: data.locations?.city || data.locations?.address,
                budget: data.budget_amount,
                created_by: data.creator?.name,
                client: data.creator
            };

            return mappedData;
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
            // Map frontend field names to schema field names
            const { budget, ...rest } = taskData;

            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    ...rest,
                    user_id: userId,
                    budget_amount: budget || taskData.budget_amount,
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
            const { data, error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId)
                .select();

            if (error) throw error;

            // If data is empty, it might mean the task didn't exist or RLS prevented deletion.
            // However, with RLS, a successful delete of 0 rows is not an error in itself, 
            // but for the UI we might want to know.
            // But if we just want to ensure it's gone, we can return success.
            // The previous logic threw an error if data was empty. 
            // If RLS hides the row, delete returns 0 rows. 
            // If we want to report "Permission denied", we can keep the check.

            if (!data || data.length === 0) {
                // It's possible the task was already deleted or RLS hid it.
                // We can log a warning but maybe not throw, or throw a more specific error.
                // For now, I'll keep the error throw but maybe relax it or just let it be, 
                // as the user's issue was likely the explicit .eq check failing.
                // If I remove .eq('user_id', ...), and it STILL fails, then it's definitely RLS.
                // But removing .eq('user_id', ...) allows Admins to delete if RLS allows it.
                throw new Error("Task not found or permission denied. Unable to delete.");
            }

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
