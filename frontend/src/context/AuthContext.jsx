import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = "http://127.0.0.1:8000/api";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem("lt_token") || null);
  const [loading, setLoading] = useState(true);

  // Set / clear axios Authorization header globally
  const applyToken = useCallback((t) => {
    if (t) {
      axios.defaults.headers.common["Authorization"] = `Token ${t}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  // Verify the stored token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      applyToken(token);
      try {
        const res = await axios.get(`${API}/auth/me/`);
        setUser(res.data);
      } catch {
        // Token invalid or expired — clear it
        localStorage.removeItem("lt_token");
        setToken(null);
        setUser(null);
        applyToken(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (username, password) => {
    const res = await axios.post(`${API}/auth/login/`, { username, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem("lt_token", t);
    setToken(t);
    setUser(u);
    applyToken(t);
    return u;
  };

  const register = async (username, email, password, confirm_password) => {
    const res = await axios.post(`${API}/auth/register/`, {
      username, email, password, confirm_password,
    });
    const { token: t, user: u } = res.data;
    localStorage.setItem("lt_token", t);
    setToken(t);
    setUser(u);
    applyToken(t);
    return u;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout/`);
    } catch { /* ignore */ }
    localStorage.removeItem("lt_token");
    setToken(null);
    setUser(null);
    applyToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
