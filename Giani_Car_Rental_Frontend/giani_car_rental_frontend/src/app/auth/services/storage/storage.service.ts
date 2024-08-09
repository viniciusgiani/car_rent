import { Injectable } from '@angular/core';

const TOKEN = 'token';
const USER = 'user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.setItem(TOKEN, token);
    }
  }

  saveUser(user: any): void {
    if (this.isBrowser()) {
      window.localStorage.removeItem(USER);
      window.localStorage.setItem(USER, JSON.stringify(user));
    }
  }

  getToken(): string | null {
    return this.isBrowser() ? window.localStorage.getItem(TOKEN) : null;
  }

  getUser(): any {
    if (this.isBrowser()) {
      const user = window.localStorage.getItem(USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  getUserId(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.id;
  }

  getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

  isAdminLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const role: string = this.getUserRole();
    return role === 'ADMIN';
  }

  isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const role: string = this.getUserRole();
    return role === 'CUSTOMER';
  }

  logout(): void {
    if (this.isBrowser()) {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.removeItem(USER);
    }
  }
}
