import React, { useEffect, useState } from "react";

const UserList = ({ users: propUsers }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(!propUsers || propUsers.length === 0);

    useEffect(() => {
        // If users were provided as props, use them
        if (propUsers && propUsers.length > 0) {
            setUsers(propUsers);
            setLoading(false);
            return;
        }

        // Otherwise fetch users
        fetch("http://localhost/chorchamp-server/api/users/getUsers.php")
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
                            className="border p-3 rounded-lg hover:bg-gray-100"
                        >
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
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
