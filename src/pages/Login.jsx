import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-glow glow-one"></div>
      <div className="admin-login-glow glow-two"></div>

      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">G</div>

          <p className="admin-login-label">PORTFOLIO CMS</p>

          <h1>Welcome Back</h1>

          <p>
            Sign in to manage your portfolio content.
          </p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="login-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link to="/" className="back-to-portfolio">
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  );
}

export default Login;