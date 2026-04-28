import api from "../api/client";

export const linkedEmailService = {
  getAll:  ()               => api.get("/api/linked-emails"),
  add:     (email, label)   => api.post("/api/linked-emails", { email, label }),
  remove:  (id)             => api.delete(`/api/linked-emails/${id}`),
};