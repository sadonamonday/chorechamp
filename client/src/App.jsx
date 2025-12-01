import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AuthCallback from "./components/AuthCallback";

import Home from "./Pages/Home";
import Task from "./Pages/Task";
import PostTask from "./Pages/PostTask";
import EditTask from "./Pages/EditTask";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import TaskerDashboard from "./tasker/pages/TaskerDashboard.jsx";
import TaskDetails from "./tasker/pages/TaskDetails.jsx";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import RegisterClient from "./Pages/RegisterClient";
import RegisterTasker from "./Pages/RegisterTasker";
import Profile from "./components/profile/Profile";
import ProfileWizard from "./components/profile/ProfileWizard";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/tasker/dashboard" element={<TaskerDashboard />} />
                            <Route path="/tasker/onboarding" element={<ProfileWizard />} />
                            <Route path="/tasker/task/:id" element={<TaskDetails />} />
                            <Route path="/" element={<Home />} />
                            <Route path="/tasks" element={<Task />} />
                            <Route path="/post" element={<PostTask />} />
                            <Route path="/edit-task/:id" element={<EditTask />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/register/client" element={<RegisterClient />} />
                            <Route path="/register/tasker" element={<RegisterTasker />} />
                            <Route path="/edit-task/:id" element={<EditTask />} />
                            <Route path="/auth/callback" element={<AuthCallback />} />
                            <Route path="/account" element={<Profile />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
