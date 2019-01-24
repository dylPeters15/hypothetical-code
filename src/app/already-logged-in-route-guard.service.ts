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
