import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthAPI } from "../services/api";
import { setAuthToken } from "../services/api";

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Provides authentication state (user, token) and actions (login/logout/register).
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      // fetch profile
      AuthAPI.me()
        .then((data) => {
          setUser(data?.user || data || null);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("auth_token");
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    setError("");
    const data = await AuthAPI.login({ email, password });
    const t = data?.token || data?.access || data?.key;
    if (t) {
      localStorage.setItem("auth_token", t);
      setToken(t);
    } else {
      throw new Error("Invalid login response");
    }
  }, []);

  const register = useCallback(async (payload) => {
    setError("");
    const data = await AuthAPI.register(payload);
    // optional auto-login
    if (data?.token || data?.access) {
      const t = data.token || data.access;
      localStorage.setItem("auth_token", t);
      setToken(t);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await AuthAPI.logout(); } catch { /* noop */ }
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    isAdmin: Boolean(user?.is_admin || user?.is_staff),
  }), [user, token, loading, error, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context */
  return useContext(AuthContext);
}
