import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SidenavServiceService {

  public sideNav:MatSidenav;
  constructor() { }
}