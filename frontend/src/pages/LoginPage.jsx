import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/components.css";
import "./LoginPage.css";

function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [username,   setUsername]   = useState("");
  const [password,   setPassword]   = useState("");
  const [error,      setError]      = useState("");
  const [isLoading,  setIsLoading]  = useState(false);
  const [showPass,   setShowPass]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await login(username.trim(), password);
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left panel — branding */}
      <div className="login-panel login-panel--brand">
        <div className="login-brand">
          <span className="login-brand__icon">⚖️</span>
          <h1 className="login-brand__name">
            Legal<span style={{ color: "var(--gold)" }}>Tech</span>
          </h1>
          <p className="login-brand__tagline">
            Automated Contract Parsing &amp; Risk Extraction
          </p>
          <div className="login-brand__features">
            <div className="login-feature">
              <span>📑</span>
              <div>
                <strong>Clause Extraction</strong>
                <p>Automatically identify payment, liability, and indemnity clauses</p>
              </div>
            </div>
            <div className="login-feature">
              <span>⚠️</span>
              <div>
                <strong>Risk Detection</strong>
                <p>Surface high, medium, and low severity legal risks instantly</p>
              </div>
            </div>
            <div className="login-feature">
              <span>🔍</span>
              <div>
                <strong>NLP Analysis</strong>
                <p>Powered by spaCy NLP for accurate legal entity recognition</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-panel login-panel--form">
        <div className="login-form-wrapper animate-in">
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <div className="gold-line" />
            <p>Sign in to access your contract dashboard</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="login-username">Username</label>
              <div className="input-icon-wrap">
                <span className="input-icon">👤</span>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔑</span>
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="feedback-error" style={{ marginBottom: 16 }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "13px", marginTop: 4 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <><span className="spinner" /> Signing in…</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p className="login-footer-hint">
            No account?{" "}
            <a
              href="/admin/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--gold)" }}
            >
              Ask your admin to create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
