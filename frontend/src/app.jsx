import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AdminDashboard from "../src/pages/AdminDashboard";
import Login from "./pages/LoginPage";
import Register from "./pages/Register"; // Import Register Component

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token"); // Clear token if invalid
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add Register Route */}
        <Route
          path="/admin"
          element={user ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={user ? "/admin" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
