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
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId)
                .eq('user_id', userId); // Ensure ownership

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
