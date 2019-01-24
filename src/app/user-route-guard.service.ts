import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { auth } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserRouteGuardService implements CanActivate {

  constructor(public router: Router) { 
    console.log("constructing user route guard service.");
  }

  canActivate(): boolean {
    console.log("checking if can access page.");
    if (!auth.isAuthenticatedForUserOperation()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
