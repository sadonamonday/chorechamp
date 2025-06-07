import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./Pages/Home";
import Task from "./Pages/Task";
import PostTask from "./Pages/PostTask";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import TaskerDashboard from "./tasker/pages/TaskerDashboard.jsx";
import TaskDetails from "./tasker/pages/TaskDetails.jsx";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/tasker/dashboard" element={<TaskerDashboard />} />
                            <Route path="/tasker/task/:id" element={<TaskDetails />} />
                            <Route path="/" element={<Home />} />
                            <Route path="/tasks" element={<Task />} />
                            <Route path="/post" element={<PostTask />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
