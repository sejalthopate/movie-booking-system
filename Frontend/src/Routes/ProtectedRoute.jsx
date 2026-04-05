// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const userRole = localStorage.getItem("role"); // logged-in user role
  const token = localStorage.getItem("token"); // check if logged in

  if (!token) {
    // User not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // User role does not match
    return (
      <div className="text-center mt-10 text-red-600 font-bold">
        Access Denied! You do not have permission to view this page.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
