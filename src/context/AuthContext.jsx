import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { STORAGE_KEYS } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem(STORAGE_KEYS.userEmail));

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEYS.token, token);
    else localStorage.removeItem(STORAGE_KEYS.token);
  }, [token]);

  useEffect(() => {
    if (userEmail) localStorage.setItem(STORAGE_KEYS.userEmail, userEmail);
    else localStorage.removeItem(STORAGE_KEYS.userEmail);
  }, [userEmail]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setToken(res.data.token);
    setUserEmail(email);
    return res.data.token;
  };

  const register = async (name, email, password) => {
    const res = await authService.signup(name, email, password);
    setToken(res.data.token);
    setUserEmail(email);
    return res.data.token;
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
  };

  const value = useMemo(
    () => ({
      token,
      userEmail,
      isAuthed: !!token,
      login,
      register,
      logout,
    }),
    [token, userEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);