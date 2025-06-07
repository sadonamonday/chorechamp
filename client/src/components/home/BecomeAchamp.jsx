import React from "react";

const BecomeAchamp = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
                <h2 className="font-extrabold text-3xl md:text-4xl text-blue-700 mb-6">
                    Become a ChoreChamp &amp; Earn
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                    Join our community of skilled ChoreChamps and start earning on your own terms. Set your schedule, choose your tasks, and get paid reliably.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-blue-600 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Flexible Hours</h3>
                        <p className="text-gray-600 text-center">Work when it suits you.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-blue-600 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25M7.5 15h2.25a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H7.5m9 6h2.25a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H16.5" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Tasks</h3>
                        <p className="text-gray-600 text-center">Select jobs you enjoy.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-blue-600 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Earn Great Income</h3>
                        <p className="text-gray-600 text-center">Get paid competitively.</p>
                    </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md">
                    Become a Champ Now
                </button>
            </div>
        </section>
    )}
export default BecomeAchamp;