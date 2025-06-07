import React from 'react'

const HowitWorks = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
                <h2 className="font-extrabold text-3xl md:text-4xl text-blue-700 mb-8">
                    How ChoreChamp Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center p-6 rounded-lg shadow-md">
                        <div className="flex justify-center rounded-full bg-blue-100 p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.932 3.374h14.066c1.716 0 2.799-1.874 1.932-3.374a9.702 9.702 0 0 0-2.19 6.827l-.319-2-7.5-4.333-7.5 4.333-.32 2a9.702 9.702 0 0 0-2.19-6.827Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Describe Your Task</h3>
                        <p className="text-gray-600 text-center">Tell us what you need help with and where you are.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-lg shadow-md">
                        <div className="flex justify-center rounded-full bg-blue-100 p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-4.036 13.888-8.937 15.333-4.902-1.445-8.937-8.191-8.937-15.333M7.05 11.072v5.129M16.95 11.072v5.129M3.218 16.328l-1.09-1.09m18.384 0l-1.09-1.09M6.75 19.5a4.859 4.859 0 0 1-.557-2.27l-1.092-1.092a3 3 0 0 0-4.243 4.243l1.092 1.094a4.859 4.859 0 0 1 .557 2.27m12.486-2.27-1.094-1.092a3 3 0 0 1 4.243 4.243l1.094 1.092a4.859 4.859 0 0 1-.557 2.27M8.25 6h7.5" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Choose a Champ</h3>
                        <p className="text-gray-600 text-center">Browse profiles, reviews, and select the right person.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-lg shadow-md">
                        <div className="flex justify-center rounded-full bg-blue-100 p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Get It Done</h3>
                        <p className="text-gray-600 text-center">Your Champ arrives and completes the task. Pay securely.</p>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default HowitWorks;