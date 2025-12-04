import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm py-4">
            <nav className="max-w-6xl mx-auto px-6 md:px-8 flex justify-between items-center h-16">
                <div>
                    <Link to="/" className="font-extrabold text-2xl md:text-3xl text-orange-600">
                        Chore<span className="text-blue-600">Champ</span>
                    </Link>
                </div>
                <ul className="hidden md:flex items-center gap-8">
                    <li>
                        <Link to="/" className="text-gray-700 hover:text-gray-900 transition duration-200">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/tasks" className="text-gray-700 hover:text-gray-900 transition duration-200">
                            Tasks
                        </Link>
                    </li>

                    {user ? (
                        <>
                            <li>
                                <Link to="/post" className="text-gray-700 hover:text-gray-900 transition duration-200 font-medium">
                                    Book a Task
                                </Link>
                            </li>
                            <li>
                                <Link to="/tasker/dashboard" className="text-gray-700 hover:text-gray-900 transition duration-200 font-medium">
                                    My Tasks
                                </Link>
                            </li>
                            <li>
                                <Link to="/account" className="text-gray-700 hover:text-gray-900 transition duration-200 font-medium">
                                    Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/messages" className="text-gray-700 hover:text-gray-900 transition duration-200 font-medium">
                                    Messages
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/register" className="text-gray-700 hover:text-gray-900 transition duration-200">
                                    Signup/Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register/tasker"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300 shadow-md"
                                >
                                    Become a Champ
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                {/*  Hamburger Menu */}
                <div className="md:hidden">
                    <button className="text-gray-600 hover:text-gray-800 focus:outline-none p-2">
                        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-5h18V6H3v2z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
