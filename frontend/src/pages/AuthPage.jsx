import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

/* ── helpers ─────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6)  s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const label  = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][score];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e", "#16a34a"];

  if (!password) return null;
  return (
    <div className="pass-strength">
      <div className="pass-strength__bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="pass-strength__bar"
            style={{ background: i <= score ? colors[score] : "var(--navy-elevated)" }}
          />
        ))}
      </div>
      <span className="pass-strength__label" style={{ color: colors[score] }}>
        {label}
      </span>
    </div>
  );
}

function InputField({ id, label, icon, type = "text", value, onChange, placeholder, autoComplete, disabled, error }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword ? (showPass ? "text" : "password") : type;

  return (
    <div className={`auth-field${error ? " auth-field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <span className="auth-input-icon">{icon}</span>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          style={isPassword ? { paddingRight: 44 } : {}}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-toggle-pass"
            onClick={() => setShowPass((v) => !v)}
            tabIndex={-1}
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <p className="auth-field__error">{error}</p>}
    </div>
  );
}

/* ── Sign In form ────────────────────────────────────────── */
function SignInForm({ onSwitch }) {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(username.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <InputField
        id="si-username" label="Username" icon="👤" type="text"
        value={username} onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username" autoComplete="username"
        disabled={loading}
      />
      <InputField
        id="si-password" label="Password" icon="🔑" type="password"
        value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password" autoComplete="current-password"
        disabled={loading}
      />

      {error && (
        <div className="auth-feedback auth-feedback--error">
          <span>⚠️</span> {error}
        </div>
      )}

      <button
        type="submit"
        className="auth-btn"
        disabled={loading}
      >
        {loading ? <><span className="auth-spinner" /> Signing in…</> : "Sign In →"}
      </button>

      <p className="auth-switch-hint">
        Don't have an account?{" "}
        <button type="button" className="auth-link-btn" onClick={onSwitch}>
          Create one
        </button>
      </p>
    </form>
  );
}

/* ── Sign Up form ────────────────────────────────────────── */
function SignUpForm({ onSwitch }) {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setError("Username is required."); return; }
    if (username.trim().length < 3) { setError("Username must be at least 3 characters."); return; }
    if (!password)   { setError("Password is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    setError("");
    try {
      await register(username.trim(), email.trim(), password, confirm);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <InputField
        id="su-username" label="Username" icon="👤" type="text"
        value={username} onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose a username (min 3 chars)" autoComplete="username"
        disabled={loading}
      />
      <InputField
        id="su-email" label="Email (optional)" icon="✉️" type="email"
        value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com" autoComplete="email"
        disabled={loading}
      />
      <InputField
        id="su-password" label="Password" icon="🔑" type="password"
        value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 6 characters" autoComplete="new-password"
        disabled={loading}
      />
      <PasswordStrength password={password} />

      <InputField
        id="su-confirm" label="Confirm Password" icon="🔒" type="password"
        value={confirm} onChange={(e) => setConfirm(e.target.value)}
        placeholder="Re-enter your password" autoComplete="new-password"
        disabled={loading}
        error={confirm && password !== confirm ? "Passwords don't match" : ""}
      />

      {error && (
        <div className="auth-feedback auth-feedback--error">
          <span>⚠️</span> {error}
        </div>
      )}

      <button
        type="submit"
        className="auth-btn"
        disabled={loading}
      >
        {loading ? <><span className="auth-spinner" /> Creating account…</> : "Create Account →"}
      </button>

      <p className="auth-switch-hint">
        Already have an account?{" "}
        <button type="button" className="auth-link-btn" onClick={onSwitch}>
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ── Main page ───────────────────────────────────────────── */
function AuthPage() {
  const [tab, setTab] = useState("signin"); // "signin" | "signup"

  return (
    <div className="auth-page">
      {/* Left — branding panel */}
      <div className="auth-brand-panel">
        {/* Decorative circles */}
        <div className="auth-brand-orb auth-brand-orb--1" />
        <div className="auth-brand-orb auth-brand-orb--2" />

        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <span className="auth-brand-logo__icon">⚖️</span>
            <span className="auth-brand-logo__name">
              Legal<span>Tech</span>
            </span>
          </div>

          <p className="auth-brand-tagline">
            Automated Contract Parsing<br />& Risk Extraction Engine
          </p>

          <div className="auth-brand-divider" />

          <ul className="auth-brand-features">
            <li>
              <div className="auth-brand-feature-icon">📑</div>
              <div>
                <strong>Smart Clause Extraction</strong>
                <p>Automatically surfaces payment, liability, indemnity & termination clauses</p>
              </div>
            </li>
            <li>
              <div className="auth-brand-feature-icon">🛡️</div>
              <div>
                <strong>Risk Detection</strong>
                <p>Flags High / Medium / Low risks with contextual descriptions</p>
              </div>
            </li>
            <li>
              <div className="auth-brand-feature-icon">🔍</div>
              <div>
                <strong>NLP-Powered Analysis</strong>
                <p>Powered by spaCy for accurate legal entity & clause recognition</p>
              </div>
            </li>
          </ul>

          <div className="auth-brand-footer">
            Advanced Python Engineering Internship
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card animate-in">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab${tab === "signin" ? " auth-tab--active" : ""}`}
              onClick={() => setTab("signin")}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`auth-tab${tab === "signup" ? " auth-tab--active" : ""}`}
              onClick={() => setTab("signup")}
              type="button"
            >
              Sign Up
            </button>
            <div
              className="auth-tab-indicator"
              style={{ transform: `translateX(${tab === "signup" ? "100%" : "0"})` }}
            />
          </div>

          {/* Header */}
          <div className="auth-card-header">
            {tab === "signin" ? (
              <>
                <h2>Welcome back</h2>
                <p>Sign in to your LegalTech account</p>
              </>
            ) : (
              <>
                <h2>Create account</h2>
                <p>Start analyzing contracts for free</p>
              </>
            )}
          </div>

          {/* Form */}
          {tab === "signin" ? (
            <SignInForm onSwitch={() => setTab("signup")} />
          ) : (
            <SignUpForm onSwitch={() => setTab("signin")} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
