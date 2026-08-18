import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <NavLink to="/" className="navbar__brand">
          <span className="navbar__brand-icon" aria-hidden="true">⚖️</span>
          <span className="navbar__brand-name">
            Legal<span className="navbar__brand-accent">Tech</span>
          </span>
        </NavLink>

        {/* Center nav links */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "navbar__link" + (isActive ? " navbar__link--active" : "")
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              "navbar__link" + (isActive ? " navbar__link--active" : "")
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              "navbar__link" + (isActive ? " navbar__link--active" : "")
            }
          >
            Documents
          </NavLink>
        </nav>

        {/* User chip + logout */}
        {user && (
          <div className="navbar__user">
            <div className="navbar__user-chip">
              <span className="navbar__user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </span>
              <span className="navbar__user-name">{user.username}</span>
            </div>
            <button
              className="navbar__logout-btn"
              onClick={handleLogout}
              title="Sign out"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;