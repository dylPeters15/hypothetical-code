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
    const admin = localStorage.getItem('admin');
    return this.isAuthenticatedForUserOperation() && admin=='true';
  }

  public storeLogin(username: string, token: string, admin: boolean, localuser: boolean): void {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('admin', ""+admin);
    localStorage.setItem('localuser', ""+localuser);
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

  public getLocal(): boolean {
    var local = localStorage.getItem('localuser');
    return local && local === "true";
  }

  public getLoggedInObservable(): Observable<boolean> {
    return this.loggedInBehaviorSubject.asObservable();
  }
}
export var auth: AuthService = new AuthService();