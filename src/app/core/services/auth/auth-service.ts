import { Injectable, signal, effect } from '@angular/core';
import type { AuthCredentials } from './auth-credentials.interface';
import type { AuthResponse } from './auth-response-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'shelf-auth-status';
  private readonly _isAuthenticated = signal<boolean>(this.getInitialAuthStatus());
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(this._isAuthenticated()));
    });
  }

  login(credentials: AuthCredentials): AuthResponse {
    this._isAuthenticated.set(true);
    console.log('auth service received credentials:', credentials);

    return {
      success: true,
      message: 'Login successful',
    };
  }

  logout(): AuthResponse {
    this._isAuthenticated.set(false);
    console.log('auth service logged out');

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  private getInitialAuthStatus(): boolean {
    const savedStatus = localStorage.getItem(this.AUTH_KEY);
    return savedStatus ? JSON.parse(savedStatus) : false;
  }
}
