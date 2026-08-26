import apiClient from "../apiClient";

export const authService = {
  async login({ email, password }) {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (formData) => {
    const response = await apiClient.post("/auth/register", formData);

    return response.data;
  },
  async getCurrentUser() {
    const response = await apiClient.get("/auth/me");
    return response.data.user;
  },
  async updateUser(formData) {
    const response = await apiClient.put("/auth/me", formData);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post("/auth/logout", {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    return response.data;
  },
};
