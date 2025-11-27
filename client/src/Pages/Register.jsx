import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const Register = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome to ChoreChamp
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please select an option to continue
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Sign Up Card */}
                    <Link to="/register/client" className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500 flex flex-col items-center text-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                            <FaUserPlus className="text-3xl text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">New Here?</h3>
                        <p className="text-gray-600">
                            Create an account to post tasks and get things done.
                        </p>
                        <span className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium group-hover:bg-blue-700 transition-colors">
                            Sign Up
                        </span>
                    </Link>

                    {/* Login Card */}
                    <Link to="/login" className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-500 flex flex-col items-center text-center">
                        <div className="p-4 bg-green-100 rounded-full mb-4 group-hover:bg-green-600 transition-colors duration-300">
                            <FaSignInAlt className="text-3xl text-green-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Already have an account?</h3>
                        <p className="text-gray-600">
                            Sign in to access your dashboard and manage tasks.
                        </p>
                        <span className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg font-medium group-hover:bg-green-700 transition-colors">
                            Login
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
