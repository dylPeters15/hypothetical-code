import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { auth } from './auth.service';

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
