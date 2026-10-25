import api from "./api";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const leadsApi = {
  list: (params) => api.get("/leads", { params }),
  get: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post("/leads", data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  remove: (id) => api.delete(`/leads/${id}`),
  reorder: (updates) => api.post("/leads/reorder", updates),
};

export const contactsApi = {
  list: (params) => api.get("/contacts", { params }),
  get: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post("/contacts", data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  remove: (id) => api.delete(`/contacts/${id}`),
};

export const notesApi = {
  list: (params) => api.get("/notes", { params }),
  get: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post("/notes", data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  remove: (id) => api.delete(`/notes/${id}`),
};

export const tasksApi = {
  list: (params) => api.get("/tasks", { params }),
  get: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`),
};

export const aiApi = {
  status: () => api.get("/ai/status"),
  analyzeLead: (id) => api.post(`/ai/leads/${id}/analyze`),
  generateEmail: (id) => api.post(`/ai/leads/${id}/email`),
  summarizeNotes: (notes) => api.post("/ai/notes/summarize", { notes }),
  generateTaskList: () => api.post("/ai/tasks"),
  salesInsights: (stats = {}) => api.post("/ai/insights", { stats }),
};

export const analyticsApi = {
  overview: () => api.get("/analytics/overview"),
};