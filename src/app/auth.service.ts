import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInBehaviorSubject: BehaviorSubject<boolean>;

  constructor() {
    this.loggedInBehaviorSubject = new BehaviorSubject<boolean>(this.isAuthenticatedForUserOperation());
   }

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
    this.loggedInBehaviorSubject.next(true);
  }

  public clearLogin(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.loggedInBehaviorSubject.next(false);
  }

  public getUsername(): string {
    return localStorage.getItem('username');
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public getLoggedInObservable(): Observable<boolean> {
    return this.loggedInBehaviorSubject.asObservable();
  }
}
export var auth: AuthService = new AuthService();