import { JWTManager } from './jwt';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  // Use relative URL for Next.js API routes
  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * Add subscriber to be notified when token refresh completes
   */
  private addRefreshSubscriber(callback: (token: string | null) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify all subscribers of token refresh completion
   */
  private notifyRefreshSubscribers(token: string | null): void {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Make authenticated API request with automatic token refresh
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get current access token
    let accessToken = JWTManager.getAccessToken();

    // Set up headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      // Make initial request
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // If unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && JWTManager.getRefreshToken()) {
        accessToken = await this.handleTokenRefresh();
        
        if (accessToken) {
          // Retry request with new token
          headers.Authorization = `Bearer ${accessToken}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        }
      }

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Handle token refresh with queue management
   */
  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing) {
      // If already refreshing, wait for it to complete
      return new Promise((resolve) => {
        this.addRefreshSubscriber(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const newToken = await JWTManager.refreshAccessToken();
      this.notifyRefreshSubscribers(newToken);
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.notifyRefreshSubscribers(null);
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Login endpoint
   */
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }
      // Store tokens if provided (update as needed)
      if (data.token) {
        JWTManager.setTokens({ accessToken: data.token, refreshToken: '' });
      }
      return {
        success: true,
        data: {
          user: data.user,
          tokens: { accessToken: data.token, refreshToken: '' },
        },
      };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async signup(credentials: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || 'Signup failed' };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  }

  /**
   * Logout endpoint
   */
  async logout(): Promise<ApiResponse> {
    try {
      // Call logout API if available
      await this.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local tokens
      JWTManager.clearTokens();
    }

    return { success: true };
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse> {
    return this.get('/auth/profile');
  }

  /**
   * Demo token generation (for development only)
   */
  private generateDemoAccessToken(user: any): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      iat: Math.floor(Date.now() / 1000),
      type: 'access'
    }));
    const signature = 'demo-access-signature';
    
    return `${header}.${payload}.${signature}`;
  }

  private generateDemoRefreshToken(user: any): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      iat: Math.floor(Date.now() / 1000),
      type: 'refresh'
    }));
    const signature = 'demo-refresh-signature';
    
    return `${header}.${payload}.${signature}`;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const api = {
  login: apiClient.login.bind(apiClient),
  signup: apiClient.signup.bind(apiClient),
  logout: apiClient.logout.bind(apiClient),
  getProfile: apiClient.getProfile.bind(apiClient),
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
};
