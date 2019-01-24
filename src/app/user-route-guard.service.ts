import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { auth } from './auth.service';

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
