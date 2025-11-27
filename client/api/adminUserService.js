import { API_BASE_URL } from '../config';

const adminUserService = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/getAllUsers.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch users');
            }

            return data;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    },

    // Delete a user
    deleteUser: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/deleteUser.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete user');
            }

            return data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
};

export default adminUserService;
