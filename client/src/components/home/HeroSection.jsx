import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section className="bg-gradient-to-r from-orange-50 to-blue-50 py-20 px-6 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
                    Connect with Local Talent. Get Things Done.
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    ChoreChamp is a South African marketplace where everyday people can post tasks and local champs can earn by completing them.
                </p>
                <div className="flex justify-center gap-6">
                    <Link
                        to="/post"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-md"
                    >
                        Post a Task
                    </Link>
                    <Link
                        to="/tasks"
                        className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-full font-semibold shadow"
                    >
                        Browse Tasks
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
