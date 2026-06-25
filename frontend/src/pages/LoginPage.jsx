import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@axxela.in");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/products");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div style={{ position: "relative" }}>
          <div className="brand-mark" style={{ marginBottom: "24px" }}>
            <span className="brand-icon" />
            <span>Axxelatlas</span>
          </div>

          <h1 style={{ marginBottom: "8px" }}>Research Data Hub</h1>

          <p style={{ marginBottom: "28px" }}>
            Product coverage, active contracts, data availability, and request
            tracking in one workspace.
          </p>

          <form onSubmit={handleSubmit} className="form-grid">
            <div>
              <label>Email</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error && <p style={{ color: "#fca5a5" }}>{error}</p>}

            <button type="submit" style={{ marginTop: "8px" }}>
              Enter Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}