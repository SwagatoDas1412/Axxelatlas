import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav-shell">
      <div className="nav-inner">
        <Link to="/products" className="brand-mark">
          <img
            src="/download.png"
            alt="Axxela logo"
            className="brand-logo"
            />
          <span>Axxelatlas</span>
        </Link>

        <Link className="nav-link" to="/products">
          Products
        </Link>

        <Link className="nav-link" to="/requests">
          My Requests
        </Link>

        {user?.role === "admin" && (
          <Link className="nav-link" to="/admin">
            Admin Panel
          </Link>
        )}

        <div className="nav-spacer" />

        {user && (
          <span className="user-chip">
            {user.name} · {user.role}
          </span>
        )}
        <ThemeToggle />
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}