import React, { createContext, useState, useEffect, useContext } from "react";

export const AdminAuthContext = createContext({
    admin: null,
    setAdmin: () => { },
});
export const useAdminAuth = () => useContext(AdminAuthContext);
export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        // Check for admin token and try to retrieve admin user data
        const adminToken = localStorage.getItem("adminToken");
        const storedAdmin = localStorage.getItem("adminUser");
        if (storedAdmin && adminToken) {
            try {
                setAdmin(JSON.parse(storedAdmin));
            } catch (error) {
                console.error("Failed to parse admin user from local storage", error);
                localStorage.removeItem("adminUser");
            }
        }
    }, []);

    return (
        <AdminAuthContext.Provider value={{ admin, setAdmin }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
