import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Loader from "../loader/Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, userLoading } = useCurrentUser();
  const location = useLocation();

  // Check if user has a token in localStorage
  const hasToken = () => {
    const token = localStorage.getItem("token");
    return token && token.trim() !== "" && token !== "null";
  };

  // If no token, redirect to sign-in immediately
  if (!hasToken()) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If we're still loading user data, show loader
  if (userLoading) {
    return <Loader />;
  }

  // If we have a token but no user data after loading is complete,
  // the token might be invalid, so clear it and redirect to sign-in
  // Only do this if we're not currently loading AND we've given enough time for the fetch
  if (!userLoading && !currentUser && hasToken()) {
    // Don't immediately clear the token on page refresh
    // Let the useCurrentUser hook handle token validation
    console.warn("Token present but user data unavailable after loading complete");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;