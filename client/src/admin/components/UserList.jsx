import React, { useEffect, useState } from "react";
import { FaTrash } from 'react-icons/fa';
import { API_BASE_URL } from '../../../config';

const UserList = ({ users: propUsers, onDeleteUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(!propUsers || propUsers.length === 0);
    const [deletingUserId, setDeletingUserId] = useState(null);

    useEffect(() => {
        // If users were provided as props, use them
        if (propUsers && propUsers.length > 0) {
            setUsers(propUsers);
            setLoading(false);
            return;
        }

        // Otherwise fetch users
        fetch(`${API_BASE_URL}/users/getUsers.php`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    setUsers(data.data);
                } else {
                    console.error("Failed to fetch users:", data.message);
                }
            })
            .catch((err) => console.error("Error fetching users:", err))
            .finally(() => setLoading(false));
    }, [propUsers]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        setDeletingUserId(userId);

        try {
            if (onDeleteUser) {
                await onDeleteUser(userId);
                // Remove the user from the local state
                setUsers(users.filter(user => user.id !== userId));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        } finally {
            setDeletingUserId(null);
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Users ({users.length})</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : users.length > 0 ? (
                <ul className="space-y-2">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className="border p-3 rounded-lg hover:bg-gray-100 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>

                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={deletingUserId === user.id}
                                className={`${
                                    deletingUserId === user.id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                                } text-white p-2 rounded-full text-sm transition-colors duration-200`}
                                title="Delete user"
                            >
                                <FaTrash />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default UserList;
