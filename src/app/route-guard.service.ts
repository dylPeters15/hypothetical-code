import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { auth } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedInRouteGuardService implements CanActivate {

  constructor(public router: Router) { }

  canActivate(): boolean {
    if (auth.isAuthenticatedForUserOperation()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserRouteGuardService implements CanActivate {

  constructor(public router: Router) { }

  canActivate(): boolean {
    if (!auth.isAuthenticatedForUserOperation()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalystRouteGuardService implements CanActivate {

  constructor(public router: Router) { }

  canActivate(): boolean {
    if (!auth.isAuthenticatedForAnalystOperation()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductManagerRouteGuardService implements CanActivate {

  constructor(public router: Router) { }

  canActivate(): boolean {
    if (!auth.isAuthenticatedForProductManagerOperation()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BusinessManagerRouteGuardService implements CanActivate {

  constructor(public router: Router) { }

  canActivate(): boolean {
    if (!auth.isAuthenticatedForBusinessManagerOperation()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminRouteGuardService implements CanActivate {

  constructor(public router: Router) { }

  canActivate(): boolean {
    if (!auth.isAuthenticatedForAdminOperation()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
