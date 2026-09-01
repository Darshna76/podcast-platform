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

  async forgotPassword({ email }) {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  async verifyOTP({ email, otp }) {
    const response = await apiClient.post("/auth/verify-otp", { email, otp });
    return response.data;
  },

  async resendOTP({ email }) {
    const response = await apiClient.post("/auth/resend-otp", { email });
    return response.data;
  },

  async resetPassword({ email, otp, password }) {
    const response = await apiClient.post("/auth/reset-password", {
      email,
      otp,
      password,
    });
    return response.data;
  },
};
