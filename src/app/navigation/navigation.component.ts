import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { auth } from '../auth.service';
// import { SidenavServiceService } from '../sidenav-service.ts';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  public sideNav:MatSidenav;
  constructor() { }
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  @ViewChild('drawer') public sideNav:MatSidenav;
  loggedin: boolean = false;
  admin: boolean = false;

  constructor(private sidenavService: SidenavService) {
    
   }

   isAuthenticatedForUserOperation() {
    return auth.isAuthenticatedForUserOperation();
   }


  ngOnInit() {
    this.sidenavService.sideNav = this.sideNav;
    auth.getLoggedInObservable().subscribe(value => {
      this.loggedin = value;
      this.admin = auth.isAuthenticatedForAdminOperation();
      if(!this.loggedin) {
        this.sidenavService.sideNav.close();
      } else {
        this.sidenavService.sideNav.open();
      }
    });
  }

}
