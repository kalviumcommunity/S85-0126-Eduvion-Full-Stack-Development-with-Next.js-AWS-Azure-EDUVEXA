import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTManager {
  private static ACCESS_TOKEN_KEY = 'eduvexa_access_token';
  private static REFRESH_TOKEN_KEY = 'eduvexa_refresh_token';

  /**
   * Store tokens securely
   * Access token in memory (sessionStorage for demo)
   * Refresh token in HTTP-only cookie (fallback to sessionStorage for demo)
   */
  static setTokens(tokenPair: TokenPair): void {
    try {
      // Store access token in sessionStorage (memory-like storage)
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokenPair.accessToken);
      
      // For demo: store refresh token in sessionStorage
      // In production, this should be an HTTP-only cookie from server
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, tokenPair.refreshToken);
      
      console.log('Tokens stored successfully');
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  /**
   * Get access token from storage
   */
  static getAccessToken(): string | null {
    try {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token from storage
   */
  static getRefreshToken(): string | null {
    try {
      return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Clear all tokens (logout)
   */
  static clearTokens(): void {
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      console.log('Tokens cleared successfully');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Check if access token is expired
   */
  static isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // Add 30-second buffer to prevent edge cases
      return decoded.exp <= currentTime + 30;
    } catch (error) {
      console.error('Failed to decode access token:', error);
      return true;
    }
  }

  /**
   * Check if refresh token is expired
   */
  static isRefreshTokenExpired(): boolean {
    const token = this.getRefreshToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp <= currentTime;
    } catch (error) {
      console.error('Failed to decode refresh token:', error);
      return true;
    }
  }

  /**
   * Get user info from access token
   */
  static getUserFromToken(): JWTPayload | null {
    const token = this.getAccessToken();
    if (!token || this.isAccessTokenExpired()) return null;

    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('Failed to decode user info from token:', error);
      return null;
    }
  }

  /**
   * Get time until token expiry in seconds
   */
  static getTimeUntilExpiry(): number {
    const token = this.getAccessToken();
    if (!token) return 0;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return Math.max(0, decoded.exp - currentTime);
    } catch (error) {
      console.error('Failed to get token expiry time:', error);
      return 0;
    }
  }

  /**
   * Validate token structure
   */
  static validateToken(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      
      // Check required fields
      if (!decoded.userId || !decoded.email || !decoded.exp || !decoded.iat) {
        return false;
      }
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Refresh access token using refresh token
   * This would typically call your API endpoint
   */
  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken || this.isRefreshTokenExpired()) {
      console.log('No valid refresh token available');
      this.clearTokens();
      return null;
    }

    try {
      // In a real app, this would be an API call to your refresh endpoint
      // For demo purposes, we'll simulate the refresh
      console.log('Refreshing access token...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo: Create a new access token (in production, this comes from server)
      const user = this.getUserFromToken();
      if (user) {
        const newAccessToken = this.generateDemoAccessToken(user);
        sessionStorage.setItem(this.ACCESS_TOKEN_KEY, newAccessToken);
        console.log('Access token refreshed successfully');
        return newAccessToken;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Demo function to generate access token (for development only)
   * In production, tokens come from your backend
   */
  private static generateDemoAccessToken(user: JWTPayload): string {
    // This is just for demo - in production, your backend generates tokens
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      ...user,
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      iat: Math.floor(Date.now() / 1000),
      type: 'access'
    }));
    const signature = 'demo-signature'; // In production, this is cryptographically signed
    
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Initialize token refresh timer
   */
  static initializeTokenRefresh(): void {
    // Check token expiry every minute
    setInterval(() => {
      if (this.isAccessTokenExpired()) {
        console.log('Access token expired, attempting refresh...');
        this.refreshAccessToken();
      }
    }, 60000); // Check every minute
  }
}
