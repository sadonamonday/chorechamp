import React from "react";
import { Link } from "react-router-dom";

const SignupCallToAction = () => {
    return (
        <section className="py-12 bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="mb-6 text-lg">
                    <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                        Sign up with your email
                    </Link>
                    <span className="mx-2 text-gray-500">or</span>
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        Connect with Facebook
                    </Link>
                    <span className="ml-2 text-gray-800 font-medium">
                        Join the ChoreChamp movement.
                    </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    It's free to post
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                    Hundreds of ChoreChamps ready to do your everyday chores and errands
                </p>

                <div className="max-w-2xl mx-auto text-left">
                    <label htmlFor="task-input" className="block text-lg font-semibold text-gray-700 mb-2">
                        What do you need done?
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            id="task-input"
                            placeholder="E.g Pick up my dry cleaning"
                            className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-md shadow-sm transition duration-200 whitespace-nowrap">
                            Get it done!
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignupCallToAction;
