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

  public isAuthenticatedForAnalystOperation(): boolean {
    const analyst = localStorage.getItem('analyst');
    return this.isAuthenticatedForUserOperation() && analyst=='true';
  }

  public isAuthenticatedForProductManagerOperation(): boolean {
    const productmanager = localStorage.getItem('productmanager');
    return this.isAuthenticatedForUserOperation() && productmanager=='true';
  }

  public isAuthenticatedForBusinessManagerOperation(): boolean {
    const businessmanager = localStorage.getItem('businessmanager');
    return this.isAuthenticatedForUserOperation() && businessmanager=='true';
  }

  public isAuthenticatedForAdminOperation(): boolean {
    const admin = localStorage.getItem('admin');
    return this.isAuthenticatedForUserOperation() && admin=='true';
  }

  public storeLogin(username: string, token: string, analyst: boolean, productmanager: boolean, businessmanager: boolean, admin: boolean, localuser: boolean): void {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('admin', ""+admin);
    localStorage.setItem('localuser', ""+localuser);
    localStorage.setItem('analyst', ""+analyst);
    localStorage.setItem('productmanager', ""+productmanager);
    localStorage.setItem('businessmanager', ""+businessmanager);
    this.loggedInBehaviorSubject.next(true);
  }

  public clearLogin(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('localuser');
    localStorage.removeItem('analyst');
    localStorage.removeItem('productmanager');
    localStorage.removeItem('businessmanager');
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