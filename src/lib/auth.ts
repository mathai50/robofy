'use client';

import { useState, useEffect } from 'react';

export interface AuthUser {
  email: string;
  token: string;
}

export class AuthService {
  static readonly TOKEN_KEY = 'authToken';
  static readonly USER_KEY = 'authUser';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.warn('Could not access localStorage:', error);
      return null;
    }
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }
  }

  static getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (!userJson) return null;
      return JSON.parse(userJson);
    } catch (error) {
      console.warn('Could not access localStorage:', error);
      return null;
    }
  }

  static setUser(user: AuthUser): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  static async login(usernameOrEmail: string, password: string): Promise<AuthUser> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: usernameOrEmail, password }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        throw new Error(response.statusText || 'Login failed');
      }
      const errorMessage = this.parseErrorMessage(errorData);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const user: AuthUser = {
      email: usernameOrEmail, // Note: We're using usernameOrEmail as email for storage, but backend returns token
      token: data.access_token
    };

    this.setToken(data.access_token);
    this.setUser(user);

    return user;
  }

  static async register(username: string, email: string, password: string): Promise<void> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        throw new Error(response.statusText || 'Registration failed');
      }
      const errorMessage = this.parseErrorMessage(errorData);
      throw new Error(errorMessage);
    }
  }

  static async logout(): Promise<void> {
    this.removeToken();
  }

  // Helper method to parse error messages from backend responses
  private static parseErrorMessage(errorData: any): string {
    if (typeof errorData === 'string') {
      return errorData;
    }
    
    // Handle common error response formats
    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        // Handle validation errors array (common in FastAPI)
        return errorData.detail.map((err: any) => {
          if (err.msg && typeof err.msg === 'string') {
            return err.msg;
          } else if (err.loc && err.msg) {
            return `${err.loc.join('.')}: ${err.msg}`;
          } else if (typeof err === 'string') {
            return err;
          }
          return JSON.stringify(err);
        }).join(', ');
      } else if (typeof errorData.detail === 'string') {
        return errorData.detail;
      }
    }
    
    // Check for other common error fields
    if (errorData.message && typeof errorData.message === 'string') {
      return errorData.message;
    }
    
    if (errorData.error && typeof errorData.error === 'string') {
      return errorData.error;
    }
    
    if (errorData.errors && Array.isArray(errorData.errors)) {
      return errorData.errors.map((err: any) =>
        err.message || JSON.stringify(err)
      ).join(', ');
    }
    
    // If we can't parse it, stringify the whole object for debugging
    try {
      return JSON.stringify(errorData);
    } catch (e) {
      return 'An unexpected error occurred. Please try again.';
    }
  }

  static getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }
}

// React hook for authentication state
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<AuthUser | null>(AuthService.getUser());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setUser(AuthService.getUser());
    };

    // Check auth state on mount
    checkAuth();

    // Listen for storage changes (e.g., login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AuthService.TOKEN_KEY) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<AuthUser> => {
    const user = await AuthService.login(usernameOrEmail, password);
    setIsAuthenticated(true);
    setUser(user);
    return user;
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    await AuthService.register(username, email, password);
  };

  const logout = async (): Promise<void> => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout
  };
};