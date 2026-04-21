import api from "../api/client";

export const applicationService = {
  getAll: (params = {}) => api.get("/api/applications", { params }),
  getSummary: () => api.get("/api/applications/summary"),
  create: (payload) => api.post("/api/applications", payload),
    update: (id, payload) => api.put(`/api/applications/${id}`, payload),
  getPage: ({ page = 0, size = 12, status = "", search = "" } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (status) params.append("status", status);
    if (search?.trim()) params.append("search", search.trim());

    return api.get(`/api/applications?${params.toString()}`);
    },
};