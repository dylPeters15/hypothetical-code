import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isAuthenticatedForUserOperation(): boolean {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return ((username != null) && (username != '')) && ((token != null) && (token != ''));
  }

  public isAuthenticatedForAdminOperation(): boolean {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return (username == 'admin') && ((token != null) && (token != ''));
  }

  public storeLogin(username: string, token: string): void {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
  }

  public clearLogin(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }

  public getUsername(): string {
    return localStorage.getItem('username');
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }
}
