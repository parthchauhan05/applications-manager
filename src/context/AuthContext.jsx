import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { authService } from "../services/authService";
import { STORAGE_KEYS } from "../utils/constants";
import { isTokenExpired, msUntilExpiry } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const toastRef = useRef(null);

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.token);
    if (stored && isTokenExpired(stored)) {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.userEmail);
      localStorage.removeItem(STORAGE_KEYS.userName);
      return null;
    }
    return stored;
  });

  const [userEmail, setUserEmail] = useState(() => localStorage.getItem(STORAGE_KEYS.userEmail));
  const [userName, setUserName]   = useState(() => localStorage.getItem(STORAGE_KEYS.userName));

  // ── Persist token ──
  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEYS.token, token);
    else localStorage.removeItem(STORAGE_KEYS.token);
  }, [token]);

  // ── Persist email ──
  useEffect(() => {
    if (userEmail) localStorage.setItem(STORAGE_KEYS.userEmail, userEmail);
    else localStorage.removeItem(STORAGE_KEYS.userEmail);
  }, [userEmail]);

  // ── Persist name ──
  useEffect(() => {
    if (userName) localStorage.setItem(STORAGE_KEYS.userName, userName);
    else localStorage.removeItem(STORAGE_KEYS.userName);
  }, [userName]);

  // ── Auto-logout on token expiry ──
  useEffect(() => {
    if (!token) return;
    const ms = msUntilExpiry(token);
    if (ms <= 0) { logout(); return; }
    const timer = setTimeout(() => logout(), ms);
    return () => clearTimeout(timer);
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { token, name } = res.data;
    setToken(token);
    setUserEmail(email);
    setUserName(name ?? null);
    const displayName = name ? name.split(" ")[0] : email;
    toastRef.current?.show({
      severity: "success",
      summary: `Welcome back, ${displayName}!`,
      detail: "You're now signed in.",
      life: 3500,
    });
    return token;
  };

  const register = async (name, email, password) => {
    const res = await authService.signup(name, email, password);
    const { token, name: returnedName } = res.data;
    const resolvedName = returnedName ?? name ?? null;
    setToken(token);
    setUserEmail(email);
    setUserName(resolvedName);
    const displayName = resolvedName ? resolvedName.split(" ")[0] : email;
    toastRef.current?.show({
      severity: "success",
      summary: `Welcome, ${displayName}!`,
      detail: "Your account is ready. Let's get started.",
      life: 4000,
    });
    return token;
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    setUserName(null);
  };

  const value = useMemo(
    () => ({
      token,
      userEmail,
      userName,
      isAuthed: !!token,
      login,
      register,
      logout,
    }),
    [token, userEmail, userName]
  );

  return (
    <AuthContext.Provider value={value}>
      {/* Global toast — lives here so it survives page navigation */}
      <Toast ref={toastRef} position="top-right" />
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
