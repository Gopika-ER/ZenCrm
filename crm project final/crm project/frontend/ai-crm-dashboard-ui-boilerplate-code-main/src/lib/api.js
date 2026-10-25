import axios from "axios";

export const TOKEN_KEY = "tip_crm_token";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL,
});

// Attach the JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Normalize responses so UI can display API errors consistently
api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // Auto-logout on unauthorized
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }

    return Promise.reject({
      status,
      message,
    });
  }
);

export default api;