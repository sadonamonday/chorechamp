import React, {createContext, useState, useEffect, useContext} from "react";

export const AdminAuthContext = createContext({
    admin: null,
    setAdmin: () => {},
});
export const useAdminAuth = () => useContext(AdminAuthContext);
export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
    }, []);

    return (
        <AdminAuthContext.Provider value={{ admin, setAdmin }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
