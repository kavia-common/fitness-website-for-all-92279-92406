/**
 * PUBLIC_INTERFACE
 * createApiClient
 * A simple axios-based API client factory that attaches auth token and handles errors.
 */
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

let authToken = null;

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Set Bearer token used for authenticated API requests. */
  authToken = token || null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach token if present
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const resp = err.response;
    const error = new Error(resp?.data?.message || err.message || "API Error");
    error.status = resp?.status;
    error.data = resp?.data;
    throw error;
  }
);

// PUBLIC_INTERFACE
export const AuthAPI = {
  /** Login with email/password */
  async login(payload) {
    const { data } = await api.post("/auth/login/", payload);
    return data;
  },
  /** Register a new user */
  async register(payload) {
    const { data } = await api.post("/auth/register/", payload);
    return data;
  },
  /** Fetch current profile */
  async me() {
    const { data } = await api.get("/auth/me/");
    return data;
  },
  /** Logout (optional server-side revoke) */
  async logout() {
    const { data } = await api.post("/auth/logout/");
    return data;
  }
};

// PUBLIC_INTERFACE
export const UserAPI = {
  /** Get user profile details */
  async getProfile() {
    const { data } = await api.get("/users/profile/");
    return data;
  },
  /** Update user profile */
  async updateProfile(payload) {
    const { data } = await api.put("/users/profile/", payload);
    return data;
  },
  /** Update fitness goals */
  async updateGoals(payload) {
    const { data } = await api.put("/users/goals/", payload);
    return data;
  },
  /** Connect device - returns URL or token to complete device auth */
  async connectDevice(provider, payload) {
    const { data } = await api.post(`/devices/connect/${encodeURIComponent(provider)}/`, payload || {});
    return data;
  },
  /** Fetch notifications */
  async getNotifications() {
    const { data } = await api.get("/notifications/");
    return data;
  },
  /** Mark notification read */
  async readNotification(id) {
    const { data } = await api.post(`/notifications/${id}/read/`);
    return data;
  },
};

// PUBLIC_INTERFACE
export const ContentAPI = {
  /** Fetch list of workouts or nutrition content */
  async listContent(params = {}) {
    const { data } = await api.get("/content/", { params });
    return data;
  },
  /** Fetch content details */
  async getContent(id) {
    const { data } = await api.get(`/content/${id}/`);
    return data;
  },
  /** Generate personalized plan */
  async generatePlan(payload) {
    const { data } = await api.post("/plans/generate/", payload);
    return data;
  },
  /** Track plan progress */
  async trackProgress(payload) {
    const { data } = await api.post("/plans/progress/", payload);
    return data;
  },
};

// PUBLIC_INTERFACE
export const ForumAPI = {
  /** List forum topics */
  async listTopics() {
    const { data } = await api.get("/forums/topics/");
    return data;
  },
  /** Get topic details with posts */
  async getTopic(id) {
    const { data } = await api.get(`/forums/topics/${id}/`);
    return data;
  },
  /** Create new topic */
  async createTopic(payload) {
    const { data } = await api.post("/forums/topics/", payload);
    return data;
  },
  /** Reply to a topic */
  async replyTopic(id, payload) {
    const { data } = await api.post(`/forums/topics/${id}/reply/`, payload);
    return data;
  }
};

// PUBLIC_INTERFACE
export const AdminAPI = {
  /** Admin: list users */
  async listUsers(params = {}) {
    const { data } = await api.get("/admin/users/", { params });
    return data;
  },
  /** Admin: update user */
  async updateUser(id, payload) {
    const { data } = await api.put(`/admin/users/${id}/`, payload);
    return data;
  },
  /** Admin: list content */
  async listContent(params = {}) {
    const { data } = await api.get("/admin/content/", { params });
    return data;
  },
  /** Admin: create/update content */
  async upsertContent(id, payload) {
    const { data } = id
      ? await api.put(`/admin/content/${id}/`, payload)
      : await api.post(`/admin/content/`, payload);
    return data;
  },
  /** Admin: audit logs */
  async auditLogs(params = {}) {
    const { data } = await api.get("/admin/audit-logs/", { params });
    return data;
  },
  /** Admin: platform settings */
  async getSettings() {
    const { data } = await api.get("/admin/settings/");
    return data;
  },
  async updateSettings(payload) {
    const { data } = await api.put("/admin/settings/", payload);
    return data;
  }
};
