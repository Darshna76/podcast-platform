import apiClient from "../apiClient";

export const podcastService = {
  async listPodcasts() {
    const response = await apiClient.get("/podcasts");
    return response.data;
  },

  async getPodcast(id) {
    const response = await apiClient.get(`/podcasts/${id}`);
    return response.data;
  },

  async createPodcast(payload) {
    const response = await apiClient.post("/podcasts", payload);
    return response.data;
  },
  async updatePodcast(id, payload) {
    const response = await apiClient.put(`/podcasts/${id}`, payload);
    return response.data;
  },

  async deletePodcast(id) {
    const response = await apiClient.delete(`/podcasts/${id}`);
    return response.data;
  },

  createEpisode(id, formData) {
    return apiClient.post(`/podcasts/${id}/episodes`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  async listEpisodes(podcastId) {
    const response = await apiClient.get(`/podcasts/${podcastId}/episodes`);
    return response.data;
  },
  updateEpisode(episodeId, formData) {
    return apiClient.put(`/podcasts/episodes/${episodeId}`, formData);
  },

  deleteEpisode(episodeId) {
    return apiClient.delete(`/podcasts/episodes/${episodeId}`);
  },
  async getEpisode(episodeId) {
    const response = await apiClient.get(`/podcasts/episodes/${episodeId}`);

    return response.data;
  },
};
