const API_BASE_URL = 'http://localhost:5000/api';

export class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async register(email, password, username) {
    return this.request('/auth/register', 'POST', {
      email,
      password,
      username,
    });
  }

  async login(email, password) {
    return this.request('/auth/login', 'POST', { email, password });
  }

  // User endpoints
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(data) {
    return this.request('/user/profile', 'PUT', data);
  }

  // Favorites endpoints
  async getFavorites() {
    return this.request('/favorites');
  }

  async addFavorite(favorite) {
    return this.request('/favorites', 'POST', favorite);
  }

  async updateFavorite(id, data) {
    return this.request(`/favorites/${id}`, 'PUT', data);
  }

  async deleteFavorite(id) {
    return this.request(`/favorites/${id}`, 'DELETE');
  }

  // Events endpoints
  async getSavedEvents() {
    return this.request('/events');
  }

  async getUpcomingEvents() {
    return this.request('/events/upcoming');
  }

  async addEvent(event) {
    return this.request('/events', 'POST', event);
  }

  async updateEvent(id, data) {
    return this.request(`/events/${id}`, 'PUT', data);
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, 'DELETE');
  }
}

export const apiClient = new ApiClient();
