import { apiConfig, endpoints } from '../config/api.js';

class ApiService {
  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
  }

  async request(url, options = {}) {
    const config = {
      method: 'GET',
      headers: {
        ...apiConfig.headers,
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    return this.request(endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request(endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request(endpoints.auth.me);
  }

  async logout() {
    return this.request(endpoints.auth.logout, {
      method: 'POST',
    });
  }

  // Links methods
  async getLinks(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`${endpoints.links.list}?${searchParams}`);
  }

  async createLink(linkData) {
    return this.request(endpoints.links.create, {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  }

  async getLink(id) {
    return this.request(endpoints.links.get(id));
  }

  async updateLink(id, linkData) {
    return this.request(endpoints.links.update(id), {
      method: 'PUT',
      body: JSON.stringify(linkData),
    });
  }

  async deleteLink(id) {
    return this.request(endpoints.links.delete(id), {
      method: 'DELETE',
    });
  }

  async checkLinkHealth(id) {
    return this.request(endpoints.links.health(id), {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
export default apiService;