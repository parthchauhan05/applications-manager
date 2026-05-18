// src/services/gmailService.js
import api from "../api/client";

export const gmailService = {
  // GET /api/gmail/accounts → returns array of linked accounts
  // Backend: GmailTokenRepository.findByUserId() mapped to a list
  getAccounts: () => api.get("/api/gmail/accounts"),

  // GET /api/gmail/oauth/url → returns { url: "https://accounts.google.com/..." }
  getAuthUrl: () => api.get("/api/gmail/oauth/url"),

  // DELETE /api/gmail/accounts/{email} — stops watch + removes token
  removeAccount: (email) =>
    api.delete(`/api/gmail/accounts/${encodeURIComponent(email)}`),
};