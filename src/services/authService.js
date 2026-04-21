import api from "../api/client";

export const authService = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  signup: (name, email, password) => api.post("/api/auth/signup", { name, email, password }),
  forgotPassword: (email) => api.post("/api/auth/forgot-password", { email }),
  resetPassword: (accessToken, newPassword) =>
    api.post("/api/auth/reset-password", { accessToken, newPassword }),
};