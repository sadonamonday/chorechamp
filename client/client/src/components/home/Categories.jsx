import React from "react";

const Categories = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
                <h2 className="font-extrabold text-3xl md:text-4xl text-blue-700 mb-8">
                    Explore ChoreChamp Services
                </h2>
                <p className="text-lg text-gray-700 mb-10">
                    Find skilled ChoreChamps for a wide range of tasks around your home.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="rounded-lg shadow-md overflow-hidden bg-white">
                        <div className="p-6">
                            <div className="flex justify-center rounded-full bg-blue-100 p-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 17.5l-4.5-4.5m0 0L3.5 7.5M19 19l-6-6m0 0L6 6m-9 9h18M7.5 10.5h9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Cleaning</h3>
                            <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition duration-200 text-center w-full block">Find Cleaning</a>
                        </div>
                    </div>
                    <div className="rounded-lg shadow-md overflow-hidden bg-white">
                        <div className="p-6">
                            <div className="flex justify-center rounded-full bg-blue-100 p-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM6.75 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM6.75 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM6.75 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM17.25 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM17.25 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM17.25 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Handyman</h3>
                            <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition duration-200 text-center w-full block">Find Handyman</a>
                        </div>
                    </div>
                    <div className="rounded-lg shadow-md overflow-hidden bg-white">
                        <div className="p-6">
                            <div className="flex justify-center rounded-full bg-blue-100 p-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-4.036 13.888-8.937 15.333-4.902-1.445-8.937-8.191-8.937-15.333M7.05 11.072v5.129M16.95 11.072v5.129M3.218 16.328l-1.09-1.09m18.384 0l-1.09-1.09M6.75 19.5a4.859 4.859 0 0 1-.557-2.27l-1.092-1.092a3 3 0 0 0-4.243 4.243l1.092 1.094a4.859 4.859 0 0 1 .557 2.27m12.486-2.27-1.094-1.092a3 3 0 0 1 4.243 4.243l1.094 1.092a4.859 4.859 0 0 1-.557 2.27M8.25 6h7.5" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Gardening</h3>
                            <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition duration-200 text-center w-full block">Find Gardening</a>
                        </div>
                    </div>
                    <div className="rounded-lg shadow-md overflow-hidden bg-white">
                        <div className="p-6">
                            <div className="flex justify-center rounded-full bg-blue-100 p-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Pet Care</h3>
                            <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition duration-200 text-center w-full block">Find Pet Care</a>
                        </div>
                    </div>
                    <div className="rounded-lg shadow-md overflow-hidden bg-white">
                        <div className="p-6">
                            <div className="flex justify-center rounded-full bg-blue-100 p-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.5-.5 1.321-.5 1.821 0l8.954 8.955c.5.5.5 1.321 0 1.821l-8.954 8.955c-.5.5-1.321.5-1.821 0L2.25 12Zm13.5-8.55m-3 3L21 21m-18-9-9 9m0-12 9 9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Moving</h3>
                            <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition duration-200 text-center w-full block">Find Moving</a>
                        </div>
                    </div>
                    <div className="rounded-lg shadow-md overflow-hidden bg-white">
                        <div className="p-6">
                            <div className="flex justify-center rounded-full bg-blue-100 p-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a3 3 0 0 0-3-3H6.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-3.75m-9 0h.008v.008H7.5v-.008ZM15 13.5h.008v.008H13.5v-.008ZM12 16.5h.008v.008H10.5v-.008Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Repairs</h3>
                            <a href="#" className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition duration-200 text-center w-full block">Find Repairs</a>
                        </div>
                    </div>

                </div>
                <a href="#" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md">
                    Browse All Services
                </a>
            </div>
        </section>


    )
}
export default Categories