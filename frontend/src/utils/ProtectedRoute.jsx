import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // Convert to boolean
    }, []);

    if (isAuthenticated === null) {
        return <p>Loading...</p>; // Prevent redirect before checking auth
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
