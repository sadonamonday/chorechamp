import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";
import { loginAdmin } from "../../../api/adminAuthService.js";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { admin, setAdmin } = useContext(AdminAuthContext);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (admin) {
            navigate("/admin/dashboard");
        }
    }, [admin, navigate]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in both fields.");
            return;
        }

        try {
            const res = await loginAdmin(email, password);
            if (res.success) {
                localStorage.setItem("adminToken", res.token);
                localStorage.setItem("adminUser", JSON.stringify(res.user));
                setAdmin(res.user); // Save user in context
                navigate("/admin/dashboard");
            } else {
                setError(res.message || "Login failed.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
                {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        <span className="text-gray-700">Email</span>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label className="block mt-4 mb-2">
                        <span className="text-gray-700">Password</span>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
