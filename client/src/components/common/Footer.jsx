import React from "react";

const Footer = () => (
    <footer className="bg-gray-100 py-8 border-t border-gray-200 text-gray-600 text-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div>
                <h6 className="font-semibold text-gray-800 mb-2">Explore</h6>
                <ul className="list-none p-0">
                    <li className="mb-1">
                        <a href="#" className="hover:text-blue-600 transition duration-200">How ChoreChamp Works</a>
                    </li>
                    <li className="mb-1">
                        <a href="#" className="hover:text-blue-600 transition duration-200">Become a Champ</a>
                    </li>
                    <li className="mb-1">
                        <a href="#" className="hover:text-blue-600 transition duration-200">Trust and Safety</a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-blue-600 transition duration-200">Help</a>
                    </li>
                </ul>
            </div>
            <div>
                <h6 className="font-semibold text-gray-800 mb-2">About</h6>
                <ul className="list-none p-0">
                    <li>
                        <a href="#" className="hover:text-blue-600 transition duration-200">About Us</a>
                    </li>
                </ul>
            </div>
            <div>
                <h6 className="font-semibold text-gray-800 mb-2">Legal</h6>
                <ul className="list-none p-0">
                    <li className="mb-1">
                        <a href="#" className="hover:text-blue-600 transition duration-200">Terms &amp; Conditions</a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-blue-600 transition duration-200">Privacy Policy</a>
                    </li>
                </ul>
            </div>
            {/* Optional: Add more columns like "Contact Us", "Social Media", etc. */}
            <div className="md:col-span-2 lg:col-span-3">
                <p className="mt-4 md:mt-0">
                    &copy; {new Date().getFullYear()} ChoreChamp. All rights reserved.
                </p>
                {/* Optional: Social media icons */}
                {/* <div className="flex gap-4 mt-3">
                <a href="#" className="hover:opacity-75"><svg className="w-5 h-5 fill-current text-blue-600" viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.67-1.65 1.13-2.6 1.5a4.16 4.16 0 0 0 1.8-2.3c-.8.5-1.7 .8-2.7.9a4.1 4.1 0 0 0-7 3.8c-1.2 2-1.9 4.3-1 6.3a11.8 11.8 0 0 1-8-4c1.3.8 2.7 1.3 4.2 1.4a4.1 4.1 0 0 0 3.5-2.3c-.8-.2-1.7-.3-2.5-.3a4.1 4.1 0 0 0 3.8-4c1 .2 2.1.4 3.2-.4a8.2 8.2 0 0 1-6.8 3.4c.4-.8.7-1.7 1-2.5a4.1 4.1 0 0 0 7.1-2.8c.3.7.6 1.4 1 2.1z"/></svg></a>
                <a href="#" className="hover:opacity-75"><svg className="w-5 h-5 fill-current text-blue-800" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.2 8.4 9.9v-7H6.9v-3h3.1V8.9c0-3 1.8-4.6 4.6-4.6 1.3 0 2.4.1 3.4.2v3.5h-2.1c-1.6 0-1.9.8-1.9 1.9v2.5h3.3l-.5 3.2h-2.8v7c5-1 8.5-5 8.5-9.8z"/></svg></a>
            </div> */}
            </div>
        </div>
    </footer>
)
export default Footer