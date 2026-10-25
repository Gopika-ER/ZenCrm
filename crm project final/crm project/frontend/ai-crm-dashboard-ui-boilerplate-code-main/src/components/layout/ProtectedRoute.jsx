import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../ui";
import { useEffect, useState } from "react";

/** Gate private routes — redirects to /login when unauthenticated. */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Safety net: if auth restoration hangs for any reason, never leave the
  // UI as a permanent blank/loader screen.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setTimedOut(true), 2500);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading && !timedOut) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

