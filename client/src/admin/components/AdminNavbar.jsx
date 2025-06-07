import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
    return (
        <nav className="bg-[#007144] text-white px-6 py-4 shadow-md flex justify-between items-center">
            <div className="text-xl font-semibold">Chorchamp Admin</div>
            <div className="space-x-4">
                <Link to="/admin/dashboard" className="hover:underline">
                    Dashboard
                </Link>
                <Link to="/admin/users" className="hover:underline">
                    Users
                </Link>
                <Link to="/admin/tasks" className="hover:underline">
                    Tasks
                </Link>
                {/* You can add Logout later */}
            </div>
        </nav>
    );
};

export default AdminNavbar;
