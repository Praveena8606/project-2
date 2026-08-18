import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps any route that requires authentication.
 * If not logged in → redirects to /login, preserving the intended destination.
 * While the token is being verified → shows a full-screen spinner.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="state-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-lg" />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Verifying session…
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
