import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const [isAdmin, setIsAdmin] = useState(() => user?.userId?.includes("admin") || false);

    // state → localStorage 연동
    useEffect(() => {
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
    }, [isAdmin]);

    return (
        <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
        {children}
        </AdminContext.Provider>
    );
};
